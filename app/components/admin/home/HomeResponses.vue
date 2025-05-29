<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Period, Range, ResponseTable } from "~~/shared/types";
import { LazyAdminHomeResponsesAnswers } from "#components";

const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UButton = resolveComponent("UButton");
const toast = useToast();

const { active_merchant } = storeToRefs(useMerchantsStore());
const overlay = useOverlay();
const modal = overlay.create(LazyAdminHomeResponsesAnswers);

const { data } = await useFetch<ResponseTable[]>(
  () => "/api/statistics/" + active_merchant.value + "/responses",
  {
    watch: [active_merchant],
  }
);

const columns: TableColumn<ResponseTable>[] = [
  {
    accessorKey: "respondent_id",
    header: "ID",
    cell: ({ row }) => `#${row.getValue("respondent_id")}`,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => `${row.getValue("name")}`,
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
