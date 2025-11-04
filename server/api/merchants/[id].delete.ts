export default defineEventHandler(async (e) => {
  const id = getRouterParam(e, "id");
  try {
    const session = await _auth(e).api.getSession({
      headers: e.headers,
    });

    const userid = session?.user.id;
    const all_merchant = await db(e)
      .select()
      .from(merchants)
      .where(eq(merchants.owner, Number(userid)));

    // .where(eq(merchants.id, Number(id)))
    const merchant = all_merchant.find((m) => m.id === Number(id));
    if (!merchant) {
      return sendError(
        e,
        createError({
          statusCode: 404,
          statusMessage: "Merchant not found",
        })
      );
    }
    if (all_merchant.length === 1) {
      return sendError(
        e,
        createError({
          statusCode: 403,
          statusMessage: "you must have at least one merchant",
        })
      );
    }

    if (merchant.logo !== null) await deleteImg(e, merchant.logo);

    const deleted = await db(e)
      .delete(merchants)
      .where(eq(merchants.id, Number(id)));

    const other_merchants = all_merchant.filter((m) => m.id !== Number(id));
    await db(e)
      .update(user)
      .set({ defaultMerchant: Number(other_merchants[0].id) })
      .where(eq(user.id, Number(userid)));

    return deleted;
  } catch (err) {
    return sendError(
      e,
      createError({
        statusCode: 500,
        statusMessage:
          err instanceof Error ? err.message : "Something went wrong",
      })
    );
  }
});
