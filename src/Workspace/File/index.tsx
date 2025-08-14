import './index.less';

export { FileComponent as File } from './FileComponent';

// 导出类型和工具函数
export type {
  FileProps,
  FileNode,
  GroupNode,
  FileType,
} from '../types';
export { getFileTypeIcon } from './utils';
