<script setup lang="ts">
import { LazyAdminQuestionsAddForm } from "#components";
import { LazyAdminQuestionsEditForm } from "#components";
import type { TableColumn } from "@nuxt/ui";
import type { Question } from "~~/shared/types";
import { LazyModalConfirm } from "#components";

definePageMeta({
  layout: "dashboard",
});
const { products, active_product } = storeToRefs(useProductsStore());
const { merchants, active_merchant } = storeToRefs(useMerchantsStore());
const overlay = useOverlay();
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UButton = resolveComponent("UButton");

const toast = useToast();
const { questions } = storeToRefs(useQuestionsStore());

const slideover_edit = overlay.create(LazyAdminQuestionsEditForm);
const modal_delete_question = overlay.create(LazyModalConfirm);
const slideover_add = overlay.create(LazyAdminQuestionsAddForm);
const table = useTemplateRef("table");
const q_type = new Map([
  [1, "Text"],
  [2, "Reting"],
]);

const columns: TableColumn<Question>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "question",
    header: "Question",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const color = {
        text: "success" as const,
        rating: "info" as const,
      }[row.getValue("type") as string];

      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        q_type.get(row.getValue("type"))
      );
    },
  },
  {
    accessorKey: "answer_options",
    header: "Options",
    cell: ({ row }) => {
      const opt = row.getValue("answer_options") as string[];
      if (opt.length > 1) {
        return h("div", { class: "flex gap-2" }, [
          h(
            UBadge,
            {
              class: "capitalize",
              variant: "subtle",
              color: "neutral",
              size: "sm",
            },
            () => opt[0]
          ),
          h(UButton, {
            label: row.getIsExpanded() ? "See less" : "See more",
            color: "neutral",
            variant: "outline",
            size: "sm",
            onClick: () => row.toggleExpanded(),
          }),
        ]);
      } else if (opt.length === 1) {
        return h(
          UBadge,
          { class: "capitalize", variant: "subtle", color: "neutral" },
          () => opt[0]
        );
      } else {
        return h(
          UBadge,
          { class: "capitalize", variant: "subtle", color: "neutral" },
          () => "no options provided."
        );
      }
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
          label: "Copy payment ID",
          onSelect() {
            navigator.clipboard.writeText(String(row.original.id));

            toast.add({
              title: "Payment ID copied to clipboard!",
              color: "success",
              icon: "i-lucide-circle-check",
            });
          },
        },
        {
          label: "Edit",
          onSelect() {
            slideover_edit.open({
              question: row.original,
            });
          },
        },
        {
          label: "Delete",
          onSelect() {
            deleteQuestion(row.getValue("id"));
          },
        },
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

const processDelete = async (id: string | number) => {
  await $fetch("/api/products/" + id, {
    method: "DELETE",
    onResponse: async ({ response }) => {
      if (response.ok) {
        const index = questions.value.findIndex((p) => p.id === id);
        questions.value.splice(index, 1);
      }
    },
  });
  modal_delete_question.close();
};

const deleteQuestion = async (id: string | number) => {
  modal_delete_question.open({
    message: "Are you sure?",
    action: {
      cancel: { color: "neutral" },
      continue: { color: "error", label: "Delete" },
    },
    onCancel: () => modal_delete_question.close(),
    onContinue: () => {
      processDelete(id);
    },
  });
  //
};
</script>
<template>
  <UDashboardPanel id="questions" resizeable :ui="{ body: 'px-0 sm:px-0' }">
    <template #header>
      <UDashboardNavbar title="Questions">
        <template #right>
          <UButton
            label="New Question"
            trailing-icon="i-heroicons-plus"
            color="neutral"
            @click="
              () => {
                slideover_add.open({
                  onClose: slideover_add.close,
                });
              }
            "
          />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <template #left>
          <USelect
            v-model="active_merchant"
            :items="merchants"
            label-key="title"
            value-key="id"
            variant="ghost"
            class="w-full min-w-40"
          />
          <USelect
            v-model="active_product"
            :items="products"
            label-key="title"
            value-key="id"
            variant="ghost"
            class="w-full min-w-40"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        ref="table"
        :data="questions"
        :columns="columns"
        sticky
        class="h-full"
      >
        <template #expanded="{ row }">
          <div class="flex justify-center gap-3">
            <UBadge
              v-for="opt in row.original.answer_options"
              color="neutral"
              variant="subtle"
              >{{ opt }}</UBadge
            >
          </div>
        </template>
      </UTable>

      <div class="px-4 py-3.5 text-sm text-muted">
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s)
      </div>
    </template>
  </UDashboardPanel>
</template>
