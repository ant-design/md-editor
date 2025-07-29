import React from 'react';
import CsvIcon from '../icons/CsvIcon';
import DocsIcon from '../icons/DocsIcon';
import FileIcon from '../icons/FileIcon';
import MdIcon from '../icons/MdIcon';
import XlsxIcon from '../icons/XlsxIcon';
import XmlIcon from '../icons/XmlIcon';
import type { FileType } from '../types';

// 文件类型到图标的映射
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
