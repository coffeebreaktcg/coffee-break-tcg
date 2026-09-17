"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const promises = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "cb-phase2-"));
for (const key of Object.keys(process.env)) if (/DATA_DIR|UPLOAD_DIR|NODE_ENV/.test(key)) delete process.env[key];
Object.assign(process.env, { NODE_ENV: "test", DATA_DIR: temp, UPLOAD_DIR: path.join(temp, "uploads") });

const { redact, validateConfig } = require("../config");
const { backupEnvelope, jarvisDataMigration, readDb, reconciliationReport, restoreBackup, salesPotentialScores, sealedInventoryDrafts, sealedInventoryMigration, transitionOrder, validateBackup, writeDbBackup } = require("../server");
const dbFile = path.join(temp, "db.json");

function database(inventory = [], orders = []) {
  return { users: [], sessions: {}, adminSessions: {}, inventory, orders, emailOutbox: [], auditLog: [], paymentReconciliation: [], migrations: ["clear-all-inventory-2026-06-02"] };
}

test.after(() => fs.rmSync(temp, { recursive: true, force: true }));

test("production configuration is strict and development remains usable", () => {
  assert.doesNotThrow(() => validateConfig({ NODE_ENV: "development", TRUST_PROXY_HOPS: "0" }));
  assert.throws(() => validateConfig({ NODE_ENV: "staging" }), error => error.variables.includes("NODE_ENV"));
  assert.throws(() => validateConfig({ NODE_ENV: "production", TRUST_PROXY_HOPS: "wrong" }), error => error.variables.includes("TRUST_PROXY_HOPS"));
  const valid = {
    NODE_ENV: "production", PUBLIC_ORIGIN: "https://coffeebreaktcg.com", DATA_DIR: "/var/data", UPLOAD_DIR: "/var/data/uploads", PERSISTENT_DISK_MOUNT_PATH: "/var/data",
    TRUST_PROXY_HOPS: "1", ADMIN_PASSWORD_HASH: `${"a".repeat(32)}:${"b".repeat(64)}`,
    SQUARE_ENVIRONMENT: "production", SQUARE_ACCESS_TOKEN: "x".repeat(32), SQUARE_LOCATION_ID: "configured",
    SQUARE_WEBHOOK_SIGNATURE_KEY: "x".repeat(32), SQUARE_WEBHOOK_NOTIFICATION_URL: "https://coffeebreaktcg.com/api/square/webhook",
  };
  assert.doesNotThrow(() => validateConfig(valid));
  for (const name of ["PUBLIC_ORIGIN", "ADMIN_PASSWORD_HASH", "SQUARE_ACCESS_TOKEN", "SQUARE_WEBHOOK_NOTIFICATION_URL"]) {
    const copy = { ...valid, [name]: "" };
    assert.throws(() => validateConfig(copy), error => error.variables.includes(name));
  }
  assert.doesNotThrow(() => validateConfig({ ...valid, SQUARE_WEBHOOK_SIGNATURE_KEY: "testWebhookSignatureKey123" }));
  for (const value of ["", "   ", "placeholder", "change-me", "your-webhook-signature-key", "<signature-key>"]) {
    assert.throws(
      () => validateConfig({ ...valid, SQUARE_WEBHOOK_SIGNATURE_KEY: value }),
      error => error.variables.includes("SQUARE_WEBHOOK_SIGNATURE_KEY"),
    );
  }
});

