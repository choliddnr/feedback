import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AddForm from '~/components/admin/products/AddForm.vue';

describe('AddForm.vue', () => {
  it('mounts successfully', () => {
    const wrapper = mount(AddForm, {
      global: {
        stubs: {
          USlideover: true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});