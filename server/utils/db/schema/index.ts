// export * from "./better-auth";
// export * from "./db";


import { sql } from "drizzle-orm";
// import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
// import { merchants } from "./db";

import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";

import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import dafaultField from "./default_field";
import { Merchant } from "~~/shared/types";
export { sql, eq, and, or, gte, lte } from "drizzle-orm";

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

export const InsertMerchantSchema = z.object({
  title: z.string().min(4),
  slug: z
    .string()
    .min(4)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug must be lowercase and can only contain letters, numbers, and dashes.",
    }),
  description: z.string().optional(),
  category: z.number().int().gt(0),
  owner: z.number().int().gt(0),
  greeting: z.string().optional(),
  primery_color: z.string().min(4).max(20).optional(),
  image_background: z.string().min(4).max(200).optional(),
  logo: z.string().min(4).max(200),
});

export type InsertMerchant = z.infer<typeof InsertMerchantSchema>;

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

export const products_to_responses = sqliteTable("products_to_responses", {
  product_id: int()
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
    }),
  response_id: int()
    .notNull()
    .references(() => respondents.id, {
      onDelete: "cascade",
    }),
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
  product: int().references((): AnySQLiteColumn => products.id, {
    onDelete: "cascade",
  }),
  analysis: text().notNull(),
  ...dafaultField,
});


export const user = sqliteTable("user", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: int("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: text("username").notNull().unique(),
  defaultMerchant: int("default_merchant").references(() => merchants.id, {
    onDelete: "set null",
  }),
});

export const session = sqliteTable("session", {
  id: int("id").primaryKey({ autoIncrement: true }),
  expiresAt: int("expires_at", { mode: "timestamp_ms" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: int("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: int("id").primaryKey({ autoIncrement: true }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: int("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: int("access_token_expires_at", {
    mode: "timestamp_ms",
  }),
  refreshTokenExpiresAt: int("refresh_token_expires_at", {
    mode: "timestamp_ms",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = sqliteTable("verification", {
  id: int("id").primaryKey({ autoIncrement: true }),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: int("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});



export const UpdateUserSchema = createUpdateSchema(user, {
  name: (field) => field.min(4),
  username: (field) =>
    field
      .min(4)
      .refine((value) => /^[a-z0-9]+(?:[-.][a-z0-9]+)*$/.test(value), {
        message:
          "username must be lowercase and can only contain letters, numbers, dot, and dashes.",
      }),
  defaultMerchant: (field) => field.gt(0),
}).omit({
  id: true,
  email: true,
  emailVerified: true,
  image: true,
  createdAt: true,
  updatedAt: true,
});
