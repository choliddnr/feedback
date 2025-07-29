export default defineEventHandler(async (e) => {
  const slug = getRouterParam(e, 'slug');
  if (!slug) {
    return sendError(
      e,
      createError({
        statusCode: 400,
        statusMessage: 'Slug is required',
      }),
    );
  }

  return await db(e)
    .select()
    .from(merchants)
    .where(eq(merchants.slug, slug!))
    .limit(1);
});
