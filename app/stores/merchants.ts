import { defineStore, acceptHMRUpdate } from "pinia";
import type { Merchant } from "~~/shared/types";

export const useMerchantsStore = defineStore("merchants", () => {
  const active_merchant = ref<number>();
  const { data: merchants, execute: fetch } =
    useFetch<Merchant[]>("/api/merchants");
  return { merchants, active_merchant, fetch };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMerchantsStore, import.meta.hot));
}
