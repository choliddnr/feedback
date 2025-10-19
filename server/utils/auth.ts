import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { H3Event } from "h3";
import { createAuthMiddleware, APIError } from "better-auth/api";
import * as schema from "./db/schema/";
import { db } from "./db";
// import { toKebabCase } from "~/utils";
// import { userAuth } from "~~/server/plugin/user_auth";

const toKebabCase = (str: string) => {
  return str
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase(); // Convert to lowercase
};

const betterAuthOptions = {
  // plugins: [userAuth()],
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        unique: true,
        input: true,
      },
      defaultMerchant: {
        type: "number",
        required: false,
        references: {
          model: "merchants",
          field: "id",
          onDelete: "set null",
        },
        input: false, // don't allow user to set role
      },
    },
  },
  advanced: {
    database: {
      generateId: false, // Using SQLite's autoincrement instead
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.NUXT_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
      mapProfileToUser: (profile) => {
        return {
          username: toKebabCase(profile.given_name + " " + profile.family_name),
          image: profile.picture,
        };
      },
    },
  },
  secret: process.env.NUXT_BETTER_AUTH_SECRET,
  url: process.env.NUXT_BASE_URL,
} as BetterAuthOptions;

export const _auth = (e: H3Event) => {
  console.log("better-auth secret: ", process.env.NUXT_BETTER_AUTH_SECRET);

  return betterAuth({
    database: drizzleAdapter(db(e), {
      provider: "sqlite",
      schema,
    }),
    ...betterAuthOptions,
  });
};
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  ...betterAuthOptions,
});

// Use per-request authentication instance
