<script setup lang="ts">
const { $pb } = useNuxtApp();
const { activeMerchant, merchant, merchants } = storeToRefs(useMerchantStore());

// const merchantList = ref<
//   {
//     label: string;
//     avatar: {
//       src: string;
//     };
//     click: (...args: any[]) => void;
//   }[]
// >([
//   //   {
//   //     label: "Nuxt",
//   //     avatar: {
//   //       src: "https://avatars.githubusercontent.com/u/23360933?s=200&v=4",
//   //     },
//   //     click: () => {
//   //       activeMerchant.value = merchants.value?.[0]?.id!;
//   //     },
//   //   },
//   //   {
//   //     label: "NuxtLabs",
//   //     avatar: {
//   //       src: "https://avatars.githubusercontent.com/u/62017400?s=200&v=4",
//   //     },
//   //     click: () => {
//   //       activeMerchant.value = merchants.value?.[1]?.id!;
//   //     },
//   //   },
// ]);

// watch(merchants, () => {
//   console.log("watching", merchants.value);

//   if (merchants.value?.length! > 0) {
//     for (let i = 0, len = merchants.value?.length || 0; i < len; i++) {
//       merchantList.value.push({
//         label: merchants.value?.[i]?.title!,
//         avatar: {
//           src: $pb.files.getURL(
//             merchants.value?.[i]!,
//             merchants.value?.[i]?.logo!
//           ),
//         },
//         click: () => {
//           activeMerchant.value = merchants.value?.[i]?.id!;
//         },
//       });
//     }
//   }
// });

const merchantList = computed<
  {
    id: string;
    label: string;
    avatar?: {
      src: string;
    };
    click?: (...args: any[]) => void;
  }[]
>(() => {
  if (merchants.value?.length! === 0) return [];
  const theMerchants = [];

  for (let i = 0, len = merchants.value?.length || 0; i < len; i++) {
    theMerchants.push({
      id: merchants.value?.[i]?.id!,
      label: merchants.value?.[i]?.title!,
      avatar: {
        src: $pb.files.getURL(
          merchants.value?.[i]!,
          merchants.value?.[i]?.logo!
        ),
      },
      click: () => {
        activeMerchant.value = merchants.value?.[i]?.id!;
        selectectedMerchant.value = merchantList.value[i];
      },
    });
  }
  return theMerchants;
});

const actions = [
  {
    label: "Create Merchant",
    icon: "i-heroicons-plus-circle",
  },
  {
    label: "Manage Merchant",
    icon: "i-heroicons-cog-8-tooth",
  },
];

const selectectedMerchant = ref();
watchEffect(() => {
  if (!activeMerchant.value || !merchantList.value) return;
  console.log(
    "watch active merchant",
    activeMerchant.value,
    merchantList.value
  );
  for (let i = 0, len = merchantList.value.length; i < len; i++) {
    if (merchantList.value[i]?.id === activeMerchant.value) {
      selectectedMerchant.value = merchantList.value[i];
      break;
    }
  }
});
</script>

<template>
  <UDropdown
    v-if="merchantList.length > 0"
    v-slot="{ open }"
    mode="hover"
    :items="[merchantList, actions]"
    class="w-full"
    :ui="{ width: 'w-full' }"
    :popper="{ strategy: 'absolute' }"
  >
    <UButton
      color="gray"
      variant="ghost"
      :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      class="w-full"
    >
      <UAvatar :src="selectectedMerchant?.avatar!.src" size="2xs" />

      <span class="truncate text-gray-900 dark:text-white font-semibold">{{
        selectectedMerchant?.label
      }}</span>
    </UButton>
    {{}}
  </UDropdown>
</template>
