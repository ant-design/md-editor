import React from 'react';
import { FileType, FileCategory, getFileCategory, type FileNode, getMimeType as getTypeMimeType, FILE_TYPES } from '../types';
import MdIcon from '../icons/MdIcon';
import XmlIcon from '../icons/XmlIcon';
import XlsxIcon from '../icons/XlsxIcon';
import HtmlIcon from '../icons/HtmlIcon';
import WordIcon from '../icons/WordIcon';
import CsvIcon from '../icons/CsvIcon';
import PdfIcon from '../icons/PdfIcon';

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
};

// 文件类型到默认图标的映射
const TYPE_ICON_MAP: Record<FileCategory, React.ReactNode> = {
  [FileCategory.Text]: <MdIcon />,
  [FileCategory.PDF]: <PdfIcon />,
  [FileCategory.Word]: <WordIcon />,
  [FileCategory.Excel]: <XlsxIcon />,
  [FileCategory.Image]: <MdIcon />,
  [FileCategory.Video]: <MdIcon />,
  [FileCategory.Other]: <MdIcon />,
};

/**
 * 获取文件的实际类型
 */
export const getActualFileType = (file: FileNode): FileType => {
  // 1. 优先使用文件的type属性
  if (file.type && file.type in FILE_TYPES) {
    return file.type;
  }

  // 2. 如果有File对象，使用File对象的类型
  if (file.file) {
    const mimeType = file.file.type;
    for (const [type, definition] of Object.entries(FILE_TYPES)) {
      if (definition.mimeTypes.includes(mimeType)) {
        return type as FileType;
      }
    }
  }

  // 3. 根据文件名后缀判断
  if (file.name) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension) {
      for (const [type, definition] of Object.entries(FILE_TYPES)) {
        if (definition.extensions.includes(extension)) {
          return type as FileType;
        }
      }
    }
  }

  // 4. 如果有URL，根据URL后缀判断
  if (file.url) {
    const urlExtension = file.url.split('.').pop()?.split('?')[0]?.toLowerCase();
    if (urlExtension) {
      for (const [type, definition] of Object.entries(FILE_TYPES)) {
        if (definition.extensions.includes(urlExtension)) {
          return type as FileType;
        }
      }
    }
  }

  return 'plainText';
};

/**
 * 判断文件是否可以预览
 */
export const canPreviewFile = (file: FileNode): boolean => {
  // 如果是content来源，支持预览
  if (file.content) {
    return true;
  }

  const actualType = getActualFileType(file);
  const category = getFileCategory(actualType);

  // 如果是图片，支持所有来源预览
  if (category === FileCategory.Image) {
    return true;
  }

  // 如果是URL来源且不是图片，不支持预览
  if (file.url) {
    return false;
  }

  // 其他情况下支持的类型
  return (
    category === FileCategory.Video ||
    category === FileCategory.PDF ||
    category === FileCategory.Text
  );
};

/**
 * 获取预览源URL
 */
export const getPreviewSource = (file: FileNode): string | null => {
  if (file.file) {
    return URL.createObjectURL(file.file);
  }

  if (file.content) {
    const blob = new Blob([file.content], { type: 'text/plain' });
    return URL.createObjectURL(blob);
  }

  if (file.url && isImageFile(file)) {
    return file.url;
  }

  return null;
};

/**
 * 获取文件类型图标
 */
export const getFileTypeIcon = (type: FileType, customIcon?: React.ReactNode, fileName?: string) => {
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

/**
 * 文件类型判断函数
 */
export const isImageFile = (file: FileNode): boolean => {
  return getFileCategory(getActualFileType(file)) === FileCategory.Image;
};

export const isVideoFile = (file: FileNode): boolean => {
  return getFileCategory(getActualFileType(file)) === FileCategory.Video;
};

export const isPdfFile = (file: FileNode): boolean => {
  return getFileCategory(getActualFileType(file)) === FileCategory.PDF;
};

export const isTextFile = (file: FileNode): boolean => {
  return getFileCategory(getActualFileType(file)) === FileCategory.Text;
};

/**
 * 获取文件的 MIME 类型
 * @param fileNode 文件节点对象
 * @returns MIME 类型字符串
 */
export const getMimeType = (fileNode: FileNode): string => {
  // 如果有原生 File/Blob 对象，使用其原生的 MIME 类型
  if (fileNode.file) {
    return fileNode.file.type || '未知类型';
  }

  // 使用 types.ts 中的 getMimeType 函数
  return getTypeMimeType(fileNode.type);
};
