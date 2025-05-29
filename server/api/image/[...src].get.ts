import { getImg } from "~~/server/utils/image";

export default defineEventHandler(async (e) => {
  const src = e.context.params!.src; //getRouterParam(e, "src");
  if (!src) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image source not provided",
    });
  }
  return await getImg(e, src!);
});
