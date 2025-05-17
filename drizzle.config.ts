import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./server/utils/db/migrations",
  schema: "./server/utils/db/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_PATH!,
  },
  casing: "snake_case",
});
