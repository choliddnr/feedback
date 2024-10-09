<script setup lang="ts">
import { ClientOnly } from "#components";
import { useStorage } from "@vueuse/core";
const { products, selectedProducts } = storeToRefs(useProductsStore());
// const respondent = useStorage("respondent", );
const state = ref<{ [key: string]: boolean }>({});
// products.value?.forEach((v) => (state.value[v.id!] = false));

const selectedProductsSet = computed(() => new Set(selectedProducts.value));

const { respondent } = storeToRefs(useRespondentStore());
const { currentProductIndex } = storeToRefs(useQuestionsStore());
// watchEffect(()=>{
//   console.log(respondent.value);

// })

const setState = () => {
  for (let i = 0, len = products.value.length; i < len; i++) {
    const id = products.value[i]?.id;
    state.value[id!] = selectedProductsSet.value.has(id!); // Direct boolean assignment
  }
};
if (products.value.length > 0) {
  setState();
} else {
  const unwatch = watch(products, () => {
    if (products.value.length > 0) {
      setState();
      unwatch();
    }
  });
}
onMounted(() => {});

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
    "selectedProducts",
    JSON.stringify(selectedProducts.value)
  );
  currentProductIndex.value = 0;
  useRouter().push(`/questions`);
};
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
          :src="'/assets/img/' + product.image"
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
    />
    <!-- <pre>{{ products }}</pre> -->

    <!-- <UFormGroup :ui="{ label: { base: 'text-2xl mb-2' } }">
          <template #label>
            <span>{{ questions[currentState]?.q }}</span>
          </template>
          <UTextarea
            v-if="questions[currentState]?.type === 'textarea'"
            size="xl"
            variant="outline"
            placeholder="Search..."
            v-model="answers[currentState]"
            :ui="{
              variant: { outline: 'ring-2 focus:ring-2 focus:border-b-4' },
            }"
          />
        </UFormGroup>
        <div class="flex flex-row gap-1 my-2">
          <UButton
            v-for="(opt, index) in questions[currentState]?.options"
            :label="opt"
            color="white"
            :ui="{ rounded: 'rounded-full' }"
            @click="answers[currentState] = opt"
          />
        </div>
        <UButtonGroup size="md" orientation="horizontal" class="w-1/2 my-3">
          <UButton
            color="primary"
            block
            icon="i-heroicons-arrow-left"
            @click="currentState--"
            :disabled="currentState === 0"
          />
          <UButton
            color="primary"
            block
            icon="i-heroicons-arrow-right"
            @click="currentState++"
            :disabled="currentState === answers.length - 1"
          />
        </UButtonGroup>
        <br />

        <div class="flex flex-row gap-1">
          <UButton
            v-for="(answer, index) in answers"
            :ui="{ block: 'w-8' }"
            :variant="
              currentState === index ? 'outline' : answer ? 'solid' : 'soft'
            "
            @click="currentState = index"
            block
            >{{ index }}</UButton
          >
        </div> -->
  </UCard>
</template>
