import React, { type ReactNode } from 'react';
import type { BrowserItemInput } from './Browser';
import type { RealtimeFollowItemInput } from './RealtimeFollow';
import type { TaskItemInput } from './Task';

export interface ChatExtensionTab {
  key: string;
  label: ReactNode;
  content?: ReactNode; // content 变为可选
}

export interface ChatExtensionPanelProps {
  tabs?: ChatExtensionTab[];
  activeKey?: string;
  onTabChange?: (key: string) => void;
  style?: React.CSSProperties;
  title?: ReactNode;
  onClose?: () => void;
  realtime?: RealtimeFollowItemInput;
  task?: TaskItemInput;
  browser?: BrowserItemInput;
  file?: ReactNode; // 暂时使用 ReactNode，后续可以根据需要定义具体类型
}
