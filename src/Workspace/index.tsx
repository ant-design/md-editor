import { CloseOutlined } from '@ant-design/icons';
import { ConfigProvider, Segmented } from 'antd';
import classNames from 'classnames';
import React, {
  type FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BrowserList } from './Browser';
import { File } from './File';
import BrowserIcon from './icons/BrowserIcon';
import FileIcon from './icons/FileIcon';
import RealtimeIcon from './icons/RealtimeIcon';
import TaskIcon from './icons/TaskIcon';
import { RealtimeFollowList } from './RealtimeFollow';
import { useWorkspaceStyle } from './style';
import { TaskList } from './Task';
import type {
  BrowserProps,
  CustomProps,
  FileProps,
  RealtimeProps,
  TabConfiguration,
  TabItem,
  TaskProps,
  WorkspaceProps,
} from './types';

// 组件类型枚举
enum ComponentType {
  REALTIME = 'realtime',
  BROWSER = 'browser',
  TASK = 'task',
  FILE = 'file',
  CUSTOM = 'custom',
}

// 默认配置映射
const DEFAULT_CONFIG = {
  [ComponentType.REALTIME]: {
    key: ComponentType.REALTIME,
    icon: <RealtimeIcon />,
    title: '实时跟随',
  },
  [ComponentType.BROWSER]: {
    key: ComponentType.BROWSER,
    icon: <BrowserIcon />,
    title: '浏览器',
  },
  [ComponentType.TASK]: {
    key: ComponentType.TASK,
    icon: <TaskIcon />,
    title: '任务',
  },
  [ComponentType.FILE]: {
    key: ComponentType.FILE,
    icon: <FileIcon />,
    title: '文件',
  },
  [ComponentType.CUSTOM]: {
    key: 'custom',
    icon: null,
    title: '自定义',
  },
} as const;

// 解析标签配置的工具函数
const resolveTabConfig = (
  tab: TabConfiguration | undefined,
  defaultConfig: (typeof DEFAULT_CONFIG)[ComponentType],
  index?: number,
): {
  key: string;
  icon: React.ReactNode;
  title: React.ReactNode;
  count?: number;
} => {
  return {
    key:
      tab?.key || defaultConfig.key + (index !== undefined ? `-${index}` : ''),
    icon: tab?.icon ?? defaultConfig.icon,
    title: tab?.title || defaultConfig.title,
    count: tab?.count,
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

const CustomComponent: FC<CustomProps> = ({ children }) => children || null;

/**
 * Workspace 组件 - 工作空间组件
 *
 * 该组件提供一个多标签页的工作空间界面，支持实时跟随、浏览器、任务、文件等不同类型的标签页。
 * 每个标签页都有独立的图标、标题和内容区域，支持动态切换和自定义配置。
 *
 * @component
 * @description 多标签页工作空间组件，支持多种内容类型
 * @param {WorkspaceProps} props - 组件属性
 * @param {string} [props.activeTabKey] - 当前激活的标签页键值
 * @param {(key: string) => void} [props.onTabChange] - 标签页切换时的回调
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {string} [props.className] - 自定义CSS类名
 * @param {string} [props.title='Workspace'] - 工作空间标题
 * @param {() => void} [props.onClose] - 关闭按钮的回调函数
 * @param {React.ReactNode} props.children - 子组件，通常是各种标签页组件
 *
 * @example
 * ```tsx
 * <Workspace
 *   title="我的工作空间"
 *   activeTabKey="browser"
 *   onTabChange={(key) => console.log('切换到:', key)}
 * >
 *   <Workspace.Browser data={browserData} />
 *   <Workspace.File nodes={fileNodes} />
 *   <Workspace.Task data={taskData} />
 * </Workspace>
 * ```
 *
 * @returns {React.ReactElement} 渲染的工作空间组件
 *
 * @remarks
 * - 支持多种预定义标签页类型：实时跟随、浏览器、任务、文件、自定义
 * - 每个标签页都有默认的图标和标题配置
 * - 支持自定义标签页配置和样式
 * - 提供标签页计数显示功能
 * - 支持关闭按钮和标题自定义
 */
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
  // 使用 ConfigProvider 获取前缀类名
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('workspace');
  const { wrapSSR, hashId } = useWorkspaceStyle(prefixCls);

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
          tabConfig = resolveTabConfig(
            props.tab,
            DEFAULT_CONFIG[ComponentType.REALTIME],
          );
          content = <RealtimeComponent {...props} />;
          break;
        case BrowserComponent:
          tabConfig = resolveTabConfig(
            props.tab,
            DEFAULT_CONFIG[ComponentType.BROWSER],
          );
          content = <BrowserComponent {...props} />;
          break;
        case TaskComponent:
          tabConfig = resolveTabConfig(
            props.tab,
            DEFAULT_CONFIG[ComponentType.TASK],
          );
          content = <TaskComponent {...props} />;
          break;
        case FileComponent:
          tabConfig = resolveTabConfig(
            props.tab,
            DEFAULT_CONFIG[ComponentType.FILE],
          );
          content = <FileComponent {...props} />;
          break;
        case CustomComponent:
          tabConfig = resolveTabConfig(
            props.tab,
            DEFAULT_CONFIG[ComponentType.CUSTOM],
            index,
          );
          content = <CustomComponent {...props} />;
          break;
        default:
          return; // 跳过未知组件类型
      }

      tabs.push({
        key: tabConfig.key,
        label: (
          <div className={classNames(`${prefixCls}-tab-item`, hashId)}>
            {tabConfig.icon}
            <span className={classNames(`${prefixCls}-tab-title`, hashId)}>
              {tabConfig.title}
            </span>
            {tabConfig.count !== undefined && (
              <span className={classNames(`${prefixCls}-tab-count`, hashId)}>
                {tabConfig.count}
              </span>
            )}
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

  const containerClassName = classNames(prefixCls, className, hashId);

  // 无可用标签页时不渲染
  if (availableTabs.length === 0) {
    return null;
  }

  return wrapSSR(
    <div className={containerClassName} style={style}>
      {/* 头部区域 */}
      <div className={classNames(`${prefixCls}-header`, hashId)}>
        <div className={classNames(`${prefixCls}-title`, hashId)}>{title}</div>
        {onClose && (
          <CloseOutlined
            className={classNames(`${prefixCls}-close`, hashId)}
            onClick={onClose}
            aria-label="关闭工作空间"
          />
        )}
      </div>

      {/* 标签页导航 */}
      {availableTabs.length > 1 && (
        <div className={classNames(`${prefixCls}-tabs`, hashId)}>
          <Segmented
            className={classNames(`${prefixCls}-segmented`, hashId)}
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
      <div className={classNames(`${prefixCls}-content`, hashId)}>
        {currentTabData?.content}
      </div>
    </div>,
  );
};

// 绑定子组件
Workspace.Realtime = RealtimeComponent;
Workspace.Browser = BrowserComponent;
Workspace.Task = TaskComponent;
Workspace.File = FileComponent;
Workspace.Custom = CustomComponent;

// 导出类型和组件
export type { HtmlPreviewProps } from './HtmlPreview';
export type {
  BrowserProps,
  CustomProps,
  FileProps,
  RealtimeProps,
  TabConfiguration,
  TabItem,
  TaskProps,
  WorkspaceProps,
} from './types';

export default Workspace;
