import { CloseOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import React, { type FC, useEffect, useMemo, useState } from 'react';
import { BrowserList } from './Browser';
import BrowserIcon from './icons/BrowserIcon';
import FileIcon from './icons/FileIcon';
import RealtimeIcon from './icons/RealtimeIcon';
import TaskIcon from './icons/TaskIcon';
import './index.less';
import { RealtimeFollowList } from './RealtimeFollow';
import { TaskList } from './Task';
import { ExtensionPanelProps, ExtensionTab } from './types';

const CSS_PREFIX = 'ant-extension-panel';

const defaultTabConfigs = [
  {
    key: 'realtime',
    label: (
      <div className={`${CSS_PREFIX}-segmented--item`}>
        <RealtimeIcon />
        实时跟随
      </div>
    ),
  },
  {
    key: 'task',
    label: (
      <div className={`${CSS_PREFIX}-segmented--item`}>
        <TaskIcon />
        任务
      </div>
    ),
  },
  {
    key: 'browser',
    label: (
      <div className={`${CSS_PREFIX}-segmented--item`}>
        <BrowserIcon />
        浏览器
      </div>
    ),
  },
  {
    key: 'file',
    label: (
      <div className={`${CSS_PREFIX}-segmented--item`}>
        <FileIcon />
        文件
      </div>
    ),
  },
] as const;

// 扩展面板组件
const ExtensionPanel: FC<ExtensionPanelProps> = ({
  tabs,
  activeTab,
  onTabChange,
  style,
  className,
  title = 'LUI Chat的工作空间',
  onClose,
  realtimeData,
  taskData,
  browserData,
  fileData,
}) => {
  const availableTabs = useMemo((): ExtensionTab[] => {
    if (tabs) return tabs;
    const dataMap = {
      realtime: realtimeData,
      task: taskData,
      browser: browserData,
      file: fileData,
    };

    return defaultTabConfigs
      .filter((config) => !!dataMap[config.key as keyof typeof dataMap])
      .map((config) => {
        let content: React.ReactNode = null;

        switch (config.key) {
          case 'realtime':
            content = realtimeData ? (
              <RealtimeFollowList item={realtimeData} />
            ) : null;
            break;
          case 'task':
            content = taskData ? <TaskList item={taskData} /> : null;
            break;
          case 'browser':
            content = browserData ? <BrowserList item={browserData} /> : null;
            break;
          case 'file':
            content = fileData || null;
            break;
        }

        return {
          key: config.key,
          label: config.label,
          content,
        };
      });
  }, [tabs, realtimeData, taskData, browserData, fileData]);

  const [internalActiveTab, setInternalActiveTab] = useState<string>('');

  useEffect(() => {
    if (activeTab !== undefined) {
      setInternalActiveTab(activeTab);
    } else if (availableTabs.length > 0 && !internalActiveTab) {
      setInternalActiveTab(availableTabs[0].key);
    }
  }, [activeTab, availableTabs, internalActiveTab]);

  const currentActiveTab = activeTab ?? internalActiveTab;
  const currentTabData = useMemo(
    () => availableTabs.find((tab) => tab.key === currentActiveTab),
    [availableTabs, currentActiveTab],
  );

  const handleTabChange = (tabKey: string | number) => {
    const key = tabKey as string;
    if (activeTab === undefined) {
      setInternalActiveTab(key);
    }
    onTabChange?.(key);
  };

  if (availableTabs.length === 0) {
    return null;
  }

  return (
    <div
      className={[CSS_PREFIX, className].filter(Boolean).join(' ')}
      style={style}
    >
      <div className={`${CSS_PREFIX}-header`}>
        <div className={`${CSS_PREFIX}-title`}>{title}</div>
        {onClose && (
          <CloseOutlined className={`${CSS_PREFIX}-close`} onClick={onClose} />
        )}
      </div>

      {availableTabs.length > 1 && (
        <div className={`${CSS_PREFIX}-tabs`}>
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

      <div className={`${CSS_PREFIX}-content`}>{currentTabData?.content}</div>
    </div>
  );
};

export type { ExtensionPanelProps, ExtensionTab } from './types';
export default ExtensionPanel;
