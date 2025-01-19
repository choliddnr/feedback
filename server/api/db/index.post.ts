import { useDB, eq, and } from "../../utils/db";
import { users as usersSchema } from "../../../shared/db.schema";

export default defineEventHandler(async (e) => {
  const body: typeof usersSchema.$inferInsert = await readBody(e);
  //   const user: typeof usersTable.$inferInsert = {
  //     name: "John",
  //     age: 30,
  //     email: "john@example.com",
  //   };
  await useDB().insert(usersSchema).values(body);
  console.log("New user created!");
  const users = await useDB().select().from(usersSchema);
  console.log("Getting all users from the database: ", users);
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */
  return body;
});
