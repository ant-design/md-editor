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
import { ChatExtensionPanelProps, ChatExtensionTab } from './types';

const defaultTabs: ChatExtensionTab[] = [
  {
    key: 'realtime',
    label: (
      <div className="ant-chat-extension-panel-segmented--item">
        <RealtimeIcon />
        实时跟随
      </div>
    ),
  },
  {
    key: 'task',
    label: (
      <div className="ant-chat-extension-panel-segmented--item">
        <TaskIcon />
        任务
      </div>
    ),
  },
  {
    key: 'browser',
    label: (
      <div className="ant-chat-extension-panel-segmented--item">
        <BrowserIcon />
        浏览器
      </div>
    ),
  },
  {
    key: 'file',
    label: (
      <div className="ant-chat-extension-panel-segmented--item">
        <FileIcon />
        文件
      </div>
    ),
  },
];

const ChatExtensionPanel: FC<ChatExtensionPanelProps> = ({
  tabs,
  activeKey,
  onTabChange,
  style,
  title = 'LUI Chat的工作空间',
  onClose,
  realtime,
  task,
  browser,
  file,
}) => {
  // 选择使用的 tabs
  const usedTabs = useMemo(() => {
    if (tabs) return tabs;

    // 根据传入的 props 过滤和渲染 tabs
    return defaultTabs
      .filter((tab) => {
        switch (tab.key) {
          case 'realtime':
            return !!realtime;
          case 'task':
            return !!task;
          case 'browser':
            return !!browser;
          case 'file':
            return !!file;
          default:
            return false;
        }
      })
      .map((tab) => {
        let content: React.ReactNode;

        switch (tab.key) {
          case 'realtime':
            content = realtime ? <RealtimeFollowList item={realtime} /> : null;
            break;
          case 'task':
            content = task ? <TaskList item={task} /> : null;
            break;
          case 'browser':
            content = browser ? <BrowserList item={browser} /> : null;
            break;
          case 'file':
            content = file || null;
            break;
          default:
            content = null;
        }

        return {
          ...tab,
          content,
        };
      });
  }, [tabs, realtime, task, browser, file]);

  // 内部状态用于非受控模式
  const [selectedKey, setSelectedKey] = useState<string>(
    activeKey ?? usedTabs[0]?.key ?? '',
  );

  // 外部 activeKey 变化时同步内部状态
  useEffect(() => {
    if (activeKey !== undefined) {
      setSelectedKey(activeKey);
    }
  }, [activeKey]);

  // 当前选中的 key
  const currentKey = activeKey !== undefined ? activeKey : selectedKey;
  const currentTab = useMemo(
    () => usedTabs.find((tab) => tab.key === currentKey),
    [usedTabs, currentKey],
  );

  // 切换逻辑
  const handleChange = (val: string | number) => {
    if (activeKey === undefined) {
      setSelectedKey(val as string);
    }
    onTabChange?.(val as string);
  };

  return (
    <div className="ant-chat-extension-panel" style={style}>
      <div className="ant-chat-extension-panel-header">
        <div className="ant-chat-extension-panel-title">{title}</div>
        {onClose && (
          <CloseOutlined
            className="ant-chat-extension-panel-oper"
            onClick={onClose}
          />
        )}
      </div>
      <div className="ant-chat-extension-panel-segmented">
        <Segmented
          options={usedTabs.map((tab) => ({
            label: tab.label,
            value: tab.key,
          }))}
          value={currentKey}
          onChange={handleChange}
          block
        />
      </div>
      <div>{currentTab?.content}</div>
    </div>
  );
};

export default ChatExtensionPanel;
