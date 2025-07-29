import React, { type FC } from 'react';
import type { FileComponentData } from '../types';
import { FileComponent } from './FileComponent';
import './index.less';

// 主要的文件组件
export const NewFileComponent: FC<{ data?: FileComponentData }> = ({
  data,
}) => {
  return <FileComponent data={data} />;
};

// 导出类型和工具函数
export type {
  FileComponentData,
  FileGroup,
  FileItem,
  FileType,
} from '../types';
export { getFileTypeIcon } from './utils';
