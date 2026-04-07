// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.js'],
    testTimeout: 30000,
    globals: true,
    include: ['test/**/*.js'],
    exclude: ['node_modules', 'test/setup.js'],
  },
});