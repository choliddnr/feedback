import { defineStore, acceptHMRUpdate } from "pinia";
import type { Question } from "~~/shared/types";

export const useQuestionsStore = defineStore("questions", () => {
  const { active_product } = storeToRefs(useProductsStore());
  const questions = ref<Question[]>([]);
  const { refresh: fetch } = useLazyFetch(
    () => `/api/questions/${active_product.value}`,
    {
      immediate: true,
      watch: [active_product],
      onRequest: ({ request }) => {},
      onResponse: ({ response }) => {
        if (response.ok) {
          questions.value = response._data;
        }
      },
    }
  );
  return { questions, fetch };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useQuestionsStore, import.meta.hot));
}
