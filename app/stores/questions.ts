import { defineStore, acceptHMRUpdate, skipHydrate } from "pinia";
import type { Question } from "~/types";

export const useQuestionsStore = defineStore("questions", () => {
  const { selectedProducts } = storeToRefs(useProductsStore());
  const currentProductIndex = ref<number>(0);
  const currentQuestionIndex = ref<number>(0);
  const currentProductId = computed<string>(
    () => selectedProducts.value[currentProductIndex.value] as string
  );

  const selectedProductsQuery = computed(() =>
    JSON.stringify(selectedProducts.value)
  );

  const { data: questions } = useFetch<Question[]>("/api/questions", {
    query: { selectedProducts: selectedProductsQuery },
  });

  const productsQuestions = computed<{ [key: string]: Question[] }>(() => {
    if (!questions.value || !selectedProducts.value) return {};
    const data: { [key: string]: Question[] } = {};
    for (let i = 0, len = selectedProducts.value.length; i < len; i++) {
      const key = selectedProducts.value[i] as string;
      data[key] = questions.value.filter((q) => q.product === key);
    }
    return data;
  });

  const productQuestions = computed<Question[]>(
    () => productsQuestions.value[currentProductId.value] || []
  );

  const currentQuestionId = computed<string>(
    () => productQuestions.value[currentQuestionIndex.value]?.id || ""
  );

  const lastQuestionsIndex = ref<number[]>([]);
  for (let i = 0; i < selectedProducts.value.length; i++) {
    lastQuestionsIndex.value[i] = 0;
  }

  return {
    questions,
    currentProductIndex,
    currentProductId,
    productsQuestions,
    productQuestions,
    currentQuestionIndex,
    currentQuestionId,
    lastQuestionsIndex,
  };
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useQuestionsStore, (import.meta as any).hot)
  );
}
