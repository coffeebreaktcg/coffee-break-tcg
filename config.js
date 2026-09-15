"use strict";

const path = require("node:path");

const secretNames = new Set([
  "ADMIN_PASSWORD_HASH",
  "SQUARE_ACCESS_TOKEN",
  "SQUARE_WEBHOOK_SIGNATURE_KEY",
  "RESEND_API_KEY",
  "GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON",
  "GOOGLE_DRIVE_PRIVATE_KEY",
]);

function configurationError(names) {
  const error = new Error(`Configuration invalide: ${[...new Set(names)].sort().join(", ")}`);
  error.code = "CONFIG_INVALID";
  error.variables = [...new Set(names)].sort();
  return error;
}

function validHttpsUrl(value, suffix = "") {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && (!suffix || url.pathname === suffix);
  } catch {
    return false;
  }
}

function validSquareWebhookSignatureKey(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed !== value) return false;
  return !/^(?:\.{3}|placeholder|change[\s_-]*me|replace[\s_-]*me|your[\s_-]*(?:square[\s_-]*)?(?:webhook[\s_-]*)?signature[\s_-]*key|square[\s_-]*webhook[\s_-]*signature[\s_-]*key|<[^>]+>)$/i.test(trimmed);
}

function validateConfig(env = process.env, options = {}) {
  const production = env.NODE_ENV === "production";
  const deploymentStage = env.DEPLOYMENT_STAGE || (production ? "production" : "development");
  const errors = [];
  if (!new Set(["development", "test", "production"]).has(env.NODE_ENV || "development")) errors.push("NODE_ENV");
  if (!new Set(["development", "staging", "production"]).has(deploymentStage)) errors.push("DEPLOYMENT_STAGE");
  const hops = Number(env.TRUST_PROXY_HOPS || 0);
  if (!Number.isSafeInteger(hops) || hops < 0 || hops > 10) errors.push("TRUST_PROXY_HOPS");
  for (const name of ["DATA_DIR", "UPLOAD_DIR"]) {
    if (env[name] && !path.isAbsolute(env[name])) errors.push(name);
  }
  if (env.PERSISTENT_DISK_MOUNT_PATH && !path.isAbsolute(env.PERSISTENT_DISK_MOUNT_PATH)) errors.push("PERSISTENT_DISK_MOUNT_PATH");
  if (env.MAX_JSON_BODY_BYTES && (!Number.isSafeInteger(Number(env.MAX_JSON_BODY_BYTES)) || Number(env.MAX_JSON_BODY_BYTES) < 1024 || Number(env.MAX_JSON_BODY_BYTES) > 8 * 1024 * 1024)) errors.push("MAX_JSON_BODY_BYTES");
  if (env.PUBLIC_ORIGIN && (!validHttpsUrl(env.PUBLIC_ORIGIN) || new URL(env.PUBLIC_ORIGIN).pathname !== "/")) errors.push("PUBLIC_ORIGIN");
  for (const origin of String(env.ALLOWED_ORIGINS || "").split(",").filter(Boolean)) {
    if (!validHttpsUrl(origin) || new URL(origin).pathname !== "/") errors.push("ALLOWED_ORIGINS");
  }
  if (env.SQUARE_ENVIRONMENT && !["sandbox", "production"].includes(env.SQUARE_ENVIRONMENT)) errors.push("SQUARE_ENVIRONMENT");
  if (production) {
    for (const name of [
      "PUBLIC_ORIGIN", "DATA_DIR", "UPLOAD_DIR", "PERSISTENT_DISK_MOUNT_PATH", "ADMIN_PASSWORD_HASH",
      "SQUARE_ENVIRONMENT", "SQUARE_ACCESS_TOKEN", "SQUARE_LOCATION_ID",
      "SQUARE_WEBHOOK_SIGNATURE_KEY", "SQUARE_WEBHOOK_NOTIFICATION_URL",
    ]) if (!String(env[name] || "").trim()) errors.push(name);
    if (env.ADMIN_PASSWORD) errors.push("ADMIN_PASSWORD");
    if (hops < 1) errors.push("TRUST_PROXY_HOPS");
    if (!/^(?:scrypt:)?[a-f0-9]{32}:[a-f0-9]{64}$/.test(env.ADMIN_PASSWORD_HASH || "")) errors.push("ADMIN_PASSWORD_HASH");
    if (String(env.SQUARE_ACCESS_TOKEN || "").length < 32) errors.push("SQUARE_ACCESS_TOKEN");
    if (!validSquareWebhookSignatureKey(env.SQUARE_WEBHOOK_SIGNATURE_KEY)) errors.push("SQUARE_WEBHOOK_SIGNATURE_KEY");
    const expectedSquareEnvironment = deploymentStage === "staging" ? "sandbox" : "production";
    if (env.SQUARE_ENVIRONMENT !== expectedSquareEnvironment && !options.allowSandboxProduction) errors.push("SQUARE_ENVIRONMENT");
    if (env.PERSISTENT_DISK_MOUNT_PATH) {
      const mount = path.resolve(env.PERSISTENT_DISK_MOUNT_PATH);
      for (const name of ["DATA_DIR", "UPLOAD_DIR"]) {
        if (env[name] && path.resolve(env[name]) !== mount && !path.resolve(env[name]).startsWith(`${mount}${path.sep}`)) errors.push(name);
      }
    }
    if (!validHttpsUrl(env.SQUARE_WEBHOOK_NOTIFICATION_URL, "/api/square/webhook")) errors.push("SQUARE_WEBHOOK_NOTIFICATION_URL");
    if (env.PUBLIC_ORIGIN && env.SQUARE_WEBHOOK_NOTIFICATION_URL && new URL(env.PUBLIC_ORIGIN).origin !== new URL(env.SQUARE_WEBHOOK_NOTIFICATION_URL).origin) errors.push("SQUARE_WEBHOOK_NOTIFICATION_URL");
    if (env.RESEND_API_KEY && !String(env.RESEND_FROM_EMAIL || "").includes("@")) errors.push("RESEND_FROM_EMAIL");
  }
  if (errors.length) throw configurationError(errors);
  return {
    environment: env.NODE_ENV || "development",
    deploymentStage,
    production,
    trustProxyHops: hops,
    categories: {
      required: production ? ["PUBLIC_ORIGIN", "DATA_DIR", "UPLOAD_DIR", "PERSISTENT_DISK_MOUNT_PATH", "ADMIN_PASSWORD_HASH", "SQUARE_ENVIRONMENT", "SQUARE_ACCESS_TOKEN", "SQUARE_LOCATION_ID", "SQUARE_WEBHOOK_SIGNATURE_KEY", "SQUARE_WEBHOOK_NOTIFICATION_URL"] : [],
      optional: [
        "ADMIN_EMAIL", "ALLOWED_ORIGINS", "MAX_JSON_BODY_BYTES", "RESEND_API_KEY", "RESEND_FROM_EMAIL",
        "GOOGLE_DRIVE_BACKUP_FOLDER_ID", "GOOGLE_DRIVE_BACKUP_FILE_ID", "GOOGLE_DRIVE_BACKUP_FILE_NAME",
        "GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON", "GOOGLE_DRIVE_SERVICE_ACCOUNT_FILE", "GOOGLE_DRIVE_CLIENT_EMAIL",
        "GOOGLE_DRIVE_PRIVATE_KEY", "MARKET_PRICE_PROVIDER", "MARKET_USD_TO_CAD", "USD_TO_CAD_RATE",
        "POKEMON_TCG_API_KEY", "TCG_API_KEY", "CANADA_POST_ADDRESS_KEY", "PORT",
      ],
      developmentOnly: ["ADMIN_PASSWORD"],
      productionOnly: ["DEPLOYMENT_STAGE", "PUBLIC_ORIGIN", "PERSISTENT_DISK_MOUNT_PATH", "TRUST_PROXY_HOPS"],
    },
  };
}

function redact(value, key = "") {
  if (secretNames.has(key) || /password|secret|token|cookie|authorization|private.?key|card.?number|\bpan\b|cvv|cvc/i.test(key)) return "[REDACTED]";
  if (Array.isArray(value)) return value.map(item => redact(item));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, redact(item, name)]));
  return value;
}

module.exports = { configurationError, redact, secretNames, validateConfig };
