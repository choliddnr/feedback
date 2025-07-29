export default defineEventHandler(async (e) => {
  const id = getRouterParam(e, 'id');
  const merchant = await db(e)
    .select()
    .from(merchants)
    .where(eq(merchants.id, Number(id)))
    .get();

  if (!merchant) {
    return sendError(
      e,
      createError({
        statusCode: 404,
        statusMessage: 'Merchant not found',
      }),
    );
  }

  if (merchant.logo !== null) await deleteImg(e, merchant.logo);

  return db(e)
    .delete(merchants)
    .where(eq(merchants.id, Number(id)));
});
