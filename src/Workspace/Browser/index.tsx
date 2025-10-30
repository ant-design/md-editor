import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { type FC, useContext } from 'react';
import { MarkdownEditor, MarkdownEditorProps } from '../../MarkdownEditor';
import { useBrowserStyle } from './style';

const EDITOR_FULL_WIDTH_STYLE = { width: '100%' };
const EDITOR_NO_PADDING_STYLE = { padding: 0 };

const isTestEnvironment = () => process.env.NODE_ENV === 'test';

const getDefaultEditorProps = (): Partial<MarkdownEditorProps> => ({
  readonly: true,
  toc: false,
  style: EDITOR_FULL_WIDTH_STYLE,
  contentStyle: EDITOR_NO_PADDING_STYLE,
  ...(isTestEnvironment() ? { typewriter: false } : {}),
});

const mergeEditorProps = (
  customProps?: Partial<MarkdownEditorProps>,
): Partial<MarkdownEditorProps> => ({
  ...getDefaultEditorProps(),
  ...customProps,
});

/**
 * BrowserList 组件输入数据
 */
export interface BrowserItemInput {
  /** 浏览器标题 */
  title?: string;
  /** 内容（Markdown 格式） */
  content: string;
  /** Markdown 编辑器配置 */
  markdownEditorProps?: Partial<MarkdownEditorProps>;
}

/**
 * BrowserList 组件
 *
 * 在工作空间中显示浏览器内容，支持 Markdown 渲染
 *
 * @example
 * ```tsx
 * <BrowserList
 *   data={{
 *     title: "网页内容",
 *     content: "# 标题\n内容"
 *   }}
 * />
 * ```
 */
export const BrowserList: FC<{ data: BrowserItemInput }> = ({ data }) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('agentic-workspace-browser');
  const { wrapSSR, hashId } = useBrowserStyle(prefixCls);

  const editorProps = mergeEditorProps(data.markdownEditorProps);

  return wrapSSR(
    <div className={classNames(prefixCls, hashId)} data-testid="browser-list">
      {data.title && (
        <div className={classNames(`${prefixCls}-header`, hashId)}>
          <div className={classNames(`${prefixCls}-title`, hashId)}>
            {data.title}
          </div>
        </div>
      )}
      <MarkdownEditor {...editorProps} initValue={data.content} />
    </div>,
  );
};
