import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    //jsxInject: "import React from 'react'",
  },
  resolve: {},
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setupTests.ts',
    testTimeout: 50000,
    alias: {
      '@ant-design/md-editor': path.resolve(__dirname, './src'),
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'text-summary', 'json', 'lcov'],
      include: ['src/**'],
      exclude: ['tests/**', 'test/**'],
    },
  },
});
