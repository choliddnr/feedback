import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import EditForm from '~/components/admin/questions/EditForm.vue';

describe('EditForm.vue', () => {
  it('mounts successfully', () => {
    const wrapper = mount(EditForm, {
      props: { question: { question: 'Test Question' } },
      global: {
        stubs: {
          USlideover: true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});