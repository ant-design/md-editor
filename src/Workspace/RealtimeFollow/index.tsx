import { Segmented } from 'antd';
import React, { useState } from 'react';
import { MarkdownEditor, MarkdownEditorProps } from '../../MarkdownEditor';
import HtmlIcon from '../icons/HtmlIcon';
import ShellIcon from '../icons/ShellIcon';
import ThinkIcon from '../icons/ThinkIcon';
import './index.less';

export type RealtimeFollowMode = 'shell' | 'html' | 'markdown';

export interface DiffContent {
  original: string;
  modified: string;
}

export interface HtmlContent {
  html: string;
  status?: 'generating' | 'done' | 'error';
}

export interface RealtimeFollowData {
  type: RealtimeFollowMode;
  content: string | DiffContent | HtmlContent;
  // 支持MarkdownEditor的所有配置项
  markdownEditorProps?: Partial<MarkdownEditorProps>;
  // 新增：可自定义的显示属性
  customTitle?: string; // 自定义主标题，如"终端执行"
  customSubTitle?: string; // 自定义副标题，如"创建文件mkdir"
  customIcon?: React.ComponentType; // 自定义图标
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
    case 'html':
      return {
        icon: HtmlIcon,
        title: '创建 HTML 文件',
        segmentedOptions: ['预览', '代码'],
      };
    case 'markdown':
      return {
        icon: ThinkIcon,
        title: 'Markdown 内容',
        segmentedOptions: null,
      };
    default:
      return {
        icon: ShellIcon,
        title: '终端执行',
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
const RealtimeHeader: React.FC<{ data: RealtimeFollowData }> = ({
  data,
}) => {
  const config = getTypeConfig(data.type); // 根据传入的类型渲染不同的头部元素
  
  // 优先使用传入的自定义属性，否则使用默认配置
  const IconComponent = data.customIcon || config.icon;
  const headerTitle = data.customTitle || config.title;
  const headerSubTitle = data.customSubTitle;

  return (
    <header
      className="chat-realtime-header"
      style={{
        borderBottom: ['html', 'markdown'].includes(data.type)
          ? '1px solid rgba(20, 22, 28, 0.07)'
          : 'none',
      }}
    >
      <div className="chat-realtime-header-left">
        <div
          className="chat-realtime-header-icon"
          style={{ background: data?.type === 'html' ? '#E0F9FF' : '#EEF1F6' }}
        >
          <IconComponent />
        </div>
        <div className="chat-realtime-header-content">
          <div className="chat-realtime-header-title">{headerTitle}</div>
          <div className="chat-realtime-header-subtitle">{headerSubTitle}</div>
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

export const RealtimeFollow: React.FC<{ data: RealtimeFollowData }> = ({
  data,
}) => {
  // 默认的MarkdownEditor配置
  const getDefaultProps = (): Partial<MarkdownEditorProps> => ({
    readonly: true,
    toc: false,
    style: { width: '100%' },
    contentStyle: { padding: data.type === 'markdown' ? 16 : 0 },
  });

  // 合并默认配置和用户传入的配置
  const getMergedProps = (
    defaultProps: Partial<MarkdownEditorProps>,
  ): Partial<MarkdownEditorProps> => {
    return {
      ...defaultProps,
      ...data.markdownEditorProps,
    };
  };

  switch (data.type) {
    case 'shell':
      return (
        <MarkdownEditor
          {...getMergedProps({
            codeProps: {
              // theme: 'vs-dark', // TODO:黑色主题不生效
              showGutter: true, // 显示行号
              showLineNumbers: true, // 显示行号
            },
            ...getDefaultProps(),
            className: 'chat-realtime--shell',
          })}
          initValue={String(data.content)}
        />
      );
    case 'html': {
      return (
        // 创建html文件：展示html文件的预览和代码
        <div>html</div>
      );
    }
    case 'markdown': {
      return (
        <MarkdownEditor
          {...getMergedProps({
            height: 550,
            ...getDefaultProps(),
            className: 'chat-realtime--markdown',
          })}
          initValue={String(data.content)}
        />
      );
    }
    default:
      return null;
  }
};

export const RealtimeFollowList: React.FC<{
  data: RealtimeFollowData; // 改为单个对象
}> = ({ data }) => {
  return (
    <div>
      <RealtimeHeader data={data} />
      <RealtimeFollow data={data} />
    </div>
  );
};
