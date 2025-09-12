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

// 组件类型枚举
enum ComponentType {
  REALTIME = 'realtime',
  BROWSER = 'browser',
  TASK = 'task',
  FILE = 'file',
  CUSTOM = 'custom',
}

// 默认配置
const DEFAULT_CONFIG = (locale: any) =>
  ({
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
      key: 'custom',
      icon: null,
      title: locale?.['workspace.custom'] || '自定义',
      label: locale?.['workspace.custom'] || '自定义',
    },
  }) as Record<ComponentType, TabItem>;

// 解析 tab 配置
const resolveTabConfig = (
  tab: TabConfiguration | undefined,
  defaultConfig: TabItem,
  index?: number,
) => {
  return {
    key:
      tab?.key || defaultConfig.key + (index !== undefined ? `-${index}` : ''),
    icon: tab?.icon ?? defaultConfig.icon,
    title: tab?.title || defaultConfig.label,
    count: tab?.count,
  };
};

// 子组件
const RealtimeComponent: FC<RealtimeProps> = ({ data }) =>
  data ? <RealtimeFollowList data={data} /> : null;
const BrowserComponent: FC<BrowserProps> = ({ data }) =>
  data ? <BrowserList data={data} /> : null;
const TaskComponent: FC<TaskProps> = ({ data }) =>
  data ? <TaskList data={data} /> : null;
const FileComponent: FC<FileProps> = (props) => <File {...props} />;
const CustomComponent: FC<CustomProps> = ({ children }) => children || null;

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
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const { locale } = useContext(I18nContext);
  const prefixCls = getPrefixCls('workspace');
  const { wrapSSR, hashId } = useWorkspaceStyle(prefixCls);

  const displayTitle = title ?? (locale?.['workspace.title'] || 'Workspace');
  const defaultConfig = DEFAULT_CONFIG(locale);

  // 构造 tabs
  const availableTabs = useMemo((): TabItem[] => {
    const tabs: TabItem[] = [];
    React.Children.forEach(children, (child, index) => {
      if (!React.isValidElement(child)) return;
      const { props, type } = child;
      let tabConfig,
        content: React.ReactNode = null;

      switch (type) {
        case RealtimeComponent:
          tabConfig = resolveTabConfig(
            props.tab,
            defaultConfig[ComponentType.REALTIME],
          );
          content = <RealtimeComponent {...props} />;
          break;
        case BrowserComponent:
          tabConfig = resolveTabConfig(
            props.tab,
            defaultConfig[ComponentType.BROWSER],
          );
          content = <BrowserComponent {...props} />;
          break;
        case TaskComponent:
          tabConfig = resolveTabConfig(
            props.tab,
            defaultConfig[ComponentType.TASK],
          );
          content = <TaskComponent {...props} />;
          break;
        case FileComponent:
          tabConfig = resolveTabConfig(
            props.tab,
            defaultConfig[ComponentType.FILE],
          );
          content = <FileComponent {...props} />;
          break;
        case CustomComponent:
          tabConfig = resolveTabConfig(
            props.tab,
            defaultConfig[ComponentType.CUSTOM],
            index,
          );
          content = <CustomComponent {...props} />;
          break;
        default:
          return;
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
  }, [children, defaultConfig, hashId, prefixCls]);

  // 非受控状态
  const [internalActiveTab, setInternalActiveTab] = useState<string>('');

  // 同步外部/内部 key
  useEffect(() => {
    if (!availableTabs.length) return;

    if (activeTabKey !== undefined) {
      const exists = availableTabs.some((tab) => tab.key === activeTabKey);
      setInternalActiveTab(exists ? activeTabKey : availableTabs[0].key);
    } else {
      if (!internalActiveTab) {
        setInternalActiveTab(availableTabs[0].key);
      }
    }
  }, [activeTabKey, availableTabs]);

  // 获取当前选中 key（兜底）
  const currentActiveTab = useMemo(() => {
    const targetKey = activeTabKey ?? internalActiveTab;
    return availableTabs.some((tab) => tab.key === targetKey)
      ? targetKey
      : (availableTabs[0]?.key ?? '');
  }, [activeTabKey, internalActiveTab, availableTabs]);

  // 切换 tab
  const handleTabChange = (tabKey: string | number) => {
    const key = String(tabKey);
    if (activeTabKey === undefined) {
      setInternalActiveTab(key);
    }
    onTabChange?.(key);
  };

  // 样式
  const containerClassName = classNames(prefixCls, className, hashId);

  // 无 tab 不渲染
  if (!availableTabs.length) return null;

  return wrapSSR(
    <div className={containerClassName} style={style}>
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

      {/* content */}
      <div className={classNames(`${prefixCls}-content`, hashId)}>
        {availableTabs.find((tab) => tab.key === currentActiveTab)?.content}
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
