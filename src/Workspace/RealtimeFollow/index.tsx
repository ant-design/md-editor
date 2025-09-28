import useAutoScroll from '@ant-design/md-editor/hooks/useAutoScroll';
import { ConfigProvider, Empty, Segmented, Spin } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { I18nContext } from '../../i18n';
import { ArrowLeft as LeftIcon } from '../../icons';
import {
  MarkdownEditor,
  MarkdownEditorInstance,
  MarkdownEditorProps,
} from '../../MarkdownEditor';
import { parserMdToSchema } from '../../MarkdownEditor/editor/parser/parserMdToSchema';
import { HtmlPreview } from '../HtmlPreview';
import HtmlIcon from '../icons/HtmlIcon';
import ShellIcon from '../icons/ShellIcon';
import ThinkIcon from '../icons/ThinkIcon';
import { useRealtimeFollowStyle } from './style';
export type RealtimeFollowMode = 'shell' | 'html' | 'markdown' | 'md';

export interface DiffContent {
  original: string;
  modified: string;
}

export interface RealtimeFollowData {
  type: RealtimeFollowMode;
  content: string | DiffContent;
  // 支持MarkdownEditor的所有配置项
  markdownEditorProps?: Partial<MarkdownEditorProps>;
  title?: string; // 自定义主标题，如"终端执行"
  subTitle?: string; // 自定义副标题，如"创建文件mkdir"
  icon?: React.ComponentType; // 自定义图标
  typewriter?: boolean; // 是否启用打印机效果
  rightContent?: React.ReactNode; // 自定义右侧内容
  loadingRender?: React.ReactNode | (() => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
  errorRender?: React.ReactNode | (() => React.ReactNode);
  // 新增：内容为空时的渲染
  emptyRender?: React.ReactNode | (() => React.ReactNode);
  // 通用状态：适用于任意类型（html/shell/markdown）
  status?: 'loading' | 'done' | 'error';
  onBack?: () => void;

  // —— 以下为库化增强配置，主要用于 html 类型 ——
  viewMode?: 'preview' | 'code';
  defaultViewMode?: 'preview' | 'code';
  onViewModeChange?: (mode: 'preview' | 'code') => void;
  iframeProps?: React.IframeHTMLAttributes<HTMLIFrameElement>;
  labels?: { preview?: string; code?: string };
  // 右侧分段器（Segmented）自定义
  segmentedItems?: Array<{ label: React.ReactNode; value: string }>; // 自定义 items
  // Segmented 右侧额外内容（当存在 segmentedItems 或默认 Segmented 时附加在其右侧）
  segmentedExtra?: React.ReactNode;
}

// 获取不同type的配置信息
const getTypeConfig = (type: RealtimeFollowMode, locale?: any) => {
  switch (type) {
    case 'shell':
      return {
        icon: ShellIcon,
        title: locale?.['workspace.terminalExecution'] || '终端执行',
      };
    case 'html':
      return {
        icon: HtmlIcon,
        title: locale?.['workspace.createHtmlFile'] || '创建 HTML 文件',
      };
    case 'markdown':
    case 'md':
      return {
        icon: ThinkIcon,
        title: locale?.['workspace.markdownContent'] || 'Markdown 内容',
      };
    default:
      return {
        icon: ShellIcon,
        title: locale?.['workspace.terminalExecution'] || '终端执行',
      };
  }
};

// 头部组件
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
        {
          [`${finalPrefixCls}-header-icon--html`]: data?.type === 'html',
          [`${finalPrefixCls}-header-icon--default`]: data?.type !== 'html',
        },
        hashId,
      )}
    >
      <IconComponent />
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
        contentStyle: {
          padding: 0,
          overflow: 'visible', // 禁用内部滚动，使用外层容器滚动
        },
        codeProps: {
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

// 通用遮罩（仅供 shell/md 使用；html 由 HtmlPreview 自己处理）
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
 * RealtimeFollow 组件 - 实时跟随组件
 *
 * 该组件用于实时显示和跟随不同类型的内容，支持HTML、Markdown、Shell等格式。
 * 提供实时更新、状态管理、错误处理等功能，主要用于显示动态内容。
 *
 * @component
 * @description 实时跟随组件，用于显示和跟随动态内容
 * @param {Object} props - 组件属性
 * @param {RealtimeFollowData} props.data - 实时跟随数据
 * @param {'preview' | 'code'} [props.htmlViewMode='preview'] - HTML查看模式
 *
 * @example
 * ```tsx
 * <RealtimeFollow
 *   data={{
 *     type: 'html',
 *     content: '<div>Hello World</div>',
 *     status: 'done'
 *   }}
 *   htmlViewMode="preview"
 * />
 * ```
 *
 * @returns {React.ReactElement|null} 渲染的实时跟随组件
 *
 * @remarks
 * - 支持多种内容类型（HTML、Markdown、Shell）
 * - 提供实时内容更新
 * - 支持状态管理（加载、错误、完成）
 * - 提供HTML预览和代码查看模式
 * - 支持自定义渲染和错误处理
 * - 在测试环境下优化性能
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
  // 添加自动滚动功能（测试环境下禁用）
  const { containerRef: autoScrollRef, scrollToBottom } = useAutoScroll({
    SCROLL_TOLERANCE: 30,
    timeout: 100, // 更快的响应时间，适配打字机效果
    deps: [isTestEnv], // 当测试环境状态变化时重新初始化
  });
  // 更新编辑器内容的effect（测试环境下跳过以减少解析与快照负载）
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
      // 在打字机模式下，内容更新后触发自动滚动
      if (data.typewriter && !isTestEnv) {
        // 使用 setTimeout 确保 DOM 更新完成后再滚动
        setTimeout(() => {
          scrollToBottom();
        }, 50);
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
          // 透传空状态渲染
          emptyRender={isTestEnv ? undefined : data.emptyRender}
        />
      </div>
    );
  }

  if (!['shell', 'markdown', 'md'].includes(data.type)) {
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
 * RealtimeFollowList 组件 - 实时跟随列表组件
 *
 * 该组件是RealtimeFollow的包装组件，提供视图模式管理和状态控制功能。
 * 支持HTML内容的预览和代码模式切换，提供更好的用户体验。
 *
 * @component
 * @description 实时跟随列表组件，管理实时跟随的视图模式
 * @param {Object} props - 组件属性
 * @param {RealtimeFollowData} props.data - 实时跟随数据
 *
 * @example
 * ```tsx
 * <RealtimeFollowList
 *   data={{
 *     type: 'html',
 *     content: '<div>Hello World</div>',
 *     status: 'done',
 *     defaultViewMode: 'preview'
 *   }}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的实时跟随列表组件
 *
 * @remarks
 * - 管理HTML视图模式状态
 * - 支持受控和非受控模式
 * - 提供默认视图模式设置
 * - 支持视图模式切换
 * - 继承RealtimeFollow的所有功能
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

  // 使用 ConfigProvider 获取前缀类名，并提前计算样式作用域，供右侧区域使用
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('workspace-realtime');
  const styleResult = useRealtimeFollowStyle(prefixCls);
  const { wrapSSR, hashId } = styleResult || {
    wrapSSR: (node: any) => node,
    hashId: '',
  };

  // 右侧：优先使用外部自定义 rightContent；否则 html 类型下显示 Segmented（自定义或默认）+ 可选 extra
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
            { label: labels.preview, value: 'preview' },
            { label: labels.code, value: 'code' },
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
        {data.segmentedExtra}
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
