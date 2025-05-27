export default defineEventHandler(async (e) => {
  return await db(e).select().from(merchant_categories);
});
