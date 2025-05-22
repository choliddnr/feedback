import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database(useRuntimeConfig().DB_PATH);
// sqlite.pragma("PRAGMA foreign_keys = ON");

export const db = drizzle({
  client: sqlite,
  casing: "snake_case",
});
