import { sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

const dafaultField = {
  id: int().primaryKey({ autoIncrement: true }),
  createdAt: int().default(sql`(strftime('%s','now'))`),
  updatedAt: int()
    .default(sql`(strftime('%s','now') )`)
    .$onUpdate(() => sql`(strftime('%s','now'))`),
};

export default dafaultField;
