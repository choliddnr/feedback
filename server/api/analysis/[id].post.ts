export default defineEventHandler(async (e) => {
  const body = (await readBody(e)) as { data: string };
  const id = Number(getRouterParam(e, "id"));
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID is required",
    });
  }

  // return { body: body.data };
  try {
    const currentAnalysis = await db(e)
      .select()
      .from(analysis)
      .where(eq(analysis.product, id))
      .limit(1);
    if (currentAnalysis.length > 0) {
      // If analysis already exists, update it
      return await db(e)
        .update(analysis)
        .set({ analysis: body.data })
        .where(eq(analysis.product, id))
        .returning();
    }
    return await db(e)
      .insert(analysis)
      .values({ product: id, analysis: body.data })
      .returning();
  } catch (err) {
    return sendError(
      e,
      createError({
        statusCode: 500,
        statusMessage: err instanceof Error ? err.message : "Unknown error",
      })
    );
  }
});
