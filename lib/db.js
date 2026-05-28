import { JSONFilePreset } from "lowdb/node";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function resolveDbPath() {
  if (process.env.DB_PATH) return process.env.DB_PATH;

  const isServerless = Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
  const dir = isServerless ? os.tmpdir() : path.join(process.cwd(), "data");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, "db.json");
}

const defaultData = { users: [] };

let dbPromise = globalThis.__userManagementDb;

export async function getDb() {
  if (!dbPromise) {
    dbPromise = JSONFilePreset(resolveDbPath(), defaultData);
    globalThis.__userManagementDb = dbPromise;
  }
  const db = await dbPromise;
  await db.read();
  if (!db.data) db.data = structuredClone(defaultData);
  if (!Array.isArray(db.data.users)) db.data.users = [];
  return db;
}

export async function findUserByEmail(email) {
  const db = await getDb();
  const normalized = String(email || "").trim().toLowerCase();
  return db.data.users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export async function findUserById(id) {
  const db = await getDb();
  return db.data.users.find((u) => u.id === id) || null;
}

export async function createUser(user) {
  const db = await getDb();
  db.data.users.push(user);
  await db.write();
  return user;
}

export async function updateUser(id, patch) {
  const db = await getDb();
  const user = db.data.users.find((u) => u.id === id);
  if (!user) return null;
  Object.assign(user, patch, { updatedAt: new Date().toISOString() });
  await db.write();
  return user;
}

export function publicUser(user) {
  if (!user) return null;
  const {
    passwordHash,
    googleRefreshToken,
    googleAccessToken,
    ...safe
  } = user;
  return safe;
}
