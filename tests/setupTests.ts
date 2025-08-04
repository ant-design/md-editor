import '@testing-library/jest-dom';
import { MotionGlobalConfig } from 'framer-motion';
import { JSDOM } from 'jsdom';
import React from 'react';
import { vi } from 'vitest';
import { setupGlobalMocks } from './_mocks_/sharedMocks';

MotionGlobalConfig.skipAnimations = true;

// 设置全局mocks
setupGlobalMocks();

globalThis.React = React;

//@ts-ignore
globalThis.window = new JSDOM().window;

globalThis.document = window.document;

// 设置正确的文档类型，修复KaTeX警告
Object.defineProperty(document, 'doctype', {
  value: {
    name: 'html',
    publicId: '',
    systemId: '',
  },
});

// 修复canvas相关的问题



global.window.scrollTo = vi.fn();
Element.prototype.scrollTo = vi.fn();

Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'node.js',
  },
});

vi.stubGlobal(
  'requestIdleCallback',
  vi.fn((cb) => cb()),
);

// 重写 console.error 来过滤 act() 警告和其他测试警告
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    (typeof args[0] === 'string' &&
      (args[0].includes('was not wrapped in act') ||
        args[0].includes('inside a test was not wrapped in act') ||
        args[0].includes('Warning: An update to') ||
        args[0].includes('Function components cannot be given refs') ||
        args[0].includes('Invalid DOM property') ||
        args[0].includes('React does not recognize') ||
        args[0].includes("KaTeX doesn't work in quirks mode"))) ||
    args?.[0]?.includes?.('act(...)')
  ) {
    return;
  }
  originalError.call(console, args[0]);
};

// 重写 console.error 来过滤 act() 警告
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    (typeof args[0] === 'string' &&
      (args[0].includes('was not wrapped in act') ||
        args[0].includes('inside a test was not wrapped in act') ||
        args[0].includes('Warning: An update to'))) ||
    args?.[0]?.includes?.('act(...)')
  ) {
    return;
  }
  originalWarn.call(console, args[0]);
};

Object.defineProperty(globalThis, 'cancelAnimationFrame', {
  value: vi.fn(() => null),
  writable: true,
});

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// ref: https://github.com/ant-design/ant-design/issues/18774
const matchMediaMock = vi.fn(() => ({
  matches: false,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  configurable: true,
  value: matchMediaMock,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: matchMediaMock,
});

vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    key(index: number) {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis.window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis, 'sessionStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis.window, 'sessionStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});
