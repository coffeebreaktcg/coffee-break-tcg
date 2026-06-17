const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const https = require("node:https");
const http = require("node:http");
const path = require("node:path");
const zlib = require("node:zlib");

const root = __dirname;

function loadLocalEnv() {
  const envPath = path.join(root, ".env");
  if (!fsSync.existsSync(envPath)) return;
  for (const line of fsSync.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

loadLocalEnv();

function envPath(name, fallback) {
  const value = process.env[name];
  if (!value) return fallback;
  return path.isAbsolute(value) ? value : path.join(root, value);
}

const dataDir = envPath("DATA_DIR", path.join(root, "data"));
const dbPath = path.join(dataDir, "db.json");
const backupDir = path.join(dataDir, "backups");
const uploadDir = envPath("UPLOAD_DIR", path.join(root, "assets", "uploads"));
const port = Number(process.env.PORT || 4173);
const canadaPostKey = process.env.CANADA_POST_ADDRESS_KEY || "";
const marketPriceProvider = process.env.MARKET_PRICE_PROVIDER || "local";
const tcgApiKey = process.env.TCG_API_KEY || "";
const pokemonTcgApiKey = process.env.POKEMON_TCG_API_KEY || "";
const usdToCadRate = Number(process.env.USD_TO_CAD_RATE || process.env.MARKET_USD_TO_CAD || 1.38);
const priceSyncIntervalMs = 60 * 60 * 1000;
const shopEmail = "coffeebreaktcg@gmail.com";
const adminEmail = String(process.env.ADMIN_EMAIL || shopEmail).trim().toLowerCase();
const adminPassword = String(process.env.ADMIN_PASSWORD || "");
const adminPasswordHash = String(process.env.ADMIN_PASSWORD_HASH || "");
const resendApiKey = process.env.RESEND_API_KEY || "";
const resendFromEmail = process.env.RESEND_FROM_EMAIL || "Coffee Break TCG <orders@coffeebreaktcg.com>";
const squareEnvironment = process.env.SQUARE_ENVIRONMENT || "sandbox";
const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN || "";
const squareLocationId = process.env.SQUARE_LOCATION_ID || "";
const squareWebhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || "";
const squareWebhookNotificationUrl = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL || "";
const googleDriveBackupFolderId = process.env.GOOGLE_DRIVE_BACKUP_FOLDER_ID || "";
const googleDriveBackupFileId = process.env.GOOGLE_DRIVE_BACKUP_FILE_ID || "";
const googleDriveBackupFileName = process.env.GOOGLE_DRIVE_BACKUP_FILE_NAME || "coffee-break-latest-backup.zip";
const googleDriveServiceAccountJson = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON || "";
const googleDriveServiceAccountFile = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_FILE || "";
const googleDriveClientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL || "";
const googleDrivePrivateKey = (process.env.GOOGLE_DRIVE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
const cardImageSearchCache = new Map();
const cardImageSearchCacheTtlMs = 1000 * 60 * 30;
const reservationHoldMs = 10 * 60 * 1000;
const adminLoginAttempts = new Map();
const maxJsonBodyBytes = Number(process.env.MAX_JSON_BODY_BYTES || 8 * 1024 * 1024);
const clearInventoryMigrationId = "clear-all-inventory-2026-06-02";
const starterInventoryIds = new Set([
  "pikachu-ar",
  "umbreon-vmax",
  "sv-151-box",
  "gengar-holo",
  "charizard-ex",
  "pokemon-mega-preorder",
  "slab-guard",
  "mewtwo-masterball",
  "lost-origin-bb",
  "snorlax-151-ir",
  "lugia-v-psa9",
  "twilight-masquerade-bundle",
  "surging-sparks-pack",
]);
let lastDbBackupAt = 0;
let googleDriveBackupTimer = null;
let googleDriveAccessToken = null;
let googleDriveAccessTokenExpiresAt = 0;
let googleDriveBackupStatus = {
  enabled: false,
  configured: false,
  state: "disabled",
  message: "Google Drive n’est pas configuré.",
  lastRunAt: null,
  fileId: null,
};
const dbBackupIntervalMs = 5 * 60 * 1000;
const adminSessionMs = 8 * 60 * 60 * 1000;
const TPS_RATE = 0.05;
const TVQ_RATE = 0.09975;
const TAX_INCLUDED_DIVISOR = 1 + TPS_RATE + TVQ_RATE;
const COFFEE_BUCKS_EARN_RATE = 4;
const COFFEE_BUCKS_REDEEM_RATE = 100;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
};

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.resend.com https://connect.squareup.com https://connect.squareupsandbox.com https://api.pokemontcg.io https://images.pokemontcg.io https://images.scrydex.com https://ws1.postescanada-canadapost.ca; form-action 'self'; upgrade-insecure-requests",
};

if (process.env.NODE_ENV === "production") {
  securityHeaders["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
}

async function readDb() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    const db = JSON.parse(await fs.readFile(dbPath, "utf8"));
    if (!Array.isArray(db.inventory)) db.inventory = defaultInventory();
    if (!Array.isArray(db.orders)) db.orders = [];
    if (!Array.isArray(db.emailOutbox)) db.emailOutbox = [];
    if (!Array.isArray(db.cardShows)) db.cardShows = [];
    if (!Array.isArray(db.reviews)) db.reviews = defaultReviews();
    if (!Array.isArray(db.users)) db.users = [];
    if (!Array.isArray(db.newsletter)) db.newsletter = [];
    if (!db.sessions) db.sessions = {};
    if (!db.adminSessions) db.adminSessions = {};
    if (!Array.isArray(db.migrations)) db.migrations = [];
    if (!db.migrations.includes(clearInventoryMigrationId)) {
      db.inventory = [];
      db.migrations.push(clearInventoryMigrationId);
      await writeDb(db);
    } else {
      const inventoryCountBeforeStarterCleanup = db.inventory.length;
      db.inventory = db.inventory.filter((item) => !starterInventoryIds.has(item.id));
      if (db.inventory.length !== inventoryCountBeforeStarterCleanup) await writeDb(db);
    }
    return db;
  } catch {
    const seedPath = path.join(root, "data", "seed.json");
    let empty = { users: [], sessions: {}, adminSessions: {}, orders: [], emailOutbox: [], newsletter: [], cardShows: [], reviews: defaultReviews(), inventory: defaultInventory() };
    try {
      const seed = JSON.parse(await fs.readFile(seedPath, "utf8"));
      empty = {
        ...empty,
        ...seed,
        users: [],
        sessions: {},
        adminSessions: {},
        orders: [],
        emailOutbox: [],
      };
    } catch {}
    await writeDb(empty);
    return empty;
  }
}

async function writeDb(db) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
  await writeDbBackup(db);
  scheduleGoogleDriveBackup(db, "database-change");
}

async function writeDbBackup(db, { force = false } = {}) {
  const now = Date.now();
  if (!force && now - lastDbBackupAt < dbBackupIntervalMs) return;
  lastDbBackupAt = now;
  await fs.mkdir(backupDir, { recursive: true });
  const stamp = new Date(now).toISOString().replace(/[:.]/g, "-");
  await fs.writeFile(path.join(backupDir, `db-${stamp}.json`), JSON.stringify(db, null, 2));
  const files = (await fs.readdir(backupDir)).filter((file) => /^db-.*\.json$/.test(file)).sort();
  const extra = files.slice(0, Math.max(0, files.length - 40));
  await Promise.all(extra.map((file) => fs.unlink(path.join(backupDir, file)).catch(() => {})));
}

async function uploadManifest() {
  await fs.mkdir(uploadDir, { recursive: true });
  const files = await fs.readdir(uploadDir).catch(() => []);
  const manifest = [];
  for (const file of files) {
    const filePath = path.join(uploadDir, file);
    const stat = await fs.stat(filePath).catch(() => null);
    if (!stat?.isFile()) continue;
    manifest.push({
      file,
      path: `/assets/uploads/${file}`,
      size: stat.size,
      updatedAt: stat.mtime.toISOString(),
    });
  }
  return manifest.sort((a, b) => a.file.localeCompare(b.file));
}

function base64Url(input) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function googleDriveCredentials() {
  if (!googleDriveBackupFolderId) return null;
  if (googleDriveServiceAccountFile && fsSync.existsSync(googleDriveServiceAccountFile)) {
    try {
      const parsed = JSON.parse(fsSync.readFileSync(googleDriveServiceAccountFile, "utf8"));
      if (parsed.client_email && parsed.private_key) {
        return { clientEmail: parsed.client_email, privateKey: parsed.private_key.replace(/\\n/g, "\n") };
      }
    } catch {
      return null;
    }
  }
  if (googleDriveServiceAccountJson) {
    try {
      const parsed = JSON.parse(
        googleDriveServiceAccountJson.trim().startsWith("{")
          ? googleDriveServiceAccountJson
          : Buffer.from(googleDriveServiceAccountJson, "base64").toString("utf8")
      );
      if (parsed.client_email && parsed.private_key) {
        return { clientEmail: parsed.client_email, privateKey: parsed.private_key.replace(/\\n/g, "\n") };
      }
    } catch {
      return null;
    }
  }
  if (googleDriveClientEmail && googleDrivePrivateKey) {
    return { clientEmail: googleDriveClientEmail, privateKey: googleDrivePrivateKey };
  }
  return null;
}

function googleDriveConfigured() {
  return Boolean(googleDriveCredentials());
}

function httpsRequestJson(url, options = {}, body = "") {
  return new Promise((resolve, reject) => {
    const request = https.request(url, options, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        const payload = text ? JSON.parse(text) : {};
        if (response.statusCode >= 400) {
          reject(new Error(payload.error_description || payload.error?.message || payload.error || `Erreur HTTP ${response.statusCode}`));
          return;
        }
        resolve(payload);
      });
    });
    request.on("error", reject);
    if (body) request.write(body);
    request.end();
  });
}

async function getGoogleDriveAccessToken() {
  if (googleDriveAccessToken && googleDriveAccessTokenExpiresAt > Date.now() + 60 * 1000) return googleDriveAccessToken;
  const credentials = googleDriveCredentials();
  if (!credentials) throw new Error("Identifiants Google Drive manquants.");
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: credentials.clientEmail,
      scope: "https://www.googleapis.com/auth/drive",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })
  );
  const signature = crypto.createSign("RSA-SHA256").update(`${header}.${claim}`).sign(credentials.privateKey, "base64url");
  const assertion = `${header}.${claim}.${signature}`;
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  }).toString();
  const payload = await httpsRequestJson(
    "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    body
  );
  googleDriveAccessToken = payload.access_token;
  googleDriveAccessTokenExpiresAt = Date.now() + Number(payload.expires_in || 3600) * 1000;
  return googleDriveAccessToken;
}

function driveHeaders(token, extra = {}) {
  return { Authorization: `Bearer ${token}`, ...extra };
}

async function findGoogleDriveBackupFile(token) {
  if (googleDriveBackupFileId) {
    return { id: googleDriveBackupFileId, name: googleDriveBackupFileName };
  }
  const url = new URL("https://www.googleapis.com/drive/v3/files");
  const escapedName = googleDriveBackupFileName.replace(/'/g, "\\'");
  url.searchParams.set("q", `'${googleDriveBackupFolderId}' in parents and name='${escapedName}' and trashed=false`);
  url.searchParams.set("fields", "files(id,name,modifiedTime)");
  const payload = await httpsRequestJson(url, { headers: driveHeaders(token) });
  return Array.isArray(payload.files) ? payload.files[0] : null;
}

function multipartDriveBody(metadata, fileBuffer, fileContentType = "application/json; charset=UTF-8") {
  const boundary = `coffee-break-${crypto.randomBytes(8).toString("hex")}`;
  const head = [
    `--${boundary}`,
    "Content-Type: application/json; charset=UTF-8",
    "",
    JSON.stringify(metadata),
    `--${boundary}`,
    `Content-Type: ${fileContentType}`,
    "",
    "",
  ].join("\r\n");
  const tail = [
    `--${boundary}--`,
    "",
  ].join("\r\n");
  return { boundary, body: Buffer.concat([Buffer.from(head), Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer), Buffer.from(`\r\n${tail}`)]) };
}

async function buildBackupPayload(db, reason = "manual") {
  return {
    generatedAt: new Date().toISOString(),
    reason,
    note: "Sauvegarde des données Coffee Break TCG. Les fichiers uploadés sont listés dans uploadedFiles et restent dans assets/uploads.",
    db,
    uploadedFiles: await uploadManifest(),
  };
}

async function buildBackupZip(db, reason = "manual") {
  const payload = await buildBackupPayload(db, reason);
  const files = [
    { name: "manifest.json", data: JSON.stringify({ generatedAt: payload.generatedAt, reason, uploadedFiles: payload.uploadedFiles }, null, 2) },
    { name: "data/db.json", data: JSON.stringify(db, null, 2) },
    { name: "data/backup.json", data: JSON.stringify(payload, null, 2) },
  ];
  await fs.mkdir(uploadDir, { recursive: true });
  for (const upload of payload.uploadedFiles) {
    const absolute = path.join(root, upload.path);
    if (!absolute.startsWith(uploadDir)) continue;
    const data = await fs.readFile(absolute).catch(() => null);
    if (data) files.push({ name: `assets/uploads/${upload.file}`, data });
  }
  return createZip(files);
}

async function uploadBackupToGoogleDrive(db, reason = "database-change") {
  googleDriveBackupStatus = {
    ...googleDriveBackupStatus,
    enabled: Boolean(googleDriveBackupFolderId),
    configured: googleDriveConfigured(),
    state: "running",
    message: "Synchronisation Google Drive en cours...",
    lastRunAt: new Date().toISOString(),
  };
  if (!googleDriveBackupFolderId) throw new Error("GOOGLE_DRIVE_BACKUP_FOLDER_ID manquant.");
  if (!googleDriveConfigured()) throw new Error("Identifiants Google Drive manquants.");
  const token = await getGoogleDriveAccessToken();
  const existing = await findGoogleDriveBackupFile(token);
  if (!existing) {
    googleDriveBackupStatus = {
      enabled: true,
      configured: true,
      state: "needs-file",
      message: `Crée d’abord un fichier ${googleDriveBackupFileName} dans le dossier Drive, partage-le avec le service account, puis ajoute GOOGLE_DRIVE_BACKUP_FILE_ID dans .env.`,
      lastRunAt: new Date().toISOString(),
      fileId: null,
    };
    return googleDriveBackupStatus;
  }
  const zipBuffer = await buildBackupZip(db, reason);
  const metadata = { name: googleDriveBackupFileName, mimeType: "application/zip" };
  const { boundary, body } = multipartDriveBody(metadata, zipBuffer, "application/zip");
  const endpoint = `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=multipart`;
  const response = await httpsRequestJson(
    endpoint,
    {
      method: "PATCH",
      headers: driveHeaders(token, {
        "Content-Type": `multipart/related; boundary=${boundary}`,
        "Content-Length": Buffer.byteLength(body),
      }),
    },
    body
  );
  googleDriveBackupStatus = {
    enabled: true,
    configured: true,
    state: "synced",
    message: "Sauvegarde Google Drive à jour.",
    lastRunAt: new Date().toISOString(),
    fileId: response.id || existing?.id || null,
  };
  return googleDriveBackupStatus;
}

