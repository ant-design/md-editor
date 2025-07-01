import '@testing-library/jest-dom';
import { MotionGlobalConfig } from 'framer-motion';
import { JSDOM } from 'jsdom';
import React from 'react';
import { vi } from 'vitest';

MotionGlobalConfig.skipAnimations = true;

globalThis.React = React;

//@ts-ignore
globalThis.window = new JSDOM().window;

globalThis.document = window.document;

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

// 重写 console.error 来过滤 act() 警告
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    (typeof args[0] === 'string' &&
      (args[0].includes('was not wrapped in act') ||
        args[0].includes('inside a test was not wrapped in act') ||
        args[0].includes('Warning: An update to'))) ||
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

if (typeof globalThis !== 'undefined') {
  // ref: https://github.com/ant-design/ant-design/issues/18774
  if (!globalThis.matchMedia) {
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn(() => ({
        matches: false,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn(() => ({
        matches: false,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  }
}

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
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});
