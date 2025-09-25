<script setup lang="ts">
// import type { TableColumn } from "@nuxt/ui";

import type { TableColumn } from "#ui/types";
import type { Question } from "~~/shared/types";
import {
  LazyAdminQuestionsAddForm,
  LazyAdminQuestionsEditForm,
  LazyAdminQuestionsGenerate,
  LazyModalConfirm,
} from "#components";

definePageMeta({
  layout: "dashboard",
});
let loadingAnimationSrc: string;
let emptyImage: string;

if (import.meta.dev) {
  loadingAnimationSrc = getImg("public/loading.gif");
  emptyImage = getImg("public/empty.png");
} else {
  loadingAnimationSrc = "/loading.gif";
  emptyImage = "/empty.png";
}

const { products, active_product } = storeToRefs(useProductsStore());
const { merchants, active_merchant } = storeToRefs(useMerchantsStore());
const overlay = useOverlay();
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UButton = resolveComponent("UButton");

const toast = useToast();
const { questions } = storeToRefs(useQuestionsStore());
const { fetch } = useQuestionsStore();
const slideover_edit = overlay.create(LazyAdminQuestionsEditForm);
const modal_delete_question = overlay.create(LazyModalConfirm);
const modal_generate_questions = overlay.create(LazyAdminQuestionsGenerate);
const slideover_add = overlay.create(LazyAdminQuestionsAddForm);
const table = useTemplateRef<any>("table");
const q_type = new Map([
  [1, "Text"],
  [2, "Rating"],
]);

const columns = [
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
      const data = q_type.get(row.getValue("type"));
      const color = {
        Text: "secondary" as const,
        Rating: "warning" as const,
      }[data as string];

      return h(
        UBadge,
        { class: "capitalize", variant: "subtle", color },
        () => data
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
] as TableColumn<Question>[];

const processDelete = async (id: string | number) => {
  await $fetch("/api/questions/" + id, {
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

const onGeneratingQuestions = ref<boolean>(false);

const generatingQuestions = async (
  id: string | number,
  title: string,
  description: string,
  keys: string
) => {
  onGeneratingQuestions.value = true;
  const questions = await $fetch("/api/questions/generate", {
    method: "POST",
    body: { id, title, description, keys },
    onResponse: async ({ response }) => {
      if (response.ok) {
        if (response._data.generatedQuestionsError.length > 0) {
          response._data.generatedQuestionsError.forEach((err: any) => {
            toast.add({
              title: err.message,
              icon: "i-heroicons-x-circle",
              color: "error",
            });
          });
        } else {
          fetch();
          toast.add({
            title: "Questions generated",
            icon: "i-heroicons-check-circle",
          });
        }
      }
      console.log("response:", response);

      onGeneratingQuestions.value = false;
    },
  });
  console.log("keys:", keys);
};

const generateQuestions = async (id: string | number) => {
  if (!id) {
    toast.add({
      title: "Please select a product first",
      icon: "i-heroicons-x-circle",
      color: "error",
    });
    return;
  }
  const product = products.value.find((p) => p.id === id);
  modal_generate_questions.open({
    title: product?.title || "",
    description: product?.description || "",
    onCancel: () => modal_generate_questions.close(),
    onContinue: async (title: string, description: string, keys: string) => {
      // processDelete(id);
      modal_generate_questions.close();
      await generatingQuestions(id, title, description, keys);
    },
  });
};
</script>
<template>
  <UDashboardPanel id="questions" :ui="{ body: 'px-0 sm:px-0' }">
    <template #header>
      <UDashboardNavbar title="Questions" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
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

        <template #empty>
          <div
            v-if="!onGeneratingQuestions"
            class="w-auto mx-auto max-w-xs flex flex-col gap-5 justify-content-center"
          >
            <NuxtImg :src="emptyImage" width="200" class="mx-auto" />
            <span class="mx-auto font-bold text-xl">No Question </span>
            <UButton
              class="mx-auto"
              label="Add a question"
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

            <UButton
              class="mx-auto"
              label="Generate questions"
              trailing-icon="i-simple-icons-googlegemini"
              color="primary"
              @click="generateQuestions(active_product!)"
            />
          </div>
          <div
            v-else
            class="w-auto mx-auto max-w-xs flex flex-col gap-5 justify-content-center"
          >
            <NuxtImg :src="loadingAnimationSrc" width="100" class="mx-auto" />
            <span class="mx-auto font-bold text-xl"
              >Generating questions...</span
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