function scheduleGoogleDriveBackup(db, reason = "database-change") {
  googleDriveBackupStatus = {
    ...googleDriveBackupStatus,
    enabled: Boolean(googleDriveBackupFolderId),
    configured: googleDriveConfigured(),
  };
  if (!googleDriveBackupFolderId || !googleDriveConfigured()) return;
  clearTimeout(googleDriveBackupTimer);
  googleDriveBackupTimer = setTimeout(() => {
    uploadBackupToGoogleDrive(db, reason).catch((error) => {
      googleDriveBackupStatus = {
        enabled: Boolean(googleDriveBackupFolderId),
        configured: googleDriveConfigured(),
        state: "error",
        message: error.message,
        lastRunAt: new Date().toISOString(),
        fileId: googleDriveBackupStatus.fileId || null,
      };
    });
  }, 1500);
}

function publicBackupStatus() {
  return {
    ...googleDriveBackupStatus,
    enabled: Boolean(googleDriveBackupFolderId),
    configured: googleDriveConfigured(),
    fileName: googleDriveBackupFileName,
  };
}

function jsonAttachment(res, filename, payload) {
  res.writeHead(200, {
    ...securityHeaders,
    "Content-Type": "application/json; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename}"`,
  });
  res.end(JSON.stringify(payload, null, 2));
}

function zipAttachment(res, filename, buffer) {
  res.writeHead(200, {
    ...securityHeaders,
    "Content-Type": "application/zip",
    "Content-Disposition": `attachment; filename="${filename}"`,
  });
  res.end(buffer);
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const time = ((date.getHours() & 0x1f) << 11) | ((date.getMinutes() & 0x3f) << 5) | Math.floor(date.getSeconds() / 2);
  const day = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, day };
}

function zipFileName(name) {
  return String(name || "file").replace(/^\/+/, "").replace(/\.\./g, "").replace(/\\/g, "/");
}

function createZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  for (const file of files) {
    const nameBuffer = Buffer.from(zipFileName(file.name), "utf8");
    const raw = Buffer.isBuffer(file.data) ? file.data : Buffer.from(String(file.data || ""), "utf8");
    const compressed = zlib.deflateRawSync(raw);
    const checksum = crc32(raw);
    const { time, day } = dosDateTime(file.date || new Date());
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6);
    localHeader.writeUInt16LE(8, 8);
    localHeader.writeUInt16LE(time, 10);
    localHeader.writeUInt16LE(day, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(raw.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localParts.push(localHeader, nameBuffer, compressed);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(time, 12);
    centralHeader.writeUInt16LE(day, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(raw.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt32LE(offset, 42);
    centralParts.push(centralHeader, nameBuffer);
    offset += localHeader.length + nameBuffer.length + compressed.length;
  }
  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...localParts, centralDirectory, end]);
}

function defaultInventory() {
  return [];
}

function defaultReviews() {
  return [
    {
      id: "review-antoine",
      name: "Antoine",
      city: "Québec",
      rating: 5,
      product: "Single Pokémon",
      text: "Carte exactement comme sur les photos, emballage solide et communication rapide.",
      date: "2026-05-20",
      published: true,
      createdAt: "2026-05-20T12:00:00.000Z",
      updatedAt: "2026-05-20T12:00:00.000Z",
    },
    {
      id: "review-sarah",
      name: "Sarah",
      city: "Laval",
      rating: 5,
      product: "Graded",
      text: "Très belle expérience. Le slab était bien protégé et la livraison a été rapide.",
      date: "2026-05-21",
      published: true,
      createdAt: "2026-05-21T12:00:00.000Z",
      updatedAt: "2026-05-21T12:00:00.000Z",
    },
    {
      id: "review-marc",
      name: "Marc",
      city: "Saint-Jérôme",
      rating: 5,
      product: "Sealed",
      text: "Service sérieux, réponse rapide et commande reçue proprement emballée.",
      date: "2026-05-22",
      published: true,
      createdAt: "2026-05-22T12:00:00.000Z",
      updatedAt: "2026-05-22T12:00:00.000Z",
    },
  ];
}

function json(res, status, payload, extraHeaders = {}) {
  res.writeHead(status, {
    ...securityHeaders,
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders,
  });
  res.end(JSON.stringify(payload));
}

function csv(res, filename, rows) {
  const body = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  res.writeHead(200, {
    ...securityHeaders,
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename}"`,
  });
  res.end(`\ufeff${body}`);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const index = item.indexOf("=");
        return [item.slice(0, index), decodeURIComponent(item.slice(index + 1))];
      })
  );
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt] = stored.split(":");
  const expected = Buffer.from(hashPassword(password, salt));
  const actual = Buffer.from(stored);
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

function adminPasswordMatches(password) {
  if (adminPasswordHash) return verifyPassword(password, adminPasswordHash);
  if (!adminPassword || password.length !== adminPassword.length) return false;
  return crypto.timingSafeEqual(Buffer.from(password), Buffer.from(adminPassword));
}

if (process.argv[2] === "hash-admin-password") {
  const password = process.argv.slice(3).join(" ");
  if (!password || password.length < 12) {
    console.error('Usage: node server.js hash-admin-password "mot-de-passe-admin-long"');
    process.exit(1);
  }
  console.log(hashPassword(password));
  process.exit(0);
}

function requestIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "local").split(",")[0].trim();
}

function adminAttemptState(req) {
  const key = requestIp(req);
  const now = Date.now();
  const state = adminLoginAttempts.get(key) || { count: 0, lockedUntil: 0 };
  if (state.lockedUntil && state.lockedUntil < now) {
    state.count = 0;
    state.lockedUntil = 0;
  }
  adminLoginAttempts.set(key, state);
  return state;
}

function recordAdminLoginFailure(req) {
  const state = adminAttemptState(req);
  state.count += 1;
  if (state.count >= 5) state.lockedUntil = Date.now() + 15 * 60 * 1000;
}

function clearAdminLoginFailures(req) {
  adminLoginAttempts.delete(requestIp(req));
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address || null,
    paymentMethod: user.paymentMethod || null,
    coffeeBucks: Math.max(0, Number(user.coffeeBucks || 0)),
    lastLogin: user.lastLogin || null,
  };
}

function publicCustomerOrder(order) {
  return {
    id: order.id,
    status: order.status,
    items: Array.isArray(order.items) ? order.items : [],
    subtotalAmount: Number(order.subtotalAmount || 0),
    tpsAmount: Number(order.tpsAmount || 0),
    tvqAmount: Number(order.tvqAmount || 0),
    totalAmount: Number(order.totalAmount || order.total || 0),
    coffeeBucksEarned: Number(order.coffeeBucksEarned || 0),
    coffeeBucksRedeemed: Number(order.coffeeBucksRedeemed || 0),
    coffeeBucksDiscount: Number(order.coffeeBucksDiscount || 0),
    paymentMethod: order.paymentMethod || null,
    paymentUrl: order.paymentUrl || "",
    reservationExpiresAt: order.reservationExpiresAt || "",
    createdAt: order.createdAt || "",
  };
}

function getAdminSession(req, db) {
  const sessionId = parseCookies(req).cb_admin;
  const session = sessionId ? db.adminSessions?.[sessionId] : null;
  if (!session) return null;
  if (session.expiresAt && new Date(session.expiresAt).getTime() < Date.now()) {
    delete db.adminSessions[sessionId];
    return null;
  }
  return session;
}

function publicAdmin(session) {
  return session ? { email: session.email, name: "Coffee Break Admin", expiresAt: session.expiresAt || null } : null;
}

function publicProduct(product) {
  const reservedQuantity = Number(product.reservedQuantity || 0);
  const stock = Number(product.stock || 0);
  const baseStatus = product.status || (product.category === "Preorder" ? "preorder" : "available");
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    kind: product.kind || product.visual || "single",
    status: baseStatus === "draft" ? "draft" : stock <= 0 && reservedQuantity > 0 ? "reserved" : baseStatus,
    sku: product.sku || product.id,
    condition: product.condition,
    setId: product.setId || "",
    setName: product.setName || "",
    cardNumber: product.cardNumber || "",
    rarity: product.rarity || "",
    gradingCompany: product.gradingCompany || "",
    grade: product.grade || "",
    price: Number(product.price || 0),
    compareAtPrice: Number(product.compareAtPrice || 0),
    market: Number(product.market || product.price || 0),
    lastMarketPrice: Number(product.lastMarketPrice || product.market || product.price || 0),
    priceAuto: product.priceAuto !== false,
    marketSource: product.marketSource || marketPriceProvider,
    lastMarketSync: product.lastMarketSync || "",
    stock,
    reservedQuantity,
    maxPerCart: Number(product.maxPerCart || 0),
    accent: product.accent || "#c9652f",
    visual: product.visual || "single",
    imageUrl: product.imageUrl || "",
    galleryImages: Array.isArray(product.galleryImages) ? product.galleryImages.slice(0, 4) : [],
    features: Array.isArray(product.features) ? product.features.slice(0, 2) : [],
    featured: Boolean(product.featured),
    badge: product.badge || "",
    createdAt: product.createdAt || product.updatedAt || "",
  };
}

function publicReview(review) {
  return {
    id: review.id,
    name: String(review.name || "").trim(),
    city: String(review.city || "").trim(),
    rating: Math.max(1, Math.min(5, Number(review.rating || 5))),
    product: String(review.product || "").trim(),
    text: String(review.text || "").trim(),
    photoUrl: String(review.photoUrl || "").trim(),
    date: String(review.date || "").trim(),
    published: review.published !== false,
    createdAt: review.createdAt || "",
    updatedAt: review.updatedAt || "",
  };
}

function moneyText(value) {
  return new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD" }).format(Number(value || 0));
}

function orderItemsTotal(orderOrItems) {
  const items = Array.isArray(orderOrItems) ? orderOrItems : orderOrItems?.items || [];
  return items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
}

function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function taxBreakdown(subtotal) {
  const value = roundMoney(subtotal);
  const tps = roundMoney(value * TPS_RATE);
  const tvq = roundMoney(value * TVQ_RATE);
  return {
    subtotal: value,
    tps,
    tvq,
    total: roundMoney(value + tps + tvq),
  };
}

function coffeeBucksDiscount(points) {
  return roundMoney(Math.max(0, Number(points || 0)) / COFFEE_BUCKS_REDEEM_RATE);
}

function coffeeBucksEarned(order) {
  return Math.floor(Number(order.totalAmount || orderGrandTotal(order) || 0) * COFFEE_BUCKS_EARN_RATE);
}

function applyCoffeeBucksEarned(db, order) {
  if (!order?.userId || order.userId === "guest" || order.userId === "admin" || order.coffeeBucksAwardedAt) return 0;
  const user = db.users.find((candidate) => candidate.id === order.userId);
  if (!user) return 0;
  const earned = coffeeBucksEarned(order);
  user.coffeeBucks = Math.max(0, Number(user.coffeeBucks || 0)) + earned;
  order.coffeeBucksEarned = earned;
  order.coffeeBucksAwardedAt = new Date().toISOString();
  return earned;
}

function refundCoffeeBucks(db, order) {
  if (!order?.userId || order.userId === "guest" || order.userId === "admin" || order.coffeeBucksRefundedAt) return 0;
  const redeemed = Number(order.coffeeBucksRedeemed || 0);
  if (redeemed <= 0) return 0;
  const user = db.users.find((candidate) => candidate.id === order.userId);
  if (!user) return 0;
  user.coffeeBucks = Math.max(0, Number(user.coffeeBucks || 0)) + redeemed;
  order.coffeeBucksRefundedAt = new Date().toISOString();
  return redeemed;
}

function releaseOrderReservation(db, order, reason = "Réservation expirée") {
  if (!order || order.reservationReleasedAt) return false;
  for (const item of order.items || []) {
    const product = db.inventory.find((candidate) => candidate.id === item.id);
    if (!product) continue;
    const quantity = Math.max(1, Number(item.quantity || 1));
    product.stock = Number(product.stock || 0) + quantity;
    product.reservedQuantity = Math.max(0, Number(product.reservedQuantity || 0) - quantity);
    if (product.status === "reserved") product.status = product.category === "Preorder" ? "preorder" : "available";
  }
  refundCoffeeBucks(db, order);
  order.status = "expired";
  order.expiredAt = new Date().toISOString();
  order.reservationReleasedAt = order.expiredAt;
  order.cancelReason = reason;
  return true;
}

function expirePendingReservations(db) {
  const now = Date.now();
  let changed = false;
  for (const order of db.orders || []) {
    if (order.status !== "pending_payment" || !order.reservationExpiresAt) continue;
    if (new Date(order.reservationExpiresAt).getTime() > now) continue;
    changed = releaseOrderReservation(db, order, "Paiement non complété dans le délai de 10 minutes") || changed;
  }
  return changed;
}

function orderGrandTotal(order) {
  if (Number(order.totalAmount || 0) > 0) return Number(order.totalAmount || 0);
  return taxBreakdown(orderItemsTotal(order)).total;
}

