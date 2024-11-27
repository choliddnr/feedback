import type { Question } from "~~/shared/types";
import { isEmptyObject } from "~/utils";

export const useQuestionsStore = defineStore("questions", () => {
  const { $pb } = useNuxtApp();
  const selectedProductId = ref<string>();
  const questions = ref<Question[]>();
  useAsyncData(
    `questions${selectedProductId.value}`,
    async () => {
      if (!selectedProductId.value) return;
      questions.value = await $pb
        .collection("questions")
        .getFullList({ filter: `product='${selectedProductId.value}'` });
    },
    {
      watch: [selectedProductId],
    }
  );
  return { selectedProductId, questions };
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useQuestionsStore, (import.meta as any).hot)
  );
}
