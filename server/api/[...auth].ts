import { auth } from "../utils/auth"; // path to your auth file

export default defineEventHandler((e) => {
  const _auth = auth(e).handler(toWebRequest(e)) as any;

  return _auth;
});
