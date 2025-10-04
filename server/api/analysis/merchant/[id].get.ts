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
    const raw_analysis = await db(e)
      .select()
      .from(products)
      .where(eq(products.merchant, id))
      .leftJoin(analysis, eq(analysis.product, products.id))
      .innerJoin(
        products_to_responses,
        eq(products_to_responses.product_id, products.id)
      );

    // const an =_analysis.map((a) => {
    //   if (a.analysis) {
    //     a["n"] = JSON.parse(a.analysis as unknown as string);
    //   }
    //   return a;
    // })
    const _analysis = Object.values(
      raw_analysis.reduce((acc, row) => {
        const pid = row.products.id;
        if (!acc[pid]) {
          acc[pid] = {
            products: row.products,
            products_to_responses: [],
            analysis: row.analysis,
          };
        }
        if (row.products_to_responses.createdAt! > row.analysis?.createdAt!) {
          acc[pid].products_to_responses.push(row.products_to_responses);
        }
        return acc;
      }, {} as Record<number, any>)
    );
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
