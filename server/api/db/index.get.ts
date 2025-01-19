// import "dotenv/config";
// import { drizzle } from "drizzle-orm/bun-sqlite";
import { useDB, eq, and } from "../../utils/db";
import { users as userSchema } from "../../../shared/db.schema";
// const db = drizzle(process.env.DB_FILE_NAME!);

export default defineEventHandler(async (e) => {
  // const db = useDatabase();
  // // Create users table
  // await db.sql`DROP TABLE IF EXISTS users`;
  // await db.sql`CREATE TABLE IF NOT EXISTS users ("id" TEXT PRIMARY KEY, "firstName" TEXT, "lastName" TEXT, "email" TEXT)`;

  // // Add a new user
  // const userId = String(Math.round(Math.random() * 10_000));
  // await db.sql`INSERT INTO users VALUES (${userId}, 'John', 'Doe', '')`;

  // // Query for users
  // const { rows } = await db.sql`SELECT * FROM users WHERE id = ${userId}`;

  // return {
  //   rows,
  // };

  const users = await useDB().select().from(userSchema);
  console.log("Getting all users from the database: ", users);
  return users;
});
