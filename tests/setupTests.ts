import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';
globalThis.React = React;

vi.mock('lodash-es', () => {
  return {
    map: (arr: any[], fn: any) => arr.map(fn),
    filter: (arr: any[], fn: any) => arr.filter(fn),
    forEach: (arr: any[], fn: any) => arr.forEach(fn),
  };
});

Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'node.js',
  },
});

Object.defineProperty(globalThis, 'cancelAnimationFrame', {
  value: vi.fn(() => null),
  writable: true,
});

vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);

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
}

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
