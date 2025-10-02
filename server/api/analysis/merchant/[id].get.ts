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

  try {
    const _analysis = await db(e)
      .select()
      .from(products)
      .where(eq(products.merchant, id))
      .leftJoin(analysis, eq(analysis.product, products.id))
      .leftJoin(
        products_to_responses,
        eq(products_to_responses.product_id, products.id)
      );

    // const an =_analysis.map((a) => {
    //   if (a.analysis) {
    //     a["n"] = JSON.parse(a.analysis as unknown as string);
    //   }
    //   return a;
    // })
    return _analysis;
  } catch (error) {
    return sendError(
      e,
      createError({
        statusCode: 500,
        statusMessage:
          error instanceof Error ? error.message : "something went wrong!",
      })
    );
  }

  //   return JSON.parse(_analysis[0].analysis);
});
