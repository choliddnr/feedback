export default defineEventHandler(async (e) => {
  return await clearUserSession(e);
});
