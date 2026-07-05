import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['**/*.test.ts'],
    // This is needed to mock dependencies in server-side tests
    server: {
      deps: {
        inline: ['h3'],
      },
    },
  },
});
