import * as SQLite from "expo-sqlite";
import { GPXCache } from "../models/Cache";

const db = SQLite.openDatabaseSync("geocaching.db");
export const initDB = () => {
//   db.execAsync(`DROP TABLE IF EXISTS caches;`);
  db.execAsync(
    `CREATE TABLE IF NOT EXISTS caches (
        code TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL
    );`
  );
};

export const saveCaches = async (caches: GPXCache[]) => {
  for (const cache of caches) {
    await db.runAsync(
      `INSERT OR IGNORE INTO caches (code, data) VALUES (?, ?)`,
      [cache.code, JSON.stringify(cache)]
    );
  }
};

export const loadCaches = async (): Promise<GPXCache[]> => {
  const rows = await db.getAllAsync('SELECT data FROM caches');
  return rows.map((row: any) => JSON.parse(row.data));
};

export const markCacheFound = async (code: string, text?: string) => {
  const rows = await db.getAllAsync('SELECT data FROM caches WHERE code = ?', [code]);
  if (rows.length === 0) return;
  const cache = JSON.parse((rows[0] as any).data);
  cache.found = true;
  cache.foundAt = new Date().toISOString();
  cache.userLog = text ?? '';
  await db.runAsync(
    `UPDATE caches SET data = ? WHERE code = ?`,
    [JSON.stringify(cache), code]
  );
};

export default db;