export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const id = Number(getRouterParam(e, 'id'));
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    });
  }
  console.log(id);

  // return { body: body.data };
  try {
    const currentAnalysis = await db(e)
      .select()
      .from(analysis)
      .where(eq(analysis.merchant, id))
      .limit(1);
    if (currentAnalysis.length > 0) {
      // If analysis already exists, update it
      return await db(e)
        .update(analysis)
        .set({ analysis: body.data })
        .where(eq(analysis.merchant, id))
        .returning();
    }
    return await db(e)
      .insert(analysis)
      .values({ merchant: id, analysis: body.data })
      .returning();
  } catch (e) {
    throw createError(e instanceof Error ? e.message : 'Unknown error');
  }
});
