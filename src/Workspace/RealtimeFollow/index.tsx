import useAutoScroll from '@ant-design/md-editor/hooks/useAutoScroll';
import {
  FileMarkdown,
  FileXml,
  ArrowLeft as LeftIcon,
  SquareTerminal,
} from '@sofa-design/icons';
import { ConfigProvider, Empty, Segmented, Spin } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { I18nContext } from '../../i18n';
import {
  MarkdownEditor,
  MarkdownEditorInstance,
  MarkdownEditorProps,
} from '../../MarkdownEditor';
import { parserMdToSchema } from '../../MarkdownEditor/editor/parser/parserMdToSchema';
import { HtmlPreview } from '../HtmlPreview';
import { useRealtimeFollowStyle } from './style';
export type RealtimeFollowMode =
  | 'shell'
  | 'html'
  | 'markdown'
  | 'md'
  | 'default';

export interface DiffContent {
  original: string;
  modified: string;
}

export interface RealtimeFollowData {
  type: RealtimeFollowMode;
  content?: string | DiffContent;
  markdownEditorProps?: Partial<MarkdownEditorProps>;
  title?: string;
  subTitle?: string;
  icon?: React.ComponentType;
  typewriter?: boolean;
  rightContent?: React.ReactNode;
  loadingRender?: React.ReactNode | (() => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
  errorRender?: React.ReactNode | (() => React.ReactNode);
  emptyRender?: React.ReactNode | (() => React.ReactNode);
  status?: 'loading' | 'done' | 'error';
  onBack?: () => void;
  /** 自定义渲染内容，传入后将直接渲染该内容，忽略其他渲染逻辑 */
  customContent?: React.ReactNode | (() => React.ReactNode);
  // HTML 类型专用配置
  viewMode?: 'preview' | 'code';
  defaultViewMode?: 'preview' | 'code';
  onViewModeChange?: (mode: 'preview' | 'code') => void;
  iframeProps?: React.IframeHTMLAttributes<HTMLIFrameElement>;
  labels?: { preview?: string; code?: string };
  segmentedItems?: Array<{ label: React.ReactNode; value: string }>;
  segmentedExtra?: React.ReactNode;
}

const getTypeConfig = (type: RealtimeFollowMode, locale?: any) => {
  switch (type) {
    case 'shell':
      return {
        icon: SquareTerminal,
        title: locale?.['workspace.terminalExecution'] || '终端执行',
      };
    case 'html':
      return {
        icon: FileXml,
        title: locale?.['workspace.createHtmlFile'] || '创建 HTML 文件',
      };
    case 'markdown':
    case 'md':
      return {
        icon: FileMarkdown,
        title: locale?.['workspace.markdownContent'] || 'Markdown 内容',
      };
    default:
      return {
        icon: SquareTerminal,
        title: locale?.['workspace.terminalExecution'] || '终端执行',
      };
  }
};

const getIconTypeClass = (type: RealtimeFollowMode, prefixCls: string) => {
  switch (type) {
    case 'html':
      return `${prefixCls}-header-icon--html`;
    case 'markdown':
    case 'md':
      return `${prefixCls}-header-icon--md`;
    default:
      return `${prefixCls}-header-icon--default`;
  }
};

const RealtimeHeader: React.FC<{
  data: RealtimeFollowData;
  hasBorder?: boolean;
  prefixCls?: string;
  hashId?: string;
}> = ({ data, hasBorder, prefixCls, hashId }) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const { locale } = useContext(I18nContext);
  const finalPrefixCls = prefixCls || getPrefixCls('workspace-realtime');
  const config = getTypeConfig(data.type, locale);

  const IconComponent = data.icon || config.icon;
  const headerTitle = data.title || config.title;
  const headerSubTitle = data.subTitle;

  const iconNode = (
    <div
      className={classNames(
        `${finalPrefixCls}-header-icon`,
        getIconTypeClass(data?.type, finalPrefixCls),
        hashId,
      )}
    >
      <IconComponent fontSize={24} />
    </div>
  );

