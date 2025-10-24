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
    /**
  Better Auth by default will generate unique IDs for users, sessions, and other entities. If you want to customize how IDs are generated, you can configure this in the advanced.database.generateId option in your auth config.
  You can also disable ID generation by setting the advanced.database.generateId option to false. This will assume your database will generate the ID automatically.
  */
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
    url: process.env.NUXT_BETTER_AUTH_URL,
  } as BetterAuthOptions;
};

/** 1. If this project uses drizzle and cloudflare D1, we need to pass H3Event. It will be used by drizzle instance to retrieve cloudflare binding.
 in this schenario, create both options. option 1 will be used on runtime and build time, option 2 will be used to generate database schema used by better-auth
 2. If this project uses drizzle with another database (drizzle instance not require H3Event). just use option 2.
 3. If not using drizzle, see this: https://www.better-auth.com/docs/installation
*/

// option 1
// export const _auth = (e: H3Event) =>
//   betterAuth({
//     database: drizzleAdapter(db(e), {
//       provider: "sqlite",
//       schema,
//     }),
//     ...config,
//   });

// option 2
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
        references: {
          model: "merchants",
          field: "id",
          onDelete: "set null",
        },
        input: true, // allow user to set role
      },
    },
  },
  ...getConfig,
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
          references: {
            model: "merchants",
            field: "id",
            onDelete: "set null",
          },
          input: true, // allow user to set role
        },
      },
    },
    ...getConfig(e),
  });
};
