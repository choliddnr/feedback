import { users, eq } from "../../../shared/db.schema";
import { toNumber } from "@vue/shared";
export default defineEventHandler(async (e) => {
  const key = getQuery(e).k as string;
  const value = getQuery(e).v as string;
  let query;
  if (!key || !value)
    throw createError({ status: 400, message: "Missing k/v" });
  if (key === "id") query = eq(users.id, toNumber(value));
  if (key === "username") query = eq(users.username, toNumber(value));
  if (key === "email") query = eq(users.email, toNumber(value));

  const user = await useDB().select().from(users).where(query).limit(1);
  return user;
});
