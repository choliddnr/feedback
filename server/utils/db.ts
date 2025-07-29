import type { H3Event } from 'h3';

import {
  drizzle as sqliteDrizzle,
  type BetterSQLite3Database,
} from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from './db/schema/index';

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
      casing: 'snake_case',
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
      casing: 'snake_case',
    });
  }
};

// export const db2 = (e: H3Event): BetterSQLite3Database<typeof schema> =>
//   import.meta.dev
//     ? sqliteDrizzle({
//         client: new Database(useRuntimeConfig().DB_PATH),
//         schema,
//         casing: "snake_case",
//       })
//     : (drizzle(e.context.cloudflare.env.NUXT_DB as D1Database, {
//         schema,
//         casing: "snake_case",
//       }) as any as BetterSQLite3Database<typeof schema>);
// // export type Db = ReturnType<typeof db>;

export type DB =
  | BetterSQLite3Database<typeof schema>
  | DrizzleD1Database<typeof schema>;
