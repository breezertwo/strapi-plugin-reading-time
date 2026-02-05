import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['server/src/**/*.test.ts'],
    server: {
      deps: {
        inline: [/@strapi\/utils/, /lodash/],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['server/src/**/*.ts'],
      exclude: ['server/src/**/*.test.ts', 'server/src/**/index.ts'],
    },
  },
});