test("sales potential ranking favors completed demand and ignores cancelled orders", () => {
  const now = Date.parse("2026-09-17T12:00:00.000Z");
  const products = [
    { id: "hot", name: "Charizard ex", category: "Singles", kind: "single", setName: "Obsidian Flames", price: 55, market: 60, cost: 30, stock: 1, imageUrl: "/hot.png", createdAt: "2026-09-10T12:00:00.000Z" },
    { id: "cold", name: "Unown", category: "Singles", kind: "single", setName: "Silver Tempest", price: 55, market: 60, cost: 30, stock: 1, imageUrl: "/cold.png", createdAt: "2026-09-10T12:00:00.000Z" },
  ];
  const orders = [
    { status: "paid", paidAt: "2026-09-12T12:00:00.000Z", items: [{ id: "sold-charizard", name: "Charizard V", category: "Singles", kind: "single", setName: "Obsidian Flames", quantity: 3 }] },
    { status: "cancelled", createdAt: "2026-09-16T12:00:00.000Z", items: [{ id: "cold", name: "Unown", category: "Singles", kind: "single", setName: "Silver Tempest", quantity: 100 }] },
  ];
  const scores = salesPotentialScores({ inventory: products, orders }, now);
  assert.ok(scores.get("hot") > scores.get("cold"));
  assert.ok(scores.get("hot") <= 100);
  assert.ok(scores.get("cold") >= 0);
});

test("migration removes only Jarvis data, preserves unknown keys and is idempotent", async () => {
  const db = {
    ...database([{ id: "p1", stock: 2 }], [{ id: "sale-1", status: "admin_sale", items: [{ id: "p1", quantity: 1 }] }]),
    users: [{ id: "client-1", email: "client@example.test" }],
    sessions: { client: { userId: "client-1", expiresAt: "2099-01-01T00:00:00.000Z" } },
    adminSessions: { admin: { email: "admin@example.test", expiresAt: "2099-01-01T00:00:00.000Z" } },
    cardShows: [{ id: "show-1", name: "Test Show" }],
    merchandising: { decisions: { featured: "p1" }, history: [], performance: [], updatedAt: "" },
    newArrivalSlides: [{ id: "slide-1", imageUrl: "/assets/test.png" }],
    newsletter: [{ email: "news@example.test" }],
    expenses: [{ id: "expense-1", amount: 5 }],
    removedInventory: [{ id: "old-product" }],
    priceSync: { lastRunAt: "2026-01-01T00:00:00.000Z" },
    emailOutbox: [{ id: "message-1", status: "sent" }],
    auditLog: [{ action: "test" }],
    paymentReconciliation: [{ id: "reconciliation-1" }],
    jarvisSessions: { secret: { expiresAt: "2099-01-01T00:00:00.000Z" } },
    jarvisEmails: [{ id: "mail-1" }],
    jarvisEmailFeedback: [{ id: "feedback-1" }],
    jarvisEmailActions: [{ id: "action-1" }],
    jarvisCalendarEvents: [{ id: "event-1" }],
    jarvisTasks: [{ id: "task-1" }],
    jarvisGoogleTokens: { business: { encrypted: "secret" } },
    jarvisCalendarTokens: { primary: { encrypted: "secret" } },
    jarvisOAuthStates: { state: { source: "business" } },
    jarvisDiagnostics: { errors: [{ message: "test" }] },
    jarvisActivity: [{ type: "test" }],
    futureCoffeeFeature: { enabled: true },
  };
  fs.writeFileSync(dbFile, JSON.stringify(db));
  const first = await readDb();
  const backupsAfterFirst = fs.readdirSync(path.join(temp, "backups"));
  const preCleanup = backupsAfterFirst
    .map(file => JSON.parse(fs.readFileSync(path.join(temp, "backups", file), "utf8")))
    .find(envelope => envelope.reason === "pre-legacy-assistant-cleanup");
  assert.deepEqual(preCleanup.db, db);
  assert.equal(first.jarvisSessions, undefined);
  assert.equal(first.jarvisActivity, undefined);
  assert.deepEqual(first.futureCoffeeFeature, db.futureCoffeeFeature);
  for (const key of ["inventory", "orders", "users", "sessions", "adminSessions", "cardShows", "merchandising", "newArrivalSlides", "newsletter", "expenses", "removedInventory", "priceSync", "emailOutbox", "auditLog", "paymentReconciliation", "migrations"]) {
    assert.deepEqual(first[key], db[key], key);
  }
  const persistedAfterFirst = fs.readFileSync(dbFile, "utf8");
  const second = await readDb();
  const third = await readDb();
  assert.deepEqual(second, first);
  assert.deepEqual(third, first);
  assert.equal(fs.readFileSync(dbFile, "utf8"), persistedAfterFirst);
  assert.deepEqual(fs.readdirSync(path.join(temp, "backups")), backupsAfterFirst);
  const plan = jarvisDataMigration(first);
  assert.deepEqual(plan.removedKeys, []);
  assert.deepEqual(plan.unknownKeys, ["futureCoffeeFeature"]);
});

