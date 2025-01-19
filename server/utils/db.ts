import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sqlite";
export { sql, eq, and, or } from "drizzle-orm";
import { users } from "../../shared/db.schema";
export const useDB = () => drizzle(process.env.DB_FILE_NAME!);
