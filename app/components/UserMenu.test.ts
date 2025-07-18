import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import UserMenu from '~/components/UserMenu.vue';
import { useUserStore } from '~/stores/user';
import { ref } from 'vue';

// Mock useFetch
vi.mock('#app', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useFetch: vi.fn(() => ({ data: ref(null), pending: ref(false), error: ref(null) })),
  };
});

// Mock the entire user store module
vi.mock('~/stores/user', () => ({
  useUserStore: () => ({
    user: ref({
      defaultMerchant: '123',
      name: 'Test User',
      email: 'test@example.com',
    }),
    fetch: vi.fn(), // Mock the fetch action if it's called
  }),
}));

describe('UserMenu.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('mounts successfully', () => {
    const wrapper = mount(UserMenu, {
      global: {
        stubs: {
          NuxtLink: true, // Stub NuxtLink to prevent resolution errors
          UButton: true, // Stub UButton from Nuxt UI
          UDropdownMenu: true, // Stub UDropdownMenu from Nuxt UI
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});