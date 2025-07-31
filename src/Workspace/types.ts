import React, { type ReactNode } from 'react';
import type { BrowserItemInput } from './Browser';
import type { RealtimeFollowData } from './RealtimeFollow';
import type { TaskItemInput } from './Task';

// 标签页配置
export interface TabConfiguration {
  key?: string;
  icon?: ReactNode;
  title?: string;
}

// 标签页数据结构
export interface TabItem {
  key: string;
  label: ReactNode;
  content?: ReactNode;
}

// 工作空间主组件属性
export interface WorkspaceProps {
  activeTabKey?: string;
  onTabChange?: (tabKey: string) => void;
  style?: React.CSSProperties;
  className?: string;
  title?: ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
}

// 子组件基础属性
export interface BaseChildProps {
  tab?: TabConfiguration;
}

// 具体子组件属性
export interface RealtimeProps extends BaseChildProps {
  data?: RealtimeFollowData;
}

export interface BrowserProps extends BaseChildProps {
  data?: BrowserItemInput;
}

export interface TaskProps extends BaseChildProps {
  data?: TaskItemInput;
}

// 文件类型枚举
export type FileType = 'csv' | 'doc' | 'excel' | 'md' | 'xml' | 'unknown';

// 文件节点基础属性
export interface FileNodeBase {
  id?: string;
  name: string;
  type: FileType;
  icon?: ReactNode;
}

// 文件节点（叶子节点）
export interface FileNode extends FileNodeBase {
  size?: string;
  lastModified?: string;
  url?: string;
  previewUrl?: string;
  [key: string]: any;
}

// 分组节点
export interface GroupNode extends FileNodeBase {
  typeName: string;
  collapsed?: boolean;
  children: FileNode[];
}

// 文件组件属性
export interface FileProps extends BaseChildProps {
  nodes: (GroupNode | FileNode)[];
  onGroupDownload?: (files: FileNode[], groupType?: FileType) => void;
  onDownload?: (file: FileNode) => void;
  onFileClick?: (file: FileNode) => void;
  onToggleGroup?: (groupType: FileType, collapsed: boolean) => void;
  onPreview?: (file: FileNode) => void;
}

export interface CustomProps extends BaseChildProps {
  children?: ReactNode;
}
