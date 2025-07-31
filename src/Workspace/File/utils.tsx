import React from 'react';
import CsvIcon from '../icons/CsvIcon';
import DocsIcon from '../icons/DocsIcon';
import FileIcon from '../icons/FileIcon';
import MdIcon from '../icons/MdIcon';
import XlsxIcon from '../icons/XlsxIcon';
import XmlIcon from '../icons/XmlIcon';
import type { FileNode, FileType } from '../types';

// TODO:文件类型到图标的映射，！！缺少默认文件图标和pdf图标，
const FILE_TYPE_ICON_MAP: Record<FileType, React.ReactNode> = {
  csv: <CsvIcon />,
  doc: <DocsIcon />,
  excel: <XlsxIcon />,
  md: <MdIcon />,
  xml: <XmlIcon />,
  unknown: <FileIcon />,
};

/**
 * 根据文件类型获取对应的图标
 * @param type 文件类型
 * @param customIcon 自定义图标，如果提供则优先使用
 * @returns React节点图标
 */
export const getFileTypeIcon = (
  type: FileType,
  customIcon?: React.ReactNode,
): React.ReactNode => {
  if (customIcon) {
    return customIcon;
  }
  return FILE_TYPE_ICON_MAP[type] || FILE_TYPE_ICON_MAP.unknown;
};

// 图片文件扩展名
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

// 文本文件扩展名
const TEXT_EXTENSIONS = [
  'txt',
  'md',
  'markdown',
  'csv',
  'xml',
  'json',
  'html',
  'htm',
  'css',
  'js',
  'javascript',
  'ts',
  'typescript',
  'jsx',
  'tsx',
];

// 其他支持预览的文件扩展名
const OTHER_PREVIEWABLE_EXTENSIONS = ['pdf'];

// 支持预览的文件类型
const PREVIEWABLE_TYPES: FileType[] = ['md', 'csv', 'xml'];

/**
 * 获取文件扩展名
 * @param fileName 文件名
 * @returns 文件扩展名（小写）
 */
const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

/**
 * 判断文件是否支持预览
 * @param file 文件对象
 * @returns 是否支持预览
 */
export const canPreviewFile = (file: FileNode): boolean => {
  // 如果有预览链接，直接支持预览
  if (file.previewUrl) {
    return true;
  }

  // 检查文件类型是否支持预览
  if (PREVIEWABLE_TYPES.includes(file.type)) {
    return true;
  }

  // 根据文件扩展名判断
  const extension = getFileExtension(file.name || '');

  return [
    ...IMAGE_EXTENSIONS,
    ...TEXT_EXTENSIONS,
    ...OTHER_PREVIEWABLE_EXTENSIONS,
  ].includes(extension);
};

/**
 * 判断文件是否为图片
 * @param file 文件对象
 * @returns 是否为图片
 */
export const isImageFile = (file: FileNode): boolean => {
  const extension = getFileExtension(file.name || '');
  return IMAGE_EXTENSIONS.includes(extension);
};

/**
 * 判断文件是否为文本文件
 * @param file 文件对象
 * @returns 是否为文本文件
 */
export const isTextFile = (file: FileNode): boolean => {
  const extension = getFileExtension(file.name || '');
  return TEXT_EXTENSIONS.includes(extension);
};
