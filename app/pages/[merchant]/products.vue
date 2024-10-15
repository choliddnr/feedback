<script setup lang="ts">
import { ClientOnly } from "#components";

const { products, selectedProducts } = storeToRefs(useFeedbackStore());
const { fetchQuestions } = useFeedbackStore();
const pbApi = useRuntimeConfig().public.pocketbaseApi as string;
// const respondent = useStorage("respondent", );
const state = ref<{ [key: string]: boolean }>({});
// products.value?.forEach((v) => (state.value[v.id!] = false));

const selectedProductsSet = computed(() => new Set(selectedProducts.value));

const { respondent } = storeToRefs(useFeedbackStore());
const { currentProductIndex } = storeToRefs(useFeedbackStore());
const { merchant } = storeToRefs(useFeedbackStore());
// watchEffect(()=>{
//   console.log(respondent.value);

// })

const setState = () => {
  for (let i = 0, len = products.value!.length; i < len; i++) {
    const id = products.value![i]?.id;
    state.value[id!] = selectedProductsSet.value.has(id!); // Direct boolean assignment
  }
};
if (products.value!.length > 0) {
  setState();
} else {
  const unwatch = watch(products, () => {
    if (products.value!.length > 0) {
      setState();
      unwatch();
    }
  });
}
onMounted(() => {});
const allowToSubmit = ref<boolean>(false);

const onSubmit = () => {
  for (let key in state.value) {
    if (state.value[key] && !selectedProductsSet.value.has(key))
      selectedProducts.value.push(key);

    if (!state.value[key] && selectedProductsSet.value.has(key)) {
      const index = selectedProducts.value.indexOf(key);
      selectedProducts.value.splice(index, 1);
    }
  }
  localStorage.setItem(
    merchant.value?.id + "_selectedProducts",
    JSON.stringify(selectedProducts.value)
  );
  fetchQuestions();
  currentProductIndex.value = 0;
  useRouter().push(`/${merchant.value?.id}/questions`);
};
watch(
  state,
  () => {
    for (let key in state.value) {
      if (state.value[key]) {
        allowToSubmit.value = true;
        return;
      }
    }
    allowToSubmit.value = false;
  },
  { deep: true, immediate: true }
);
</script>
<template>
  <UCard
    :ui="{ background: 'backdrop-blur-sm bg-white/80' }"
    class="w-full md:w-2/3"
  >
    <div class="font-bold text-center mb-3 text-xl">
      <ClientOnly>
        <p>
          {{ respondent?.name || "" }}, Silahkan pilih produk yang akan anda
          berikan feedback.
        </p>
      </ClientOnly>
    </div>
    <div class="flex flex-col gap-4">
      <div v-for="product in products" class="flex flex-row gap-4 items-center">
        <UCheckbox
          :ui="{
            border: ' border-primary-300 dark:border-primary-700 border-2',
            base: 'w-6 h-6',
          }"
          v-model="state[product.id!]"
        />
        <NuxtImg
          :src="`${pbApi}/api/files/products/${product.id}/${product.images![0]}`"
          height="100px"
          width="100px"
        />
        <div class="flex flex-col gap-2">
          <span class="text-xl font-bold">{{ product.title }}</span>
          <span>{{ product.description }}</span>
        </div>
      </div>
    </div>
    <UButton
      label="Selanjutnya"
      size="xl"
      class="mt-4"
      block
      @click="onSubmit"
      :color="allowToSubmit ? 'primary' : 'gray'"
      :disabled="!allowToSubmit"
    />
    <!-- <pre>{{ state }}</pre> -->
  </UCard>
</template>
