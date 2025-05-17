import { toNumber } from "@vue/shared";
import { db } from "~~/server/utils/db";
export { eq, and } from "drizzle-orm";
import { user } from "~~/server/utils/db/schema";
export default defineEventHandler(async (e) => {
  const id = toNumber(getRouterParam(e, "id"));
  return db.select().from(user).where(eq(user.id, id));
});
