/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */
import { HookAPI } from 'antd/es/modal/useModal';
import { customAlphabet } from 'nanoid';
import React from 'react';
import { Subject } from 'rxjs';

export const nid = customAlphabet(
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  13,
);

const kb = 1024;
const mb = kb * 1024;
const gb = mb * 1024;
export const sizeUnit = (size: number) => {
  if (size > gb) return (size / gb).toFixed(2) + ' GB';
  if (size > mb) return (size / mb).toFixed(2) + ' MB';
  if (size > kb) return (size / kb).toFixed(2) + ' KB';
  return size + ' B';
};

export const copy = <T = any>(data: T): T => JSON.parse(JSON.stringify(data));

export const isMod = (
  e: MouseEvent | KeyboardEvent | React.KeyboardEvent | React.MouseEvent,
) => {
  return e.metaKey || e.ctrlKey;
};

export function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const getImageData = (filePath: string = '') => {
  if (filePath.startsWith('data:image')) {
    return filePath;
  }
  return filePath;
};

export function toArrayBuffer(buffer: any) {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}

export const download = (data: Blob | Uint8Array, fileName: string) => {
  data = data instanceof Uint8Array ? new Blob([data]) : data;
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(data);
    link.addEventListener('click', (e) => e.stopPropagation());
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

type ModalEvent<K extends keyof HookAPI> = {
  type: K;
  params: Parameters<HookAPI[K]>[0];
};
export const modal$ = new Subject<ModalEvent<keyof HookAPI>>();

export const encodeHtml = (str: string) => {
  const encodeHTMLRules = {
      '&': '&#38;',
      '<': '&#60;',
      '>': '&#62;',
      '"': '&#34;',
      "'": '&#39;',
      '/': '&#47;',
    },
    matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
  return str.replace(matchHTML, function (m) {
    //@ts-ignore
    return encodeHTMLRules[m] || m;
  });
};

const MARKDOWN_REGEX = new RegExp(
  '(^#+\\s.*)|' + // 标题（如 # Heading）
    '(^[\\*\\-+] .*)|' + // 无序列表（如 * Item）
    '(^\\d+\\. .*)|' + // 有序列表（如 1. Item）
    '(\\[.*?\\]\\(.*?\\))|' + // 链接（如 [text](url)）
    '(!\\[.*?\\]\\(.*?\\))|' + // 图片（如 ![alt](url)）
    '(^`{3}.*)|' + // 代码块（如 ```js）
    '(`.*?`)|' + // 行内代码（如 `code`）
    '(^> .*)|' + // 引用块（如 > Quote）
    '(\\*\\*.*?\\*\\*|__.*?__)|' + // 粗体（如 **bold** 或 __bold__）
    '(\\*.*?\\*|_.*?_)|' + // 斜体（如 *italic* 或 _italic_）
    '(~~.*?~~)|' + // 删除线（如 ~~text~~）
    '(^===+$|^---+$|^\\*\\*\\*+$)', // 水平线（如 --- 或 ***）
  'gm', // 全局匹配 + 多行模式
);

export function isMarkdown(text: string): boolean {
  return MARKDOWN_REGEX.test(text);
}
export function debounce(
  func: { (): void; apply?: any },
  delay: number | undefined,
) {
  let timer: any = null;
  const fn = function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      //@ts-ignore
      func.apply(this, arguments);
    }, delay);
  };
  fn.flush = function () {
    clearTimeout(timer);
    //@ts-ignore
    func.apply(this, arguments);
  };
  fn.cancel = function () {
    clearTimeout(timer);
  };
  return fn;
}

import { DependencyList, useCallback, useEffect, useRef } from 'react';

export type UseTimeoutFnReturn = [() => boolean | null, () => void, () => void];

/**
 * 创建一个延时执行函数的Hook。
 *
 * @param fn - 需要延时执行的函数
 * @param ms - 延时时间（毫秒），默认为0
 * @returns 返回一个数组，包含三个元素：
 * - isReady - 用于检查定时器是否已经触发的函数
 * - clear - 用于清除定时器的函数
 * - set - 用于重新设置定时器的函数
 *
 * @example
 * ```ts
 * const [isReady, clear, set] = useTimeoutFn(() => {
 *   console.log('Timeout triggered');
 * }, 1000);
 * ```
 *
 * @remarks
 * - 当组件挂载时，定时器会自动启动
 * - 当传入的函数(fn)发生变化时，会自动更新回调函数
 * - 当延时时间(ms)发生变化时，定时器会自动重置
 * - 当组件卸载时，定时器会自动清除
 */