function reportDate(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

function reportMonth(value) {
  return value ? new Date(value).toISOString().slice(0, 7) : "";
}

function monthNameFr(index) {
  return ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"][index] || "";
}

function orderCustomer(order) {
  return order.customer || order.address || {};
}

function paidOrders(db) {
  return (db.orders || []).filter((order) => ["paid", "admin_sale"].includes(order.status));
}

function saleCategoryLabel(category) {
  if (category === "Graded") return "Slabs";
  if (category === "Sealed") return "Scellé";
  return category || "Autre";
}

function accountingSummary(db, year = new Date().getFullYear()) {
  const rows = Array.from({ length: 12 }, (_, index) => {
    const key = `${year}-${String(index + 1).padStart(2, "0")}`;
    const monthOrders = paidOrders(db).filter((order) => reportMonth(order.createdAt) === key);
    const revenue = roundMoney(monthOrders.reduce((sum, order) => sum + orderItemsTotal(order), 0));
    const cost = roundMoney(
      monthOrders.reduce(
        (sum, order) =>
          sum +
          (order.items || []).reduce((lineSum, item) => lineSum + Number(item.cost || 0) * Math.max(1, Number(item.quantity || 1)), 0),
        0
      )
    );
    const netProfit = roundMoney(revenue - cost);
    const categories = { Singles: 0, Slabs: 0, Scellé: 0 };
    for (const order of monthOrders) {
      for (const item of order.items || []) {
        const label = saleCategoryLabel(item.category);
        if (Object.prototype.hasOwnProperty.call(categories, label)) {
          categories[label] += Number(item.price || 0) * Number(item.quantity || 0);
        }
      }
    }
    const tpsCollected = roundMoney(monthOrders.reduce((sum, order) => sum + Number(order.tpsAmount || order.taxBreakdown?.tps || 0), 0));
    const tvqCollected = roundMoney(monthOrders.reduce((sum, order) => sum + Number(order.tvqAmount || order.taxBreakdown?.tvq || 0), 0));
    return {
      month: monthNameFr(index),
      key,
      revenue,
      cost,
      netProfit,
      singles: roundMoney(categories.Singles),
      slabs: roundMoney(categories.Slabs),
      sealed: roundMoney(categories.Scellé),
      margin: revenue > 0 ? roundMoney(netProfit / revenue) : 0,
      tpsCollected,
      tvqCollected,
      netTps: tpsCollected,
      netTvq: tvqCollected,
    };
  });
  return {
    year,
    rows,
    totals: {
      revenue: roundMoney(rows.reduce((sum, row) => sum + row.revenue, 0)),
      cost: roundMoney(rows.reduce((sum, row) => sum + row.cost, 0)),
      netProfit: roundMoney(rows.reduce((sum, row) => sum + row.netProfit, 0)),
      tpsCollected: roundMoney(rows.reduce((sum, row) => sum + row.tpsCollected, 0)),
      tvqCollected: roundMoney(rows.reduce((sum, row) => sum + row.tvqCollected, 0)),
      netTps: roundMoney(rows.reduce((sum, row) => sum + row.netTps, 0)),
      netTvq: roundMoney(rows.reduce((sum, row) => sum + row.netTvq, 0)),
    },
  };
}

function salesReportRows(db) {
  const rows = [
    [
      "Date",
      "Commande",
      "Statut",
      "Client",
      "Courriel",
      "Item",
      "Catégorie",
      "Quantité",
      "Prix vendu",
      "Prix payé",
      "Sous-total ligne",
      "Profit ligne",
      "TPS commande",
      "TVQ commande",
      "Total commande",
      "Paiement",
    ],
  ];
  for (const order of db.orders || []) {
    const customer = orderCustomer(order);
    for (const item of order.items || []) {
      const quantity = Math.max(1, Number(item.quantity || 1));
      const lineRevenue = roundMoney(Number(item.price || 0) * quantity);
      const lineCost = roundMoney(Number(item.cost || 0) * quantity);
      rows.push([
        reportDate(order.createdAt),
        order.id,
        order.status,
        customer.name || "",
        customer.email || "",
        item.name,
        item.category || "",
        quantity,
        Number(item.price || 0),
        Number(item.cost || 0),
        lineRevenue,
        roundMoney(lineRevenue - lineCost),
        Number(order.tpsAmount || order.taxBreakdown?.tps || 0),
        Number(order.tvqAmount || order.taxBreakdown?.tvq || 0),
        orderGrandTotal(order),
        order.paymentMethod?.label || "",
      ]);
    }
  }
  return rows;
}

function monthlyReportRows(db) {
  const summary = accountingSummary(db);
  return [
    ["Mois", "Revenu brut", "Coût des items", "Revenu net", "Singles", "Slabs", "Scellé", "Marge %"],
    ...summary.rows.map((row) => [row.month, row.revenue, row.cost, row.netProfit, row.singles, row.slabs, row.sealed, row.margin]),
  ];
}

function taxesReportRows(db) {
  const summary = accountingSummary(db);
  return [
    ["Mois", "TPS collectée", "TVQ collectée"],
    ...summary.rows.map((row) => [row.month, row.tpsCollected, row.tvqCollected]),
  ];
}

function inventoryReportRows(db) {
  return [
    ["Item", "Catégorie", "Extension", "Numéro", "Rareté", "Condition", "Slab", "Stock", "Réservé", "Prix payé", "Prix marché", "Prix affiché", "Valeur payée", "Valeur affichée"],
    ...(db.inventory || []).map((item) => {
      const stock = Number(item.stock || 0);
      return [
        item.name,
        item.category,
        item.setName || "",
        item.cardNumber || "",
        item.rarity || "",
        item.condition || "",
        item.gradingCompany && item.grade ? `${item.gradingCompany} ${item.grade}` : "",
        stock,
        Number(item.reservedQuantity || 0),
        Number(item.cost || 0),
        Number(item.market || 0),
        Number(item.price || 0),
        roundMoney(Number(item.cost || 0) * stock),
        roundMoney(Number(item.price || 0) * stock),
      ];
    }),
  ];
}

function pendingReportRows(db) {
  const rows = [["Date", "Expiration", "Commande", "Client", "Courriel", "Téléphone", "Item", "Quantité", "Total commande", "Paiement"]];
  for (const order of db.orders || []) {
    if (order.status !== "pending_payment") continue;
    const customer = orderCustomer(order);
    for (const item of order.items || []) {
      rows.push([
        reportDate(order.createdAt),
        order.reservationExpiresAt || "",
        order.id,
        customer.name || "",
        customer.email || "",
        customer.phone || "",
        item.name,
        Number(item.quantity || 1),
        orderGrandTotal(order),
        order.paymentMethod?.label || "",
      ]);
    }
  }
  return rows;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function orderEmailLines(order) {
  const address = order.address || {};
  const items = (order.items || []).map((item) => {
    const details = [
      item.gradingCompany && item.grade ? `${item.gradingCompany} ${item.grade}` : "",
      item.setName,
      item.cardNumber ? `#${item.cardNumber}` : "",
      item.condition,
    ].filter(Boolean).join(" - ");
    const lineTotal = moneyText(Number(item.price || 0) * Number(item.quantity || 0));
    return `- ${item.name}${details ? ` (${details})` : ""} x ${item.quantity} - ${lineTotal}${item.imageUrl ? `\n  Image: ${item.imageUrl}` : ""}`;
  });
  return [
    `Commande ${order.id}`,
    "",
    "Items:",
    ...items,
    "",
    "Livraison:",
    `${address.name || order.customer?.name || ""}`,
    `${address.address || ""}`,
    `${address.city || ""}, ${address.province || ""} ${address.postal || ""}`,
    `Téléphone: ${address.phone || order.customer?.phone || ""}`,
    `Courriel: ${address.email || order.customer?.email || ""}`,
    address.notes ? `Notes: ${address.notes}` : "",
    "",
    `Paiement: ${order.paymentMethod?.label || "Carte avec Square"}`,
    order.paymentMethod?.instructions || "",
    "Expédition: Livraison depuis Laval, suivi inclus.",
  ].filter((line) => line !== "");
}

function orderEmailHtml(order, intro) {
  const address = order.address || {};
  const taxes = order.taxBreakdown || taxBreakdown(orderItemsTotal(order));
  const items = (order.items || [])
    .map((item) => {
      const details = [
        item.gradingCompany && item.grade ? `${item.gradingCompany} ${item.grade}` : "",
        item.setName,
        item.cardNumber ? `#${item.cardNumber}` : "",
        item.condition,
      ]
        .filter(Boolean)
        .join(" - ");
      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #ead8c6;width:74px;">
            ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="" style="width:58px;height:78px;object-fit:contain;border:1px solid #ead8c6;background:#fffaf2;" />` : ""}
          </td>
          <td style="padding:12px 12px;border-bottom:1px solid #ead8c6;">
            <strong>${escapeHtml(item.name)}</strong><br />
            <span style="color:#806452;font-size:13px;">${escapeHtml(details)}</span><br />
            <span style="color:#806452;font-size:13px;">Quantité: ${Number(item.quantity || 0)}</span>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #ead8c6;text-align:right;font-weight:700;">
            ${moneyText(Number(item.price || 0) * Number(item.quantity || 0))}
          </td>
        </tr>
      `;
    })
    .join("");
  return `
    <div style="margin:0;background:#fff8ec;color:#3b2a22;font-family:Arial,sans-serif;line-height:1.55;">
      <div style="max-width:680px;margin:0 auto;padding:28px;">
        <h1 style="margin:0 0 10px;font-size:26px;letter-spacing:0;color:#c9652f;">Coffee Break TCG</h1>
        <p style="margin:0 0 24px;color:#806452;">${escapeHtml(intro)}</p>
        <h2 style="font-size:18px;margin:0 0 8px;">Commande ${escapeHtml(order.id)}</h2>
        <table style="width:100%;border-collapse:collapse;background:#fffaf2;border-top:1px solid #ead8c6;">${items}</table>
        ${order.coffeeBucksDiscount ? `<p style="text-align:right;font-size:15px;font-weight:700;margin:18px 0 4px;">Coffee Bucks: -${moneyText(order.coffeeBucksDiscount)} (${Number(order.coffeeBucksRedeemed || 0)} points)</p>` : ""}
        <p style="text-align:right;font-size:15px;font-weight:700;margin:${order.coffeeBucksDiscount ? "4px" : "18px"} 0 4px;">Sous-total: ${moneyText(taxes.subtotal)}</p>
        <p style="text-align:right;font-size:15px;font-weight:700;margin:4px 0;">TPS: ${moneyText(taxes.tps)}</p>
        <p style="text-align:right;font-size:15px;font-weight:700;margin:4px 0;">TVQ: ${moneyText(taxes.tvq)}</p>
        <p style="text-align:right;font-size:18px;font-weight:800;margin:4px 0 18px;">Total: ${moneyText(taxes.total)}</p>
        <div style="background:#fffaf2;border:1px solid #ead8c6;padding:16px;margin-top:18px;">
          <strong>Livraison</strong><br />
          ${escapeHtml(address.name || order.customer?.name || "")}<br />
          ${escapeHtml(address.address || "")}<br />
          ${escapeHtml(address.city || "")}, ${escapeHtml(address.province || "")} ${escapeHtml(address.postal || "")}<br />
          Téléphone: ${escapeHtml(address.phone || order.customer?.phone || "")}<br />
          Courriel: ${escapeHtml(address.email || order.customer?.email || "")}
          ${address.notes ? `<br />Notes: ${escapeHtml(address.notes)}` : ""}
        </div>
        <p style="margin-top:18px;color:#806452;">Paiement: ${escapeHtml(order.paymentMethod?.label || "Carte avec Square")}. ${order.paymentMethod?.instructions ? `${escapeHtml(order.paymentMethod.instructions)} ` : ""}Si tu as des questions ou si tu souhaites valider un détail avant le paiement, écris-nous simplement. Ça nous fera plaisir de t’aider.</p>
      </div>
    </div>
  `;
}

function orderPackingEmailHtml(order) {
  const address = order.address || {};
  const taxes = order.taxBreakdown || taxBreakdown(orderItemsTotal(order));
  const items = (order.items || [])
    .map((item) => {
      const details = [
        item.gradingCompany && item.grade ? `${item.gradingCompany} ${item.grade}` : "",
        item.setName,
        item.cardNumber ? `#${item.cardNumber}` : "",
        item.condition,
      ]
        .filter(Boolean)
        .join(" - ");
      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #ead8c6;width:82px;">
            ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="" style="width:64px;height:86px;object-fit:contain;border:1px solid #ead8c6;background:#fffaf2;" />` : ""}
          </td>
          <td style="padding:12px;border-bottom:1px solid #ead8c6;">
            <strong>${escapeHtml(item.name)}</strong><br />
            <span style="color:#806452;font-size:13px;">${escapeHtml(details)}</span><br />
            <span style="color:#806452;font-size:13px;">Quantité: ${Number(item.quantity || 0)} | Prix: ${moneyText(Number(item.price || 0))}</span>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #ead8c6;text-align:right;font-weight:800;">${moneyText(Number(item.price || 0) * Number(item.quantity || 0))}</td>
        </tr>
      `;
    })
    .join("");
  return `
    <div style="margin:0;background:#fff8ec;color:#3b2a22;font-family:Arial,sans-serif;line-height:1.55;">
      <div style="max-width:760px;margin:0 auto;padding:28px;">
        <h1 style="margin:0 0 8px;font-size:27px;color:#c9652f;">Commande à préparer</h1>
        <p style="margin:0 0 20px;color:#806452;">Commande ${escapeHtml(order.id)} reçue sur Coffee Break TCG.</p>
        <div style="display:block;background:#fffaf2;border:1px solid #ead8c6;padding:16px;margin-bottom:18px;">
          <strong>Client / livraison</strong><br />
          ${escapeHtml(address.name || order.customer?.name || "")}<br />
          ${escapeHtml(address.address || "")}<br />
          ${escapeHtml(address.city || "")}, ${escapeHtml(address.province || "")} ${escapeHtml(address.postal || "")}<br />
          Téléphone: ${escapeHtml(address.phone || order.customer?.phone || "")}<br />
          Courriel: ${escapeHtml(address.email || order.customer?.email || "")}
          ${address.notes ? `<br />Notes: ${escapeHtml(address.notes)}` : ""}
        </div>
        <div style="background:#fff4df;border:1px solid #ead8c6;padding:16px;margin-bottom:18px;">
          <strong>Checklist</strong><br />
          1. Vérifier le paiement Square.<br />
          2. Sortir les items ci-dessous.<br />
          3. Protéger singles/slabs/sealed selon le type d’item.<br />
          4. Préparer l’étiquette et ajouter le suivi.
        </div>
        <table style="width:100%;border-collapse:collapse;background:#fffaf2;border-top:1px solid #ead8c6;">${items}</table>
        ${order.coffeeBucksDiscount ? `<p style="text-align:right;font-size:15px;font-weight:700;margin:18px 0 4px;">Coffee Bucks: -${moneyText(order.coffeeBucksDiscount)} (${Number(order.coffeeBucksRedeemed || 0)} points)</p>` : ""}
        <p style="text-align:right;font-size:15px;font-weight:700;margin:${order.coffeeBucksDiscount ? "4px" : "18px"} 0 4px;">Sous-total: ${moneyText(taxes.subtotal)}</p>
        <p style="text-align:right;font-size:15px;font-weight:700;margin:4px 0;">TPS: ${moneyText(taxes.tps)}</p>
        <p style="text-align:right;font-size:15px;font-weight:700;margin:4px 0;">TVQ: ${moneyText(taxes.tvq)}</p>
        <p style="text-align:right;font-size:20px;font-weight:900;margin:4px 0 18px;">Total: ${moneyText(taxes.total)}</p>
        <p style="margin-top:18px;color:#806452;">Statut actuel: ${escapeHtml(order.status || "pending_payment")}. Paiement: ${escapeHtml(order.paymentMethod?.label || "Carte avec Square")}.</p>
      </div>
    </div>
  `;
}

function orderCustomerConfirmationHtml(order, customerName) {
  const paid = order.status === "paid";
  return orderEmailHtml(
    order,
    paid
      ? `Merci pour ta commande chez Coffee Break TCG, ${customerName}. Ton paiement est confirmé et nous préparons ta commande avec soin. Tu trouveras le récapitulatif ci-dessous; si tu as une question, réponds simplement à ce courriel.`
      : `Merci pour ta commande chez Coffee Break TCG, ${customerName}. Nous avons bien reçu ta demande. Tu trouveras le récapitulatif ci-dessous; si tu as une question, réponds simplement à ce courriel.`
  );
}

function resendEmail(message) {
  if (!resendApiKey) return Promise.resolve({ skipped: true, reason: "RESEND_API_KEY missing" });
  const body = JSON.stringify({
    from: resendFromEmail,
    to: [message.to],
    subject: message.subject,
    text: message.body,
    html: message.html,
    attachments: message.attachments,
  });
  return new Promise((resolve, reject) => {
    const request = https.request(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          if (response.statusCode >= 400) return reject(new Error(`Resend ${response.statusCode}: ${text.slice(0, 220)}`));
          try {
            resolve(JSON.parse(text));
          } catch {
            resolve({ ok: true });
          }
        });
      }
    );
    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

function sellRequestPhotoAttachments(photos) {
  if (!Array.isArray(photos)) return [];
  return photos
    .filter((photo) => typeof photo === "string" && photo.startsWith("data:image/"))
    .slice(0, 12)
    .map((photo, index) => {
      const match = photo.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
      if (!match) return null;
      const ext = match[1] === "jpeg" ? "jpg" : match[1];
      return {
        filename: `collection-photo-${index + 1}.${ext}`,
        content: match[2],
      };
    })
    .filter(Boolean);
}

function sellRequestEmailHtml(body, photos) {
  const photoPreview = photos
    .slice(0, 6)
    .map((photo) => `<img src="${escapeHtml(photo)}" alt="" style="width:110px;height:110px;object-fit:cover;border:1px solid #ead8c6;background:#fffaf2;margin:0 8px 8px 0;" />`)
    .join("");
  return `
    <div style="margin:0;background:#fff8ec;color:#3b2a22;font-family:Arial,sans-serif;line-height:1.55;">
      <div style="max-width:680px;margin:0 auto;padding:28px;">
        <h1 style="margin:0 0 10px;font-size:26px;letter-spacing:0;color:#c9652f;">Nouvelle demande d'achat</h1>
        <p style="margin:0 0 18px;color:#806452;">Une collection a été soumise depuis le site Coffee Break TCG.</p>
        <div style="background:#fffaf2;border:1px solid #ead8c6;padding:16px;margin-bottom:18px;">
          <strong>Client</strong><br />
          Nom: ${escapeHtml(body.name)}<br />
          Courriel: ${escapeHtml(body.email)}<br />
          Prix demandé: ${escapeHtml(body.askingPrice ? moneyText(Number(body.askingPrice)) : "Non précisé")}
        </div>
        <div style="background:#fffaf2;border:1px solid #ead8c6;padding:16px;margin-bottom:18px;">
          <strong>Résumé de la collection</strong>
          <p>${escapeHtml(body.summary || "Aucun résumé fourni").replace(/\n/g, "<br />")}</p>
          <strong>Cartes importantes</strong>
          <p>${escapeHtml(body.cardNames || "Aucun nom fourni").replace(/\n/g, "<br />")}</p>
        </div>
        ${photoPreview ? `<div>${photoPreview}</div>` : ""}
        <p style="color:#806452;">Photos jointes: ${photos.length}</p>
      </div>
    </div>
  `;
}

async function queueSellRequestEmail(db, body) {
  const photos = Array.isArray(body.photos) ? body.photos.filter(Boolean).slice(0, 12) : [];
  const requestId = `SELL-${Date.now()}`;
  const text = [
    `Demande ${requestId}`,
    "",
    `Nom: ${body.name || ""}`,
    `Courriel: ${body.email || ""}`,
    `Prix demandé: ${body.askingPrice ? moneyText(Number(body.askingPrice)) : "Non précisé"}`,
    "",
    "Résumé:",
    body.summary || "",
    "",
    "Cartes importantes:",
    body.cardNames || "",
    "",
    `Photos jointes: ${photos.length}`,
  ].join("\n");
  const message = {
    id: requestId,
    to: shopEmail,
    subject: `Nouvelle collection à évaluer - ${body.name || "client"}`,
    body: text,
    html: sellRequestEmailHtml(body, photos),
    attachments: sellRequestPhotoAttachments(photos),
    status: "prepared",
    createdAt: new Date().toISOString(),
  };
  try {
    const result = await resendEmail(message);
    message.status = result.skipped ? "prepared" : "sent";
    message.resendId = result.id || "";
    message.sentAt = result.skipped ? "" : new Date().toISOString();
    if (result.reason) message.error = result.reason;
  } catch (error) {
    message.status = "failed";
    message.error = error.message;
  }
  db.emailOutbox.push(message);
  return message;
}

async function queueOrderEmails(db, order) {
  const customerEmail = order.customer?.email || order.address?.email || "";
  const customerName = order.customer?.name || order.address?.name || "Bonjour";
  const itemSummary = orderEmailLines(order).join("\n");
  const taxes = order.taxBreakdown || taxBreakdown(orderItemsTotal(order));
  const address = order.address || {};
  const paid = order.status === "paid";
  const messages = [
    {
      id: `${order.id}-shop`,
      to: shopEmail,
      subject: `Commande à préparer ${order.id}`,
      body: [
        `Commande à préparer ${order.id}`,
        "",
        "Client / livraison:",
        `${address.name || order.customer?.name || ""}`,
        `${address.address || ""}`,
        `${address.city || ""}, ${address.province || ""} ${address.postal || ""}`,
        `Téléphone: ${address.phone || order.customer?.phone || ""}`,
        `Courriel: ${address.email || order.customer?.email || ""}`,
        address.notes ? `Notes: ${address.notes}` : "",
        "",
        "Checklist:",
        paid ? "1. Paiement Square confirmé." : "1. Vérifier le paiement Square.",
        "2. Sortir les items.",
        "3. Protéger la commande.",
        "4. Préparer l’étiquette et le suivi.",
        "",
        itemSummary,
      ].filter((line) => line !== "").join("\n"),
      html: orderPackingEmailHtml(order),
      status: "prepared",
      createdAt: new Date().toISOString(),
    },
    {
      id: `${order.id}-client`,
      to: customerEmail,
      subject: `Confirmation de commande ${order.id} - Coffee Break TCG`,
      body: [
        `${customerName},`,
        "",
        paid
          ? "Merci pour ta commande chez Coffee Break TCG. Ton paiement est confirmé et nous préparons ta commande avec soin."
          : "Merci pour ta commande chez Coffee Break TCG. Nous avons bien reçu ta demande.",
        "Voici ton récapitulatif:",
        "",
        itemSummary,
        "",
        `Sous-total: ${moneyText(taxes.subtotal)}`,
        `TPS: ${moneyText(taxes.tps)}`,
        `TVQ: ${moneyText(taxes.tvq)}`,
        `Total: ${moneyText(taxes.total)}`,
        "",
        `Paiement: ${order.paymentMethod?.label || "Carte avec Square"}. Square peut aussi envoyer son propre reçu après le paiement.`,
        "Si tu as une question ou si tu souhaites valider un détail, réponds simplement à ce courriel. Ça nous fera plaisir de t’aider.",
      ].join("\n"),
      html: orderCustomerConfirmationHtml(order, customerName),
      status: "prepared",
      createdAt: new Date().toISOString(),
    }
  ];

  for (const message of messages) {
    const existing = db.emailOutbox.find((candidate) => candidate.id === message.id);
    if (existing?.status === "sent") continue;
    if (!message.to) {
      message.status = "skipped";
      message.error = "Adresse courriel manquante";
      if (existing) Object.assign(existing, message);
      else db.emailOutbox.push(message);
      continue;
    }
    try {
      const result = await resendEmail(message);
      message.status = result.skipped ? "prepared" : "sent";
      message.resendId = result.id || "";
      message.sentAt = result.skipped ? "" : new Date().toISOString();
      if (result.reason) message.error = result.reason;
    } catch (error) {
      message.status = "failed";
      message.error = error.message;
    }
    if (existing) Object.assign(existing, message);
    else db.emailOutbox.push(message);
  }
}

function updateOrderEmailStatus(db, order) {
  const orderEmails = db.emailOutbox.filter((message) => String(message.id || "").startsWith(`${order.id}-`));
  const sentCount = orderEmails.filter((message) => message.status === "sent").length;
  const failedCount = orderEmails.filter((message) => message.status === "failed").length;
  order.emailStatus = failedCount ? "partial" : sentCount === orderEmails.length && orderEmails.length ? "sent" : "prepared";
  order.emailMessage =
    order.emailStatus === "sent"
      ? `Récapitulatif envoyé à ${shopEmail} et au client.`
      : failedCount
        ? `Certains courriels n’ont pas été envoyés. Vérifie Resend et le domaine d’envoi.`
        : `Récapitulatif préparé. Vérifie la configuration Resend si l’envoi n’est pas complété.`;
  return order.emailStatus;
}

async function readBody(req) {
  const raw = await readRawBody(req);
  return raw ? JSON.parse(raw) : {};
}

async function saveImageData(imageData, id) {
  if (!imageData || !String(imageData).startsWith("data:image/")) return "";
  const match = String(imageData).match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
  if (!match) return "";
  const ext = match[1] === "jpeg" ? "jpg" : match[1];
  const filename = `${id}.${ext}`;
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), Buffer.from(match[2], "base64"));
  return `/assets/uploads/${filename}`;
}

