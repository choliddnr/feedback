// import lib
import type { H3Event } from "h3";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

// covert sentences into kebab case
const toKebabCase = (str: string) => {
  return str.replace(/\s+/g, "-").toLowerCase();
};
// Better Auth configuration
const getConfig = (e: H3Event | null = null): BetterAuthOptions => {
  return {
    advanced: {
      database: {
        generateId: false,
      },
    },
    // Eneble email and password authentication
    emailAndPassword: {
      enabled: true,
    },
    // Enable Google OAuth
    socialProviders: {
      google: {
        clientId: process.env.NUXT_GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
        // Customizing user profile
        mapProfileToUser: (profile) => {
          return {
            username: toKebabCase(
              profile.given_name + " " + profile.family_name
            ), //convert `given_name` returned by google into kebab case
            image: profile.picture,
          };
        },
      },
    },
    // set better-auth secret and URL
    secret: e
      ? e.context.cloudflare.env.BETTER_AUTH_SECRET
      : process.env.NUXT_BETTER_AUTH_SECRET,
    
  } as BetterAuthOptions;
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  // Configure user table
  user: {
    // Add custom fields
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
        defaultValue: 0,
        input: true, // allow user to set
      },
    },
  },
  ...getConfig(),
});

export const _auth = (e: H3Event) => {
  return betterAuth({
    database: drizzleAdapter(db(e), {
      provider: "sqlite",
      schema,
    }),
    // Configure user table
    user: {
      // Add custom fields
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
          defaultValue: 0,
          input: true, // allow user to set role
        },
      },
    },
    ...getConfig(e),
  });
};
