export default defineEventHandler(async (e) => {
  const url = getRequestURL(e);
  if (
    url.pathname.startsWith("/api/merchants") ||
    url.pathname.startsWith("/api/products") ||
    url.pathname.startsWith("/api/questions") ||
    url.pathname.startsWith("/api/statistics") ||
    url.pathname.startsWith("/api/user")
  ) {
    const session = await auth(e).api.getSession({
      headers: e.headers,
    });
    if (!session) {
      return sendError(
        e,
        createError({ statusCode: 401, statusMessage: "Unauthorized" })
      );
    }
  }
  return;
});
