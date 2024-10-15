import { defineStore, acceptHMRUpdate, skipHydrate } from "pinia";
import type { Question } from "~/types";
import { isEmptyObject } from "~/utils";

export const useQuestionsStore = defineStore("questions", () => {
  return {};
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useQuestionsStore, (import.meta as any).hot)
  );
}