async function saveProductImage(imageData, id) {
  return saveImageData(imageData, id);
}

async function saveProductGalleryImages(imageDataList, id) {
  if (!Array.isArray(imageDataList)) return [];
  const saved = [];
  for (const [index, imageData] of imageDataList.filter(Boolean).slice(0, 4).entries()) {
    const imageUrl = await saveImageData(imageData, `${id}-gallery-${index + 1}`);
    if (imageUrl) saved.push(imageUrl);
  }
  return saved;
}

async function saveCardShowImage(imageData, id) {
  const suffix = crypto.createHash("sha1").update(String(imageData || "")).digest("hex").slice(0, 10);
  return saveImageData(imageData, `show-${id}-${Date.now()}-${suffix}`);
}

function summarizeSales(db) {
  const orders = (db.orders || []).filter((order) => ["admin_sale", "paid"].includes(order.status));
  const inventory = db.inventory || [];
  const revenue = orders.reduce(
    (sum, order) => sum + order.items.reduce((lineSum, item) => lineSum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    0
  );
  const cost = orders.reduce(
    (sum, order) => sum + order.items.reduce((lineSum, item) => lineSum + Number(item.cost || 0) * Number(item.quantity || 0), 0),
    0
  );
  const unitsSold = orders.reduce(
    (sum, order) => sum + order.items.reduce((lineSum, item) => lineSum + Number(item.quantity || 0), 0),
    0
  );
  const inventoryValue = inventory.reduce((sum, item) => sum + Number(item.cost || 0) * Number(item.stock || 0), 0);
  const marketValue = inventory.reduce((sum, item) => sum + Number(item.market || item.price || 0) * Number(item.stock || 0), 0);
  const listedValue = inventory.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.stock || 0), 0);
  const reservedUnits = inventory.reduce((sum, item) => sum + Number(item.reservedQuantity || 0), 0);
  return {
    orders: orders.length,
    unitsSold,
    revenue,
    cost,
    profit: revenue - cost,
    inventoryValue,
    marketValue,
    listedValue,
    potentialProfit: listedValue - inventoryValue,
    activeItems: inventory.filter((item) => Number(item.stock || 0) > 0).length,
    draftItems: inventory.filter((item) => item.status === "draft").length,
    reservedUnits,
    pendingOrders: (db.orders || []).filter((order) => order.status === "pending_payment").length,
  };
}

function roundStorePrice(marketPrice) {
  const price = Number(marketPrice || 0);
  if (!Number.isFinite(price) || price <= 0) return 0;
  return Math.max(0, Math.round(price) - 1);
}

function marketUsdToCadRate() {
  return Number.isFinite(usdToCadRate) && usdToCadRate > 0 ? usdToCadRate : 1.38;
}

function convertUsdMarketToCad(price) {
  const value = Number(price || 0);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Number((value * marketUsdToCadRate()).toFixed(2));
}

function marketCurrencyNote(source) {
  return `${source} USD -> CAD (${marketUsdToCadRate().toFixed(3)})`;
}

function isPriceSyncProduct(product) {
  return false;
}

function bestMarketPriceFromTcgApi(product, payload) {
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  if (!rows.length) return 0;
  const name = String(product.name || "").toLowerCase();
  const setHint = String(product.condition || "").split("-")[0].trim().toLowerCase();
  const scored = rows
    .map((row) => {
      const rowName = String(row.name || "").toLowerCase();
      const rowSet = String(row.set_name || "").toLowerCase();
      const score = (rowName === name ? 3 : rowName.includes(name) || name.includes(rowName) ? 2 : 0) + (setHint && rowSet.includes(setHint) ? 1 : 0);
      return { row, score };
    })
    .sort((a, b) => b.score - a.score);
  const chosen = scored[0]?.row || rows[0];
  return Number(chosen.market_price || chosen.lowest_with_shipping || chosen.median_price || chosen.low_price || 0);
}

async function fetchMarketPrice(product) {
  if (marketPriceProvider === "tcgapi" && tcgApiKey) {
    const url = new URL("https://api.tcgapi.dev/v1/search");
    url.searchParams.set("q", product.name);
    url.searchParams.set("game", "pokemon");
    const payload = await httpsJsonWithHeaders(url, { "X-API-Key": tcgApiKey });
    return bestMarketPriceFromTcgApi(product, payload);
  }
  return Number(product.market || product.price || 0);
}

