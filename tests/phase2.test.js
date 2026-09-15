"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "cb-phase2-"));
for (const key of Object.keys(process.env)) if (/DATA_DIR|UPLOAD_DIR|NODE_ENV/.test(key)) delete process.env[key];
Object.assign(process.env, { NODE_ENV: "test", DATA_DIR: temp, UPLOAD_DIR: path.join(temp, "uploads") });

const { redact, validateConfig } = require("../config");
const { backupEnvelope, reconciliationReport, restoreBackup, transitionOrder, validateBackup, writeDbBackup } = require("../server");
const dbFile = path.join(temp, "db.json");

function database(inventory = [], orders = []) {
  return { users: [], sessions: {}, adminSessions: {}, jarvisSessions: {}, inventory, orders, emailOutbox: [], auditLog: [], paymentReconciliation: [], migrations: ["clear-all-inventory-2026-06-02"] };
}

test.after(() => fs.rmSync(temp, { recursive: true, force: true }));

test("production configuration is strict and development remains usable", () => {
  assert.doesNotThrow(() => validateConfig({ NODE_ENV: "development", TRUST_PROXY_HOPS: "0" }));
  assert.throws(() => validateConfig({ NODE_ENV: "staging" }), error => error.variables.includes("NODE_ENV"));
  assert.throws(() => validateConfig({ NODE_ENV: "production", TRUST_PROXY_HOPS: "wrong" }), error => error.variables.includes("TRUST_PROXY_HOPS"));
  const valid = {
    NODE_ENV: "production", PUBLIC_ORIGIN: "https://coffeebreaktcg.com", DATA_DIR: "/var/data", UPLOAD_DIR: "/var/data/uploads", PERSISTENT_DISK_MOUNT_PATH: "/var/data",
    TRUST_PROXY_HOPS: "1", ADMIN_PASSWORD_HASH: `${"a".repeat(32)}:${"b".repeat(64)}`, JARVIS_PASSWORD_HASH: `scrypt:${"c".repeat(32)}:${"d".repeat(64)}`, JARVIS_TOKEN_SECRET: "x".repeat(32),
    SQUARE_ENVIRONMENT: "production", SQUARE_ACCESS_TOKEN: "x".repeat(32), SQUARE_LOCATION_ID: "configured",
    SQUARE_WEBHOOK_SIGNATURE_KEY: "x".repeat(32), SQUARE_WEBHOOK_NOTIFICATION_URL: "https://coffeebreaktcg.com/api/square/webhook",
  };
  assert.doesNotThrow(() => validateConfig(valid));
  for (const name of ["PUBLIC_ORIGIN", "ADMIN_PASSWORD_HASH", "SQUARE_ACCESS_TOKEN", "SQUARE_WEBHOOK_NOTIFICATION_URL"]) {
    const copy = { ...valid, [name]: "" };
    assert.throws(() => validateConfig(copy), error => error.variables.includes(name));
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
  const promises = require("node:fs/promises");
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
