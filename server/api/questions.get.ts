export default defineEventHandler(async (event) => {
  const selectedProducts = JSON.parse(
    getQuery(event).selectedProducts as string
  ) as string[];
  console.log("server questions!", selectedProducts);

  const questions = [
    {
      q: "how do you feel?",
      type: "textarea",
      options: ["makan", "minum", "tidur"],
      product: "",
    },
    {
      q: "how do you do?",
      type: "textarea",
      options: ["sekolah", "kerja", "nganggur"],
      product: "",
    },
    {
      q: "Are you okey?",
      type: "textarea",
      options: ["yes", "no", "i think so"],
      product: "",
    },
  ];
  const data = [];
  for (let i = 0; i < selectedProducts.length; i++) {
    for (let j = 0; j < questions.length; j++) {
      data.push({
        ...questions[j],
        product: selectedProducts[i],
        id: `${selectedProducts[i]}-${j}`,
      });
    }
  }
  return data;
  // return selectedProducts;
});
