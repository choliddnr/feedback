import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
export { sql, eq, and, or } from "drizzle-orm";

import dafaultField from "./default_field";
import { user } from "./better-auth";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

// export const users = sqliteTable("users", {
//   name: text().notNull(),
//   email: text().notNull().unique(),
//   username: text().notNull().unique(),
//   picture: text(),
//   default_merchant: int().references((): AnySQLiteColumn => merchants.id),
//   ...dafaultField,
// });

export const merchants = sqliteTable("merchants", {
  title: text().notNull(),
  description: text(),
  category: int().references((): AnySQLiteColumn => merchant_categories.id, {
    onDelete: "set null",
  }),
  owner: int().references((): AnySQLiteColumn => user.id, {
    onDelete: "cascade",
  }),
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
  image: text().notNull(),
  merchant: int()
    .notNull()
    .references((): AnySQLiteColumn => merchants.id, { onDelete: "cascade" }),
  ...dafaultField,
});

export const questions = sqliteTable("questions", {
  question: text().notNull(),
  type: int()
    .notNull()
    .references((): AnySQLiteColumn => question_types.id, {
      onDelete: "set null",
    }),
  product: int()
    .notNull()
    .references((): AnySQLiteColumn => products.id, { onDelete: "cascade" }),
  answer_options: text({ mode: "json" })
    .notNull()
    .$type<string[]>()
    .default([]),
  ...dafaultField,
});

export const InsertQuestionSchema = createInsertSchema(questions, {
  question: (field) => field.min(10),
  product: (field) => field.gt(0),
  type: (field) => field.gt(0),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateQuestionSchema = createUpdateSchema(questions, {
  question: (field) => field.min(10),
  product: (field) => field.gt(0),
  type: (field) => field.gt(0),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
  respondent: int()
    .references((): AnySQLiteColumn => respondents.id, {
      onDelete: "set default",
    })
    .$default(() => 0),
  ...dafaultField,
});
export const response_answers = sqliteTable("response_answers", {
  response: int().references((): AnySQLiteColumn => responses.id, {
    onDelete: "cascade",
  }),
  question: int().references((): AnySQLiteColumn => questions.id, {
    onDelete: "cascade",
  }),
  answer: text().notNull(),
  ...dafaultField,
});
