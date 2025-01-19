import { toNumber } from "@vue/shared";
import { useDB, eq, and } from "../../utils/db";
import { users } from "../../../shared/db.schema";

export default defineEventHandler(async (e) => {
  const body: typeof users.$inferInsert = await readBody(e);
  const id = toNumber(getRouterParam(e, "id"));
  //   const user: typeof usersTable.$inferInsert = {
  //     name: "John",
  //     age: 30,
  //     email: "john@example.com",
  //   };
  // type User = (typeof usersTable.$inferSelect)
  await useDB().delete(users).where(eq(users.id, 1));
  // console.log("New user created!");
  // const users = await useDB().select().from(usersTable);
  // console.log("Getting all users from the database: ", users);
  // /*
  // const users: {
  //   id: number;
  //   name: string;
  //   age: number;
  //   email: string;
  // }[]
  // */
  return body;
});
