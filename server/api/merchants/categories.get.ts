import { merchant_categories } from "~~/server/utils/db/schema";

export default defineEventHandler(async (e) => {
  // console.log("api hit");

  return await db.select().from(merchant_categories);
});
