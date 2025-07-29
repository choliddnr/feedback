import { saveImg } from '~~/server/utils/image';

export default defineEventHandler(async (e) => {
  const src = e.context.params!.src; // getRouterParam(e, "src");
  const formdata = await readFormData(e);
  const file = formdata.get('image') as File | undefined;
  return await saveImg(e, file!, src!);
});
