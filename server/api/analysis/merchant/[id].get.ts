export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, "id"));
  if (!id) {
    return sendError(
      e,
      createError({
        statusCode: 400,
        statusMessage: "ID is required",
      })
    );
  }

  const _analysis = await db(e)
    .select()
    .from(products)
    .where(eq(products.merchant, id))
    .leftJoin(analysis, eq(analysis.product, products.id));

  // const an =_analysis.map((a) => {
  //   if (a.analysis) {
  //     a["n"] = JSON.parse(a.analysis as unknown as string);
  //   }
  //   return a;
  // })

  if (_analysis.length === 0) {
    return sendError(
      e,
      createError({
        statusCode: 404,
        statusMessage: "Analysis not found",
      })
    );
  }

  //   return JSON.parse(_analysis[0].analysis);
  return _analysis;
});
