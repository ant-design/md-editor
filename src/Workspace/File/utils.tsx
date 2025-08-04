import React from 'react';
import ArchiveIcon from '../icons/ArchiveIcon';
import CsvIcon from '../icons/CsvIcon';
import HtmlIcon from '../icons/HtmlIcon';
import MdIcon from '../icons/MdIcon';
import PdfIcon from '../icons/PdfIcon';
import WordIcon from '../icons/WordIcon';
import XlsxIcon from '../icons/XlsxIcon';
import XmlIcon from '../icons/XmlIcon';
import {
  FILE_TYPES,
  FileCategory,
  FileNode,
  FileType,
  getFileCategory,
  GroupNode,
} from '../types';

// 文件扩展名到图标的映射
const EXTENSION_ICON_MAP: Record<string, React.ReactNode> = {
  xlsx: <XlsxIcon />,
  xls: <XlsxIcon />,
  doc: <WordIcon />,
  docx: <WordIcon />,
  pdf: <PdfIcon />,
  csv: <CsvIcon />,
  xml: <XmlIcon />,
  html: <HtmlIcon />,
  md: <MdIcon />,
  markdown: <MdIcon />,
  zip: <ArchiveIcon />,
  rar: <ArchiveIcon />,
  '7z': <ArchiveIcon />,
  tar: <ArchiveIcon />,
  gz: <ArchiveIcon />,
  bz2: <ArchiveIcon />,
};

// 文件类型到默认图标的映射
const TYPE_ICON_MAP: Record<FileCategory, React.ReactNode> = {
  [FileCategory.Text]: <MdIcon />,
  [FileCategory.PDF]: <PdfIcon />,
  [FileCategory.Word]: <WordIcon />,
  [FileCategory.Excel]: <XlsxIcon />,
  [FileCategory.Image]: <MdIcon />,
  [FileCategory.Video]: <MdIcon />,
  [FileCategory.Archive]: <ArchiveIcon />,
  [FileCategory.Other]: <MdIcon />,
};

/**
 * 获取文件类型图标
 */
export const getFileTypeIcon = (
  type: FileType,
  customIcon?: React.ReactNode,
  fileName?: string,
) => {
  if (customIcon) {
    return customIcon;
  }

  if (fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension && extension in EXTENSION_ICON_MAP) {
      return EXTENSION_ICON_MAP[extension];
    }
  }

  const fileDefinition = FILE_TYPES[type];
  if (fileDefinition && fileDefinition.extensions[0] in EXTENSION_ICON_MAP) {
    return EXTENSION_ICON_MAP[fileDefinition.extensions[0]];
  }

  return TYPE_ICON_MAP[getFileCategory(type)] || <MdIcon />;
};

// 生成唯一ID的工具函数
export const generateUniqueId = (node: FileNode | GroupNode): string => {
  if (node.id) return node.id;

  // 使用文件名、类型和时间戳组合生成唯一ID
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${node.type}_${node.name}_${timestamp}_${randomStr}`;
};
