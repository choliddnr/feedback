import { merchant_categories } from "~~/server/utils/db/schema";

export default defineEventHandler(async (e) => {
  return await db.select().from(merchant_categories);
});