  return (
    <header
      className={classNames(
        `${finalPrefixCls}-header`,
        {
          [`${finalPrefixCls}-header-with-border`]: hasBorder,
          [`${finalPrefixCls}-header-with-back`]: data?.onBack,
        },
        hashId,
      )}
    >
      <div className={classNames(`${finalPrefixCls}-header-left`, hashId)}>
        {data?.onBack && (
          <button
            type="button"
            className={classNames(
              `${finalPrefixCls}-header-back-button`,
              hashId,
            )}
            onClick={data.onBack}
          >
            <LeftIcon
              className={classNames(
                `${finalPrefixCls}-header-back-icon`,
                hashId,
              )}
            />
          </button>
        )}
        <div className={classNames(`${finalPrefixCls}-header-content`, hashId)}>
          {!data?.onBack && iconNode}
          <div
            className={classNames(
              `${finalPrefixCls}-header-title-wrapper`,
              hashId,
            )}
          >
            <div
              className={classNames(`${finalPrefixCls}-header-title`, hashId)}
            >
              {data?.onBack && iconNode}
              {headerTitle}
            </div>
            <div
              className={classNames(
                `${finalPrefixCls}-header-subtitle`,
                hashId,
              )}
            >
              {headerSubTitle}
            </div>
          </div>
        </div>
      </div>
      <div className={classNames(`${finalPrefixCls}-header-right`, hashId)}>
        {data.rightContent}
      </div>
    </header>
  );
};

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
        contentStyle: {
          padding: 0,
          overflow: 'visible', // 禁用内部滚动，使用外层容器滚动
        },
        codeProps: {
          theme: 'chaos',
          showGutter: true,
          showLineNumbers: true,
          hideToolBar: true,
        },
      };
    case 'markdown':
    case 'md':
      return {
        ...baseConfig,
        contentStyle: {
          padding: 16,
          overflow: 'visible', // 禁用内部滚动，使用外层容器滚动
        },
        height: '100%',
      };
    default:
      return baseConfig;
  }
};

const Overlay: React.FC<{
  status?: 'loading' | 'done' | 'error';
  loadingRender?: React.ReactNode | (() => React.ReactNode);
  errorRender?: React.ReactNode | (() => React.ReactNode);
  prefixCls?: string;
  hashId?: string;
}> = ({ status, loadingRender, errorRender, prefixCls, hashId }) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const { locale } = useContext(I18nContext);
  const finalPrefixCls = prefixCls || getPrefixCls('workspace-realtime');
  if (status !== 'loading' && status !== 'error') return null;
  const loadingNode =
    typeof loadingRender === 'function' ? loadingRender() : loadingRender;
  const errorNode =
    typeof errorRender === 'function' ? errorRender() : errorRender;
  return (
    <div
      className={classNames(
        `${finalPrefixCls}-overlay`,
        {
          [`${finalPrefixCls}-overlay--loading`]: status === 'loading',
          [`${finalPrefixCls}-overlay--error`]: status === 'error',
        },
        hashId,
      )}
    >
      {status === 'loading'
        ? loadingNode || <Spin />
        : errorNode || (
            <span>
              {locale?.['htmlPreview.renderFailed'] || '页面渲染失败'}
            </span>
          )}
    </div>
  );
};

/**
 * 实时跟随组件 - 支持 HTML、Markdown、Shell 等类型，或自定义内容
 * @example
 * <RealtimeFollow data={{ type: 'shell', customContent: <div>自定义内容</div> }} />
 */
export const RealtimeFollow: React.FC<{
  data: RealtimeFollowData;
  htmlViewMode?: 'preview' | 'code';
  prefixCls?: string;
  hashId?: string;
}> = ({ data, htmlViewMode = 'preview', prefixCls, hashId }) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const finalPrefixCls = prefixCls || getPrefixCls('workspace-realtime');
  const mdInstance = useRef<MarkdownEditorInstance>();
  const isTestEnv = process.env.NODE_ENV === 'test';
  const { containerRef: autoScrollRef, scrollToBottom } = useAutoScroll({
    SCROLL_TOLERANCE: 30,
    timeout: 100,
    deps: [isTestEnv],
  });

  useEffect(() => {
    if (isTestEnv) return;
    if (
      mdInstance.current?.store &&
      (data.type === 'shell' ||
        ['markdown', 'md'].includes(data.type) ||
        (data.type === 'html' && htmlViewMode === 'code'))
    ) {
      const content = (() => {
        if (data.type === 'html') {
          const html = typeof data.content === 'string' ? data.content : '';
          return '```html\n' + html + '\n```';
        }
        return String(data.content);
      })();

      const { schema } = parserMdToSchema(
        content,
        mdInstance.current.store.plugins,
      );
      mdInstance.current.store.updateNodeList(schema);
      if (data.typewriter && !isTestEnv) {
        setTimeout(() => scrollToBottom(), 50);
      }
    }
  }, [
    data.content,
    data.type,
    htmlViewMode,
    isTestEnv,
    data.typewriter,
    scrollToBottom,
  ]);

  if (data.customContent) {
    const customNode =
      typeof data.customContent === 'function'
        ? data.customContent()
        : data.customContent;
    return (
      <div className={classNames(`${finalPrefixCls}-content`, hashId)}>
        {customNode || null}
      </div>
    );
  }

  if (data.type === 'html') {
    const html = typeof data.content === 'string' ? data.content : '';
    return (
      <div className={classNames(`${finalPrefixCls}-content`, hashId)}>
        <HtmlPreview
          html={html}
          status={isTestEnv ? 'done' : data.status}
          viewMode={htmlViewMode}
          onViewModeChange={(m) => data.onViewModeChange?.(m)}
          markdownEditorProps={data.markdownEditorProps}
          iframeProps={data.iframeProps}
          labels={data.labels}
          loadingRender={isTestEnv ? undefined : data.loadingRender}
          errorRender={isTestEnv ? undefined : data.errorRender}
          showSegmented={false}
          emptyRender={isTestEnv ? undefined : data.emptyRender}
        />
      </div>
    );
  }

  if (!['shell', 'markdown', 'md', 'default'].includes(data.type)) {
    return null;
  }

  const defaultProps = getEditorConfig(data.type);
  const mergedProps = {
    ...defaultProps,
    ...data.markdownEditorProps,
    typewriter: isTestEnv
      ? false
      : (data.typewriter ?? defaultProps.typewriter),
    style: {
      maxHeight: 'auto',
      ...defaultProps.style,
      ...data.markdownEditorProps?.style,
    },
  };

  const contentStr = String((data as any).content ?? '');
  const isEmpty = contentStr.trim() === '';
  const shouldShowEmpty =
    !isTestEnv &&
    isEmpty &&
    data.status !== 'loading' &&
    data.status !== 'error';
  const emptyNode =
    typeof data.emptyRender === 'function'
      ? data.emptyRender()
      : data.emptyRender;

  return (
    <div
      className={classNames(`${finalPrefixCls}-content`, hashId)}
      ref={isTestEnv ? undefined : autoScrollRef}
    >
      {!isTestEnv && (
        <Overlay
          status={data.status}
          loadingRender={data.loadingRender}
          errorRender={data.errorRender}
          prefixCls={prefixCls}
          hashId={hashId}
        />
      )}
      {shouldShowEmpty ? (
        <div className={classNames(`${finalPrefixCls}-empty`, hashId)}>
          {emptyNode || <Empty />}
        </div>
      ) : (
        <MarkdownEditor
          {...mergedProps}
          editorRef={mdInstance}
          initValue={String(data.content)}
        />
      )}
    </div>
  );
};

