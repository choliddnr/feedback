import * as schema from "./db/schema/index";
import type { H3Event } from "h3";

import { drizzle as sqliteDrizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import { drizzle } from "drizzle-orm/d1";
import type { D1Database } from "@cloudflare/workers-types";

export const db = (e: H3Event) => {
  if (import.meta.dev) {
    /**
     * Development config
     * with Better-SQLite3
     */
    const sqlite = new Database(useRuntimeConfig().DB_PATH);
    // export const db = (e: H3Event) => {
    return sqliteDrizzle({
      client: sqlite,
      schema,
      casing: "snake_case",
    });
    // };
  } else {
    /**
     * Production config
     * with Cloudflare D1
     * CLoudfalre Pages
     */

    return drizzle(e.context.cloudflare.env.NUXT_DB as D1Database, {
      schema,
      casing: "snake_case",
    });
  }
};
