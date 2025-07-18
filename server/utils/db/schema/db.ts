import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
export { sql, eq, and, or } from "drizzle-orm";

import dafaultField from "./default_field";
import { user } from "./better-auth";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { Merchant } from "~~/shared/types";
import { ZodString } from "better-auth";

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
  slug: text().notNull(),
  description: text(),
  category: int().references((): AnySQLiteColumn => merchant_categories.id, {
    onDelete: "set null",
  }),
  owner: int().references((): AnySQLiteColumn => user.id, {
    onDelete: "cascade",
  }),
  greeting: text().notNull(),
  primery_color: text(),
  image_background: text(),
  logo: text().notNull(),
  ...dafaultField,
});

export const InsertMerchantSchema = createInsertSchema(merchants, {
  title: (field) => field.min(4),
  slug: (field) =>
    field.min(4).refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
      message:
        "Slug must be lowercase and can only contain letters, numbers, and dashes.",
    }),
  description: (field) => field.optional(),
  category: (field) => field.gt(0),
  owner: (field) => field.gt(0),
  greeting: (field) => field.optional(),
  primery_color: (field) => field.min(4).max(20).optional(),
  image_background: (field) => field.min(4).max(200).optional(),
  logo: (field) => field.min(4).max(200),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateMerchantSchema = createUpdateSchema(merchants, {
  title: (field) => field.min(4),
  slug: (field) =>
    field.min(4).refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
      message:
        "Slug must be lowercase and can only contain letters, numbers, and dashes.",
    }),
  description: (field) => field.optional(),
  category: (field) => field.gt(0),
  owner: (field) => field.gt(0),
  greeting: (field) => field.optional(),
  primery_color: (field) => field.min(4).max(20).optional(),
  image_background: (field) => field.min(4).max(200).optional(),
  logo: (field) => field.min(4).max(200),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

export const InsertProductSchema = createInsertSchema(products, {
  title: (field) => field.min(5).max(25),
  merchant: (field) => field.gt(0),
}).omit({
  id: true,
  description: true,
  image: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateProductSchema = createUpdateSchema(products, {
  title: (field) => field.min(5).max(25),
  merchant: (field) => field.gt(0),
}).omit({
  id: true,
  description: true,
  image: true,
  createdAt: true,
  updatedAt: true,
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

export const InsertRespondentsSchema = createInsertSchema(respondents, {
  name: (field) => field.min(3),
  age: (field) => field.gte(20).lte(90),
  gender: (field) => field,
  whatsapp: (field) => field.gt(100000000).lt(10000000000000).nullable(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  location: true,
});

export const responses = sqliteTable("responses", {
  merchant: int()
    .notNull()
    .references((): AnySQLiteColumn => merchants.id, { onDelete: "cascade" }),
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

export const InsertResponseAnswerSchema = createInsertSchema(response_answers, {
  answer: (field) => field.nonempty(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  response: true,
  question: true,
});


export const analysis = sqliteTable("analysis", {
  merchant: int().references((): AnySQLiteColumn => responses.id, {
    onDelete: "cascade",
  }),
  analysis: text().notNull(),
  ...dafaultField,
});
