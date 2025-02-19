import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
export { sql, eq, and, or } from "drizzle-orm";

const dafaultField = {
  id: int().primaryKey({ autoIncrement: true }),
  updated: int({ mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  created: int({ mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
};

export const users = sqliteTable("users", {
  name: text().notNull(),
  email: text().notNull().unique(),
  username: text().notNull().unique(),
  picture: text(),
  default_merchant: int().references((): AnySQLiteColumn => merchants.id),
  ...dafaultField,
});

export const merchants = sqliteTable("merchants", {
  title: text().notNull(),
  description: text(),
  category: int().references((): AnySQLiteColumn => merchant_categories.id),
  owner: int().references((): AnySQLiteColumn => users.id),
  greeting: text().notNull(),
  primery_color: text().default("fuel-yellow"),
  image_background: text(),
  logo: text(),
  ...dafaultField,
});

export const merchant_categories = sqliteTable("merchant_categories", {
  title: text().notNull(),
  description: text(),
  ...dafaultField,
});

export const products = sqliteTable("products", {
  title: text().notNull(),
  description: text().notNull(),
  images: text({ mode: "json" }).$type<string[]>().default([]),
  merchant: int().references((): AnySQLiteColumn => merchants.id),
  ...dafaultField,
});

export const questions = sqliteTable("questions", {
  question: text().notNull(),
  type: int().references((): AnySQLiteColumn => question_types.id),
  product: int().references((): AnySQLiteColumn => products.id),
  answer_options: text({ mode: "json" }).$type<string[]>().default([]),
  ...dafaultField,
});

export const question_types = sqliteTable("question_types", {
  title: text().notNull(),
  description: text(),
  ...dafaultField,
});

export const respondents = sqliteTable("respondents", {
  name: text().notNull(),
  gender: int({ mode: "boolean" }).notNull(),
  age: int().notNull(),
  whatsapp: int(),
  location: text({ mode: "json" }).$type<[number, number]>(),
  ...dafaultField,
});

export const responses = sqliteTable("responses", {
  respondent: int().references((): AnySQLiteColumn => respondents.id),
  ...dafaultField,
});
export const response_answers = sqliteTable("response_answers", {
  response: int().references((): AnySQLiteColumn => responses.id),
  question: int().references((): AnySQLiteColumn => questions.id),
  answer: text().notNull(),
  ...dafaultField,
});
