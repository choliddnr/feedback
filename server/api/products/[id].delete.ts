export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, "id"));
  try {
    const product = await db(e)
      .select()
      .from(products)
      .where(eq(products.id, id))
      .get();
    if (!product)
      return sendError(
        e,
        createError({ statusCode: 404, statusMessage: "product not found" })
      );

    await deleteImg(e, product.image);

    return await db(e).delete(products).where(eq(products.id, id));
  } catch (err) {
    return sendError(
      e,
      createError({ statusCode: 500, statusMessage: "Unknown Error - " + err })
    );
  }
});
