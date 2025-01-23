export default defineEventHandler(async (e) => {
  const id = getRouterParam(e, "id");
  const formData = await readFormData(e);
  console.log("fd", formData);

  return { formData: formData, id: id };
});
