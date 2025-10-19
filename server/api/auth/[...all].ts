export default defineEventHandler((e) => {
  return _auth(e).handler(toWebRequest(e)) as any;
});
