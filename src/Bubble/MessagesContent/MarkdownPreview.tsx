import { CloseCircleFilled } from '@ant-design/icons';
import { ConfigProvider, theme } from 'antd';
import React, { useContext, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from 'react-error-boundary';
import {
  ActionIconBox,
  MarkdownEditor,
  MarkdownEditorInstance,
  MarkdownEditorProps,
  parserMdToSchema,
} from '../../';
import { Slides } from '../../Slides';
import { BubbleConfigContext } from '../BubbleConfigProvide';
import { MessageBubbleData } from '../type';
import { MessagesContext } from './BubbleContext';

/**
 * MarkdownPreview 组件用于渲染 Markdown 内容的预览。
 *
 * @param {Object} props - 组件的属性。
 * @param {string} props.content - 要渲染的 Markdown 内容。
 * @param {MarkdownEditorProps['fncProps']} props.fncProps - Markdown 编辑器的函数属性。
 * @param {boolean} [props.typing] - 是否启用打字机效果。
 * @param {React.ReactNode} props.extra - 额外的 React 节点。
 * @param {React.ReactNode} props.docListNode - 文档列表节点。
 * @param {React.RefObject<HTMLDivElement>} props.htmlRef - HTML 元素的引用。
 *
 * @returns {JSX.Element} 渲染的 Markdown 预览组件。
 */
export interface MarkdownPreviewProps {
  /** markdown 源文本内容，例如: "# 标题\n这是正文" */
  content: string;
  /** markdown 编辑器的功能属性配置，控制编辑器行为 */
  fncProps?: MarkdownEditorProps['fncProps'];
  /** 是否启用打字机效果，例如: true */
  typing?: boolean;
  /** 额外的 React 节点，用于显示附加内容，例如: <Button>更多</Button> */
  extra?: React.ReactNode;
  /** 文档列表节点，用于展示相关文档，例如: <DocList items={[...]} /> */
  docListNode?: React.ReactNode;
  /** HTML 元素的引用，用于获取容器尺寸，例如: useRef<HTMLDivElement>(null) */
  htmlRef?: React.RefObject<HTMLDivElement>;
  /** 内容是否已完成加载，例如: true */
  isFinished?: boolean;
  /** 是否启用幻灯片模式，例如: true */
  slidesMode?: boolean;
  /** 关闭幻灯片模式的回调函数，例如: () => setSlideMode(false) */
  onCloseSlides?: () => void;
  style?: React.CSSProperties;
  originData?: MessageBubbleData;
  markdownRenderConfig?: MarkdownEditorProps;
  /** 在 content 前面插入的 DOM 元素，例如: <div>前置内容</div> */
  beforeContent: React.ReactNode;
  /** 在 content 后面插入的 DOM 元素，例如: <div>后置内容</div> */
  afterContent: React.ReactNode;
}

/**
 * Markdown 预览组件
 * @component MarkdownPreview
 *
 * @param {Object} props - 组件属性
 * @param {string} props.content - Markdown 内容
 * @param {ReactNode} props.extra - 额外的内容
 * @param {boolean} props.typing - 是否正在输入
 * @param {React.RefObject} props.htmlRef - HTML 元素的引用
 * @param {Object} props.fncProps - 功能属性
 * @param {ReactNode} props.docListNode - 文档列表节点
 * @param {boolean} props.isFinished - 内容是否已完成
 * @param {boolean} props.slidesMode - 是否为幻灯片模式
 * @param {() => void} props.onCloseSlides - 关闭幻灯片模式的回调函数
 * @param {ReactNode} props.beforeContent - 在 content 前面插入的 DOM 元素
 * @param {ReactNode} props.afterContent - 在 content 后面插入的 DOM 元素
 *
 * @description
 * 这是一个用于渲染 Markdown 内容的预览组件。它支持以下功能：
 * - 普通 Markdown 渲染
 * - 幻灯片模式展示
 * - 支持打字机效果
 * - 错误边界处理
 * - 支持 Apaasify 自定义渲染
 * - 支持紧凑模式和标准模式
 * - 支持弹出层展示额外内容
 * - 支持在 content 前后插入自定义 DOM 元素
 *
 * @example
 * ```tsx
 * <MarkdownPreview
 *   content="# Hello World"
 *   typing={false}
 *   htmlRef={ref}
 *   beforeContent={<div>前置内容</div>}
 *   afterContent={<div>后置内容</div>}
 * />
 * ```
 */
export const MarkdownPreview = (props: MarkdownPreviewProps) => {
  const {
    content,
    extra,
    typing,
    htmlRef,
    fncProps,
    docListNode,
    isFinished,
    slidesMode,
    onCloseSlides,
    beforeContent,
    afterContent,
  } = props;
  const MarkdownEditorRef = React.useRef<MarkdownEditorInstance | undefined>(
    undefined,
  );

  const { hidePadding } = useContext(MessagesContext) || {};

  const { locale, standalone } = useContext(BubbleConfigContext) || {};
  const { token } = theme.useToken();

  useEffect(() => {
    if (isFinished) {
      MarkdownEditorRef.current?.store.setMDContent(content);
      return;
    }
  }, [isFinished]);

  const isPaddingHidden = useMemo(() => {
    return !!extra;
  }, [extra, typing]);

  useEffect(() => {
    const schema = parserMdToSchema(content).schema;
    MarkdownEditorRef.current?.store.updateNodeList(schema);
  }, [content]);

  const markdown = useMemo(() => {
    const minWidth = content?.includes?.('chartType')
      ? standalone
        ? Math.max((htmlRef?.current?.clientWidth || 600) - 23, 500)
        : Math.min((htmlRef?.current?.clientWidth || 600) - 128, 500)
      : undefined;
    return slidesMode ? (
      ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            background: '#FFF',
            zIndex: 9999,
          }}
          id="slides-container"
        >
          <div
            style={{ position: 'absolute', top: 20, right: 20, zIndex: 9999 }}
          >
            <ActionIconBox
              title={locale?.['slides.closeSlidesMode'] || '关闭幻灯片模式'}
              onClick={onCloseSlides}
            >
              <CloseCircleFilled />
            </ActionIconBox>
          </div>
          <ConfigProvider
            getPopupContainer={() =>
              document.getElementById('slides-container')!
            }
            getTargetContainer={() =>
              document.getElementById('slides-container')!
            }
          >
            <Slides initValue={content.trim()} />
          </ConfigProvider>
        </div>,
        document.body,
      )
    ) : (
      <MarkdownEditor
        {...(props.markdownRenderConfig || {})}
        fncProps={fncProps}
        editorRef={MarkdownEditorRef}
        initValue={content}
        toc={false}
        width="100%"
        height="auto"
        contentStyle={props.style}
        tableConfig={{
          actions: {
            fullScreen: 'modal',
          },
        }}
        rootContainer={htmlRef as any}
        editorStyle={{
          fontSize: 14,
        }}
        typewriter={typing}
        style={{
          minWidth: minWidth ? `min(${minWidth}px,100%)` : undefined,
          maxWidth: standalone ? '100%' : undefined,
          padding: isPaddingHidden ? 0 : undefined,
          margin: isPaddingHidden ? 0 : undefined,
        }}
        readonly
      />
    );
  }, [slidesMode, hidePadding, typing, isPaddingHidden, content]);

  const errorDom = (
    <div
      style={{
        padding: '12px 20px',
        background: ' #FFFFFF',
        color: token.colorError,
        borderRadius: '12px 6px 12px 12px',
        border: '1px solid ' + token.colorErrorBorder,
      }}
    >
      {locale?.['error.unexpected'] || '出现点意外情况，请重新发送'}
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        maxWidth: '100%',
      }}
    >
      <ErrorBoundary fallback={errorDom}>
        {beforeContent}
        {markdown}
        {docListNode}
        {afterContent}
      </ErrorBoundary>
      {extra}
    </div>
  );
};
