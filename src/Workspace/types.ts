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

// 单个文件项数据结构
export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size?: string;
  lastModified?: string; // 最后修改时间
  url?: string; // 下载链接
  previewUrl?: string; // 预览链接
  icon?: ReactNode; // 自定义图标
  [key: string]: any; // 允许扩展其他属性
}

// 文件分组数据结构
export interface FileGroup {
  type: FileType;
  typeName: string;
  files: FileItem[];
  collapsed?: boolean; // 是否折叠，仅分组展示时有效
  icon?: ReactNode; // 分组自定义图标
}

// 文件组件数据结构
export interface FileComponentData {
  mode: 'group' | 'flat'; // 展示模式：分组或平铺
  groups?: FileGroup[]; // 分组数据，mode为group时使用
  files?: FileItem[]; // 平铺文件列表，mode为flat时使用
  onGroupDownload?: (files: FileItem[], groupType?: FileType) => void; // 分组下载回调
  onDownload?: (file: FileItem) => void; // 单文件下载回调
  onFileClick?: (file: FileItem) => void; // 文件点击回调
  onToggleGroup?: (groupType: FileType, collapsed: boolean) => void; // 切换分组展开/收起回调
  onPreview?: (file: FileItem) => void; // 文件预览回调
}

// 文件组件属性
export interface FileProps extends BaseChildProps {
  data?: FileComponentData;
}

export interface CustomProps extends BaseChildProps {
  children?: ReactNode;
}
