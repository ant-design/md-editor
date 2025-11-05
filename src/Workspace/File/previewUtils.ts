/**
 * 预览处理工具函数
 * 
 * 将复杂的预览处理逻辑从 FileComponent.tsx 中提取出来，消除深层嵌套
 */

import React from 'react';
import type { FileNode } from '../types';
import { isImageFile } from './FileTypeProcessor';

/**
 * 获取文件预览源
 */
const getPreviewSource = (file: FileNode): string => {
  return file.previewUrl || file.url || '';
};

/**
 * 预览数据结果类型
 */
export type PreviewDataResult =
  | React.ReactNode
  | FileNode
  | false
  | null
  | undefined;

/**
 * 处理自定义预览内容的函数类型
 */
export type PreviewContentHandler = (
  content: React.ReactNode,
  file: FileNode,
) => void;

/**
 * 处理自定义预览头部
 */
export type PreviewHeaderHandler = (header: React.ReactNode) => void;

/**
 * 处理预览返回值的回调函数类型
 */
export interface PreviewCallbacks {
  onBack: () => void;
  onDownload: (file: FileNode) => void;
  onShare: (file: FileNode) => void;
  setPreviewHeader: PreviewHeaderHandler;
}

/**
 * 判断是否为 React 元素
 */
const isReactElement = (value: any): boolean => {
  return (
    React.isValidElement(value) ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
};

/**
 * 判断是否为文件节点
 */
const isFileNode = (value: any): value is FileNode => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value
  );
};

/**
 * 处理 React 元素类型的预览数据
 */
export const processReactElementPreview = (
  previewData: React.ReactNode,
  file: FileNode,
  callbacks: PreviewCallbacks,
): React.ReactNode => {
  if (!React.isValidElement(previewData)) {
    return previewData;
  }

  return React.cloneElement(previewData as React.ReactElement, {
    setPreviewHeader: callbacks.setPreviewHeader,
    back: callbacks.onBack,
    download: () => callbacks.onDownload(file),
    share: () => callbacks.onShare(file),
  });
};

/**
 * 处理自定义预览数据
 */
export const processCustomPreviewData = (
  previewData: PreviewDataResult,
  file: FileNode,
  callbacks: PreviewCallbacks,
): {
  content: React.ReactNode | null;
  header: React.ReactNode | null;
  file: FileNode | null;
} => {
  // 如果返回 false，阻止内部预览逻辑
  if (previewData === false) {
    return { content: null, header: null, file: null };
  }

  // 如果返回 React 元素，处理为自定义内容
  if (isReactElement(previewData)) {
    const content = processReactElementPreview(
      previewData,
      file,
      callbacks,
    );
    return { content, header: null, file: null };
  }

  // 如果返回文件节点，预览新文件
  if (isFileNode(previewData)) {
    return { content: null, header: null, file: previewData };
  }

  // 其他情况，使用原文件预览
  return { content: null, header: null, file };
};

/**
 * 处理图片预览
 */
export const handleImagePreview = (
  file: FileNode,
): { visible: boolean; src: string } | null => {
  if (!isImageFile(file)) return null;

  const previewSrc = getPreviewSource(file);
  return {
    visible: true,
    src: previewSrc,
  };
};