test("sealed inventory import creates private drafts once without overwriting existing products", () => {
  const drafts = sealedInventoryDrafts();
  assert.equal(drafts.length, 11);
  assert.equal(drafts.reduce((sum, item) => sum + item.stock, 0), 26);
  assert.ok(drafts.every((item) => item.status === "admin_draft" && item.category === "Sealed" && item.price === 0));
  assert.ok(drafts.every((item) => fs.existsSync(path.join(__dirname, "..", item.imageUrl))));

  const existing = { ...drafts[0], stock: 99, price: 123 };
  const db = database([existing]);
  const first = sealedInventoryMigration(db);
  assert.equal(first.addedCount, 10);
  assert.equal(first.db.inventory.find((item) => item.id === existing.id).stock, 99);
  assert.equal(first.db.inventory.find((item) => item.id === existing.id).price, 123);
  const snapshot = JSON.stringify(first.db);
  const second = sealedInventoryMigration(first.db);
  assert.equal(second.changed, false);
  assert.equal(second.addedCount, 0);
  assert.equal(JSON.stringify(second.db), snapshot);
});

test("migration aborts without changing the database when its forced backup fails", async () => {
  const db = { ...database([{ id: "safe", stock: 1 }]), jarvisTasks: [{ id: "task" }], futureCoffeeFeature: { enabled: true } };
  fs.writeFileSync(dbFile, JSON.stringify(db));
  const originalRename = promises.rename;
  promises.rename = async (source, target) => {
    if (String(target).includes(`${path.sep}backups${path.sep}`)) throw new Error("simulated backup failure");
    return originalRename(source, target);
  };
  try {
    await assert.rejects(readDb(), /simulated backup failure/);
    assert.deepEqual(JSON.parse(fs.readFileSync(dbFile)), db);
  } finally {
    promises.rename = originalRename;
  }
});

test("structured log redaction removes secrets recursively", () => {
  const record = redact({ requestId: "request-1", orderId: "CB-1", password: "visible-no", nested: { SQUARE_ACCESS_TOKEN: "visible-no", eventId: "event-1" } });
  const output = JSON.stringify(record);
  assert.match(output, /request-1/); assert.match(output, /CB-1/); assert.match(output, /event-1/);
  assert.doesNotMatch(output, /visible-no/); assert.match(output, /REDACTED/);
});

test("order transitions permit business flow and reject impossible changes", () => {
  const order = { id: "CB-1", status: "pending_payment" };
  assert.equal(transitionOrder(order, "paid", { reason: "verified", requestId: "r1" }), true);
  assert.equal(transitionOrder(order, "fulfilled", { reason: "shipped" }), true);
  assert.throws(() => transitionOrder(order, "pending_payment"), error => error.statusCode === 409);
  assert.equal(order.statusHistory.length, 2);
  assert.equal(transitionOrder(order, "refunded", { reason: "manual" }), true);
  assert.throws(() => transitionOrder(order, "fulfilled"), error => error.statusCode === 409);
});

