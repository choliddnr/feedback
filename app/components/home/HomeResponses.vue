<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Period, Range, ResponseTable } from "~~/shared/types";
import { LazyHomeResponsesAnswers } from "#components";

const props = defineProps<{
  period: Period;
  range: Range;
}>();

const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UButton = resolveComponent("UButton");
const toast = useToast();

const { active_merchant } = storeToRefs(useMerchantsStore());

// const sampleEmails = [
//   "james.anderson@example.com",
//   "mia.white@example.com",
//   "william.brown@example.com",
//   "emma.davis@example.com",
//   "ethan.harris@example.com",
// ];

// const { data } = await useAsyncData('sales', async () => {
//   const sales: Sale[] = []
//   const currentDate = new Date()

//   for (let i = 0; i < 5; i++) {
//     const hoursAgo = randomInt(0, 48)
//     const date = new Date(currentDate.getTime() - hoursAgo * 3600000)

//     sales.push({
//       id: (4600 - i).toString(),
//       date: date.toISOString(),
//       status: randomFrom(['paid', 'failed', 'refunded']),
//       email: randomFrom(sampleEmails),
//       amount: randomInt(100, 1000)
//     })
//   }

//   return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
// }, {
//   watch: [() => props.period, () => props.range],
//   default: () => []
// })

const overlay = useOverlay();
const modal = overlay.create(LazyHomeResponsesAnswers);

const { data } = await useFetch<ResponseTable[]>(
  () => "/api/statistics/" + active_merchant.value + "/responses",
  {
    watch: [active_merchant],
    onResponse: ({ response }) => {
      console.log("res", response._data);
    },
  }
);

const columns: TableColumn<ResponseTable>[] = [
  {
    accessorKey: "respondent_id",
    header: "Respondent ID",
    cell: ({ row }) => `#${row.getValue("respondent_id")}`,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) =>
      h("span", { class: "font-bold" }, `${row.getValue("age")} y.o.`),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      console.log(
        "gender",
        typeof row.getValue("gender"),
        row.getValue("gender")
      );
      const isMale = row.getValue("gender");
      return h(
        UBadge,
        {
          class: "capitalize",
          variant: "subtle",
          color: isMale ? "neutral" : "success",
        },
        () => (isMale ? "Male" : "Female")
      );
    },
  },
  {
    accessorKey: "whatsapp",
    header: "Whatsapp",
    cell: ({ row }) => {
      return h("div", { class: "flex gap-3" }, [
        h(
          UBadge,
          {
            class: "capitalize",
            variant: "subtle",
            color: row.getValue("gender") ? "secondary" : "primary",
          },
          () => "+62"
        ),
        h("span", row.getValue("whatsapp")),
      ]);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const items = [
        {
          type: "label",
          label: "Actions",
        },
        {
          label: "Copy Response ID",
          onSelect() {
            navigator.clipboard.writeText(String(row.original.response_id));

            toast.add({
              title: "Response ID copied to clipboard!",
              color: "success",
              icon: "i-lucide-circle-check",
            });
          },
        },
        {
          label: "Show Response Answers",
          onSelect() {
            modal.open({
              response_id: row.original.response_id,
              respondent: row.original.name,
            });
          },
        },
        // {
        //   label: "Delete",
        //   onSelect() {
        //     deleteQuestion(row.getValue("id"));
        //   },
        // },
      ];

      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: {
              align: "end",
            },
            items,
            "aria-label": "Actions dropdown",
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
              "aria-label": "Actions dropdown",
            })
        )
      );
    },
  },
];
</script>

<template>
  <UTable
    :data="data"
    :columns="columns"
    class="shrink-0"
    :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
      td: 'border-b border-default',
    }"
  />
</template>
