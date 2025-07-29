export default defineEventHandler(async (e) => {
  const slug = getRouterParam(e, 'slug') as string;

  return db(e)
    .select()
    .from(merchants)
    .where(eq(merchants.slug, slug))
    .limit(1)
    .get();
});
