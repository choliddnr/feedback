<script setup lang="ts">
const id = useRoute().params.id;
const { productQuesions: questions, currentProduct } = storeToRefs(
  useQuestionsStore()
);
currentProduct.value = id as string;
// watchEffect(() => {
//   console.log("ps", questions.value);
// });
const numberOfQuestions = computed<number>(() => questions.value.length);

const currentState = ref<number>(0);
const answers = ref<any>([]);
const unwatch = watch(numberOfQuestions, () => {
  if (numberOfQuestions.value > 0) {
    for (let i = 0; i < numberOfQuestions.value; i++) {
      answers.value[i] = undefined;
    }
    unwatch();
  }
});

const count = ref(0);
onMounted(() => {});
</script>
<template>
  <div class="bg-[url('/assets/img/2.jpg')] bg-cover bg-center">
    <UContainer
      :ui="{ constrained: 'max-w-4xl', base: 'h-screen content-center' }"
    >
      <UCard :ui="{ background: 'backdrop-blur-sm bg-white/60' }">
        <UFormGroup :ui="{ label: { base: 'text-2xl mb-2' } }">
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
            variant="soft"
          />
          <UButton
            color="primary"
            block
            icon="i-heroicons-arrow-right"
            @click="currentState++"
            :disabled="currentState === answers.length - 1"
            variant="soft"
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
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
