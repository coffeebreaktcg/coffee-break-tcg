"use strict";
const net = require("node:net");
const fs = require("node:fs/promises");
const path = require("node:path");

function fail(message, statusCode = 400) {
  throw Object.assign(new Error(message), { statusCode });
}
function object(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("Objet JSON requis");
  return value;
}
function text(value, max = 500, required = false) {
  if ((value === undefined || value === null) && !required) return "";
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) fail("Texte invalide");
  return value;
}
function id(value) {
  if (typeof value !== "string" || ["__proto__", "constructor", "prototype"].includes(value) || !/^[a-zA-Z0-9_-]{1,180}$/.test(value)) fail("Identifiant invalide");
  return value;
}
function number(value, max = 1000000, integer = false, min = 0) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isSafeInteger(value))) fail("Nombre invalide");
  return value;
}
function email(value) {
  text(value, 254, true);
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value)) fail("Courriel invalide");
}
function publicUrl(value) {
  text(value, 2048);
  if (!value) return;
  if (/^\/(?!\/)/.test(value) && !/[\\<>"\s]/.test(value)) return;
  let url; try { url = new URL(value); } catch { fail("URL invalide"); }
  if (url.protocol !== "https:" || url.username || url.password || /[<>"\s]/.test(value)) fail("URL publique HTTPS requise");
}
function walk(value, depth = 0, key = "") {
  if (depth > 8) fail("JSON trop profond");
  if (typeof value === "string") {
    const image = /^(imageData|photoData|galleryImageData|dataUrl|photos)$/.test(key);
    text(value, image ? 6 * 1024 * 1024 : 20000);
  } else if (Array.isArray(value)) {
    if (value.length > 100) fail("Trop d’éléments");
    value.forEach(v => walk(v, depth + 1, key));
  } else if (value && typeof value === "object") {
    if (Object.keys(value).length > 100) fail("Trop de champs");
    for (const [k, v] of Object.entries(value)) {
      if (["__proto__", "constructor", "prototype"].includes(k)) fail("Champ interdit");
      walk(v, depth + 1, k);
    }
  }
}
function validateBody(route, body) {
  object(body); walk(body);
  if (/\/(login|signup)$/.test(route)) {
    email(body.email); text(body.password, 256, true);
    if (route === "/api/signup" && body.password.length < 12) fail("Mot de passe de 12 caractères minimum requis");
  }
  for (const key of ["name", "title", "city", "condition", "setName", "cardNumber", "rarity", "gradingCompany", "sku"]) {
    if (body[key] !== undefined) {
      text(body[key], 500);
      // Existing templates interpolate these fields as HTML. They must remain plain text.
      if (/[<>]/.test(body[key])) fail("Texte HTML interdit");
    }
  }
  if (route.startsWith("/api/admin/") && body.id !== undefined && body.id !== "") id(body.id);
  for (const key of ["imageUrl", "photoUrl", "href", "announcementUrl"]) if (body[key] !== undefined) publicUrl(body[key]);
  if (body.galleryImageUrls !== undefined) {
    if (!Array.isArray(body.galleryImageUrls) || body.galleryImageUrls.length > 4) fail("Galerie invalide");
    body.galleryImageUrls.forEach(publicUrl);
  }
  if (body.galleryImageData !== undefined && (!Array.isArray(body.galleryImageData) || body.galleryImageData.length > 4)) fail("Galerie invalide");
  if (route === "/api/sell-request") {
    email(body.email);
    if (typeof body.askingPrice === "string" && /^\d+(?:\.\d+)?$/.test(body.askingPrice)) body.askingPrice = Number(body.askingPrice);
    number(body.askingPrice, 1000000, false, 1000);
    if (body.photos !== undefined) {
      if (!Array.isArray(body.photos) || body.photos.length > 12) fail("Photos invalides");
      for (const photo of body.photos) {
        text(photo, 6 * 1024 * 1024);
        if (!/^data:image\/(?:png|jpe?g|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(photo)) fail("Photo invalide");
      }
    }
  }
  if (route.startsWith("/api/admin/")) {
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string" && !/Data$/.test(key) && /[<>]/.test(value)) fail("Texte HTML interdit");
    }
    // HTML form values arrive as decimal strings; normalize only these known fields.
    for (const key of ["price", "cost", "market", "compareAtPrice", "soldPrice", "stock", "featuredRank", "maxPerCart", "rating"]) {
      if (body[key] === null || body[key] === "") body[key] = 0;
      if (typeof body[key] === "string") {
        if (!/^\d+(?:\.\d+)?$/.test(body[key])) fail("Nombre invalide");
        body[key] = Number(body[key]);
      }
    }
    if (body.accent !== undefined && !/^#[0-9a-fA-F]{6}$/.test(body.accent)) fail("Couleur invalide");
    if (body.rating !== undefined) number(body.rating, 5, true, 1);
    for (const key of ["price", "cost", "market", "compareAtPrice", "soldPrice"]) if (body[key] !== undefined) number(body[key]);
    for (const key of ["stock", "featuredRank", "maxPerCart"]) if (body[key] !== undefined) number(body[key], 100000, true);
    for (const key of ["featured", "heroFeatured", "active", "published", "priceAuto"]) if (body[key] !== undefined && typeof body[key] !== "boolean") fail("Booléen invalide");
    if (body.category !== undefined && !["Singles", "Graded", "Sealed", "Accessories", "Preorder"].includes(body.category)) fail("Catégorie invalide");
    if (body.game !== undefined && !["Pokemon", "One Piece"].includes(body.game)) fail("Jeu invalide");
    if (body.language !== undefined && !["en", "fr", "jp", "cn", "kr"].includes(body.language)) fail("Langue invalide");
    if (/\/api\/admin\/products(?:\/|$)/.test(route) && body.status !== undefined && body.status !== "" && !["available", "draft", "admin_draft", "removed", "sold", "reserved", "preorder"].includes(body.status)) fail("Statut invalide");
    if (body.features !== undefined && (!Array.isArray(body.features) || body.features.length > 2 || body.features.some(v => typeof v !== "string" || v.length > 100 || /[<>]/.test(v)))) fail("Caractéristiques invalides");
  }
  if (route === "/api/admin/merchandising") {
    if (!["accept", "lock", "exclude", "reset-unlocked"].includes(body.action)) fail("Action invalide");
    if (body.action !== "reset-unlocked") {
      if (!["new", "vitrine", "one-piece", "accessible", "dormant", "content"].includes(body.section)) fail("Section invalide");
      id(body.productId);
      if (body.score !== undefined) number(body.score, 100);
      for (const key of ["reasons", "penalties"]) if (body[key] !== undefined && (!Array.isArray(body[key]) || body[key].length > 8 || body[key].some(v => typeof v !== "string" || v.length > 500 || /[<>]/.test(v)))) fail("Raisons invalides");
    }
  }
  if (route === "/api/admin/orders/transition") {
    id(body.id);
    if (!["paid", "fulfilled", "refunded", "cancelled", "manual_review"].includes(body.status)) fail("Statut de commande invalide");
    if (body.reason !== undefined) text(body.reason, 300);
  }
  for (const key of ["marketingOptIn", "saveProfile", "rememberMe"]) if (body[key] !== undefined && typeof body[key] !== "boolean") fail("Booléen invalide");
  if (["/api/order", "/api/profile"].includes(route)) {
    for (const group of ["address", "customer"]) {
      if (body[group] === undefined) continue;
      object(body[group]);
      const clean = {};
      for (const key of ["name", "email", "phone", "address", "city", "province", "postal", "notes"]) {
        if (body[group][key] === undefined || body[group][key] === null) continue;
        text(body[group][key], key === "notes" ? 2000 : 300);
        if (/[<>]/.test(body[group][key])) fail("Texte HTML interdit");
        clean[key] = body[group][key];
      }
      body[group] = clean;
    }
  }
  if (route === "/api/order") {
    object(body.address); object(body.customer);
    for (const key of ["name", "address", "city", "province", "postal"]) text(body.address[key], 300, true);
    email(body.customer.email); email(body.address.email);
    if (!["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"].includes(body.address.province)) fail("Province invalide");
    if (body.shipping !== "canada_post_manual") fail("Livraison invalide");
  }
  return body;
}
function checkoutItems(items, inventory) {
  if (!Array.isArray(items) || !items.length || items.length > 100) fail("Panier invalide");
  const grouped = new Map();
  for (const item of items) {
    object(item); id(item.id); number(item.quantity, 1000, true, 1);
    grouped.set(item.id, (grouped.get(item.id) || 0) + item.quantity);
  }
  return [...grouped].map(([productId, quantity]) => {
    number(quantity, 1000, true, 1);
    const product = inventory.find(p => p.id === productId);
    if (!product || !["available", "preorder"].includes(product.status || "available")) fail("Produit non disponible");
    number(product.price, 1000000, false, 0.01);
    number(product.stock, 100000, true);
    if (quantity > product.stock || (Number(product.maxPerCart) > 0 && quantity > Number(product.maxPerCart))) fail("Stock ou limite de panier dépassé");
    return { id: productId, quantity };
  });
}
function requestIp(req) {
  const remote = req.socket.remoteAddress || "local";
  // Trust only a configured number of rightmost proxy hops, never arbitrary leftmost input.
  const hops = Number(process.env.TRUST_PROXY_HOPS || 0);
  if (!Number.isSafeInteger(hops) || hops < 1 || hops > 10) return remote;
  const chain = String(req.headers["x-forwarded-for"] || "").split(",").map(s => s.trim());
  if (chain.length < hops || chain.some(ip => !net.isIP(ip))) return remote;
  return chain[chain.length - hops];
}
function proxyDiagnostic(req) {
  const remoteAddress = req.socket.remoteAddress || "local";
  const forwardedFor = String(req.headers["x-forwarded-for"] || "");
  const chain = forwardedFor.split(",").map(value => value.trim()).filter(Boolean);
  const configuredHops = Number(process.env.TRUST_PROXY_HOPS || 0);
  const validChain = chain.length >= configuredHops && chain.every(ip => net.isIP(ip));
  const warnings = [];
  if (!Number.isSafeInteger(configuredHops) || configuredHops < 1 || configuredHops > 10) warnings.push("TRUST_PROXY_HOPS doit être compris entre 1 et 10 sur Render.");
  if (configuredHops > 0 && chain.length < configuredHops) warnings.push("La chaîne X-Forwarded-For contient moins d’adresses que le nombre de proxies approuvés.");
  if (chain.some(ip => !net.isIP(ip))) warnings.push("La chaîne X-Forwarded-For contient une adresse invalide.");
  return { configuredHops, remoteAddress, forwardedFor: chain, chainLength: chain.length, validChain, effectiveIp: requestIp(req), warnings };
}
const buckets = new Map();
function rateLimit(req, route) {
  const windowMs = 15 * 60 * 1000;
  const now = Date.now();
  for (const [key, bucket] of buckets) if (bucket.until <= now) buckets.delete(key);
  let group = "api", limit = 1200;
  if (/\/(login|signup)$/.test(route)) { group = "auth"; limit = 20; }
  else if (route === "/api/order") { group = "checkout"; limit = 30; }
  else if (/card-images|market-suggest|\/address\/|\/sets$|\/api\/jarvis\//.test(route)) { group = "external"; limit = 120; }
  else if (route === "/api/sell-request") { group = "sell"; limit = 10; }
  else if (route.startsWith("/api/admin/")) { group = "admin"; limit = 600; }
  const key = `${group}:${requestIp(req)}`;
  if (!buckets.has(key) && buckets.size >= 20000) fail("Réessaie plus tard", 429);
  const bucket = buckets.get(key) || { count: 0, until: now + windowMs };
  buckets.set(key, bucket);
  if (++bucket.count > limit) fail("Trop de requêtes. Réessaie plus tard.", 429);
}
function origin(req) {
  if (process.env.PUBLIC_ORIGIN) return new URL(process.env.PUBLIC_ORIGIN).origin;
  if (process.env.NODE_ENV === "production") return "https://coffeebreaktcg.com";
  return `http://${req.headers.host}`;
}
function guardRequest(req, route) {
  rateLimit(req, route);
  if (["GET", "HEAD"].includes(req.method)) return;
  if (req.method !== "POST") fail("Méthode interdite", 405);
  if (route === "/api/square/webhook") return;
  const allowed = new Set([origin(req), ...(process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean)]);
  if (req.headers["sec-fetch-site"] === "cross-site" || (req.headers.origin && !allowed.has(req.headers.origin))) fail("Origine interdite", 403);
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"] || "")) fail("Content-Type JSON requis", 415);
}
async function publicFile(root, uploadDir, rawUrl, appRoutes) {
  const rawPath = rawUrl.split("?")[0];
  if (!rawPath.startsWith("/") || rawPath.startsWith("//")) return null;
  let pathname; try { pathname = decodeURIComponent(rawPath); } catch { return null; }
  if (/[\\%\x00-\x1f\x7f]/.test(pathname) || pathname.split("/").some(s => s === "." || s === ".." || s.startsWith("."))) return null;
  const entry = pathname === "/" || appRoutes.has(pathname) || /^\/produit\/[a-zA-Z0-9_-]{1,180}$/.test(pathname) ? "index.html" : pathname === "/jarvis" ? "jarvis.html" : pathname.slice(1);
  const files = new Set(["index.html", "app.js", "styles.css", "jarvis.html", "jarvis.js", "jarvis.css", "jarvis-manifest.webmanifest"]);
  let base = root, relative = entry;
  if (!files.has(entry)) {
    if (!/^assets\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:png|jpe?g|webp|gif|avif|ico|svg|woff2?|ttf|otf)$/i.test(entry)) return null;
    if (entry.toLowerCase().startsWith("assets/uploads/")) {
      relative = entry.slice("assets/uploads/".length); base = uploadDir;
      if (!/^(?!expense-)[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp)$/i.test(relative)) return null;
    }
  }
  // Reject symlinks at every component, even when their targets are within the root.
  let file = base;
  try {
    for (const part of relative.split("/")) {
      file = path.join(file, part);
      if ((await fs.lstat(file)).isSymbolicLink()) return null;
    }
    if (!(await fs.stat(file)).isFile()) return null;
    const realBase = await fs.realpath(base), realFile = await fs.realpath(file);
    if (!realFile.startsWith(realBase + path.sep)) return null;
    return realFile;
  } catch { return null; }
}
module.exports = { fail, object, text, id, number, email, publicUrl, validateBody, checkoutItems, requestIp, proxyDiagnostic, guardRequest, publicFile, origin };
