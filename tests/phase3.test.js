"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { redact, validateConfig } = require("../config");
const security = require("../security");
const { configurationReport, storageReport } = require("../staging-diagnostics");
const moduleData = fs.mkdtempSync(path.join(os.tmpdir(), "cb-stage-restore-"));
Object.assign(process.env, { NODE_ENV: "test", DATA_DIR: moduleData, UPLOAD_DIR: path.join(moduleData, "uploads") });
const { restoreBackup, writeDbBackup } = require("../server");
test.after(() => fs.rmSync(moduleData, { recursive: true, force: true }));

function productionEnv(overrides = {}) {
  return {
    NODE_ENV: "production", DEPLOYMENT_STAGE: "staging", PUBLIC_ORIGIN: "https://staging.example.com",
    DATA_DIR: "/var/data", UPLOAD_DIR: "/var/data/uploads", PERSISTENT_DISK_MOUNT_PATH: "/var/data", TRUST_PROXY_HOPS: "1",
    ADMIN_PASSWORD_HASH: `${"a".repeat(32)}:${"b".repeat(64)}`, JARVIS_PASSWORD_HASH: `${"c".repeat(32)}:${"d".repeat(64)}`,
    JARVIS_TOKEN_SECRET: "j".repeat(32), SQUARE_ENVIRONMENT: "sandbox", SQUARE_ACCESS_TOKEN: "s".repeat(32),
    SQUARE_LOCATION_ID: "sandbox-location", SQUARE_WEBHOOK_SIGNATURE_KEY: "w".repeat(32),
    SQUARE_WEBHOOK_NOTIFICATION_URL: "https://staging.example.com/api/square/webhook", ...overrides,
  };
}

test("staging keeps production security while requiring Square Sandbox", () => {
  assert.doesNotThrow(() => validateConfig(productionEnv()));
  assert.throws(() => validateConfig(productionEnv({ SQUARE_ENVIRONMENT: "production" })), error => error.variables.includes("SQUARE_ENVIRONMENT"));
  assert.throws(() => validateConfig(productionEnv({ DATA_DIR: "/tmp/data" })), error => error.variables.includes("DATA_DIR"));
  const missing = configurationReport({ NODE_ENV: "production", DEPLOYMENT_STAGE: "staging" });
  assert.equal(missing.ok, false);
  assert.ok(missing.invalidVariables.includes("PERSISTENT_DISK_MOUNT_PATH"));
  assert.ok(!JSON.stringify(missing).includes("sandbox-location"));
});

test("storage diagnostic writes, renames, reads and cleans all persistent directories", async () => {
  const mount = fs.mkdtempSync(path.join(os.tmpdir(), "cb-stage-disk-"));
  try {
    const report = await storageReport({ PERSISTENT_DISK_MOUNT_PATH: mount, DATA_DIR: path.join(mount, "data"), UPLOAD_DIR: path.join(mount, "uploads") });
    assert.equal(report.ok, true);
    assert.equal(report.sameDevice, true);
    assert.deepEqual(report.probes.map(probe => probe.label), ["data", "uploads", "backups"]);
    for (const probe of report.probes) assert.equal(fs.readdirSync(probe.path).some(name => name.startsWith(".cb-staging-")), false);
    assert.equal((await storageReport({ PERSISTENT_DISK_MOUNT_PATH: mount, DATA_DIR: "/tmp/outside", UPLOAD_DIR: path.join(mount, "uploads") })).ok, false);
  } finally { fs.rmSync(mount, { recursive: true, force: true }); }
});

test("backup, mutation and restore recover the complete business data", async () => {
  const original = {
    migrations: ["clear-all-inventory-2026-06-02"], users: [{ id: "u1", email: "anonymous@example.test" }], sessions: {}, adminSessions: {}, jarvisSessions: {},
    inventory: [{ id: "p1", name: "Card", category: "Singles", status: "available", price: 12, stock: 3 }],
    orders: [{ id: "o1", status: "paid", items: [{ id: "p1", quantity: 1, price: 12 }] }], emailOutbox: [], auditLog: [], paymentReconciliation: [],
  };
  fs.writeFileSync(path.join(moduleData, "db.json"), JSON.stringify(original));
  const backup = await writeDbBackup(structuredClone(original), { force: true, reason: "phase3-roundtrip" });
  const mutated = structuredClone(original); mutated.inventory[0].stock = 0; mutated.orders[0].status = "refunded"; mutated.users = [];
  fs.writeFileSync(path.join(moduleData, "db.json"), JSON.stringify(mutated));
  const restored = await restoreBackup(path.basename(backup));
  for (const key of ["users", "inventory", "orders", "emailOutbox", "paymentReconciliation"]) assert.deepEqual(restored[key], original[key]);
  assert.ok(restored.auditLog.some(entry => entry.action === "backup.restored"));
  const persisted = JSON.parse(fs.readFileSync(path.join(moduleData, "db.json")));
  assert.deepEqual(persisted.inventory, original.inventory); assert.deepEqual(persisted.orders, original.orders);
});

