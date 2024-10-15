import { defineStore, acceptHMRUpdate, skipHydrate } from "pinia";
import type { Respondent } from "~/types";

export const useRespondentStore = defineStore("respondent", () => {
  return {};
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useRespondentStore, (import.meta as any).hot)
  );
}
