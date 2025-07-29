export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, 'id'));
  if (!id) {
    return sendError(
      e,
      createError({
        statusCode: 400,
        statusMessage: 'ID is required',
      }),
    );
  }

  const _analysis = await db(e)
    .select()
    .from(analysis)
    .where(eq(analysis.merchant, id))
    .limit(1);

  if (_analysis.length === 0) {
    return sendError(
      e,
      createError({
        statusCode: 404,
        statusMessage: 'Analysis not found',
      }),
    );
  }

  return _analysis[0].analysis;
});