async function syncMarketPrices(db, options = {}) {
  const now = new Date().toISOString();
  const updates = [];
  for (const product of db.inventory || []) {
    if (!isPriceSyncProduct(product)) continue;
    const rawMarketPrice = await fetchMarketPrice(product).catch(() => 0);
    if (!rawMarketPrice) continue;
    const marketPrice = marketPriceProvider === "tcgapi" ? convertUsdMarketToCad(rawMarketPrice) : rawMarketPrice;
    const roundedPrice = roundStorePrice(marketPrice);
    product.lastMarketPrice = Number(product.market || product.price || 0);
    product.market = Number(marketPrice.toFixed(2));
    product.price = roundedPrice;
    product.marketSource = marketPriceProvider === "tcgapi" ? marketCurrencyNote("TCG API") : marketPriceProvider;
    product.lastMarketSync = now;
    product.updatedAt = now;
    updates.push({
      id: product.id,
      name: product.name,
      market: product.market,
      price: product.price,
    });
  }
  db.priceSync = {
    lastRunAt: now,
    nextRunAt: new Date(Date.now() + priceSyncIntervalMs).toISOString(),
    provider: marketPriceProvider === "tcgapi" ? marketCurrencyNote("TCG API") : marketPriceProvider,
    mode: options.manual ? "manual" : "hourly",
    updated: updates.length,
    rounding: "Prices from USD providers are converted to CAD first; displayed price is rounded market price minus $1",
  };
  return { summary: db.priceSync, updates };
}

async function syncMarketPricesFromDisk(options = {}) {
  const db = await readDb();
  const result = await syncMarketPrices(db, options);
  await writeDb(db);
  return result;
}

async function getSessionUser(req, db) {
  const sessionId = parseCookies(req).cb_session;
  const userId = sessionId ? db.sessions[sessionId] : null;
  return userId ? db.users.find((user) => user.id === userId) : null;
}

const localAddresses = [
  {
    id: "local-laval-centre",
    provider: "local",
    text: "3030 Boulevard le Carrefour",
    description: "Laval QC H7T 2P5",
    address: "3030 Boulevard le Carrefour",
    city: "Laval",
    province: "QC",
    postal: "H7T 2P5",
  },
  {
    id: "local-laval-concorde",
    provider: "local",
    text: "1600 Boulevard de la Concorde Ouest",
    description: "Laval QC H7N 6N6",
    address: "1600 Boulevard de la Concorde Ouest",
    city: "Laval",
    province: "QC",
    postal: "H7N 6N6",
  },
  {
    id: "local-quebec",
    provider: "local",
    text: "1020 Rue Bouvier",
    description: "Quebec QC G2K 0K9",
    address: "1020 Rue Bouvier",
    city: "Quebec",
    province: "QC",
    postal: "G2K 0K9",
  },
];

function httpsJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", reject);
  });
}

function httpsJsonWithHeaders(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https
      .request(url, { headers }, (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          if (response.statusCode >= 400) return reject(new Error(`Pricing API ${response.statusCode}: ${body.slice(0, 160)}`));
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", reject)
      .end();
  });
}

function squareApiHost() {
  return squareEnvironment === "production" ? "connect.squareup.com" : "connect.squareupsandbox.com";
}

function publicOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  return `${proto}://${req.headers.host}`;
}

function squareJson(pathname, body) {
  if (!squareAccessToken || !squareLocationId) {
    return Promise.reject(new Error("Configuration Square manquante"));
  }
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: squareApiHost(),
        path: pathname,
        method: "POST",
        headers: {
          "Square-Version": "2026-01-22",
          Authorization: `Bearer ${squareAccessToken}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          if (response.statusCode >= 400) return reject(new Error(`Square ${response.statusCode}: ${text.slice(0, 220)}`));
          try {
            resolve(JSON.parse(text));
          } catch {
            resolve({});
          }
        });
      }
    );
    request.on("error", reject);
    request.write(payload);
    request.end();
  });
}

function squareRequest(pathname, method = "GET") {
  if (!squareAccessToken) {
    return Promise.reject(new Error("Configuration Square manquante"));
  }
  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: squareApiHost(),
        path: pathname,
        method,
        headers: {
          "Square-Version": "2026-01-22",
          Authorization: `Bearer ${squareAccessToken}`,
          "Content-Type": "application/json",
        },
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          if (response.statusCode >= 400) return reject(new Error(`Square ${response.statusCode}: ${text.slice(0, 220)}`));
          try {
            resolve(JSON.parse(text));
          } catch {
            resolve({});
          }
        });
      }
    );
    request.on("error", reject);
    request.end();
  });
}

async function getSquarePayment(paymentId) {
  if (!paymentId) return null;
  const payload = await squareRequest(`/v2/payments/${encodeURIComponent(paymentId)}`);
  return payload.payment || null;
}

function verifySquareWebhookSignature(req, rawBody) {
  if (!squareWebhookSignatureKey) return true;
  const signature = String(req.headers["x-square-hmacsha256-signature"] || "");
  if (!signature) return false;
  const notificationUrl = squareWebhookNotificationUrl || `${publicOrigin(req)}/api/square/webhook`;
  const expected = crypto
    .createHmac("sha256", squareWebhookSignatureKey)
    .update(notificationUrl + rawBody)
    .digest("base64");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  return expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

async function readRawBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > maxJsonBodyBytes) {
      const error = new Error("Requête trop volumineuse");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function markOrderPaidFromSquare(db, order, payment, eventType = "square_webhook") {
  if (!order) return { changed: false, reason: "order_missing" };
  if (order.status === "paid") return { changed: false, reason: "already_paid" };
  if (order.status !== "pending_payment") return { changed: false, reason: `status_${order.status}` };
  for (const item of order.items || []) {
    const product = db.inventory.find((candidate) => candidate.id === item.id);
    if (!product) continue;
    const quantity = Math.max(1, Number(item.quantity || 1));
    product.reservedQuantity = Math.max(0, Number(product.reservedQuantity || 0) - quantity);
    if (Number(product.stock || 0) <= 0 && Number(product.reservedQuantity || 0) <= 0) {
      product.status = "sold";
    } else if (product.status === "reserved") {
      product.status = product.category === "Preorder" ? "preorder" : "available";
    }
  }
  order.status = "paid";
  order.paidAt = new Date().toISOString();
  order.paymentConfirmedBy = eventType;
  order.squarePayment = {
    id: payment?.id || order.squarePayment?.id || "",
    status: payment?.status || order.squarePayment?.status || "COMPLETED",
    orderId: payment?.order_id || order.squarePaymentLink?.orderId || "",
    receiptUrl: payment?.receipt_url || "",
    totalMoney: payment?.total_money || payment?.amount_money || null,
    updatedAt: payment?.updated_at || "",
  };
  applyCoffeeBucksEarned(db, order);
  return { changed: true };
}

async function handleSquareWebhook(req, res, db) {
  const rawBody = await readRawBody(req);
  if (!verifySquareWebhookSignature(req, rawBody)) {
    return json(res, 403, { error: "Signature Square invalide" });
  }
  let event;
  try {
    event = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return json(res, 400, { error: "Webhook Square JSON invalide" });
  }

  const eventType = event.type || "";
  const eventPayment = event.data?.object?.payment || {};
  const eventPaymentId = eventPayment.id || event.data?.id || "";
  let payment = eventPayment;
  if (eventPaymentId && (!payment.status || !payment.order_id)) {
    try {
      payment = await getSquarePayment(eventPaymentId);
    } catch (error) {
      db.emailOutbox.push({
        id: `square-webhook-${event.event_id || Date.now()}`,
        to: shopEmail,
        subject: "Webhook Square à vérifier",
        body: `Impossible de récupérer le paiement Square ${eventPaymentId}: ${error.message}`,
        status: "prepared",
        createdAt: new Date().toISOString(),
      });
    }
  }

  const paymentStatus = payment?.status || eventPayment.status || "";
  const squareOrderId = payment?.order_id || eventPayment.order_id || "";
  const paymentId = payment?.id || eventPaymentId;
  const order = (db.orders || []).find(
    (candidate) =>
      candidate.squarePaymentLink?.orderId === squareOrderId ||
      candidate.squarePayment?.id === paymentId ||
      candidate.squarePaymentLink?.id === eventPayment.payment_link_id
  );

  const webhookRecord = {
    eventId: event.event_id || crypto.randomBytes(8).toString("hex"),
    type: eventType,
    paymentId,
    squareOrderId,
    paymentStatus,
    receivedAt: new Date().toISOString(),
  };

  if (eventType === "payment.updated" && paymentStatus === "COMPLETED" && order) {
    const result = markOrderPaidFromSquare(db, order, payment, "square_webhook");
    if (result.changed) {
      await queueOrderEmails(db, order);
      updateOrderEmailStatus(db, order);
    }
    order.squareWebhookEvents = [...(order.squareWebhookEvents || []), webhookRecord].slice(-10);
    await writeDb(db);
    return json(res, 200, { ok: true, orderId: order.id, changed: result.changed, reason: result.reason || "" });
  }

  if (order) {
    order.squareWebhookEvents = [...(order.squareWebhookEvents || []), webhookRecord].slice(-10);
    await writeDb(db);
  }
  return json(res, 200, { ok: true, ignored: true, type: eventType, paymentStatus, orderId: order?.id || "" });
}

async function createSquarePaymentLink(order, req) {
  const amount = Math.round(orderGrandTotal(order) * 100);
  if (amount <= 0) throw new Error("Total Square invalide");
  const result = await squareJson("/v2/online-checkout/payment-links", {
    idempotency_key: `${order.id}-${Date.now()}`,
    quick_pay: {
      name: `Coffee Break TCG ${order.id}`,
      price_money: {
        amount,
        currency: "CAD",
      },
      location_id: squareLocationId,
    },
    checkout_options: {
      redirect_url: `${publicOrigin(req)}/checkout?order=${encodeURIComponent(order.id)}&payment=square`,
    },
    pre_populated_data: {
      buyer_email: order.customer?.email || order.address?.email || "",
    },
  });
  const paymentLink = result.payment_link || {};
  if (!paymentLink.url) throw new Error("Square n'a pas retourné de lien de paiement");
  return {
    id: paymentLink.id || "",
    url: paymentLink.url,
    orderId: paymentLink.order_id || "",
  };
}

function pokemonTcgHeaders() {
  return pokemonTcgApiKey ? { "X-Api-Key": pokemonTcgApiKey } : {};
}

function cacheKey(parts) {
  return parts.map((part) => String(part || "").trim().toLowerCase()).join("::");
}

function getCachedSearch(key) {
  const cached = cardImageSearchCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.createdAt > cardImageSearchCacheTtlMs) {
    cardImageSearchCache.delete(key);
    return null;
  }
  return cached.value;
}

function setCachedSearch(key, value) {
  if (cardImageSearchCache.size > 250) {
    const oldestKey = cardImageSearchCache.keys().next().value;
    if (oldestKey) cardImageSearchCache.delete(oldestKey);
  }
  cardImageSearchCache.set(key, { createdAt: Date.now(), value });
  return value;
}

function cleanCardSearchTerm(value) {
  return String(value || "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(alt art|alternate art|special illustration rare|illustration rare|full art|near mint|lightly played|moderately played|damaged|promo|promos|promotional|psa|cgc|bgs|beckett|tag|holo|reverse|first edition|1st edition)\b/gi, " ")
    .replace(/\b(nm|lp|mp|hp|dmG?)\b/gi, " ")
    .replace(/\b(?:[a-z]{1,4}\d{1,4}[a-z]?|\d{1,4}[a-z]?)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCardNumberHint(value) {
  const matches = String(value || "").match(/\b(?:[a-z]{1,4}\d{1,4}[a-z]?|\d{1,4}[a-z]?)\b/gi) || [];
  return matches.find((match) => /\d/.test(match)) || "";
}

function cardSearchTokens(term) {
  return String(term || "")
    .split(/\s+/)
    .map((token) => token.replace(/[^a-z0-9-]/gi, ""))
    .filter((token) => token.length > 1)
    .filter((token) => !/^(alt|art|alternate|promo|promos|promotional|sir|ir|gold|mep)$/i.test(token))
    .slice(0, 4);
}

function normalizeSealedSearch(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function localSealedProductCandidates(query) {
  const normalized = normalizeSealedSearch(query);
  const words = normalized.split(" ").filter(Boolean);
  const sealedProducts = [
    {
      name: "ETB Ascended Heroes Pokemon Center",
      set: "Ascended Heroes",
      images: [
        { label: "Avant", url: "/assets/sealed-ascended-heroes-etb.jpg" },
        { label: "Arriere", url: "/assets/sealed-ascended-heroes-etb-back.jpg" },
      ],
    },
    {
      name: "Scarlet & Violet 151 Elite Trainer Box",
      set: "Scarlet & Violet 151",
      images: [
        { label: "Avant", url: "/assets/sealed-151-etb.webp" },
        { label: "Arriere", url: "/assets/sealed-151-etb-back.webp" },
      ],
    },
  ];
  return sealedProducts
    .filter((product) => {
      const haystack = normalizeSealedSearch(`${product.name} ${product.set} etb elite trainer box`);
      return !words.length || words.some((word) => haystack.includes(word));
    })
    .flatMap((product) =>
      product.images.map((image, index) => ({
        id: `${normalizeSealedSearch(product.name).replace(/\s+/g, "-")}-${index}`,
        name: `${product.name} - ${image.label}`,
        setId: "",
        set: product.set,
        number: "",
        rarity: "Produit scelle",
        imageType: "sealed",
        imageUrl: image.url,
        smallImageUrl: image.url,
      }))
    )
    .slice(0, 18);
}

function cardNumberVariants(value) {
  const raw = String(value || "").trim();
  if (!raw) return [];
  const variants = [raw];
  const withoutLeadingZero = raw.replace(/^0+(?=\d)/, "");
  if (withoutLeadingZero && withoutLeadingZero !== raw) variants.push(withoutLeadingZero);
  return [...new Set(variants)];
}

function cardSearchScore(card, tokens, numberHint) {
  const normalizedNumber = String(numberHint || "").trim().toLowerCase();
  const cardNumber = String(card?.number || "").trim().toLowerCase();
  const normalizedNumberNoZero = normalizedNumber.replace(/^0+(?=\d)/, "");
  const cardNumberNoZero = cardNumber.replace(/^0+(?=\d)/, "");
  const cardName = String(card?.name || "").toLowerCase();
  const setName = String(card?.set?.name || "").toLowerCase();
  const setId = String(card?.set?.id || "").toLowerCase();
  let score = 0;
  if (normalizedNumber && cardNumber === normalizedNumber) score += 50;
  if (normalizedNumberNoZero && cardNumberNoZero === normalizedNumberNoZero) score += 35;
  if (normalizedNumber && cardNumber.includes(normalizedNumber)) score += 20;
  for (const token of tokens) {
    const normalizedToken = token.toLowerCase();
    if (cardName.includes(normalizedToken)) score += 8;
    if (setName.includes(normalizedToken)) score += 2;
    if (setId.includes(normalizedToken)) score += 2;
  }
  return score;
}

function pokemonCardImageCandidates(payload, numberHint = "", tokens = []) {
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  return rows
    .filter((card) => card?.images?.large || card?.images?.small)
    .sort((a, b) => {
      return cardSearchScore(b, tokens, numberHint) - cardSearchScore(a, tokens, numberHint);
    })
    .slice(0, 18)
    .map((card) => ({
      id: card.id,
      name: card.name || "",
      setId: card.set?.id || "",
      set: card.set?.name || "",
      number: card.number || "",
      rarity: card.rarity || "",
      imageUrl: card.images.large || card.images.small,
      smallImageUrl: card.images.small || card.images.large,
    }));
}

function candidateMatchesSearchTokens(candidate, tokens) {
  if (!tokens.length) return true;
  const haystack = `${candidate.name || ""} ${candidate.set || ""} ${candidate.setId || ""}`.toLowerCase();
  return tokens.some((token) => haystack.includes(token.toLowerCase()));
}

async function searchPokemonCardImages(query, numberHint = "", setId = "") {
  const key = cacheKey(["card", query, numberHint, setId]);
  const cached = getCachedSearch(key);
  if (cached) return cached;
  const term = cleanCardSearchTerm(query);
  const detectedNumber = String(numberHint || "").trim() || extractCardNumberHint(query);
  const tokens = cardSearchTokens(term);
  if (term.length < 2 && !detectedNumber) return setCachedSearch(key, []);

  const setQuery = setId ? ` set.id:${String(setId).replace(/[^a-z0-9-]/gi, "")}` : "";
  const nameQuery = tokens.map((token) => `name:${token}*`).join(" ");
  const numberVariants = cardNumberVariants(detectedNumber);
  const numberAttemptQueries = numberVariants.flatMap((number) => [
    nameQuery ? `${nameQuery} number:${number}${setQuery}` : "",
    nameQuery ? `number:${number} ${tokens.slice(0, 2).map((token) => `name:${token}*`).join(" ")}${setQuery}` : "",
    `number:${number}${setQuery}`,
  ]);
  const attempts = [
    term ? `name:"${term.replace(/"/g, "")}"${setQuery}` : "",
    ...numberAttemptQueries,
    nameQuery ? `${nameQuery}${setQuery}` : "",
    tokens[0] ? `name:${tokens[0]}*${setQuery}` : "",
  ].filter(Boolean);

  const uniqueAttempts = [...new Set(attempts)].slice(0, 4);
  const searches = uniqueAttempts.map(async (searchQuery, index) => {
    const url = new URL("https://api.pokemontcg.io/v2/cards");
    url.searchParams.set("q", searchQuery);
    url.searchParams.set("pageSize", "18");
    url.searchParams.set("orderBy", "-set.releaseDate");
    url.searchParams.set("select", "id,name,set,number,rarity,images");
    try {
      const payload = await httpsJsonWithHeaders(url, pokemonTcgHeaders());
      const candidates = pokemonCardImageCandidates(payload, detectedNumber, tokens);
      if (tokens.length && candidates.length && !candidates.some((candidate) => candidateMatchesSearchTokens(candidate, tokens))) return { index, candidates: [] };
      return { index, candidates };
    } catch {
      return { index, candidates: [] };
    }
  });

  const results = await Promise.all(searches);
  const candidates = results
    .sort((a, b) => a.index - b.index)
    .flatMap((result) => result.candidates)
    .filter((candidate, index, all) => all.findIndex((item) => item.id === candidate.id) === index)
    .slice(0, 18);
  return setCachedSearch(key, candidates);
}

