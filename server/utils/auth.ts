import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./db/schema/";
import { db } from "./db";
// import { toKebabCase } from "~/utils";
import { createAuthMiddleware, APIError } from "better-auth/api";
// import { userAuth } from "~~/server/plugin/user_auth";

const toKebabCase = (str: string) => {
  return str
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase(); // Convert to lowercase
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),

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
      generateId: false,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: useRuntimeConfig().GOOGLE_CLIENT_ID as string,
      clientSecret: useRuntimeConfig().GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          username: toKebabCase(profile.given_name + " " + profile.family_name),
          image: profile.picture,
        };
      },
    },
  },
  secret: useRuntimeConfig().BETTER_AUTH_SECRET as string,
  url: useRuntimeConfig().BETTER_AUTH_URL as string,
});

type Session = typeof auth.$Infer.Session;
type User = typeof auth.$Infer.Session.user;
