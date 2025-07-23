import { Segmented } from 'antd';
import React, { useState } from 'react';
import { MarkdownEditor, MarkdownEditorProps } from '../../MarkdownEditor';
import HtmlIcon from '../icons/HtmlIcon';
import ShellIcon from '../icons/ShellIcon';
import TaskPlanIcon from '../icons/TaskPlanIcon';
import ThinkIcon from '../icons/ThinkIcon';
import './index.less';

export type RealtimeFollowMode = 'shell' | 'task' | 'html' | 'think';

export interface DiffContent {
  original: string;
  modified: string;
}
export interface HtmlContent {
  html: string;
  status?: 'generating' | 'done' | 'error';
}
export interface ThinkContent {
  text: string;
}
export interface RealtimeFollowItemInput {
  type: RealtimeFollowMode;
  title?: string;
  content: string | DiffContent | HtmlContent | ThinkContent;
  // 支持MarkdownEditor的所有配置项
  markdownEditorProps?: Partial<MarkdownEditorProps>;
}

// 获取不同type的配置信息
const getTypeConfig = (type: RealtimeFollowMode) => {
  switch (type) {
    case 'shell':
      return {
        icon: ShellIcon,
        title: '终端执行',
        segmentedOptions: null,
      };
    case 'task':
      return {
        icon: TaskPlanIcon,
        title: '任务规划',
        segmentedOptions: ['差异', '原始', '已修改'],
      };
    case 'html':
      return {
        icon: HtmlIcon,
        title: '创建 HTML 文件',
        segmentedOptions: ['预览', '代码'],
      };
    case 'think':
      return {
        icon: ThinkIcon,
        title: '深度思考',
        segmentedOptions: null,
      };
    default:
      return {
        icon: ShellIcon,
        defaultTitle: '终端执行',
        segmentedOptions: null,
      };
  }
};

// Segmented 组件
const SegmentedControl: React.FC<{ options: string[] }> = ({ options }) => {
  const [selectedValue, setSelectedValue] = useState<string>(options[0]);

  return (
    <div className="chat-realtime-segmented-control">
      <Segmented
        options={options}
        value={selectedValue}
        onChange={(value) => {
          setSelectedValue(value as string);
          // TODO: 实现选项切换事件
          console.log(`切换到 ${value} 选项`);
        }}
        size="small"
      />
    </div>
  );
};

// 头部组件
const RealtimeHeader: React.FC<{ item: RealtimeFollowItemInput }> = ({
  item,
}) => {
  const config = getTypeConfig(item.type); // 根据传入的类型渲染不同的头部元素
  const IconComponent = config.icon;

  return (
    <header className="chat-realtime-header">
      <div className="chat-realtime-header-left">
        <div
          className="chat-realtime-header-icon"
          style={{ background: item?.type === 'html' ? '#E0F9FF' : '#EEF1F6' }}
        >
          <IconComponent />
        </div>
        <div className="chat-realtime-header-content">
          <div className="chat-realtime-header-title">{config.title}</div>
          <div className="chat-realtime-header-subtitle">{item?.title}</div>
        </div>
      </div>
      <div className="chat-realtime-right">
        {config.segmentedOptions && (
          <SegmentedControl options={config.segmentedOptions} />
        )}
      </div>
    </header>
  );
};

export const RealtimeFollow: React.FC<{ item: RealtimeFollowItemInput }> = ({
  item,
}) => {
  // 默认的MarkdownEditor配置
  const getDefaultProps = (): Partial<MarkdownEditorProps> => ({
    readonly: true,
    toc: false,
    style: { width: '100%' },
    contentStyle: { padding: 0 },
  });

  // 合并默认配置和用户传入的配置
  const getMergedProps = (
    defaultProps: Partial<MarkdownEditorProps>,
  ): Partial<MarkdownEditorProps> => {
    return {
      ...defaultProps,
      ...item.markdownEditorProps,
    };
  };

  switch (item.type) {
    case 'shell':
      return (
        <MarkdownEditor
          {...getMergedProps({
            ...getDefaultProps(),
            className: 'chat-realtime--shell',
            codeProps: {
              theme: 'vs-dark', // TODO:黑色主题不生效
              showGutter: true, // 显示行号
              showLineNumbers: true, // 显示行号
            },
          })}
          initValue={String(item.content)}
        />
      );
    case 'task': {
      // 任务规划：进行文件对比，展示差异、原始、已修改
      return (
        <MarkdownEditor
          {...getMergedProps({
            ...getDefaultProps(),
            codeProps: {
              showGutter: true, // 显示行号
              showLineNumbers: true, // 显示行号
            },
          })}
          initValue={String(item.content)}
        />
      );
    }
    case 'html': {
      return (
        // 创建html文件：展示html文件的预览和代码
        <div>html</div>
      );
    }
    case 'think': {
      return (
        <MarkdownEditor
          {...getMergedProps(getDefaultProps())}
          initValue={String(item.content)}
        />
      );
    }
    default:
      return null;
  }
};

export const RealtimeFollowList: React.FC<{
  item: RealtimeFollowItemInput; // 改为单个对象
}> = ({ item }) => {
  return (
    <div>
      <RealtimeHeader item={item} />
      <RealtimeFollow item={item} />
    </div>
  );
};
