import type { Question } from "~~/shared/types";
import { isEmptyObject } from "~/utils";

export const useQuestionsStore = defineStore("questions", () => {
  const selectedProductId = ref<number>();

  const { data: questions } = useFetch<Question[]>("/api/question", {
    query: {
      product: selectedProductId,
    },
    immediate: false,
    watch: [selectedProductId],
  });
  return { selectedProductId, questions };
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useQuestionsStore, (import.meta as any).hot)
  );
}
