import { deleteImg } from "~~/server/utils/image";

export default defineEventHandler(async (e) => {
  const src = e.context.params!.src; //getRouterParam(e, "src");
  return await deleteImg(e, src!);
});
