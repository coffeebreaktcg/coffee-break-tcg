"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const https = require("node:https");
const crypto = require("node:crypto");
const { EventEmitter } = require("node:events");
// No real credentials, database, uploads, emails or external requests are used.
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "cb-security-"));
for (const key of Object.keys(process.env)) if (/SQUARE|RESEND|GOOGLE|ADMIN|DATA_DIR|UPLOAD_DIR|PUBLIC_ORIGIN|ALLOWED_ORIGINS|TRUST_PROXY/.test(key)) delete process.env[key];
Object.assign(process.env, { NODE_ENV: "test", DATA_DIR: temp, UPLOAD_DIR: path.join(temp, "uploads"), SQUARE_ACCESS_TOKEN: "test-only", SQUARE_LOCATION_ID: "test-location", SQUARE_WEBHOOK_SIGNATURE_KEY: "test-signature", SQUARE_WEBHOOK_NOTIFICATION_URL: "https://shop.example/api/square/webhook", RESEND_API_KEY: "test-resend-only", RESEND_FROM_EMAIL: "Test <test@example.com>", ADMIN_EMAIL: "admin@example.com", ADMIN_PASSWORD: "test-password-long", MAX_JSON_BODY_BYTES: "8192" });
let calls = [], emailCalls = [], emailMode = "failure", payment = null, squareMode = "ok";
https.get = () => { throw new Error("External network forbidden in tests"); };
https.request = (input, options, callback) => {
  if (typeof input === "string") options = { ...options, hostname: new URL(input).hostname, path: new URL(input).pathname };
  else { callback = options; options = input; }
  if (typeof options !== "object" || typeof callback !== "function") throw new Error("Unexpected external service");
  const request = new EventEmitter(); request.setTimeout = () => request; request.destroy = () => {};
  let body = ""; request.write = data => { body += data; };
  request.end = () => {
    if (options.hostname === "api.resend.com") {
      emailCalls.push({ path: options.path });
      return process.nextTick(() => {
        const response = new EventEmitter(); response.statusCode = emailMode === "failure" ? 500 : 200; callback(response);
        response.emit("data", Buffer.from(emailMode === "failure" ? JSON.stringify({ message: "simulated" }) : JSON.stringify({ id: "email-test" })));
        response.emit("end");
      });
    }
    if (!options.hostname?.includes("square")) throw new Error("Unexpected external service");
    calls.push({ path: options.path, body: body ? JSON.parse(body) : null });
    if (squareMode === "network") return process.nextTick(() => request.emit("error", new Error("network down")));
    const payload = options.path === "/v2/online-checkout/payment-links" ? { payment_link: { id: "link-test", url: "https://square.example/pay", order_id: "square-order" } } : { payment };
    process.nextTick(() => { const response = new EventEmitter(); response.statusCode = squareMode === "500" ? 500 : squareMode === "429" ? 429 : 200; callback(response); response.emit("data", Buffer.from(squareMode === "invalid" ? "not-json" : JSON.stringify(payload))); response.emit("end"); });
  };
  return request;
};
const security = require("../security");
const api = require("../server");
const dbFile = path.join(temp, "db.json");
const baseProduct = { id: "test-card", name: "Test card", category: "Singles", game: "Pokemon", status: "available", price: 10, stock: 2 };
function reset(extra = {}) {
  fs.writeFileSync(dbFile, JSON.stringify({ migrations: ["clear-all-inventory-2026-06-02"], inventory: [{ ...baseProduct }], users: [], orders: [], ...extra }));
  calls = []; emailCalls = []; emailMode = "failure"; squareMode = "ok";
}
function checkout(items) { return { items, shipping: "canada_post_manual", customer: { name: "Test", email: "test@example.com" }, address: { name: "Test", email: "test@example.com", address: "1 Test", city: "Laval", province: "QC", postal: "H1H 1H1" } }; }
let port;
function request(url, method = "GET", body, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, path: url, method, headers: { ...(method === "POST" ? { "Content-Type": "application/json" } : {}), ...headers } }, res => {
      const chunks = []; res.on("data", chunk => chunks.push(chunk)); res.on("end", () => { const raw = Buffer.concat(chunks).toString(); let data; try { data = JSON.parse(raw); } catch {} resolve({ status: res.statusCode, headers: res.headers, data }); });
    }); req.on("error", reject); req.end(body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body));
  });
}
function webhook(event) {
  const raw = JSON.stringify(event);
  return request("/api/square/webhook", "POST", raw, { "x-square-hmacsha256-signature": crypto.createHmac("sha256", "test-signature").update(process.env.SQUARE_WEBHOOK_NOTIFICATION_URL + raw).digest("base64") });
}
test.before(async () => { reset(); await new Promise(resolve => api.server.listen(0, "127.0.0.1", resolve)); port = api.server.address().port; });
test.after(async () => { await new Promise(resolve => api.server.close(resolve)); fs.rmSync(temp, { recursive: true, force: true }); });

