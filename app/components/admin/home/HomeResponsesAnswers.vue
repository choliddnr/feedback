<script setup lang="ts">
type ResponseData = {
  product: string;
  question: string;
  type: string;
  answer: string;
};
const props = defineProps<{
  response_id: number;
  respondent: string;
}>();

const emit = defineEmits<{ close: [boolean] }>();
const { data } = await useFetch(
  "/api/statistics/answers/" + props.response_id,
  {
    transform: (
      data: {
        product: string;
        question: string;
        type: string;
        answer: string;
      }[]
    ) => {
      const res: {
        [key: string]: ResponseData[];
      } = {};
      data.forEach((d) => {
        res[d.product] = res[d.product]
          ? (res[d.product] as ResponseData[])
          : ([] as ResponseData[]);
        res[d.product]!.push({ ...d })!;
      });
      return res;
    },
  }
);
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    :title="`Response by ${respondent}`"
    :ui="{ body: 'text-center justify-items-center gap-4' }"
    fullscreen
  >
    <template #body>
      <UPageCard v-for="product_group in data" class="my-5">
        <template #header>
          <h1
            class="text-xl text-center font-bold text-decoration-underline flex"
          >
            {{ product_group[0]!.product }}
          </h1>
        </template>
        <USeparator />
        <div v-for="response in product_group">
          <p class="text-lg">Q: {{ response.question }}</p>
          <p v-if="response.type === 'text'" class="font-bold text-lg">
            A: {{ response.answer }}
          </p>
          <p v-if="response.type === 'rating'" class="flex gap-3 text-warning">
            <svg
              v-for="index in Number(response.answer)"
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.56.56 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.56.56 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.56.56 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.56.56 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.56.56 0 0 0 .475-.345z"
              />
            </svg>
          </p>
        </div>
      </UPageCard>
    </template>
  </UModal>
</template>
