export default defineEventHandler(async (e) => {
  const product_id = getRouterParam(e, 'id');

  return await db(e)
    .select()
    .from(questions)
    .where(eq(questions.product, Number(product_id)));
});
