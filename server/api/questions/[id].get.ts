export default defineEventHandler(async (e) => {
  // const selectedProducts = JSON.parse(
  //   getQuery(e).selectedProducts as string
  // ) as string[];
  const product_id = getRouterParam(e, "id");
  // const questions = [
  //   {
  //     q: "how do you feel?",
  //     type: "textarea",
  //     options: ["makan", "minum", "tidur"],
  //     product: "",
  //   },
  //   {
  //     q: "how do you do?",
  //     type: "textarea",
  //     options: ["sekolah", "kerja", "nganggur"],
  //     product: "",
  //   },
  //   {
  //     q: "Are you okey?",
  //     type: "textarea",
  //     options: ["yes", "no", "i think so"],
  //     product: "",
  //   },
  // ];
  // const data = [];
  // for (let i = 0; i < selectedProducts.length; i++) {
  //   for (let j = 0; j < questions.length; j++) {
  //     data.push({
  //       ...questions[j],
  //       product: selectedProducts[i],
  //       id: `${selectedProducts[i]}-${j}`,
  //     });
  //   }
  // }
  return await db
    .select()
    .from(questions)
    .where(eq(questions.product, Number(product_id)));
  // return selectedProducts;
});
