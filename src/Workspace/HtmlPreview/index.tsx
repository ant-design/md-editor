import { Segmented, Spin } from 'antd';
import DOMPurify from 'dompurify';
import React, { useMemo, useState } from 'react';
import { MarkdownEditor, type MarkdownEditorProps } from '../../MarkdownEditor';
import './index.less';

export type HtmlViewMode = 'preview' | 'code';

export interface HtmlPreviewProps {
  html: string;
  status?: 'generating' | 'loading' | 'done' | 'error';
  viewMode?: HtmlViewMode;
  defaultViewMode?: HtmlViewMode;
  onViewModeChange?: (mode: HtmlViewMode) => void;
  markdownEditorProps?: Partial<MarkdownEditorProps>;
  iframeProps?: React.IframeHTMLAttributes<HTMLIFrameElement>;
  labels?: { preview?: string; code?: string };
  loadingRender?: React.ReactNode | (() => React.ReactNode);
  errorRender?: React.ReactNode | (() => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
  // 是否在组件内部渲染 Segmented；如为 false，父级可自定义外部切换
  showSegmented?: boolean;
  segmentedItems?: Array<{ label: React.ReactNode; value: string }>;
}

export const HtmlPreview: React.FC<HtmlPreviewProps> = (props) => {
  const {
    html,
    status: inputStatus,
    viewMode,
    defaultViewMode = 'preview',
    onViewModeChange,
    markdownEditorProps,
    iframeProps,
    labels,
    loadingRender,
    errorRender,
    className,
    style,
    showSegmented = true,
    segmentedItems,
  } = props;

  const status = inputStatus === 'generating' ? 'loading' : inputStatus;
  const isControlled = viewMode !== undefined;
  const [innerMode, setInnerMode] = useState<HtmlViewMode>(defaultViewMode);
  const mode = isControlled ? (viewMode as HtmlViewMode) : innerMode;

  const handleModeChange = (m: HtmlViewMode) => {
    if (!isControlled) setInnerMode(m);
    onViewModeChange?.(m);
  };

  // 始终在 html 变化时更新 iframe 内容，避免首次未显示
  const iframeHtml = useMemo(() => DOMPurify.sanitize(html || ''), [html]);

  const labelsMap = {
    preview: labels?.preview || '预览',
    code: labels?.code || '代码',
  };

  const overlayNode = (() => {
    if (status !== 'loading' && status !== 'error') return null;
    const loadingNode =
      typeof loadingRender === 'function' ? loadingRender() : loadingRender;
    const errorNode =
      typeof errorRender === 'function' ? errorRender() : errorRender;
    return (
      <div
        className={`workspace-html-preview__overlay ${status === 'loading' ? 'workspace-html-preview__overlay--loading' : 'workspace-html-preview__overlay--error'}`}
      >
        {status === 'loading'
          ? loadingNode || <Spin />
          : errorNode || <span>页面渲染失败</span>}
      </div>
    );
  })();

  const getMergedMdConfig = () => {
    const defaultMdConfig: Partial<MarkdownEditorProps> = {
      width: '100%',
      height: '100%',
      contentStyle: {
        width: '100%',
        padding: 0,
        marginTop: -10,
      },
      codeProps: {
        showGutter: true,
        showLineNumbers: true,
      },
    };
    return {
      ...defaultMdConfig,
      ...markdownEditorProps,
    };
  };

  return (
    <div
            className={['workspace-html-preview', className].filter(Boolean).join(' ')}
      style={style}
    >
      {showSegmented && (
        <div className="workspace-html-preview__actions">
          {segmentedItems && segmentedItems.length > 0 ? (
            <Segmented
              options={segmentedItems}
              value={mode}
              onChange={(v) => handleModeChange(String(v) as HtmlViewMode)}
            />
          ) : (
            <Segmented
              size="small"
              options={[
                { label: labelsMap.preview, value: 'preview' },
                { label: labelsMap.code, value: 'code' },
              ]}
              value={mode}
              onChange={(v) => handleModeChange(v as HtmlViewMode)}
            />
          )}
        </div>
      )}

      <div className="workspace-html-preview__content" style={{ minHeight: 240 }}>
        {overlayNode}
        {mode === 'code' ? (
          <MarkdownEditor
            {...getMergedMdConfig()}
            readonly
            toc={false}
            initValue={`\`\`\`html\n${html || ''}\n\`\`\``}
          />
        ) : (
          <iframe
            title="html-preview"
            className="workspace-html-preview__iframe"
            sandbox={iframeProps?.sandbox || 'allow-scripts'}
            srcDoc={iframeHtml}
            key={iframeHtml}
            {...iframeProps}
          />
        )}
      </div>
    </div>
  );
};

export default HtmlPreview;
