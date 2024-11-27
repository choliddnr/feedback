// import { defineStore, acceptHMRUpdate } from "pinia";
import type { Merchant, Product, Respondent, Question } from "~~/shared/types";
import { isEmptyObject } from "~/utils";

export const useFeedbackStore = defineStore("feedback", () => {
  const { $pb } = useNuxtApp();
  /**
   * Merchant
   */
  const merchantId = ref<string>();
  const { data: merchant } = useAsyncData<Merchant>(
    async () => {
      const records = await $pb
        .collection("merchant")
        .getOne(merchantId.value!, { expand: `greeting` });
      console.log("fetch merchant", records.id);
      return structuredClone(records) as unknown as Merchant;
    },
    {
      watch: [merchantId],
    }
  );

  /**
   * Peoducts
   */
  const { data: products } = useAsyncData<Product[]>(
    async () => {
      console.log("fetch products", merchant.value);
      if (!merchant.value?.id) return [];
      const records = await $pb
        .collection("products")
        .getFullList({ filter: `merchant='${merchantId.value}'` });

      return structuredClone(records) as unknown as Product[];
    },
    { watch: [merchant], immediate: false }
  );
  const selectedProducts = ref<string[]>([]);
  if (import.meta.client) {
    if (localStorage.getItem(merchant.value?.id + "_selectedProducts")) {
      selectedProducts.value = JSON.parse(
        localStorage.getItem(merchant.value?.id + "_selectedProducts")!
      );
    }
  }
  const productsMap = computed(() => {
    if (!products.value) return new Map();
    return new Map(products.value!.map((p) => [p.id, p]));
  });
  //   watch(selectedProducts, () => {
  //     console.log("sp", selectedProducts.value);
  //   });

  /**
   * Respondent
   */

  const respondent = ref<Respondent>();

  /**
   * Questions
   */

  const currentProductIndex = ref<number>(0);
  const currentQuestionIndex = ref<number>(0);
  const currentProductId = computed<string>(
    () => selectedProducts.value[currentProductIndex.value] as string
  );

  const selectedProductsQuery = computed(() => {
    let q = "(";
    for (let i = 0, len = selectedProducts.value.length; i < len; i++) {
      q = q + `product='${selectedProducts.value[i]}'`;
      if (i + 1 !== len) q = q + `||`;
    }
    q = q + `)`;
    console.log("q", q);
    // return JSON.stringify(selectedProducts.value);
    return q;
  });

  // const { data: questions } = useFetch<Question[]>("/api/questions", {
  //   query: { selectedProducts: selectedProductsQuery },
  // });
  //   const questions = ref<Question[]>([]);
  //   const { execute: fetchQuestions } = useFetch<Question[]>(
  //     `collections/questions/records`,
  //     {
  //       baseURL: pbApi,
  //       query: { filter: selectedProductsQuery },
  //       onResponse: ({ response }) => {
  //         questions.value = response._data.items;
  //       },
  //       immediate: false,
  //     }
  //   );

  const { data: questions, execute: fetchQuestions } = useAsyncData<Question[]>(
    async () => {
      const records = await $pb
        .collection("questions")
        .getFullList({ filter: selectedProductsQuery.value });
      return structuredClone(records) as unknown as Question[];
    },
    {
      immediate: false,
    }
  );

  const productsQuestions = computed<{ [key: string]: Question[] }>(() => {
    if (!questions.value || !selectedProducts.value) return {};
    const data: { [key: string]: Question[] } = {};
    for (let i = 0, len = selectedProducts.value.length; i < len; i++) {
      const key = selectedProducts.value[i] as string;
      data[key] = questions.value.filter((q) => q.product === key);
    }
    return data;
  });
  const totalQuestions = computed<number>(() => {
    let count = 0;
    if (!isEmptyObject(productsQuestions.value)) {
      for (let key in productsQuestions.value) {
        count = count + (productsQuestions.value[key]?.length || 0);
      }
    }

    return count;
  });

  const productQuestions = computed<Question[]>(
    () => productsQuestions.value[currentProductId.value] || []
  );

  const currentQuestionId = computed<string>(
    () => productQuestions.value[currentQuestionIndex.value]?.id || ""
  );

  const lastQuestionsIndex = ref<number[]>([]);
  for (let i = 0; i < selectedProducts.value.length; i++) {
    lastQuestionsIndex.value[i] = 0;
  }

  //   return {
  //     questions,
  //     currentProductIndex,
  //     currentProductId,
  //     productsQuestions,
  //     productQuestions,
  //     currentQuestionIndex,
  //     currentQuestionId,
  //     lastQuestionsIndex,
  //     totalQuestions,
  //     // fetchQuestions,
  //   };

  return {
    merchantId,
    merchant,
    products,
    productsMap,
    selectedProducts,
    respondent,
    questions,
    currentProductIndex,
    currentProductId,
    productsQuestions,
    productQuestions,
    currentQuestionIndex,
    currentQuestionId,
    lastQuestionsIndex,
    totalQuestions,
    fetchQuestions,
  };
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useFeedbackStore, (import.meta as any).hot)
  );
}
