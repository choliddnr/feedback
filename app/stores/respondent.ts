import { defineStore, acceptHMRUpdate, skipHydrate } from "pinia";
import { useStorage } from "@vueuse/core";
import type { Respondent } from "~/types";

export const useRespondentStore = defineStore("respondent", () => {
  const respondent = ref<Respondent>();

  if (import.meta.client) {
    if (localStorage.getItem("respondent")) {
      respondent.value = JSON.parse(localStorage.getItem("respondent")!);
    }
  }
  return { respondent: skipHydrate(respondent) };
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useRespondentStore, (import.meta as any).hot)
  );
}
