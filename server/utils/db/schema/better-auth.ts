import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { createUpdateSchema } from "drizzle-zod";
import { User } from "better-auth";
import { merchants } from "./db";

export const user = sqliteTable("user", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: int({ mode: "boolean" }).notNull(),
  image: text(),
  createdAt: int({ mode: "timestamp" }).notNull(),
  updatedAt: int({ mode: "timestamp" }).notNull(),
  username: text().notNull().unique(),
  defaultMerchant: int()
    .references(() => merchants.id, {
      onDelete: "set default",
    })
    .default(0),
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

export const session = sqliteTable("session", {
  id: int().primaryKey({ autoIncrement: true }),
  expiresAt: int({ mode: "timestamp" }).notNull(),
  token: text().notNull().unique(),
  createdAt: int({ mode: "timestamp" }).notNull(),
  updatedAt: int({ mode: "timestamp" }).notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: int()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: int().primaryKey({ autoIncrement: true }),
  accountId: int().notNull(),
  providerId: int().notNull(),
  userId: int()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: int({
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: int({
    mode: "timestamp",
  }),
  scope: text(),
  password: text(),
  createdAt: int({ mode: "timestamp" }).notNull(),
  updatedAt: int({ mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: int().primaryKey({ autoIncrement: true }),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: int({ mode: "timestamp" }).notNull(),
  createdAt: int({ mode: "timestamp" }),
  updatedAt: int({ mode: "timestamp" }),
});
