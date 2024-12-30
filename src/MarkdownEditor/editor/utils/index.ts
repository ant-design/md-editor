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

export const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

export const isWindows = /windows|win32/i.test(navigator.userAgent);

export function isMarkdown(text: string) {
  if (text.includes('# ')) {
    return true;
  }
  if (text.length > 50) {
    return true;
  }

  return false;
}

export * from './editorUtils';
export * from './keyboard';
export * from './media';
export * from './path';
export * from './schemaToMarkdown';
export * from './useLocalState';
