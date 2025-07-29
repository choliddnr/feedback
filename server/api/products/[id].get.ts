export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, 'id'));
  return await db(e).select().from(products).where(eq(products.merchant, id));
});