export function useTimeoutFn(fn: Function, ms: number = 0): UseTimeoutFnReturn {
  const ready = useRef<boolean | null>(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const callback = useRef(fn);

  const isReady = useCallback(() => ready.current, []);

  const set = useCallback(() => {
    ready.current = false;
    timeout.current && clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      ready.current = true;
      callback.current();
    }, ms);
  }, [ms]);

  const clear = useCallback(() => {
    ready.current = null;
    timeout.current && clearTimeout(timeout.current);
  }, []);

  // update ref when function changes
  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  // set on mount, clear on unmount
  useEffect(() => {
    set();

    return clear;
  }, [ms]);

  return [isReady, clear, set];
}

export type UseDebounceReturn = [() => boolean | null, () => void];

/**
 * 创建一个防抖函数的 Hook。
 *
 * @param fn - 需要进行防抖处理的函数
 * @param ms - 防抖延迟时间(毫秒)。默认为0
 * @param deps - 依赖数组，当依赖项改变时会重置防抖计时器。默认为空数组
 * @returns 返回一个元组 [isReady, cancel]
 *          - isReady: 一个函数，用于检查防抖是否已经准备好执行
 *          - cancel: 一个函数，用于取消当前的防抖计时器
 *
 * @example
 * ```typescript
 * const [isReady, cancel] = useDebounce(() => {
 *   // 执行一些操作
 * }, 1000);
 * ```
 */
export function useDebounce(
  fn: Function,
  ms: number = 0,
  deps: DependencyList = [],
): UseDebounceReturn {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  useEffect(reset, deps);

  return [isReady, cancel];
}

import { useReducer } from 'react';

const updateReducer = (num: number): number => (num + 1) % 1_000_000;

export default function useUpdate(): () => void {
  const [, update] = useReducer(updateReducer, 0);

  return update;
}

export const useGetSetState = <T extends object>(
  initialState: T = {} as T,
): [() => T, (patch: Partial<T>) => void] => {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof initialState !== 'object') {
      console.error('useGetSetState initial state must be an object.');
    }
  }

  const update = useUpdate();
  const state = useRef<T>({ ...(initialState as object) } as T);
  const get = useCallback(() => state.current, []);
  const set = useCallback((patch: Partial<T>) => {
    if (!patch) {
      return;
    }
    if (process.env.NODE_ENV !== 'production') {
      if (typeof patch !== 'object') {
        console.error('useGetSetState setter patch must be an object.');
      }
    }
    Object.assign(state.current, patch);
    update();
  }, []);

  return [get, set];
};

// 时间戳方案
export function throttle(fn: any, wait: number) {
  let pre = Date.now();
  const runFn = function () {
    //@ts-ignore
    let context = this;
    let args = arguments;
    let now = Date.now();
    if (now - pre >= wait) {
      fn.apply(context, args);
      pre = Date.now();
    }
  };
  runFn.flush = function () {
    {
      pre = Date.now();
      //@ts-ignore
      fn.apply(this, arguments);
    }
  };
  runFn.cancel = function () {
    pre = Date.now();
  };
  return runFn;
}

export const debugLog = (path: string, ...msg: any[]) => {
  if (typeof window === 'undefined') return;
  //@ts-expect-error
  if (window?.debug) {
    console.log(`debug「${path}」--->`, ...msg);
  }
};

/**
 * Markdown 编辑器事件常量对象
 * @constant
 * @description 包含编辑器的主要事件名称
 * @property {string} SELECTIONCHANGE - 当编辑器选区发生变化时触发的事件名
 * @property {string} FOCUS - 当编辑器获得焦点时触发的事件名
 * @property {string} BLUR - 当编辑器失去焦点时触发的事件名
 */
export const MARKDOWN_EDITOR_EVENTS = {
  // 编辑器选区发生变化时触发的事件名
  SELECTIONCHANGE: 'md-editor-selectionchange',
  // 编辑器获得焦点时触发的事件名
  FOCUS: 'md-editor-focus',
  // 编辑器失去焦点时触发的事件名
  BLUR: 'md-editor-blur',
};

export * from '../parser/parserSlateNodeToMarkdown';
export * from './editorUtils';
export * from './keyboard';
export * from './media';
export * from './path';
export * from './useLocalState';
