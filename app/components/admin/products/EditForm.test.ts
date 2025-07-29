import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import EditForm from '~/components/admin/products/EditForm.vue';

describe('EditForm.vue', () => {
  it('mounts successfully', () => {
    const wrapper = mount(EditForm, {
      props: { product: { title: 'Test Product' } },
      global: {
        stubs: {
          USlideover: true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
