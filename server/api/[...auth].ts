import { auth } from "../utils/auth"; // path to your auth file

export default defineEventHandler((e) => {
  return auth(e).handler(toWebRequest(e));
});
