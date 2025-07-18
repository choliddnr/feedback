export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, "id"));
  return await db(e)
    .select()
    .from(products)
    .innerJoin(questions, eq(questions.product, products.id))
    .where(eq(products.merchant, id))
    .groupBy(products.id);
});
