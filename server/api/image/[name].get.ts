import { userPictureStorage } from "../../utils/userPictureStorage";
export default defineEventHandler(async (e) => {
  const name = getRouterParam(e, "name");
  return await userPictureStorage.getItemRaw(name || "");
});
