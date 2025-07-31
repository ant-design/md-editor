import { CloseOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import React, { type FC, useEffect, useMemo, useState } from 'react';
import { BrowserList } from './Browser';
import { File } from './File';
import BrowserIcon from './icons/BrowserIcon';
import FileIcon from './icons/FileIcon';
import RealtimeIcon from './icons/RealtimeIcon';
import TaskIcon from './icons/TaskIcon';
import './index.less';
import { RealtimeFollowList } from './RealtimeFollow';
import { TaskList } from './Task';
import type { 
  WorkspaceProps, 
  TabItem,
  RealtimeProps,
  BrowserProps,
  TaskProps,
  FileProps,
  CustomProps,
  TabConfiguration
} from './types';

const CSS_PREFIX = 'workspace';

// 组件类型枚举
enum ComponentType {
  REALTIME = 'realtime',
  BROWSER = 'browser', 
  TASK = 'task',
  FILE = 'file',
  CUSTOM = 'custom'
}

// 默认配置映射
const DEFAULT_CONFIG = {
  [ComponentType.REALTIME]: {
    key: ComponentType.REALTIME,
    icon: <RealtimeIcon />,
    title: '实时跟随'
  },
  [ComponentType.BROWSER]: {
    key: ComponentType.BROWSER,
    icon: <BrowserIcon />,
    title: '浏览器'
  },
  [ComponentType.TASK]: {
    key: ComponentType.TASK,
    icon: <TaskIcon />,
    title: '任务'
  },
  [ComponentType.FILE]: {
    key: ComponentType.FILE,
    icon: <FileIcon />,
    title: '文件'
  },
  [ComponentType.CUSTOM]: {
    key: 'custom',
    icon: null,
    title: '自定义'
  }
} as const;

// 解析标签配置的工具函数
const resolveTabConfig = (
  tab: TabConfiguration | undefined,
  defaultConfig: typeof DEFAULT_CONFIG[ComponentType],
  index?: number
): { key: string; icon: React.ReactNode; title: string } => {
  return {
    key: tab?.key || defaultConfig.key + (index !== undefined ? `-${index}` : ''),
    icon: tab?.icon ?? defaultConfig.icon,
    title: tab?.title || defaultConfig.title,
  };
};

// 子组件定义
const RealtimeComponent: FC<RealtimeProps> = ({ data }) => 
  data ? <RealtimeFollowList data={data} /> : null;

const BrowserComponent: FC<BrowserProps> = ({ data }) => 
  data ? <BrowserList data={data} /> : null;

const TaskComponent: FC<TaskProps> = ({ data }) => 
  data ? <TaskList data={data} /> : null;

const FileComponent: FC<FileProps> = (props) => <File {...props} />;

const CustomComponent: FC<CustomProps> = ({ children }) => 
  children || null;

// 主组件
const Workspace: FC<WorkspaceProps> & {
  Realtime: typeof RealtimeComponent;
  Browser: typeof BrowserComponent;
  Task: typeof TaskComponent;
  File: typeof FileComponent;
  Custom: typeof CustomComponent;
} = ({
  activeTabKey,
  onTabChange,
  style,
  className,
  title = 'Workspace',
  onClose,
  children,
}) => {
  // 构建可用标签页
  const availableTabs = useMemo((): TabItem[] => {
    const tabs: TabItem[] = [];

    React.Children.forEach(children, (child, index) => {
      if (!React.isValidElement(child)) return;

      const { props, type } = child;
      let tabConfig: ReturnType<typeof resolveTabConfig>;
      let content: React.ReactNode = null;

      // 根据组件类型解析配置
      switch (type) {
        case RealtimeComponent:
          tabConfig = resolveTabConfig(props.tab, DEFAULT_CONFIG[ComponentType.REALTIME]);
          content = <RealtimeComponent {...props} />;
          break;
        case BrowserComponent:
          tabConfig = resolveTabConfig(props.tab, DEFAULT_CONFIG[ComponentType.BROWSER]);
          content = <BrowserComponent {...props} />;
          break;
        case TaskComponent:
          tabConfig = resolveTabConfig(props.tab, DEFAULT_CONFIG[ComponentType.TASK]);
          content = <TaskComponent {...props} />;
          break;
        case FileComponent:
          tabConfig = resolveTabConfig(props.tab, DEFAULT_CONFIG[ComponentType.FILE]);
          content = <FileComponent {...props} />;
          break;
        case CustomComponent:
          tabConfig = resolveTabConfig(props.tab, DEFAULT_CONFIG[ComponentType.CUSTOM], index);
          content = <CustomComponent {...props} />;
          break;
        default:
          return; // 跳过未知组件类型
      }

      tabs.push({
        key: tabConfig.key,
        label: (
          <div className={`${CSS_PREFIX}__tab-item`}>
            {tabConfig.icon}
            <span className={`${CSS_PREFIX}__tab-title`}>{tabConfig.title}</span>
          </div>
        ),
        content,
      });
    });

    return tabs;
  }, [children]);

  // 活跃标签页状态管理
  const [internalActiveTab, setInternalActiveTab] = useState<string>('');

  useEffect(() => {
    if (activeTabKey !== undefined) {
      setInternalActiveTab(activeTabKey);
    } else if (availableTabs.length > 0 && !internalActiveTab) {
      setInternalActiveTab(availableTabs[0].key);
    }
  }, [activeTabKey, availableTabs, internalActiveTab]);

  const currentActiveTab = activeTabKey ?? internalActiveTab;
  const currentTabData = useMemo(
    () => availableTabs.find((tab) => tab.key === currentActiveTab),
    [availableTabs, currentActiveTab],
  );

  // 标签页切换处理
  const handleTabChange = (tabKey: string | number) => {
    const key = String(tabKey);
    if (activeTabKey === undefined) {
      setInternalActiveTab(key);
    }
    onTabChange?.(key);
  };

  // 无可用标签页时不渲染
  if (availableTabs.length === 0) {
    return null;
  }

  const containerClassName = [CSS_PREFIX, className].filter(Boolean).join(' ');

  return (
    <div className={containerClassName} style={style}>
      {/* 头部区域 */}
      <div className={`${CSS_PREFIX}__header`}>
        <div className={`${CSS_PREFIX}__title`}>{title}</div>
        {onClose && (
          <CloseOutlined 
            className={`${CSS_PREFIX}__close`} 
            onClick={onClose} 
            aria-label="关闭工作空间"
          />
        )}
      </div>

      {/* 标签页导航 */}
      {availableTabs.length > 1 && (
        <div className={`${CSS_PREFIX}__tabs`}>
          <Segmented
            options={availableTabs.map((tab) => ({
              label: tab.label,
              value: tab.key,
            }))}
            value={currentActiveTab}
            onChange={handleTabChange}
            block
          />
        </div>
      )}

      {/* 内容区域 */}
      <div className={`${CSS_PREFIX}__content`}>
        {currentTabData?.content}
      </div>
    </div>
  );
};

// 绑定子组件
Workspace.Realtime = RealtimeComponent;
Workspace.Browser = BrowserComponent;
Workspace.Task = TaskComponent;
Workspace.File = FileComponent;
Workspace.Custom = CustomComponent;

// 导出类型和组件
export type { 
  WorkspaceProps, 
  TabItem, 
  TabConfiguration,
  RealtimeProps,
  BrowserProps,
  TaskProps,
  FileProps,
  CustomProps
} from './types';

export default Workspace;