async function searchSealedProductImages(query, setId = "") {
  const key = cacheKey(["sealed", query, setId]);
  const cached = getCachedSearch(key);
  if (cached) return cached;
  const localCandidates = localSealedProductCandidates(query);
  if (!setId) return setCachedSearch(key, localCandidates);
  const url = new URL(`https://api.pokemontcg.io/v2/sets/${String(setId).replace(/[^a-z0-9-]/gi, "")}`);
  const payload = await httpsJsonWithHeaders(url, pokemonTcgHeaders());
  const set = payload?.data;
  if (!set?.images) return setCachedSearch(key, localCandidates);
  const productName = [set.name, query].filter(Boolean).join(" ");
  return setCachedSearch(
    key,
    [
    ...localCandidates,
    set.images.logo
      ? {
          id: `${set.id}-logo`,
          name: productName,
          setId: set.id,
          set: set.name,
          number: "",
          rarity: "Produit scelle",
          imageType: "sealed",
          imageUrl: set.images.logo,
          smallImageUrl: set.images.logo,
        }
      : null,
    set.images.symbol
      ? {
          id: `${set.id}-symbol`,
          name: productName,
          setId: set.id,
          set: set.name,
          number: "",
          rarity: "Logo extension",
          imageType: "sealed",
          imageUrl: set.images.symbol,
          smallImageUrl: set.images.symbol,
        }
      : null,
    ]
      .filter(Boolean)
      .slice(0, 18)
  );
}

function inferVisual(category, kind) {
  if (category === "Graded" || kind === "slab") return "graded";
  if (["Sealed", "Preorder", "Accessories"].includes(category) || kind !== "single") return "boxed";
  return "single";
}

function cardMarketPriceFromPokemonApi(card) {
  const prices = card?.tcgplayer?.prices || {};
  const candidates = [
    prices.holofoil?.market,
    prices.reverseHolofoil?.market,
    prices.normal?.market,
    prices["1stEditionHolofoil"]?.market,
    prices.unlimitedHolofoil?.market,
  ]
    .map(Number)
    .filter((price) => Number.isFinite(price) && price > 0);
  return candidates[0] || 0;
}

function conditionMultiplier(condition) {
  return (
    {
      NM: 1,
      LP: 0.82,
      MP: 0.62,
      Damaged: 0.35,
      Scelle: 1,
      "Scellé parfait": 1,
      "Scellé endommagé": 0.75,
    }[condition] || 1
  );
}

function gradeMultiplier(grade) {
  const value = Number(grade || 0);
  if (value >= 10) return 3.4;
  if (value >= 9.5) return 2.7;
  if (value >= 9) return 2.05;
  if (value >= 8) return 1.45;
  if (value >= 7) return 1.12;
  if (value >= 1) return 0.9;
  return 1;
}

async function suggestMarketPriceFromSources({ name, setId, cardNumber, condition, gradingCompany, grade }) {
  const term = cleanCardSearchTerm(name);
  if (term.length < 2) return null;
  const q = [`name:"${term.replace(/"/g, "")}"`];
  if (setId) q.push(`set.id:${String(setId).replace(/[^a-z0-9-]/gi, "")}`);
  if (cardNumber) q.push(`number:${String(cardNumber).replace(/[^a-z0-9-]/gi, "")}`);
  const url = new URL("https://api.pokemontcg.io/v2/cards");
  url.searchParams.set("q", q.join(" "));
  url.searchParams.set("pageSize", "1");
  url.searchParams.set("select", "id,name,set,number,rarity,tcgplayer");
  const payload = await httpsJsonWithHeaders(url, pokemonTcgHeaders());
  const card = Array.isArray(payload?.data) ? payload.data[0] : null;
  const rawMarketUsd = cardMarketPriceFromPokemonApi(card);
  if (!rawMarketUsd) return null;
  const adjustedUsd = rawMarketUsd * conditionMultiplier(condition) * (gradingCompany ? gradeMultiplier(grade) : 1);
  const market = convertUsdMarketToCad(adjustedUsd);
  return {
    market,
    storePrice: roundStorePrice(market),
    label: `${gradingCompany && grade ? `${gradingCompany} ${grade} ` : ""}${card?.name || name}`,
    source: gradingCompany
      ? `${marketCurrencyNote("PokemonTCG API / TCGplayer")} + multiplicateur slab local; Collectr/eBay/PriceCharting a brancher`
      : marketCurrencyNote("PokemonTCG API / TCGplayer"),
  };
}

function fallbackPokemonSets() {
  return [
    { id: "sv10", name: "Destined Rivals", releaseDate: "2025/05/30" },
    { id: "sv9", name: "Journey Together", releaseDate: "2025/03/28" },
    { id: "sv8pt5", name: "Prismatic Evolutions", releaseDate: "2025/01/17" },
    { id: "sv8", name: "Surging Sparks", releaseDate: "2024/11/08" },
    { id: "sv7", name: "Stellar Crown", releaseDate: "2024/09/13" },
    { id: "sv6", name: "Twilight Masquerade", releaseDate: "2024/05/24" },
    { id: "sv5", name: "Temporal Forces", releaseDate: "2024/03/22" },
    { id: "svp", name: "Scarlet & Violet Black Star Promos", releaseDate: "2023/03/31" },
    { id: "sv4pt5", name: "Paldean Fates", releaseDate: "2024/01/26" },
    { id: "sv4", name: "Paradox Rift", releaseDate: "2023/11/03" },
    { id: "sv3pt5", name: "Scarlet & Violet 151", releaseDate: "2023/09/22" },
    { id: "sv3", name: "Obsidian Flames", releaseDate: "2023/08/11" },
    { id: "sv2", name: "Paldea Evolved", releaseDate: "2023/06/09" },
    { id: "sv1", name: "Scarlet & Violet", releaseDate: "2023/03/31" },
    { id: "swshp", name: "SWSH Black Star Promos", releaseDate: "2019/11/15" },
    { id: "smp", name: "SM Black Star Promos", releaseDate: "2017/02/03" },
    { id: "xyp", name: "XY Black Star Promos", releaseDate: "2013/10/12" },
    { id: "bwp", name: "BW Black Star Promos", releaseDate: "2011/03/01" },
  ];
}

async function fetchPokemonSets() {
  const url = new URL("https://api.pokemontcg.io/v2/sets");
  url.searchParams.set("orderBy", "-releaseDate");
  url.searchParams.set("select", "id,name,releaseDate,series");
  const payload = await httpsJsonWithHeaders(url, pokemonTcgHeaders());
  const fetched = (Array.isArray(payload?.data) ? payload.data : []).map((set) => ({
    id: set.id,
    name: set.name,
    releaseDate: set.releaseDate || "",
    series: set.series || "",
  }));
  const promoFallbacks = fallbackPokemonSets().filter((set) => /promos/i.test(set.name));
  return [...fetched, ...promoFallbacks.filter((promo) => !fetched.some((set) => set.id === promo.id))];
}

async function findAddresses(query) {
  if (canadaPostKey) {
    const url = new URL("https://ws1.postescanada-canadapost.ca/AddressComplete/Interactive/Find/v2.10/json3.ws");
    url.searchParams.set("Key", canadaPostKey);
    url.searchParams.set("SearchTerm", query);
    url.searchParams.set("Country", "CAN");
    url.searchParams.set("LanguagePreference", "FR");
    const payload = await httpsJson(url);
    return (payload.Items || []).slice(0, 8).map((item) => ({
      id: item.Id,
      provider: "canadapost",
      text: item.Text,
      description: item.Description,
    }));
  }

  const normalized = query.toLowerCase();
  return localAddresses
    .filter((item) => `${item.text} ${item.description}`.toLowerCase().includes(normalized))
    .slice(0, 5)
    .map(({ id, provider, text, description }) => ({ id, provider, text, description }));
}

async function retrieveAddress(id, provider) {
  if (provider === "canadapost" && canadaPostKey) {
    const url = new URL("https://ws1.postescanada-canadapost.ca/AddressComplete/Interactive/Retrieve/v2.11/json3.ws");
    url.searchParams.set("Key", canadaPostKey);
    url.searchParams.set("Id", id);
    const payload = await httpsJson(url);
    const item = (payload.Items || [])[0];
    if (!item) return null;
    return {
      address: [item.Line1, item.Line2].filter(Boolean).join(" "),
      city: item.City || "",
      province: item.ProvinceCode || item.Province || "",
      postal: item.PostalCode || "",
    };
  }

  return localAddresses.find((item) => item.id === id) || null;
}