test("private files, encoded traversal, unsupported files and symlinks are denied", async () => {
  for (const url of ["/.env", "/.env.example", "/.git/config", "/data/db.json", "/data/seed.json", "/server.js", "/security.js", "/package.json", "/package-lock.json", "/docs/coffee-photo-guide.md", "/reports/test.csv", "/../.env", "/%2e%2e/.env", "/%252e%252e/.env", "/assets/../server.js", "/assets/%2e%2e/server.js", "/assets%5c..%5c.env", "//etc/passwd", "/%00", "/%ZZ", "/assets/uploads/expense-private.png", "/Assets/Uploads/expense-private.png"]) assert.equal((await request(url)).status, 404, url);
  fs.mkdirSync(process.env.UPLOAD_DIR); fs.symlinkSync(dbFile, path.join(process.env.UPLOAD_DIR, "leak.png"));
  assert.equal((await request("/assets/uploads/leak.png")).status, 404);
});
test("public routes/assets still resolve, headers and CORS are safe", async () => {
  for (const route of ["/", "/singles", "/slabs", "/sealed", "/one-piece", "/one-piece/singles", "/produit/test-card", "/admin", "/app.js", "/styles.css", "/assets/coffee-cup-mark.png", "/sitemap.xml", "/robots.txt"]) assert.equal((await request(route)).status, 200, route);
  const res = await request("/api/products", "GET", undefined, { Origin: "https://evil.example" });
  assert.equal(res.headers["access-control-allow-origin"], undefined); assert.equal(res.headers["x-content-type-options"], "nosniff"); assert.match(res.headers["content-security-policy"], /frame-ancestors 'none'/);
  assert.equal((await request("/api/logout", "POST", {}, { Origin: "https://evil.example" })).status, 403);
  assert.equal((await request("/api/logout", "POST", "{}", { "Content-Type": "text/plain" })).status, 415);
});
test("admin routes require server sessions, malformed JSON rejected", async () => {
  for (const route of ["/api/admin/summary", "/api/admin/card-images?q=Pikachu"]) assert.equal((await request(route)).status, 401);
  assert.equal((await request("/api/admin/products", "POST", { name: "Injected" })).status, 401);
  assert.equal((await request("/api/signup", "POST", "{")).status, 400);
  assert.equal((await request("/api/signup", "POST", "x".repeat(9000))).status, 413);
});
test("strict checkout quantities, duplicate lines and unavailable products", async () => {
  for (const quantity of [0, -1, 1.5, 1000000000, null, "1", "NaN"]) { reset(); assert.equal((await request("/api/order", "POST", checkout([{ id: "test-card", quantity }]))).status, 400); assert.equal(calls.length, 0); }
  reset(); assert.equal((await request("/api/order", "POST", checkout([{ id: "test-card", quantity: 2 }, { id: "test-card", quantity: 1 }]))).status, 400);
  for (const status of ["draft", "admin_draft", "removed", "sold", "reserved"]) { reset({ inventory: [{ ...baseProduct, status }] }); assert.equal((await request("/api/order", "POST", checkout([{ id: "test-card", quantity: 1 }]))).status, 400); }
});
test("browser prices ignored, duplicates consolidated, no real Square call", async () => {
  reset(); const res = await request("/api/order", "POST", checkout([{ id: "test-card", quantity: 1, price: 0.01 }, { id: "test-card", quantity: 1, price: 0 }]));
  assert.equal(res.status, 201); assert.equal(res.data.order.items.length, 1); assert.equal(res.data.order.items[0].price, 10); assert.equal(res.data.order.items[0].quantity, 2);
  assert.equal(calls[0].body.quick_pay.price_money.amount, 2300);
});
test("webhook signatures fail closed, wrong amount/currency/location/order rejected, concurrent duplicates idempotent", async () => {
  assert.equal(api.verifySquareWebhookSignature({ headers: {} }, "{}"), false);
  assert.equal((await request("/api/square/webhook", "POST", {})).status, 403);
  assert.equal((await request("/api/square/webhook", "POST", {}, { "x-square-hmacsha256-signature": "fake" })).status, 403);
  const order = { id: "CB-TEST", status: "pending_payment", reservationExpiresAt: new Date(Date.now() + 600000).toISOString(), totalAmount: 11.5, squarePaymentLink: { orderId: "square-order" }, items: [{ id: "test-card", quantity: 1, price: 10 }] };
  reset({ inventory: [{ ...baseProduct, stock: 0, reservedQuantity: 1, status: "reserved" }], orders: [order] });
  const good = { id: "payment-test", order_id: "square-order", location_id: "test-location", status: "COMPLETED", total_money: { amount: 1150, currency: "CAD" } };
  const event = { event_id: "event-test", type: "payment.updated", data: { object: { payment: { id: "payment-test" } } } };
  for (const invalid of [{ total_money: { amount: 1, currency: "CAD" } }, { total_money: { amount: 1150, currency: "USD" } }, { location_id: "other" }]) {
    reset({ inventory: [{ ...baseProduct, stock: 0, reservedQuantity: 1, status: "reserved" }], orders: [structuredClone(order)] });
    payment = { ...good, ...invalid };
    const invalidResult = await webhook({ ...event, event_id: `event-${Math.random()}`.replace(".", "-") });
    assert.equal(invalidResult.status, 200); assert.equal(invalidResult.data.manualReview, true); assert.equal(JSON.parse(fs.readFileSync(dbFile)).orders[0].status, "manual_review");
  }
  reset({ inventory: [{ ...baseProduct, stock: 0, reservedQuantity: 1, status: "reserved" }], orders: [structuredClone(order)] });
  payment = { ...good, order_id: "unrelated" }; assert.equal((await webhook(event)).data.manualReview, true);
  reset({ inventory: [{ ...baseProduct, stock: 0, reservedQuantity: 1, status: "reserved" }], orders: [structuredClone(order)] });
  payment = good;
  const responses = await Promise.all([webhook(event), webhook(event)]);
  assert.equal(responses[0].data.changed, true); assert.equal(responses[1].data.duplicate, true);
  const db = JSON.parse(fs.readFileSync(dbFile)); assert.equal(db.orders[0].status, "paid"); assert.equal(db.inventory[0].reservedQuantity, 0); assert.equal(db.orders[0].squareWebhookEvents.length, 1);
  assert.equal((await webhook({ ...event, event_id: "another-event" })).data.changed, false);
});
test("callback and webhook are safe in either order and replay remains idempotent", async () => {
  const order = { id: "CB-SEQUENCE", status: "pending_payment", reservationExpiresAt: new Date(Date.now() + 600000).toISOString(), totalAmount: 11.5, squarePaymentLink: { orderId: "square-sequence" }, items: [{ id: "test-card", quantity: 1, price: 10 }] };
  const event = { event_id: "sequence-event", type: "payment.updated", data: { object: { payment: { id: "sequence-payment" } } } };
  payment = { id: "sequence-payment", order_id: "square-sequence", location_id: "test-location", status: "COMPLETED", total_money: { amount: 1150, currency: "CAD" } };
  reset({ inventory: [{ ...baseProduct, stock: 0, reservedQuantity: 1, status: "reserved" }], orders: [structuredClone(order)] });
  payment = { id: "sequence-payment", order_id: "square-sequence", location_id: "test-location", status: "COMPLETED", total_money: { amount: 1150, currency: "CAD" } };
  assert.equal((await request("/checkout?order=CB-SEQUENCE&payment=square")).status, 200);
  assert.equal(JSON.parse(fs.readFileSync(dbFile)).orders[0].status, "pending_payment");
  assert.equal((await webhook(event)).data.changed, true);
  assert.equal((await webhook(event)).data.duplicate, true);

  reset({ inventory: [{ ...baseProduct, stock: 0, reservedQuantity: 1, status: "reserved" }], orders: [structuredClone(order)] });
  payment = { id: "sequence-payment", order_id: "square-sequence", location_id: "test-location", status: "COMPLETED", total_money: { amount: 1150, currency: "CAD" } };
  assert.equal((await webhook({ ...event, event_id: "webhook-first" })).data.changed, true);
  assert.equal((await request("/checkout?order=CB-SEQUENCE&payment=square")).status, 200);
  assert.equal(JSON.parse(fs.readFileSync(dbFile)).orders[0].status, "paid");
});
test("payment remains paid after email failure and admin retry can recover", async () => {
  const order = { id: "CB-EMAIL", status: "pending_payment", reservationExpiresAt: new Date(Date.now() + 600000).toISOString(), totalAmount: 11.5, customer: { name: "Test", email: "client@example.com" }, address: { name: "Test", email: "client@example.com" }, squarePaymentLink: { orderId: "square-email" }, items: [{ id: "test-card", quantity: 1, price: 10 }] };
  reset({ inventory: [{ ...baseProduct, stock: 0, reservedQuantity: 1, status: "reserved" }], orders: [order] });
  payment = { id: "email-payment", order_id: "square-email", location_id: "test-location", status: "COMPLETED", total_money: { amount: 1150, currency: "CAD" } };
  const paid = await webhook({ event_id: "email-event", type: "payment.updated", data: { object: { payment: { id: "email-payment" } } } });
  assert.equal(paid.data.changed, true);
  let db = JSON.parse(fs.readFileSync(dbFile));
  assert.equal(db.orders[0].status, "paid"); assert.equal(db.orders[0].emailStatus, "partial");
  assert.ok(db.emailOutbox.every(message => message.status === "failed"));
  const login = await request("/api/admin/login", "POST", { email: "admin@example.com", password: "test-password-long" });
  const headers = { Cookie: login.headers["set-cookie"][0].split(";")[0] };
  emailMode = "success";
  const retry = await request("/api/admin/orders/resend-emails", "POST", { id: "CB-EMAIL" }, headers);
  assert.equal(retry.status, 200); assert.equal(retry.data.emailStatus, "sent");
  db = JSON.parse(fs.readFileSync(dbFile)); assert.equal(db.orders[0].status, "paid");
  assert.ok(db.emailOutbox.every(message => message.status === "sent"));
});
test("late payment fulfills only when released stock is still available", async () => {
  const expired = { id: "CB-LATE", status: "expired", totalAmount: 11.5, squarePaymentLink: { orderId: "square-order" }, items: [{ id: "test-card", quantity: 1, price: 10 }] };
  const event = { event_id: "late-available", type: "payment.updated", data: { object: { payment: { id: "payment-test" } } } };
  payment = { id: "payment-test", order_id: "square-order", location_id: "test-location", status: "COMPLETED", total_money: { amount: 1150, currency: "CAD" } };
  reset({ inventory: [{ ...baseProduct, stock: 1 }], orders: [structuredClone(expired)] }); payment = { id: "payment-test", order_id: "square-order", location_id: "test-location", status: "COMPLETED", total_money: { amount: 1150, currency: "CAD" } };
  assert.equal((await webhook(event)).data.changed, true);
  let db = JSON.parse(fs.readFileSync(dbFile)); assert.equal(db.orders[0].status, "paid"); assert.equal(db.inventory[0].stock, 0); assert.equal(db.inventory[0].reservedQuantity, 0);
  reset({ inventory: [{ ...baseProduct, stock: 0, status: "sold" }], orders: [structuredClone(expired)] }); payment = { id: "payment-test", order_id: "square-order", location_id: "test-location", status: "COMPLETED", total_money: { amount: 1150, currency: "CAD" } };
  const review = await webhook({ ...event, event_id: "late-unavailable" }); assert.equal(review.data.changed, false); assert.equal(review.data.reason, "late_payment_stock_unavailable");
  db = JSON.parse(fs.readFileSync(dbFile)); assert.equal(db.orders[0].status, "manual_review"); assert.equal(db.inventory[0].stock, 0);
});
test("Square failures release reservations and preserve an explicit failed order", async () => {
  for (const mode of ["network", "500", "429", "invalid"]) {
    reset(); squareMode = mode;
    const response = await request("/api/order", "POST", checkout([{ id: "test-card", quantity: 1 }]));
    assert.equal(response.status, 502);
    const db = JSON.parse(fs.readFileSync(dbFile)); assert.equal(db.orders.length, 1); assert.equal(db.orders[0].status, "checkout_failed"); assert.equal(db.inventory[0].stock, 2); assert.equal(db.inventory[0].reservedQuantity || 0, 0);
  }
});
test("admin input validation and image writes, compatible numeric form strings", async () => {
  reset(); const login = await request("/api/admin/login", "POST", { email: "admin@example.com", password: "test-password-long" }); assert.equal(login.status, 200);
  const headers = { Cookie: login.headers["set-cookie"][0].split(";")[0] };
  for (const body of [{ id: "../escape", name: "Bad" }, { name: "Bad", price: -1 }, { name: "Bad", stock: "1.5" }, { name: "<script>" }, { name: "Bad", imageUrl: "javascript:alert(1)" }, { name: "Bad", imageData: "data:image/png;base64,YmFk" }]) assert.equal((await request("/api/admin/products", "POST", body, headers)).status, 400);
  const res = await request("/api/admin/products", "POST", { name: "Valid", price: "10.50", stock: "1", cost: "", market: "", featuredRank: "", category: "Singles" }, headers); assert.equal(res.status, 201); assert.equal(res.data.product.price, 10.5);
  assert.equal((await request("/api/admin/logout", "POST", {}, headers)).status, 200); assert.equal((await request("/api/admin/summary", "GET", undefined, headers)).status, 401);
});
test("admin reconciliation, fulfillment and email retry use existing authentication", async () => {
  reset({ orders: [{ id: "CB-PAID", status: "paid", paidAt: new Date().toISOString(), items: [], emailStatus: "failed" }], emailOutbox: [{ id: "CB-PAID-client", to: "client@example.com", status: "failed" }] });
  const login = await request("/api/admin/login", "POST", { email: "admin@example.com", password: "test-password-long" });
  const headers = { Cookie: login.headers["set-cookie"][0].split(";")[0] };
  const report = await request("/api/admin/reconciliation", "GET", undefined, headers);
  assert.equal(report.status, 200); assert.deepEqual(report.data.paidNotFulfilled.map(order => order.id), ["CB-PAID"]);
  const fulfilled = await request("/api/admin/orders/transition", "POST", { id: "CB-PAID", status: "fulfilled", reason: "Test shipment" }, headers);
  assert.equal(fulfilled.status, 200); assert.equal(fulfilled.data.order.status, "fulfilled");
  assert.equal((await request("/api/admin/orders/transition", "POST", { id: "CB-PAID", status: "paid" }, headers)).status, 409);
  emailMode = "success";
  const resend = await request("/api/admin/orders/resend-emails", "POST", { id: "CB-PAID" }, headers);
  assert.equal(resend.status, 200); assert.equal(resend.data.emailStatus, "prepared");
  const db = JSON.parse(fs.readFileSync(dbFile)); assert.ok(db.auditLog.some(entry => entry.action === "order.transition")); assert.equal(db.orders[0].status, "fulfilled");
});
test("cookies, hashes, session expiry and proxy trust", async () => {
  process.env.NODE_ENV = "production";
  for (const create of [api.cookieHeader, api.adminCookieHeader]) { const cookie = create("test")["Set-Cookie"]; for (const part of ["HttpOnly", "Secure", "SameSite=", "Path=/", "Max-Age="]) assert.ok(cookie.includes(part)); }
  process.env.NODE_ENV = "test";
  const hashed = api.hashPassword("long-test-password"); assert.ok(api.verifyPassword("long-test-password", hashed)); assert.ok(!api.verifyPassword("wrong", hashed));
  const salt = "a".repeat(32); const legacy = `${salt}:${crypto.pbkdf2Sync("legacy", salt, 120000, 32, "sha256").toString("hex")}`; assert.ok(api.verifyPassword("legacy", legacy));
  assert.equal(await api.getSessionUser({ headers: { cookie: "cb_session=test" } }, { sessions: { test: "legacy-user" }, users: [] }), null);
  assert.equal(await api.getSessionUser({ headers: { cookie: "cb_session=test" } }, { sessions: { test: { userId: "u", expiresAt: "2000-01-01" } }, users: [{ id: "u" }] }), null);
  const req = { headers: { "x-forwarded-for": "1.1.1.1, 2.2.2.2" }, socket: { remoteAddress: "127.0.0.1" } };
  assert.equal(security.requestIp(req), "127.0.0.1"); process.env.TRUST_PROXY_HOPS = "1"; assert.equal(security.requestIp(req), "2.2.2.2"); delete process.env.TRUST_PROXY_HOPS;
});
test("configuration absent fails closed; malformed admin sessions expire", async () => {
  const { validateConfig } = require("../config");
  assert.throws(() => validateConfig({ NODE_ENV: "production" }), error => error.code === "CONFIG_INVALID" && error.variables.includes("SQUARE_ACCESS_TOKEN"));
  for (const expiresAt of [undefined, "invalid", "2000-01-01"]) {
    const req = { headers: { cookie: "cb_admin=a" } };
    assert.equal(api.getAdminSession(req, { adminSessions: { a: { expiresAt } } }), null);
  }
});
test("concurrent checkout cannot oversell a one-unit product", async () => {
  reset({ inventory: [{ ...baseProduct, stock: 1 }] });
  const body = checkout([{ id: "test-card", quantity: 1 }]);
  const results = await Promise.all([request("/api/order", "POST", body), request("/api/order", "POST", body)]);
  assert.deepEqual(results.map(r => r.status).sort(), [201, 400]); assert.equal(calls.length, 1);
  assert.equal(JSON.parse(fs.readFileSync(dbFile)).orders.length, 1);
});
test("corrupt JSON database is not replaced by seed", async () => {
  fs.writeFileSync(dbFile, "corrupted-test-data");
  assert.equal((await request("/api/products")).status, 500);
  assert.equal(fs.readFileSync(dbFile, "utf8"), "corrupted-test-data"); reset();
});
test("signup creates expiring session, weak passwords rejected; valid raster upload succeeds", async () => {
  reset();
  assert.equal((await request("/api/signup", "POST", { email: "new@example.com", password: "short" })).status, 400);
  const signup = await request("/api/signup", "POST", { email: "new@example.com", password: "long-test-account", name: "Test" });
  assert.equal(signup.status, 201);
  const cookie = signup.headers["set-cookie"][0].split(";")[0];
  assert.equal((await request("/api/me", "GET", undefined, { Cookie: cookie })).data.user.email, "new@example.com");
  const db = JSON.parse(fs.readFileSync(dbFile)); assert.ok(Date.parse(Object.values(db.sessions)[0].expiresAt) > Date.now());
  const login = await request("/api/admin/login", "POST", { email: "admin@example.com", password: "test-password-long" });
  const uploaded = await request("/api/admin/products", "POST", { name: "Image test", imageData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1cAAAAASUVORK5CYII=" }, { Cookie: login.headers["set-cookie"][0].split(";")[0] });
  assert.equal((await request("/api/admin/merchandising", "POST", { action: "accept", section: "__proto__", productId: "test-card" }, { Cookie: login.headers["set-cookie"][0].split(";")[0] })).status, 400);
  assert.equal(uploaded.status, 201);
  assert.equal((await request(uploaded.data.product.imageUrl)).status, 200);
});
test("checkout rate bucket rejects excess requests with no database/network work", () => {
  const req = { method: "POST", socket: { remoteAddress: "192.0.2.55" }, headers: { host: "localhost", "content-type": "application/json" } };
  for (let i = 0; i < 30; i++) security.guardRequest(req, "/api/order");
  assert.throws(() => security.guardRequest(req, "/api/order"), error => error.statusCode === 429);
});
test("collection photo validation preserves normal image payloads without sending email", () => {
  const body = { email: "test@example.com", askingPrice: "1000", photos: ["data:image/png;base64," + "A".repeat(24000)] };
  assert.equal(security.validateBody("/api/sell-request", body).askingPrice, 1000);
  assert.throws(() => security.validateBody("/api/sell-request", { email: "test@example.com", askingPrice: 1000, photos: ["data:text/html;base64,WA=="] }));
});
test("repeated incorrect admin login is rate limited even with spoofed forwarding", async () => {
  let response;
  for (let i = 0; i < 7; i++) response = await request("/api/admin/login", "POST", { email: "admin@example.com", password: "incorrect" }, { "X-Forwarded-For": `1.2.3.${i}` });
  assert.equal(response.status, 429);
});
