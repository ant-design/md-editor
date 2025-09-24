import { CloseOutlined } from '@ant-design/icons';
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
    icon: <RealtimeIcon />,
    title: locale?.['workspace.realtimeFollow'] || '实时跟随',
    label: locale?.['workspace.realtimeFollow'] || '实时跟随',
  },
  [ComponentType.BROWSER]: {
    key: ComponentType.BROWSER,
    icon: <BrowserIcon />,
    title: locale?.['workspace.browser'] || '浏览器',
    label: locale?.['workspace.browser'] || '浏览器',
  },
  [ComponentType.TASK]: {
    key: ComponentType.TASK,
    icon: <TaskIcon />,
    title: locale?.['workspace.task'] || '任务',
    label: locale?.['workspace.task'] || '任务',
  },
  [ComponentType.FILE]: {
    key: ComponentType.FILE,
    icon: <FileIcon />,
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
    >
      {/* header */}
      <div className={classNames(`${prefixCls}-header`, hashId)}>
        <div className={classNames(`${prefixCls}-title`, hashId)}>
          {displayTitle}
        </div>
        {onClose && (
          <CloseOutlined
            className={classNames(`${prefixCls}-close`, hashId)}
            onClick={onClose}
            aria-label={locale?.['workspace.closeWorkspace'] || '关闭工作空间'}
          />
        )}
      </div>

      {/* tabs */}
      {availableTabs.length > 1 && (
        <div className={classNames(`${prefixCls}-tabs`, hashId)}>
          <Segmented
            key={segmentedKey} // ⭐ 每次宽度从 0 变为 >0，重新挂载
            className={classNames(`${prefixCls}-segmented`, hashId)}
            options={availableTabs.map(({ label, key }) => ({
              label,
              value: key,
            }))}
            value={currentActiveTab}
            onChange={handleTabChange}
            block
          />
        </div>
      )}

      {/* content */}
      <div className={classNames(`${prefixCls}-content`, hashId)}>
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