/**
 * 实时跟随列表组件 - RealtimeFollow 的包装组件，管理视图模式状态
 */
export const RealtimeFollowList: React.FC<{
  data: RealtimeFollowData;
}> = ({ data }) => {
  const isControlled = data.type === 'html' && data.viewMode !== undefined;
  const [innerViewMode, setInnerViewMode] = useState<'preview' | 'code'>(
    data.defaultViewMode || 'preview',
  );
  const htmlViewMode: 'preview' | 'code' =
    data.type === 'html'
      ? isControlled
        ? (data.viewMode as any)
        : innerViewMode
      : 'preview';

  const handleSetMode = (mode: 'preview' | 'code') => {
    if (!isControlled) setInnerViewMode(mode);
    data.onViewModeChange?.(mode);
  };

  const { locale } = useContext(I18nContext);
  const labels = {
    preview: data.labels?.preview || locale?.['htmlPreview.preview'] || '预览',
    code: data.labels?.code || locale?.['htmlPreview.code'] || '代码',
  };

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('workspace-realtime');
  const styleResult = useRealtimeFollowStyle(prefixCls);
  const { wrapSSR, hashId } = styleResult || {
    wrapSSR: (node: any) => node,
    hashId: '',
  };

  const rightContent = (() => {
    if (data.rightContent) return data.rightContent;
    if (data.type !== 'html') return null;

    const segmentedNode =
      data.segmentedItems && data.segmentedItems.length > 0 ? (
        <Segmented
          options={data.segmentedItems}
          onChange={(val) => data.onViewModeChange?.(String(val) as any)}
        />
      ) : (
        <Segmented
          options={[
            {
              label: (
                <div className="ant-segmented-item-title">{labels.preview}</div>
              ),
              value: 'preview',
            },
            {
              label: (
                <div className="ant-segmented-item-title">{labels.code}</div>
              ),
              value: 'code',
            },
          ]}
          value={htmlViewMode}
          onChange={(val) => handleSetMode(val as 'preview' | 'code')}
        />
      );

    if (!data.segmentedExtra) return segmentedNode;

    return (
      <div
        className={classNames(`${prefixCls}-header-segmented-right`, hashId)}
      >
        {segmentedNode}
        <div
          className={classNames(
            `${prefixCls}-header-segmented-right-extra`,
            hashId,
          )}
        >
          {data.segmentedExtra}
        </div>
      </div>
    );
  })();

  const headerData: RealtimeFollowData = { ...data, rightContent };

  return wrapSSR(
    <div
      className={classNames(
        `${prefixCls}-container`,
        `${prefixCls}--${data.type}`,
        data.className,
        hashId,
      )}
      style={data.style}
      data-testid="realtime-follow"
    >
      <RealtimeHeader
        data={headerData}
        hasBorder={['html', 'markdown'].includes(data.type)}
        prefixCls={prefixCls}
        hashId={hashId}
      />
      <RealtimeFollow
        data={data}
        htmlViewMode={htmlViewMode}
        prefixCls={prefixCls}
        hashId={hashId}
      />
    </div>,
  );
};
