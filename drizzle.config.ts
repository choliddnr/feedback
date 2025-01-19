import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./server/api/db/migrations",
  schema: "./shared/db.schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
