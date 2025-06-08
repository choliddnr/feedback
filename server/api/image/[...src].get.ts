import { getImg } from "~~/server/utils/image";

export default defineEventHandler(async (e) => {
  const src = e.context.params!.src; //getRouterParam(e, "src");
  if (!src) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image source not provided",
    });
  }

  try {
    const response = await getImg(e, src);
    setHeader(
      e,
      "Content-Type",
      response!.ContentType || "application/octet-stream"
    );
    setHeader(e, "Content-Length", response!.ContentLength || 0);
    return sendStream(e, response!.Body as ReadableStream);
  } catch (error) {
    console.error("get image error:", error);
    return sendError(
      e,
      createError({
        statusCode: 500,
        statusMessage:
          error instanceof Error ? error.message : "get image error",
      })
    );
  }
});
