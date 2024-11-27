import { type Merchant } from "~~/shared/types";

export const useMerchantStore = defineStore("merchant", () => {
  const { $pb } = useNuxtApp();
  const { user } = storeToRefs(useUserStore());
  const activeMerchant = ref<string>(user.value.default_merchant);
  const merchant = computed<Merchant | undefined>(() => {
    if (!merchants.value || merchants.value.length === 0) return;
    for (let i = 0, len = merchants.value?.length || 0; i < len; i++) {
      if (merchants.value[i]?.id === activeMerchant.value)
        return merchants.value[i];
    }
    return;
  });
  const { data: merchants } = useAsyncData<Merchant[]>(
    async () => {
      const records = await $pb
        .collection("merchant")
        .getFullList({ filter: `owner='${user.value.id}'` });
      return structuredClone(records) as unknown as Merchant[];
    },
    {
      watch: [user],
    }
  );
  return { activeMerchant, merchant, merchants };
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useMerchantStore, (import.meta as any).hot)
  );
}
