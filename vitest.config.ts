import path from 'path';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  esbuild: {
    jsxInject: "import React from 'react'",
  },
  resolve: {},
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setupTests.ts',
    testTimeout: 10000,
    alias: {
      '@ant-design/md-editor': path.resolve(__dirname, './src'),
      '@ant-design/pro-card': path.resolve(__dirname, './node_modules/.pnpm/@ant-design+pro-card@2.8.8_antd@5.21.0_react-dom@18.3.1_react@18.3.1/node_modules/@ant-design/pro-card/es/index.js'),
      '@ant-design/pro-components': path.resolve(__dirname, './node_modules/.pnpm/@ant-design+pro-components@2.7.19_antd@5.21.0_rc-field-form@2.4.0_react-dom@18.3.1_react@18.3.1/node_modules/@ant-design/pro-components/es/index.js'),
      '@ant-design/pro-descriptions': path.resolve(__dirname, './node_modules/.pnpm/@ant-design+pro-descriptions@2.5.53_antd@5.21.0_rc-field-form@2.4.0_react-dom@18.3.1_react@18.3.1/node_modules/@ant-design/pro-descriptions/es/index.js'),
      '@ant-design/pro-field': path.resolve(__dirname, './node_modules/.pnpm/@ant-design+pro-field@2.16.2_antd@5.21.0_react-dom@18.3.1_react@18.3.1/node_modules/@ant-design/pro-field/es/index.js'),
      '@ant-design/pro-form': path.resolve(__dirname, './node_modules/.pnpm/@ant-design+pro-form@2.30.2_antd@5.21.0_rc-field-form@2.4.0_react-dom@18.3.1_react@18.3.1/node_modules/@ant-design/pro-form/es/index.js'),
      '@ant-design/pro-layout': path.resolve(__dirname, './node_modules/.pnpm/@ant-design+pro-layout@7.20.2_antd@5.21.0_react-dom@18.3.1_react@18.3.1/node_modules/@ant-design/pro-layout/es/index.js'),
      '@ant-design/pro-list': path.resolve(__dirname, './node_modules/.pnpm/@ant-design+pro-list@2.5.69_antd@5.21.0_rc-field-form@2.4.0_react-dom@18.3.1_react@18.3.1/node_modules/@ant-design/pro-list/es/index.js'),
      '@ant-design/pro-provider': path.resolve(__dirname, './node_modules/.pnpm/@ant-design+pro-provider@2.14.9_antd@5.21.0_react-dom@18.3.1_react@18.3.1/node_modules/@ant-design/pro-provider/es/index.js'),
      '@ant-design/pro-skeleton': path.resolve(__dirname, './node_modules/.pnpm/@ant-design+pro-skeleton@2.1.13_antd@5.21.0_react-dom@18.3.1_react@18.3.1/node_modules/@ant-design/pro-skeleton/es/index.js'),
      '@ant-design/pro-table': path.resolve(__dirname, './node_modules/.pnpm/@ant-design+pro-table@3.17.2_antd@5.21.0_rc-field-form@2.4.0_react-dom@18.3.1_react@18.3.1/node_modules/@ant-design/pro-table/es/index.js'),
      '@ant-design/pro-utils': path.resolve(__dirname, './node_modules/.pnpm/@ant-design+pro-utils@2.15.18_antd@5.21.0_react-dom@18.3.1_react@18.3.1/node_modules/@ant-design/pro-utils/es/index.js'),
    }
  },
});
