export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, "id"));
  console.log("id", id, typeof id);

  return await db(e).select().from(products).where(eq(products.merchant, id));
});