test("proxy diagnostic selects the trusted address from the right", () => {
  const previous = process.env.TRUST_PROXY_HOPS;
  process.env.TRUST_PROXY_HOPS = "2";
  try {
    const report = security.proxyDiagnostic({ headers: { "x-forwarded-for": "198.51.100.20, 10.0.0.8" }, socket: { remoteAddress: "10.0.0.9" } });
    assert.equal(report.effectiveIp, "198.51.100.20");
    assert.equal(report.validChain, true);
    assert.deepEqual(report.warnings, []);
  } finally {
    if (previous === undefined) delete process.env.TRUST_PROXY_HOPS; else process.env.TRUST_PROXY_HOPS = previous;
  }
});

function startServer(dataDir) {
  const child = spawn(process.execPath, [path.resolve(__dirname, "../server.js")], {
    env: { ...process.env, NODE_ENV: "test", DATA_DIR: dataDir, UPLOAD_DIR: path.join(dataDir, "uploads"), PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", chunk => { output += chunk; });
  child.stderr.on("data", chunk => { output += chunk; });
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { child.kill("SIGKILL"); reject(new Error("server startup timeout")); }, 5000);
    const inspect = () => {
      const line = output.split("\n").find(item => item.includes('"event":"server.started"'));
      if (!line) return setTimeout(inspect, 20);
      clearTimeout(timer);
      resolve({ child, output: () => output, port: JSON.parse(line).port });
    };
    inspect();
  });
}

function get(port, route) {
  return new Promise((resolve, reject) => {
    http.get({ host: "127.0.0.1", port, path: route }, response => {
      response.resume(); response.on("end", () => resolve(response.statusCode));
    }).on("error", reject);
  });
}

async function stopServer(instance) {
  instance.child.kill("SIGTERM");
  await new Promise(resolve => instance.child.once("exit", resolve));
}

test("restart recovers active reservations and expires only overdue orders", async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "cb-stage-restart-"));
  const dbPath = path.join(dataDir, "db.json");
  const db = {
    migrations: ["clear-all-inventory-2026-06-02"], users: [], sessions: {}, adminSessions: {}, jarvisSessions: {},
    inventory: [{ id: "one", name: "One", category: "Singles", status: "reserved", price: 10, stock: 0, reservedQuantity: 2 }],
    orders: [
      { id: "ACTIVE", status: "pending_payment", reservationExpiresAt: new Date(Date.now() + 600000).toISOString(), items: [{ id: "one", quantity: 1, price: 10 }] },
      { id: "OVERDUE", status: "pending_payment", reservationExpiresAt: new Date(Date.now() - 60000).toISOString(), items: [{ id: "one", quantity: 1, price: 10 }] },
    ],
  };
  fs.writeFileSync(dbPath, JSON.stringify(db));
  try {
    let instance = await startServer(dataDir);
    assert.equal(await get(instance.port, "/api/products"), 200);
    await stopServer(instance);
    let saved = JSON.parse(fs.readFileSync(dbPath));
    assert.equal(saved.orders.find(order => order.id === "ACTIVE").status, "pending_payment");
    assert.equal(saved.orders.find(order => order.id === "OVERDUE").status, "expired");
    assert.equal(saved.inventory[0].stock, 1); assert.equal(saved.inventory[0].reservedQuantity, 1);
    instance = await startServer(dataDir);
    assert.equal(await get(instance.port, "/api/products"), 200);
    await stopServer(instance);
    saved = JSON.parse(fs.readFileSync(dbPath));
    assert.equal(saved.inventory[0].stock, 1); assert.equal(saved.inventory[0].reservedQuantity, 1);
    for (const line of instance.output().trim().split("\n")) assert.doesNotThrow(() => JSON.parse(line));
  } finally { fs.rmSync(dataDir, { recursive: true, force: true }); }
});

test("log redaction covers credentials and payment card fields", () => {
  const marker = "must-never-appear";
  const output = JSON.stringify(redact({ token: marker, password: marker, authorization: marker, cardNumber: marker, cvv: marker, paymentId: "safe-id" }));
  assert.ok(!output.includes(marker));
  assert.ok(output.includes("safe-id"));
});