async function handleApi(req, res) {
  const db = await readDb();
  const url = new URL(req.url, `http://${req.headers.host}`);
  const expiredReservations = expirePendingReservations(db);
  if (expiredReservations) await writeDb(db);

  if (url.pathname === "/api/square/webhook" && req.method === "POST") {
    return handleSquareWebhook(req, res, db);
  }

  if (url.pathname === "/api/me" && req.method === "GET") {
    return json(res, 200, { user: publicUser(await getSessionUser(req, db)) });
  }

  if (url.pathname === "/api/profile" && req.method === "POST") {
    const user = await getSessionUser(req, db);
    if (!user) return json(res, 401, { error: "Connexion requise" });
    const body = await readBody(req);
    const name = String(body.name || "").trim();
    const address = body.address && typeof body.address === "object" ? body.address : {};
    if (!name) return json(res, 400, { error: "Nom requis" });
    user.name = name;
    user.address = {
      name,
      email: user.email,
      phone: String(address.phone || "").trim(),
      address: String(address.address || "").trim(),
      city: String(address.city || "").trim(),
      province: String(address.province || "QC").trim(),
      postal: String(address.postal || "").trim(),
      notes: String(address.notes || "").trim(),
    };
    user.updatedAt = new Date().toISOString();
    await writeDb(db);
    return json(res, 200, { user: publicUser(user) });
  }

  if (url.pathname === "/api/my-orders" && req.method === "GET") {
    const user = await getSessionUser(req, db);
    if (!user) return json(res, 401, { error: "Connexion requise" });
    const orders = (db.orders || [])
      .filter((order) => order.userId === user.id)
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      .map(publicCustomerOrder);
    return json(res, 200, { orders });
  }

  if (url.pathname === "/api/products" && req.method === "GET") {
    return json(res, 200, {
      products: db.inventory
        .filter((product) => product.status !== "draft")
        .map(publicProduct)
        .filter((product) => product.status !== "reserved"),
    });
  }

  if (url.pathname === "/api/card-shows" && req.method === "GET") {
    return json(res, 200, {
      cardShows: (db.cardShows || [])
        .filter((show) => show.active !== false)
        .sort((a, b) => String(a.date || "").localeCompare(String(b.date || ""))),
    });
  }

  if (url.pathname === "/api/reviews" && req.method === "GET") {
    return json(res, 200, {
      reviews: (db.reviews || defaultReviews())
        .filter((review) => review.published !== false)
        .sort((a, b) => String(b.date || b.createdAt || "").localeCompare(String(a.date || a.createdAt || "")))
        .map(publicReview),
    });
  }

  if (url.pathname === "/api/admin/login" && req.method === "POST") {
    const attempts = adminAttemptState(req);
    if (attempts.lockedUntil && attempts.lockedUntil > Date.now()) {
      return json(res, 429, { error: "Trop d’essais. Réessaie dans quelques minutes." });
    }
    const body = await readBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!adminPassword && !adminPasswordHash) {
      return json(res, 503, { error: "Mot de passe admin non configuré sur le serveur" });
    }
    if (email !== adminEmail || !adminPasswordMatches(password)) {
      recordAdminLoginFailure(req);
      return json(res, 401, { error: "Identifiants admin invalides" });
    }
    clearAdminLoginFailures(req);
    const sessionId = crypto.randomBytes(24).toString("hex");
    db.adminSessions[sessionId] = {
      email: adminEmail,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + adminSessionMs).toISOString(),
      ip: requestIp(req),
    };
    await writeDb(db);
    return json(res, 200, { admin: publicAdmin(db.adminSessions[sessionId]) }, adminCookieHeader(sessionId));
  }

  if (url.pathname === "/api/admin/logout" && req.method === "POST") {
    const sessionId = parseCookies(req).cb_admin;
    if (sessionId && db.adminSessions?.[sessionId]) {
      delete db.adminSessions[sessionId];
      await writeDb(db);
    }
    return json(res, 200, { ok: true }, clearAdminCookieHeader());
  }

  if (url.pathname === "/api/admin/me" && req.method === "GET") {
    const session = getAdminSession(req, db);
    if (!session) return json(res, 401, { error: "Connexion admin requise" });
    return json(res, 200, { admin: publicAdmin(session) });
  }

  if (url.pathname.startsWith("/api/admin/") && !getAdminSession(req, db)) {
    return json(res, 401, { error: "Connexion admin requise" });
  }

  if (url.pathname === "/api/admin/reports/sales.csv" && req.method === "GET") {
    return csv(res, "coffee-break-ventes.csv", salesReportRows(db));
  }

  if (url.pathname === "/api/admin/reports/monthly.csv" && req.method === "GET") {
    return csv(res, "coffee-break-resume-mensuel.csv", monthlyReportRows(db));
  }

  if (url.pathname === "/api/admin/reports/inventory.csv" && req.method === "GET") {
    return csv(res, "coffee-break-inventaire.csv", inventoryReportRows(db));
  }

  if (url.pathname === "/api/admin/reports/pending.csv" && req.method === "GET") {
    return csv(res, "coffee-break-reservations.csv", pendingReportRows(db));
  }

  if (url.pathname === "/api/admin/reports/taxes.csv" && req.method === "GET") {
    return csv(res, "coffee-break-taxes.csv", taxesReportRows(db));
  }

  if (url.pathname === "/api/admin/backup.json" && req.method === "GET") {
    await writeDbBackup(db, { force: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    return jsonAttachment(res, `coffee-break-backup-${stamp}.json`, await buildBackupPayload(db, "manual-download"));
  }

  if (url.pathname === "/api/admin/backup.zip" && req.method === "GET") {
    await writeDbBackup(db, { force: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    return zipAttachment(res, `coffee-break-backup-${stamp}.zip`, await buildBackupZip(db, "manual-download"));
  }

  if (url.pathname === "/api/admin/backup/google-drive" && req.method === "POST") {
    await writeDbBackup(db, { force: true });
    if (!googleDriveBackupFolderId || !googleDriveConfigured()) {
      return json(res, 400, {
        error: "Google Drive n’est pas configuré. Ajoute GOOGLE_DRIVE_BACKUP_FOLDER_ID et les identifiants du service account.",
        backup: publicBackupStatus(),
      });
    }
    const backup = await uploadBackupToGoogleDrive(db, "manual-sync");
    return json(res, 200, { backup });
  }

  if (url.pathname === "/api/admin/summary" && req.method === "GET") {
    return json(res, 200, {
      summary: summarizeSales(db),
      inventory: db.inventory,
      orders: db.orders,
      accounting: accountingSummary(db),
      backup: publicBackupStatus(),
      cardShows: db.cardShows || [],
      reviews: (db.reviews || []).map(publicReview),
      priceSync: db.priceSync || null,
    });
  }

  if (url.pathname === "/api/admin/prices/sync" && req.method === "POST") {
    const result = await syncMarketPrices(db, { manual: true });
    await writeDb(db);
    return json(res, 200, result);
  }

  if (url.pathname === "/api/admin/sales" && req.method === "POST") {
    const body = await readBody(req);
    const index = db.inventory.findIndex((candidate) => candidate.id === body.id);
    const product = index >= 0 ? db.inventory[index] : null;
    const quantity = 1;
    const soldPrice = Number(body.soldPrice || body.price || product?.price || 0);
    if (!product) return json(res, 404, { error: "Item introuvable" });
    if (!Number.isFinite(soldPrice) || soldPrice < 0) {
      return json(res, 400, { error: "Prix vendu invalide" });
    }
    if (Number(product.stock || 0) < quantity) {
      return json(res, 400, { error: "Stock insuffisant pour enregistrer cette vente" });
    }
    const soldProduct = { ...product, stock: 0, soldAt: new Date().toISOString(), soldPrice };
    const order = {
      id: `CB-${String((db.orders || []).length + 1).padStart(5, "0")}`,
      userId: "admin",
      items: [
        {
          id: product.id,
          name: product.name,
          quantity,
          price: soldPrice,
          cost: Number(product.cost || 0),
          imageUrl: product.imageUrl || "",
          category: product.category,
          kind: product.kind || product.visual || "single",
          condition: product.condition || "",
          setId: product.setId || "",
          setName: product.setName || "",
          cardNumber: product.cardNumber || "",
          rarity: product.rarity || "",
          gradingCompany: product.gradingCompany || "",
          grade: product.grade || "",
          market: Number(product.market || 0),
          listedPrice: Number(product.price || 0),
          features: Array.isArray(product.features) ? product.features : [],
        },
      ],
      shipping: "admin_sale",
      address: null,
      paymentMethod: null,
      status: "admin_sale",
      createdAt: new Date().toISOString(),
      soldProduct,
    };
    db.inventory.splice(index, 1);
    db.orders.push(order);
    await writeDb(db);
    return json(res, 201, { order, product: publicProduct(soldProduct), summary: summarizeSales(db) });
  }

  if (url.pathname === "/api/admin/products/discount" && req.method === "POST") {
    const body = await readBody(req);
    const product = db.inventory.find((candidate) => candidate.id === body.id);
    const newPrice = Number(body.price);
    if (!product) return json(res, 404, { error: "Item introuvable" });
    if (!Number.isFinite(newPrice) || newPrice <= 0) {
      return json(res, 400, { error: "Nouveau prix invalide" });
    }
    const currentPrice = Number(product.price || 0);
    if (currentPrice > 0 && newPrice >= currentPrice) {
      return json(res, 400, { error: "Le nouveau prix doit être plus bas que le prix actuel" });
    }
    product.compareAtPrice = Number(product.compareAtPrice || currentPrice || 0);
    product.price = newPrice;
    product.priceAuto = false;
    product.badge = product.badge || "Prix réduit";
    product.updatedAt = new Date().toISOString();
    await writeDb(db);
    return json(res, 200, { product: publicProduct(product), inventory: db.inventory.map(publicProduct), summary: summarizeSales(db) });
  }

  if (url.pathname === "/api/admin/products/remove" && req.method === "POST") {
    const body = await readBody(req);
    const index = db.inventory.findIndex((candidate) => candidate.id === body.id);
    const product = index >= 0 ? db.inventory[index] : null;
    if (!product) return json(res, 404, { error: "Item introuvable" });
    if (Number(product.reservedQuantity || 0) > 0 || product.status === "reserved") {
      return json(res, 400, { error: "Cet item est réservé dans une commande en cours. Attends l’expiration ou annule la commande avant de le retirer." });
    }
    const removedProduct = {
      ...product,
      removedAt: new Date().toISOString(),
      removedReason: String(body.reason || "Retiré de l’inventaire").trim(),
    };
    db.inventory.splice(index, 1);
    db.removedInventory = Array.isArray(db.removedInventory) ? db.removedInventory : [];
    db.removedInventory.push(removedProduct);
    await writeDb(db);
    return json(res, 200, { product: publicProduct(removedProduct), inventory: db.inventory.map(publicProduct), summary: summarizeSales(db) });
  }

  if (url.pathname === "/api/admin/orders/cancel" && req.method === "POST") {
    const body = await readBody(req);
    const order = db.orders.find((candidate) => candidate.id === body.id);
    if (!order) return json(res, 404, { error: "Commande introuvable" });
    if (order.status !== "pending_payment") {
      return json(res, 400, { error: "Seules les commandes en attente de paiement peuvent être annulées" });
    }
    for (const item of order.items || []) {
      const product = db.inventory.find((candidate) => candidate.id === item.id);
      if (!product) continue;
      const quantity = Math.max(1, Number(item.quantity || 1));
      product.stock = Number(product.stock || 0) + quantity;
      product.reservedQuantity = Math.max(0, Number(product.reservedQuantity || 0) - quantity);
      if (product.status === "reserved") product.status = product.category === "Preorder" ? "preorder" : "available";
    }
    order.status = "cancelled";
    order.cancelledAt = new Date().toISOString();
    order.cancelReason = body.reason || "Paiement non reçu";
    refundCoffeeBucks(db, order);
    await writeDb(db);
    return json(res, 200, { order, summary: summarizeSales(db), inventory: db.inventory.map(publicProduct) });
  }

  if (url.pathname === "/api/admin/orders/paid" && req.method === "POST") {
    const body = await readBody(req);
    const order = db.orders.find((candidate) => candidate.id === body.id);
    if (!order) return json(res, 404, { error: "Commande introuvable" });
    if (order.status !== "pending_payment") {
      return json(res, 400, { error: "Seules les commandes en attente de paiement peuvent être marquées comme payées" });
    }
    markOrderPaidFromSquare(db, order, { status: "COMPLETED" }, "admin");
    await queueOrderEmails(db, order);
    updateOrderEmailStatus(db, order);
    await writeDb(db);
    return json(res, 200, { order, summary: summarizeSales(db), inventory: db.inventory.map(publicProduct) });
  }

  if (url.pathname === "/api/admin/sets" && req.method === "GET") {
    try {
      return json(res, 200, { sets: await fetchPokemonSets() });
    } catch {
      return json(res, 200, { sets: fallbackPokemonSets(), fallback: true });
    }
  }

  if (url.pathname === "/api/admin/card-images" && req.method === "GET") {
    const query = url.searchParams.get("q") || "";
    const number = url.searchParams.get("number") || "";
    const setId = url.searchParams.get("setId") || "";
    const productType = url.searchParams.get("productType") || "";
    if (query.trim().length < 2 && !setId) return json(res, 200, { candidates: [] });
    try {
      if (["etb", "utb", "pack", "booster-bundle", "booster-box", "japanese", "accessory"].includes(productType)) {
        return json(res, 200, { candidates: await searchSealedProductImages(query, setId) });
      }
      return json(res, 200, { candidates: await searchPokemonCardImages(query, number, setId) });
    } catch (error) {
      return json(res, 502, { error: `Recherche image indisponible: ${error.message}` });
    }
  }

  if (url.pathname === "/api/admin/market-suggest" && req.method === "GET") {
    try {
      const suggestion = await suggestMarketPriceFromSources({
        name: url.searchParams.get("name") || "",
        setId: url.searchParams.get("setId") || "",
        cardNumber: url.searchParams.get("cardNumber") || "",
        condition: url.searchParams.get("condition") || "NM",
        gradingCompany: url.searchParams.get("gradingCompany") || "",
        grade: url.searchParams.get("grade") || "",
      });
      if (!suggestion) return json(res, 404, { error: "Aucun prix marche trouve pour cette carte" });
      return json(res, 200, suggestion);
    } catch (error) {
      return json(res, 502, { error: `Suggestion prix indisponible: ${error.message}` });
    }
  }

  if (url.pathname === "/api/admin/products" && req.method === "POST") {
    const body = await readBody(req);
    const id =
      body.id ||
      String(body.name || "item")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      `item-${Date.now()}`;
    const existingIndex = db.inventory.findIndex((item) => item.id === id);
    const existingProduct = existingIndex >= 0 ? db.inventory[existingIndex] : null;
    const imageUrl = (await saveProductImage(body.imageData, id)) || body.imageUrl || "";
    const galleryImageUrls = Array.isArray(body.galleryImageUrls)
      ? body.galleryImageUrls.map((image) => String(image || "").trim()).filter(Boolean)
      : [];
    const uploadedGalleryImages = await saveProductGalleryImages(body.galleryImageData, id);
    const galleryImages = [...galleryImageUrls, ...uploadedGalleryImages].slice(0, 4);
    const features = Array.isArray(body.features)
      ? body.features.map((feature) => String(feature).trim()).filter(Boolean).slice(0, 2)
      : [];
    const category = body.category || "Singles";
    const publishedStatus = category === "Preorder" ? "preorder" : "available";
    const productStatus = existingProduct ? String(body.status || existingProduct.status || publishedStatus) : "draft";
    const product = {
      id,
      name: String(body.name || "").trim(),
      category,
      kind: body.kind || "single",
      status: productStatus,
      sku: String(body.sku || id).trim(),
      condition: body.condition || "",
      setId: String(body.setId || "").trim(),
      setName: String(body.setName || "").trim(),
      cardNumber: String(body.cardNumber || "").trim(),
      rarity: String(body.rarity || "").trim(),
      gradingCompany: String(body.gradingCompany || "").trim(),
      grade: String(body.grade || "").trim(),
      cost: Number(body.cost || 0),
      price: Number(body.price || 0),
      compareAtPrice:
        Number(body.price || 0) < Number(existingProduct?.compareAtPrice || 0)
          ? Number(existingProduct.compareAtPrice || 0)
          : Number(body.compareAtPrice || 0),
      market: Number(body.market || body.price || 0),
      priceAuto: false,
      stock: Number(body.stock || 0),
      reservedQuantity: existingProduct?.reservedQuantity || 0,
      maxPerCart: 0,
      accent: body.accent || "#c9652f",
      visual: inferVisual(body.category || "Singles", body.kind || "single"),
      imageUrl,
      galleryImages: galleryImages.length ? galleryImages : Array.isArray(existingProduct?.galleryImages) ? existingProduct.galleryImages.slice(0, 4) : [],
      features,
      featured: Boolean(body.featured),
      badge: String(body.badge || "").trim(),
      createdAt: body.createdAt || existingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (!product.name) return json(res, 400, { error: "Nom du produit requis" });
    if (existingIndex >= 0) {
      db.inventory[existingIndex] = {
        ...db.inventory[existingIndex],
        ...product,
        imageUrl: product.imageUrl || db.inventory[existingIndex].imageUrl || "",
      };
    }
    else db.inventory.push(product);
    await writeDb(db);
    return json(res, 201, { product });
  }

  if (url.pathname === "/api/admin/products/publish-drafts" && req.method === "POST") {
    let published = 0;
    for (const product of db.inventory || []) {
      if (product.status !== "draft") continue;
      product.status = product.category === "Preorder" ? "preorder" : "available";
      product.updatedAt = new Date().toISOString();
      published += 1;
    }
    await writeDb(db);
    return json(res, 200, {
      published,
      summary: summarizeSales(db),
      inventory: db.inventory.map(publicProduct),
    });
  }

  if (url.pathname === "/api/admin/card-shows" && req.method === "POST") {
    const body = await readBody(req);
    const id =
      body.id ||
      String(body.name || "show")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      `show-${Date.now()}`;
    const existingIndex = (db.cardShows || []).findIndex((show) => show.id === id);
    const existingShow = existingIndex >= 0 ? db.cardShows[existingIndex] : null;
    const imageUrl = (await saveCardShowImage(body.imageData, id)) || body.imageUrl || existingShow?.imageUrl || "";
    const show = {
      id,
      name: String(body.name || "").trim(),
      location: String(body.location || "").trim(),
      city: String(body.city || "").trim(),
      date: String(body.date || "").trim(),
      dateEnd: String(body.dateEnd || "").trim(),
      time: String(body.time || "").trim(),
      tables: String(body.tables || "").trim(),
      collaborator: String(body.collaborator || "").trim(),
      announcementUrl: String(body.announcementUrl || "").trim(),
      imageUrl,
      active: body.active !== false,
      createdAt: existingShow?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (!show.name) return json(res, 400, { error: "Nom du card show requis" });
    if (existingIndex >= 0) db.cardShows[existingIndex] = show;
    else db.cardShows.push(show);
    await writeDb(db);
    return json(res, 201, { show });
  }

  if (url.pathname === "/api/admin/card-shows/delete" && req.method === "POST") {
    const body = await readBody(req);
    const before = (db.cardShows || []).length;
    db.cardShows = (db.cardShows || []).filter((show) => show.id !== body.id);
    if (db.cardShows.length === before) return json(res, 404, { error: "Card show introuvable" });
    await writeDb(db);
    return json(res, 200, { ok: true });
  }

  if (url.pathname === "/api/admin/reviews" && req.method === "POST") {
    const body = await readBody(req);
    const id =
      body.id ||
      `review-${String(body.name || "client")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
    const existingIndex = (db.reviews || []).findIndex((review) => review.id === id);
    const existingReview = existingIndex >= 0 ? db.reviews[existingIndex] : null;
    const photoUrl = (await saveImageData(body.photoData, `review-${id}`)) || String(body.photoUrl || existingReview?.photoUrl || "").trim();
    const review = {
      id,
      name: String(body.name || "").trim(),
      city: String(body.city || "").trim(),
      rating: Math.max(1, Math.min(5, Number(body.rating || 5))),
      product: String(body.product || "").trim(),
      text: String(body.text || "").trim(),
      photoUrl,
      date: String(body.date || "").trim(),
      published: body.published !== false,
      createdAt: existingReview?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (!review.name) return json(res, 400, { error: "Nom du client requis" });
    if (!review.text) return json(res, 400, { error: "Commentaire requis" });
    if (!Array.isArray(db.reviews)) db.reviews = [];
    if (existingIndex >= 0) db.reviews[existingIndex] = review;
    else db.reviews.push(review);
    await writeDb(db);
    return json(res, 201, { review: publicReview(review) });
  }

  if (url.pathname === "/api/admin/reviews/delete" && req.method === "POST") {
    const body = await readBody(req);
    const before = (db.reviews || []).length;
    db.reviews = (db.reviews || []).filter((review) => review.id !== body.id);
    if (db.reviews.length === before) return json(res, 404, { error: "Avis introuvable" });
    await writeDb(db);
    return json(res, 200, { ok: true });
  }

  if (url.pathname === "/api/address/find" && req.method === "GET") {
    const query = url.searchParams.get("q") || "";
    if (query.trim().length < 3) return json(res, 200, { suggestions: [] });
    return json(res, 200, { suggestions: await findAddresses(query.trim()) });
  }

  if (url.pathname === "/api/address/retrieve" && req.method === "GET") {
    const address = await retrieveAddress(url.searchParams.get("id"), url.searchParams.get("provider"));
    if (!address) return json(res, 404, { error: "Adresse introuvable" });
    return json(res, 200, { address });
  }

  if (url.pathname === "/api/signup" && req.method === "POST") {
    const body = await readBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim() || email.split("@")[0];
    if (!email || password.length < 6) {
      return json(res, 400, { error: "Courriel valide et mot de passe de 6 caracteres requis" });
    }
    if (db.users.some((user) => user.email === email)) {
      return json(res, 409, { error: "Ce courriel existe deja" });
    }
    const user = {
      id: `usr_${crypto.randomBytes(8).toString("hex")}`,
      email,
      name,
      passwordHash: hashPassword(password),
      marketingOptIn: Boolean(body.marketingOptIn),
      coffeeBucks: 0,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    if (user.marketingOptIn && !db.newsletter.some((entry) => entry.email === email)) {
      db.newsletter.push({
        email,
        name,
        source: "account",
        createdAt: new Date().toISOString(),
      });
    }
    const sessionId = crypto.randomBytes(24).toString("hex");
    db.users.push(user);
    db.sessions[sessionId] = user.id;
    await writeDb(db);
    return json(res, 201, { user: publicUser(user) }, cookieHeader(sessionId));
  }

  if (url.pathname === "/api/login" && req.method === "POST") {
    const body = await readBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const user = db.users.find((candidate) => candidate.email === email);
    if (!user || !verifyPassword(String(body.password || ""), user.passwordHash)) {
      return json(res, 401, { error: "Connexion invalide" });
    }
    const sessionId = crypto.randomBytes(24).toString("hex");
    user.lastLogin = new Date().toISOString();
    db.sessions[sessionId] = user.id;
    await writeDb(db);
    return json(res, 200, { user: publicUser(user) }, cookieHeader(sessionId, body.rememberMe ? 60 * 60 * 24 * 90 : undefined));
  }

  if (url.pathname === "/api/logout" && req.method === "POST") {
    const sessionId = parseCookies(req).cb_session;
    if (sessionId) delete db.sessions[sessionId];
    await writeDb(db);
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    return json(res, 200, { ok: true }, {
      "Set-Cookie": `cb_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`,
    });
  }

  if (url.pathname === "/api/sell-request" && req.method === "POST") {
    const body = await readBody(req);
    const email = String(body.email || "").trim();
    const askingPrice = Number(body.askingPrice || 0);
    if (!email.includes("@")) return json(res, 400, { error: "Courriel requis pour envoyer la demande" });
    if (!Number.isFinite(askingPrice) || askingPrice < 1000) {
      return json(res, 400, { error: "La valeur minimale pour soumettre une collection est de 1 000 $" });
    }
    const message = await queueSellRequestEmail(db, body);
    await writeDb(db);
    return json(res, 201, {
      ok: true,
      emailStatus: message.status,
      message:
        message.status === "sent"
          ? "Demande envoyée. Nous allons l’évaluer et répondre par courriel."
          : "Demande préparée. Vérifie la configuration Resend si l’envoi n’est pas complété.",
    });
  }

  if (url.pathname === "/api/order" && req.method === "POST") {
    const user = await getSessionUser(req, db);
    const body = await readBody(req);
    if (!Array.isArray(body.items) || !body.items.length) {
      return json(res, 400, { error: "Panier vide" });
    }

    const requestedPaymentType = "square";
    const paymentMethod = { type: "square", label: "Carte avec Square" };
    if (user && body.saveProfile) {
      user.address = body.address;
      user.paymentMethod = paymentMethod;
    }

    for (const item of body.items) {
      const product = db.inventory.find((candidate) => candidate.id === item.id);
      const quantity = Math.max(1, Number(item.quantity || 1));
      if (!product) return json(res, 404, { error: "Un item du panier est introuvable" });
      const stock = Number(product.stock || 0);
      const maxPerCart = Number(product.maxPerCart || 0);
      const cartLimit = maxPerCart > 0 ? Math.min(stock, maxPerCart) : stock;
      if (quantity > cartLimit) {
        return json(res, 400, {
          error: `Maximum ${cartLimit} par panier pour ${product.name}`,
        });
      }
    }

    const orderItems = body.items.map((item) => {
      const product = db.inventory.find((candidate) => candidate.id === item.id);
      const quantity = Math.max(1, Number(item.quantity || 1));
      return {
        id: item.id,
        name: product?.name || item.name,
        quantity,
        price: Number(product?.price ?? item.price ?? 0),
        cost: Number(product?.cost || 0),
        imageUrl: product?.imageUrl || "",
        category: product?.category || "",
        kind: product?.kind || "",
        condition: product?.condition || "",
        setName: product?.setName || "",
        cardNumber: product?.cardNumber || "",
        gradingCompany: product?.gradingCompany || "",
        grade: product?.grade || "",
      };
    });
    const subtotal = orderItemsTotal(orderItems);
    const requestedCoffeeBucks = Math.max(0, Math.floor(Number(body.coffeeBucksToRedeem || 0)));
    const availableCoffeeBucks = user ? Math.max(0, Number(user.coffeeBucks || 0)) : 0;
    const maxCoffeeBucksForOrder = Math.floor(subtotal * COFFEE_BUCKS_REDEEM_RATE);
    const coffeeBucksRedeemed = Math.min(requestedCoffeeBucks, availableCoffeeBucks, maxCoffeeBucksForOrder);
    const coffeeBucksDiscountAmount = coffeeBucksDiscount(coffeeBucksRedeemed);
    const taxes = taxBreakdown(Math.max(0, subtotal - coffeeBucksDiscountAmount));
    if (coffeeBucksRedeemed > 0 && user) {
      user.coffeeBucks = Math.max(0, Number(user.coffeeBucks || 0) - coffeeBucksRedeemed);
    }

    const order = {
      id: `CB-${String(db.orders.length + 1).padStart(5, "0")}`,
      userId: user?.id || "guest",
      customer: body.customer || null,
      items: orderItems,
      shipping: body.shipping,
      taxBreakdown: taxes,
      originalSubtotalAmount: subtotal,
      subtotalAmount: taxes.subtotal,
      tpsAmount: taxes.tps,
      tvqAmount: taxes.tvq,
      totalAmount: taxes.total,
      coffeeBucksRedeemed,
      coffeeBucksDiscount: coffeeBucksDiscountAmount,
      address: body.address,
      marketingOptIn: Boolean(body.marketingOptIn),
      paymentMethod,
      status: "pending_payment",
      reservationExpiresAt: new Date(Date.now() + reservationHoldMs).toISOString(),
      emailStatus: "waiting_payment",
      emailMessage: "Les courriels seront envoyés après confirmation du paiement Square.",
      createdAt: new Date().toISOString(),
    };
    if (order.marketingOptIn) {
      const email = String(order.customer?.email || order.address?.email || "").trim().toLowerCase();
      if (email && !db.newsletter.some((entry) => entry.email === email)) {
        db.newsletter.push({
          email,
          name: order.customer?.name || order.address?.name || "",
          source: "checkout",
          createdAt: new Date().toISOString(),
        });
      }
    }
    if (requestedPaymentType === "square") {
      try {
        order.squarePaymentLink = await createSquarePaymentLink(order, req);
        order.paymentUrl = order.squarePaymentLink.url;
      } catch (error) {
        return json(res, 502, { error: `Square indisponible: ${error.message}` });
      }
    }
    for (const item of orderItems) {
      const product = db.inventory.find((candidate) => candidate.id === item.id);
      if (!product) continue;
      product.stock = Math.max(0, Number(product.stock || 0) - Number(item.quantity || 1));
      product.reservedQuantity = Number(product.reservedQuantity || 0) + Number(item.quantity || 1);
      if (Number(product.stock || 0) <= 0) product.status = "reserved";
    }
    db.orders.push(order);
    await writeDb(db);
    return json(res, 201, { order, user: publicUser(user), squareCheckoutUrl: order.paymentUrl || "" });
  }

  return json(res, 404, { error: "Route API introuvable" });
}

function cookieHeader(sessionId, maxAge = 60 * 60 * 24 * 7) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return {
    "Set-Cookie": `cb_session=${encodeURIComponent(
      sessionId
    )}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`,
  };
}

function adminCookieHeader(sessionId) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return {
    "Set-Cookie": `cb_admin=${encodeURIComponent(
      sessionId
    )}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(adminSessionMs / 1000)}${secure}`,
  };
}

function clearAdminCookieHeader() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return {
    "Set-Cookie": `cb_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`,
  };
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  const requested = safePath === "/" ? "/index.html" : safePath;
  const isUploadAsset = requested.startsWith("/assets/uploads/");
  const uploadFileName = isUploadAsset ? path.basename(requested) : "";
  const filePath = isUploadAsset ? path.join(uploadDir, uploadFileName) : path.join(root, requested);
  const allowedRoot = isUploadAsset ? uploadDir : root;
  if (!filePath.startsWith(allowedRoot)) {
    res.writeHead(403, securityHeaders);
    return res.end("Forbidden");
  }
  try {
    const file = await fs.readFile(filePath);
    res.writeHead(200, {
      ...securityHeaders,
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": ["html", ".js", ".css"].some((ext) => filePath.endsWith(ext)) ? "no-store" : "public, max-age=3600",
    });
    res.end(file);
  } catch {
    const acceptsHtml = (req.headers.accept || "").includes("text/html");
    if (acceptsHtml && !url.pathname.startsWith("/assets/")) {
      const file = await fs.readFile(path.join(root, "index.html"));
      res.writeHead(200, { ...securityHeaders, "Content-Type": mimeTypes[".html"] });
      return res.end(file);
    }
    res.writeHead(404, securityHeaders);
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api/")) return await handleApi(req, res);
    return await serveStatic(req, res);
  } catch (error) {
    const status = Number(error.statusCode || 500);
    json(res, status, { error: error.message || "Erreur serveur" });
  }
});

server.listen(port, () => {
  console.log(`Coffee Break TCG running at http://localhost:${port}`);
});

setInterval(() => {
  syncMarketPricesFromDisk().catch((error) => {
    console.error("Price sync failed:", error.message);
  });
}, priceSyncIntervalMs).unref();
