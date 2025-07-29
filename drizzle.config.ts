import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({
  path: './.env.local',
});
export default defineConfig({
  out: './server/utils/db/migrations',
  schema: './server/utils/db/schema/index.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.NUXT_DB_PATH!,
  },
  casing: 'snake_case',
});