test("reconciliation report identifies operational exceptions", () => {
  const old = new Date(Date.now() - 3600000).toISOString();
  const db = database([], [
    { id: "pending", status: "pending_payment", createdAt: old, items: [] },
    { id: "paid", status: "paid", items: [{ id: "missing", quantity: 1 }] },
    { id: "review", status: "manual_review", items: [] },
    { id: "expired", status: "expired", items: [] },
  ]);
  db.paymentReconciliation.push({ eventId: "event", resolvedAt: "" });
  const report = reconciliationReport(db);
  assert.deepEqual(report.pendingTooLong.map(item => item.id), ["pending"]);
  assert.deepEqual(report.paidNotFulfilled.map(item => item.id), ["paid"]);
  assert.deepEqual(report.manualReview.map(item => item.id), ["review"]);
  assert.deepEqual(report.expired.map(item => item.id), ["expired"]);
  assert.equal(report.unmatchedPayments.length, 1); assert.equal(report.stockIssues.length, 1);
});

test("backup checksum detects corruption and restoration preserves current state first", async () => {
  const original = database([{ id: "one", stock: 1 }]);
  const envelope = backupEnvelope(original, "test");
  assert.deepEqual(validateBackup(envelope), original);
  const corrupt = structuredClone(envelope); corrupt.db.inventory[0].stock = 99;
  assert.throws(() => validateBackup(corrupt));
  fs.writeFileSync(dbFile, JSON.stringify(database([{ id: "changed", stock: 2 }])));
  const source = await writeDbBackup(original, { force: true, reason: "restore-source" });
  const restored = await restoreBackup(path.basename(source));
  assert.equal(restored.inventory[0].id, "one");
  assert.equal(JSON.parse(fs.readFileSync(dbFile)).inventory[0].id, "one");
  const backups = fs.readdirSync(path.join(temp, "backups")).filter(name => name.endsWith(".json"));
  assert.ok(backups.length >= 2);
  for (const name of backups) assert.doesNotThrow(() => validateBackup(JSON.parse(fs.readFileSync(path.join(temp, "backups", name)))));
});

test("backup rotation keeps forty healthy snapshots", async () => {
  const db = database([{ id: "rotation", stock: 1 }]);
  for (let index = 0; index < 42; index++) await writeDbBackup(db, { force: true, reason: `rotation-${index}` });
  const backups = fs.readdirSync(path.join(temp, "backups")).filter(name => name.endsWith(".json"));
  assert.equal(backups.length, 40);
  for (const name of backups) assert.doesNotThrow(() => validateBackup(JSON.parse(fs.readFileSync(path.join(temp, "backups", name)))));
});

test("backup rename failure is reported and leaves no temporary snapshot", async () => {
  const originalRename = promises.rename;
  promises.rename = async () => { const error = new Error("simulated rename failure"); error.code = "EIO"; throw error; };
  try {
    await assert.rejects(() => writeDbBackup(database(), { force: true, reason: "failure-test" }), error => error.code === "EIO");
  } finally {
    promises.rename = originalRename;
  }
  assert.equal(fs.readdirSync(path.join(temp, "backups")).filter(name => name.endsWith(".tmp")).length, 0);
});

test("SIGTERM drains the server and emits structured shutdown logs", async () => {
  const childData = fs.mkdtempSync(path.join(os.tmpdir(), "cb-shutdown-"));
  const child = spawn(process.execPath, [path.resolve(__dirname, "../server.js")], {
    env: { ...process.env, NODE_ENV: "test", DATA_DIR: childData, UPLOAD_DIR: path.join(childData, "uploads"), PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", chunk => { output += chunk; });
  child.stderr.on("data", chunk => { output += chunk; });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`server did not start: ${output}`)), 5000);
      const inspect = () => {
        if (child.exitCode !== null) {
          clearTimeout(timer);
          return reject(new Error(`server exited before startup: ${output}`));
        }
        if (!output.includes('"event":"server.started"')) return setTimeout(inspect, 20);
        clearTimeout(timer); resolve();
      };
      inspect();
    });
    child.kill("SIGTERM");
    const code = await new Promise(resolve => child.once("exit", resolve));
    assert.equal(code, 0);
    assert.match(output, /"event":"server.shutdown.started"/);
    assert.match(output, /"event":"server.shutdown.completed"/);
  } finally {
    if (child.exitCode === null) child.kill("SIGKILL");
    fs.rmSync(childData, { recursive: true, force: true });
  }
});
