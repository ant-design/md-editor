import React, { useEffect, useRef } from 'react';
import {
  MarkdownEditor,
  MarkdownEditorInstance,
  MarkdownEditorProps,
} from '../../MarkdownEditor';
import { parserMdToSchema } from '../../MarkdownEditor/editor/parser/parserMdToSchema';
import HtmlIcon from '../icons/HtmlIcon';
import ShellIcon from '../icons/ShellIcon';
import ThinkIcon from '../icons/ThinkIcon';
import './index.less';

export type RealtimeFollowMode = 'shell' | 'html' | 'markdown' | 'md';

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
  title?: string; // 自定义主标题，如"终端执行"
  subTitle?: string; // 自定义副标题，如"创建文件mkdir"
  icon?: React.ComponentType; // 自定义图标
  typewriter?: boolean; // 是否启用打印机效果
  rightContent?: React.ReactNode; // 自定义右侧内容
}

// 获取不同type的配置信息
const getTypeConfig = (type: RealtimeFollowMode) => {
  switch (type) {
    case 'shell':
      return {
        icon: ShellIcon,
        title: '终端执行',
      };
    case 'html':
      return {
        icon: HtmlIcon,
        title: '创建 HTML 文件',
      };
    case 'markdown':
    case 'md':
      return {
        icon: ThinkIcon,
        title: 'Markdown 内容',
      };
    default:
      return {
        icon: ShellIcon,
        title: '终端执行',
      };
  }
};

// 头部组件
const RealtimeHeader: React.FC<{ data: RealtimeFollowData }> = ({ data }) => {
  const config = getTypeConfig(data.type); // 根据传入的类型渲染不同的头部元素

  // 优先使用传入的自定义属性，否则使用默认配置
  const IconComponent = data.icon || config.icon;
  const headerTitle = data.title || config.title;
  const headerSubTitle = data.subTitle;

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
      <div className="chat-realtime-right">{data.rightContent}</div>
    </header>
  );
};

// 获取不同type的MarkdownEditor配置
const getEditorConfig = (
  type: RealtimeFollowMode,
): Partial<MarkdownEditorProps> => {
  const baseConfig = {
    readonly: true,
    toc: false,
    style: { width: '100%' },
    typewriter: true,
  };

  switch (type) {
    case 'shell':
      return {
        ...baseConfig,
        contentStyle: { padding: 0 },
        className: 'chat-realtime--shell',
        codeProps: {
          showGutter: true,
          showLineNumbers: true,
        },
      };
    case 'markdown':
    case 'md':
      return {
        ...baseConfig,
        contentStyle: { padding: 16 },
        className: 'chat-realtime--markdown',
        height: '100%',
      };
    default:
      return baseConfig;
  }
};

export const RealtimeFollow: React.FC<{ data: RealtimeFollowData }> = ({
  data,
}) => {
  const mdInstance = useRef<MarkdownEditorInstance>();
  // 更新编辑器内容的effect
  useEffect(() => {
    if (
      mdInstance.current?.store &&
      (data.type === 'shell' || ['markdown', 'md'].includes(data.type))
    ) {
      const content = String(data.content);
      const { schema } = parserMdToSchema(
        content,
        mdInstance.current.store.plugins,
      );
      mdInstance.current.store.updateNodeList(schema);
    }
  }, [data.content, data.type]);

  if (data.type === 'html') {
    return <div>html</div>;
  }

  if (!['shell', 'markdown', 'md'].includes(data.type)) {
    return null;
  }

  const defaultProps = getEditorConfig(data.type);
  const mergedProps = {
    ...defaultProps,
    ...data.markdownEditorProps,
    typewriter: data.typewriter ?? defaultProps.typewriter,
  };

  return (
    <MarkdownEditor
      {...mergedProps}
      editorRef={mdInstance}
      initValue={String(data.content)}
    />
  );
};

export const RealtimeFollowList: React.FC<{
  data: RealtimeFollowData;
}> = ({ data }) => {
  return (
    <div className="chat-realtime-container">
      <RealtimeHeader data={data} />
      <RealtimeFollow data={data} />
    </div>
  );
};
