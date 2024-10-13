import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@ant-design/md-editor': path.resolve(__dirname, './src'),
      '@ant-design/pro-utils': path.resolve(
        __dirname,
        './tests/__mocks__/empty',
      ),
      '@ant-design/pro-components': path.resolve(
        __dirname,
        './tests/__mocks__/empty',
      ),
      '@ant-design/pro-card': path.resolve(
        __dirname,
        './tests/__mocks__/empty',
      ),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setupTests.ts',
    server: {
      deps: {
        inline: [],
      },
    },
  },
});
