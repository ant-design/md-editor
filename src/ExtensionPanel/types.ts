import React, { type ReactNode } from 'react';
import type { BrowserItemInput } from './Browser';
import type { RealtimeFollowItemInput } from './RealtimeFollow';
import type { TaskItemInput } from './Task';

export interface ExtensionTab {
  key: string;
  label: ReactNode;
  content?: ReactNode;
}

export interface ExtensionPanelProps {
  tabs?: ExtensionTab[];
  activeTab?: string;
  onTabChange?: (tabKey: string) => void;
  style?: React.CSSProperties;
  className?: string;
  title?: ReactNode;
  onClose?: () => void;
  realtimeData?: RealtimeFollowItemInput;
  taskData?: TaskItemInput;
  browserData?: BrowserItemInput;
  fileData?: ReactNode;
}
