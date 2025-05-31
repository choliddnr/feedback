import { Merchant } from "~~/shared/types";

export default defineEventHandler(async (e) => {
  const slug = await $fetch<Merchant[]>(
    "/api/merchants/slug/merchant-demo-xxx",
    {
      headers: e.headers,
    }
  );
  if (slug.length > 0) {
    return sendError(
      e,
      createError({
        statusCode: 422,
        statusMessage: "slug is already taken",
        data: slug,
      })
    );
  }
  return slug;
});
