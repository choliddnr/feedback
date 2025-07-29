import { defineStore, acceptHMRUpdate } from 'pinia';
import type { QuestionType } from '~~/shared/types';

export const useQuestionTypesStore = defineStore('question_types', () => {
  const question_types = ref<QuestionType[]>();
  const { refresh: fetch } = useFetch('/api/questions/types', {
    onResponse: ({ response }) => {
      if (response.ok) {
        question_types.value = response._data;
      }
    },
  });
  return { question_types, fetch };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useQuestionTypesStore, import.meta.hot),
  );
}
