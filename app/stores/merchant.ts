import { type Merchant } from "~~/shared/types";
import { useUserStore } from "./user";

export const useMerchantStore = defineStore("merchant", () => {
  const { user } = storeToRefs(useUserStore());
  const activeMerchant = ref<number>();
  const merchant = computed<Merchant | undefined>(() => {
    if (!merchants.value || merchants.value.length === 0) return;
    for (let i = 0, len = merchants.value?.length || 0; i < len; i++) {
      if (merchants.value[i]?.id === activeMerchant.value)
        return merchants.value[i];
    }
  });
  const { data: merchants, execute } = useFetch<Merchant[]>("/api/merchant", {
    immediate: false,
    watch: [user],
  });
  return { activeMerchant, merchant, merchants };
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useMerchantStore, (import.meta as any).hot)
  );
}
