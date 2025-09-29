import { CloseOutlined } from '@ant-design/icons';
import {
  FileStack,
  Language,
  ListTodo,
  MousePointerClick,
} from '@sofa-design/icons';
import { ConfigProvider, Segmented } from 'antd';
import classNames from 'classnames';
import React, {
  FC,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { I18nContext } from '../i18n';
import { BrowserList } from './Browser';
import { File } from './File';
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

export type { FileActionRef } from './types';

enum ComponentType {
  REALTIME = 'realtime',
  BROWSER = 'browser',
  TASK = 'task',
  FILE = 'file',
  CUSTOM = 'custom',
}

const DEFAULT_CONFIG = (locale: any): Record<ComponentType, TabItem> => ({
  [ComponentType.REALTIME]: {
    key: ComponentType.REALTIME,
    icon: <MousePointerClick />,
    title: locale?.['workspace.realtimeFollow'] || '实时跟随',
    label: locale?.['workspace.realtimeFollow'] || '实时跟随',
  },
  [ComponentType.BROWSER]: {
    key: ComponentType.BROWSER,
    icon: <Language />,
    title: locale?.['workspace.browser'] || '浏览器',
    label: locale?.['workspace.browser'] || '浏览器',
  },
  [ComponentType.TASK]: {
    key: ComponentType.TASK,
    icon: <ListTodo />,
    title: locale?.['workspace.task'] || '任务',
    label: locale?.['workspace.task'] || '任务',
  },
  [ComponentType.FILE]: {
    key: ComponentType.FILE,
    icon: <FileStack />,
    title: locale?.['workspace.file'] || '文件',
    label: locale?.['workspace.file'] || '文件',
  },
  [ComponentType.CUSTOM]: {
    key: ComponentType.CUSTOM,
    icon: null,
    title: locale?.['workspace.custom'] || '自定义',
    label: locale?.['workspace.custom'] || '自定义',
  },
});

const resolveTabConfig = (
  tab: TabConfiguration | undefined,
  defaultConfig: TabItem,
  index?: number,
) => ({
  key: tab?.key || defaultConfig.key + (index !== undefined ? `-${index}` : ''),
  icon: tab?.icon ?? defaultConfig.icon,
  title: tab?.title || defaultConfig.label,
  count: tab?.count,
});

// 子组件
const RealtimeComponent: FC<RealtimeProps> = ({ data }) =>
  data ? <RealtimeFollowList data={data} /> : null;
const BrowserComponent: FC<BrowserProps> = ({ data }) =>
  data ? <BrowserList data={data} /> : null;
const TaskComponent: FC<TaskProps> = ({ data }) =>
  data ? <TaskList data={data} /> : null;
const FileComponent: FC<FileProps> = (props) => <File {...props} />;
const CustomComponent: FC<CustomProps> = ({ children }) => children || null;

// 组件类型限制
type WorkspaceChildComponent =
  | typeof RealtimeComponent
  | typeof BrowserComponent
  | typeof TaskComponent
  | typeof FileComponent
  | typeof CustomComponent;

const COMPONENT_MAP = new Map<WorkspaceChildComponent, ComponentType>([
  [RealtimeComponent, ComponentType.REALTIME],
  [BrowserComponent, ComponentType.BROWSER],
  [TaskComponent, ComponentType.TASK],
  [FileComponent, ComponentType.FILE],
  [CustomComponent, ComponentType.CUSTOM],
]);

/**
 * Workspace 组件 - 工作空间组件
 *
 * 该组件提供一个多标签页的工作空间界面，支持实时跟随、浏览器、任务、文件等多种功能模块。
 * 每个标签页可以独立配置，支持自定义图标、标题、计数等功能。
 *
 * @component
 * @description 工作空间组件，提供多标签页功能模块管理
 * @param {WorkspaceProps} props - 组件属性
 * @param {string} [props.activeTabKey] - 当前激活的标签页key
 * @param {(key: string) => void} [props.onTabChange] - 标签页切换回调
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {string} [props.className] - 自定义CSS类名
 * @param {string} [props.title] - 工作空间标题
 * @param {() => void} [props.onClose] - 关闭回调
 * @param {React.ReactNode} [props.children] - 子组件，支持Workspace.Realtime、Workspace.Browser等
 *
 * @example
 * ```tsx
 * <Workspace
 *   title="我的工作空间"
 *   activeTabKey="realtime"
 *   onTabChange={(key) => console.log('切换到:', key)}
 *   onClose={() => console.log('关闭工作空间')}
 * >
 *   <Workspace.Realtime data={realtimeData} />
 *   <Workspace.Browser data={browserData} />
 *   <Workspace.Task data={taskData} />
 *   <Workspace.File {...fileProps} />
 * </Workspace>
 * ```
 *
 * @returns {React.ReactElement} 渲染的工作空间组件
 *
 * @remarks
 * - 支持多种功能模块标签页
 * - 自动根据子组件生成标签页
 * - 支持标签页的展开/折叠状态管理
 * - 提供响应式布局适配
 * - 支持自定义标签页配置
 * - 集成国际化支持
 * - 提供关闭功能
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
  title,
  onClose,
  children,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const { locale } = useContext(I18nContext);
  const prefixCls = getPrefixCls('workspace');
  const { wrapSSR, hashId } = useWorkspaceStyle(prefixCls);

  const containerRef = useRef<HTMLDivElement>(null);
  const [segmentedKey, setSegmentedKey] = useState(0); // ⭐ 用于强制刷新 Segmented

  const displayTitle = title ?? (locale?.['workspace.title'] || 'Workspace');
  const defaultConfig = DEFAULT_CONFIG(locale);
  const [internalActiveTab, setInternalActiveTab] = useState('');

  // 构造 tabs
  const availableTabs = useMemo((): TabItem[] => {
    const tabs: TabItem[] = [];
    React.Children.forEach(children, (child, index) => {
      if (!React.isValidElement(child)) return;
      const componentType = COMPONENT_MAP.get(
        child.type as WorkspaceChildComponent,
      );
      if (!componentType) return;

      const tabConfig = resolveTabConfig(
        child.props.tab,
        defaultConfig[componentType],
        componentType === ComponentType.CUSTOM ? index : undefined,
      );
      tabs.push({
        key: tabConfig.key,
        icon: tabConfig.icon,
        label: (
          <div className={classNames(`${prefixCls}-tab-item`, hashId)}>
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
        content: React.createElement(child.type, child.props),
      });
    });
    return tabs;
  }, [children, defaultConfig, hashId, prefixCls]);

  // 同步 activeTab 状态
  useEffect(() => {
    if (!availableTabs.length) return;
    const isControlled = activeTabKey !== undefined;
    const currentKey = isControlled ? activeTabKey : internalActiveTab;

    if (!availableTabs.some((tab) => tab.key === currentKey)) {
      const firstKey = availableTabs[0].key;
      if (!isControlled) setInternalActiveTab(firstKey);
      onTabChange?.(firstKey);
    } else if (isControlled) {
      setInternalActiveTab(currentKey!);
    }
  }, [availableTabs, activeTabKey, internalActiveTab, onTabChange]);

  // 🚀 关键修复：监听容器宽度变化，强制 Segmented 重新渲染
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    let lastWidth = el.getBoundingClientRect().width;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0 && lastWidth === 0) {
          // 从隐藏状态切换到显示状态，强制刷新 Segmented
          setSegmentedKey((k) => k + 1);
        }
        lastWidth = width;
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const currentActiveTab =
    availableTabs.find((tab) => tab.key === (activeTabKey ?? internalActiveTab))
      ?.key ??
    availableTabs[0]?.key ??
    '';

  const handleTabChange = (key: string | number) => {
    const tabKey = String(key);
    if (activeTabKey === undefined) setInternalActiveTab(tabKey);
    onTabChange?.(tabKey);
  };

  if (!availableTabs.length) return null;

  return wrapSSR(
    <div
      ref={containerRef}
      className={classNames(prefixCls, className, hashId)}
      style={style}
      data-testid="workspace"
    >
      {/* header */}
      <div
        className={classNames(`${prefixCls}-header`, hashId)}
        data-testid="workspace-header"
      >
        <div
          className={classNames(`${prefixCls}-title`, hashId)}
          data-testid="workspace-title"
        >
          {displayTitle}
        </div>
        {onClose && (
          <CloseOutlined
            className={classNames(`${prefixCls}-close`, hashId)}
            onClick={onClose}
            aria-label={locale?.['workspace.closeWorkspace'] || '关闭工作空间'}
            data-testid="workspace-close"
          />
        )}
      </div>

      {/* tabs */}
      {availableTabs.length > 1 && (
        <div
          className={classNames(`${prefixCls}-tabs`, hashId)}
          data-testid="workspace-tabs"
        >
          <Segmented
            key={segmentedKey} // ⭐ 每次宽度从 0 变为 >0，重新挂载
            className={classNames(`${prefixCls}-segmented`, hashId)}
            options={availableTabs.map(({ label, key, icon }) => ({
              label,
              value: key,
              icon,
            }))}
            value={currentActiveTab}
            onChange={handleTabChange}
            block
            data-testid="workspace-segmented"
          />
        </div>
      )}

      {/* content */}
      <div
        className={classNames(`${prefixCls}-content`, hashId)}
        data-testid="workspace-content"
      >
        {availableTabs.find((tab) => tab.key === currentActiveTab)?.content}
      </div>
    </div>,
  );
};

Workspace.Realtime = RealtimeComponent;
Workspace.Browser = BrowserComponent;
Workspace.Task = TaskComponent;
Workspace.File = FileComponent;
Workspace.Custom = CustomComponent;

export * from './File';
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
