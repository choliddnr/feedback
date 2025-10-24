export * from "./better-auth";
export * from "./db";

import { createUpdateSchema } from "drizzle-zod";
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
