"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const { validateConfig } = require("./config");

function configurationReport(env = process.env) {
  try {
    const config = validateConfig(env);
    return {
      ok: true,
      environment: config.environment,
      deploymentStage: config.deploymentStage,
      squareEnvironment: env.SQUARE_ENVIRONMENT || "unset",
      required: Object.fromEntries(config.categories.required.map(name => [name, Boolean(String(env[name] || "").trim())])),
      optional: Object.fromEntries(config.categories.optional.map(name => [name, Boolean(String(env[name] || "").trim())])),
    };
  } catch (error) {
    return { ok: false, code: error.code || "CONFIG_INVALID", invalidVariables: error.variables || [] };
  }
}

function isWithin(parent, child) {
  return child === parent || child.startsWith(`${parent}${path.sep}`);
}

async function probeDirectory(directory, label) {
  await fs.mkdir(directory, { recursive: true });
  const id = crypto.randomBytes(8).toString("hex");
  const temporary = path.join(directory, `.cb-staging-${id}.tmp`);
  const target = path.join(directory, `.cb-staging-${id}.probe`);
  const payload = `coffeebreak-staging-probe:${id}`;
  try {
    await fs.writeFile(temporary, payload, { mode: 0o600, flag: "wx" });
    await fs.rename(temporary, target);
    if (await fs.readFile(target, "utf8") !== payload) throw new Error(`${label}: contenu relu différent`);
    const stat = await fs.stat(directory);
    return { label, ok: true, path: directory, device: stat.dev };
  } finally {
    await fs.unlink(temporary).catch(() => {});
    await fs.unlink(target).catch(() => {});
  }
}

async function storageReport(env = process.env) {
  if (!env.PERSISTENT_DISK_MOUNT_PATH || !env.DATA_DIR || !env.UPLOAD_DIR) {
    return { ok: false, invalidVariables: ["PERSISTENT_DISK_MOUNT_PATH", "DATA_DIR", "UPLOAD_DIR"].filter(name => !env[name]) };
  }
  const mount = path.resolve(env.PERSISTENT_DISK_MOUNT_PATH);
  const data = path.resolve(env.DATA_DIR);
  const uploads = path.resolve(env.UPLOAD_DIR);
  const backups = path.join(data, "backups");
  if (![data, uploads, backups].every(directory => isWithin(mount, directory))) {
    return { ok: false, error: "DATA_DIR, UPLOAD_DIR et backups doivent être sous PERSISTENT_DISK_MOUNT_PATH.", mount, data, uploads, backups };
  }
  try {
    const mountReal = await fs.realpath(mount);
    const probes = [];
    for (const [directory, label] of [[data, "data"], [uploads, "uploads"], [backups, "backups"]]) {
      const probe = await probeDirectory(directory, label);
      const real = await fs.realpath(directory);
      if (!isWithin(mountReal, real)) throw new Error(`${label}: chemin réel hors du disque persistant`);
      probes.push({ ...probe, realPath: real });
    }
    const sameDevice = probes.every(probe => probe.device === probes[0].device);
    return { ok: sameDevice, mount: mountReal, sameDevice, probes };
  } catch (error) {
    return { ok: false, mount, error: error.code || error.message };
  }
}

async function run(command = "all", env = process.env) {
  const report = { timestamp: new Date().toISOString(), command };
  if (["all", "config"].includes(command)) report.configuration = configurationReport(env);
  if (["all", "storage"].includes(command)) report.storage = await storageReport(env);
  report.ok = Object.values(report).filter(value => value && typeof value === "object" && "ok" in value).every(value => value.ok);
  return report;
}

if (require.main === module) {
  run(process.argv[2] || "all").then(report => {
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exitCode = 1;
  }).catch(error => {
    console.error(JSON.stringify({ ok: false, code: error.code || "DIAGNOSTIC_FAILED" }));
    process.exitCode = 1;
  });
}

module.exports = { configurationReport, isWithin, probeDirectory, run, storageReport };
