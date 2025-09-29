import type { Kpi, Product } from "~~/shared/types";

const _useDashboard = () => {
  const route = useRoute();
  const router = useRouter();
  const kpis = ref<Kpi[]>([]);
  // const products = ref<ProductStat[]>([]);
  const loading = ref(true);

  // const analysis = ref<any[]>([]);

  async function fetchData() {
    loading.value = true;
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // console.log("active", active_merchant.value);

    // const { data: _analysisResult } = await useFetch<
    //   { products: Product; analysis: { analysis: string } }[]
    // >(() => "/api/analysis/merchant/" + active_merchant.value, {
    //   onResponse: ({ response }) => {
    //     console.log("on Response", response._data);
    //   },
    //   onRequest: ({ request }) => {
    //     console.log("on Request", request);
    //   },
    // });

    kpis.value = [
      { label: "Total Responses", value: "1,248" },
      { label: "Unique Respondents", value: "980" },
      { label: "Average Rating", value: "⭐ 4.2 / 5" },
      { label: "Response Rate", value: "42%", class: "text-blue-600" },
      { label: "Completion Rate", value: "85%", class: "text-green-600" },
    ];

    // for (const item of _analysisResult.value || []) {
    //   const data = {
    //     name: `🔥 ${item.products.title}`,
    //     avgRating: item.analysis
    //       ? JSON.parse(item.analysis.analysis).analysis.average_rating
    //       : 0,
    //     sentiment: item.analysis
    //       ? JSON.parse(item.analysis.analysis).sentiment
    //       : { positive: 0, neutral: 0, negative: 0 },
    //     nps: item.analysis ? JSON.parse(item.analysis.analysis).nps : 0,
    //     summary: item.analysis
    //       ? JSON.parse(item.analysis.analysis).summary
    //       : "",
    //     themes: item.analysis ? JSON.parse(item.analysis.analysis).themes : [],
    //     quote: item.analysis
    //       ? (JSON.parse(item.analysis.analysis).highlight || []).length > 0
    //         ? JSON.parse(item.analysis.analysis).highlight[0]
    //         : ""
    //       : "",
    //   };
    //   analysis.value.push(data);
    //   console.log("push", data);
    // }
    // products.value = [
    //   {
    //     name: "🔥 Hot Noodles",
    //     avgRating: 4.3,
    //     sentiment: { positive: 65, neutral: 20, negative: 15 },
    //     nps: 52,
    //     summary:
    //       "Customers love the spicy flavor and portion size. Some complain about packaging leakage.",
    //     themes: [
    //       "Taste → 80% positive",
    //       "Packaging → 45% negative",
    //       "Price → 70% positive",
    //     ],
    //     quote: "“The noodles are delicious, but the cup leaks sometimes.”",
    //   },
    //   {
    //     name: "🔥 Jebew Noodles",
    //     avgRating: 4.9,
    //     sentiment: { positive: 70, neutral: 25, negative: 5 },
    //     nps: 52,
    //     summary:
    //       "Customers love the spicy flavor and portion size. Some complain about packaging leakage.",
    //     themes: [
    //       "Taste → 80% positive",
    //       "Packaging → 45% negative",
    //       "Price → 70% positive",
    //     ],
    //     quote: "“The noodles are delicious, but the cup leaks sometimes.”",
    //   },
    // ];
    loading.value = false;
  }

  onMounted(fetchData);

  defineShortcuts({
    // 'g-h': () => router.push('/'),
    // 'g-i': () => router.push('/inbox'),
    // 'g-u': () => router.push('/users'),
    // 'g-s': () => router.push('/settings'),

    "g-r": () => router.push("/admin/responses"),
    // "?": () => (isHelpSlideoverOpen.value = true),
  });

  watch(
    () => route.fullPath,
    () => {
      // isHelpSlideoverOpen.value = false;
    }
  );

  return {
    kpis,
  };
};

export const useDashboard = createSharedComposable(_useDashboard);
