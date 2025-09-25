import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { type FC, useContext } from 'react';
import { MarkdownEditor, MarkdownEditorProps } from '../../MarkdownEditor';
import { useBrowserStyle } from './style';

export interface BrowserItemInput {
  title?: string;
  content: string;
  markdownEditorProps?: Partial<MarkdownEditorProps>;
}

/**
 * BrowserList 组件 - 浏览器列表组件
 *
 * 该组件用于在工作空间中显示浏览器内容，支持Markdown内容的渲染和显示。
 * 提供标题显示和内容渲染功能，主要用于展示网页内容或文档。
 *
 * @component
 * @description 浏览器列表组件，用于显示浏览器内容
 * @param {Object} props - 组件属性
 * @param {BrowserItemInput} props.data - 浏览器数据
 * @param {string} [props.data.title] - 浏览器标题
 * @param {string} props.data.content - 浏览器内容（Markdown格式）
 * @param {Partial<MarkdownEditorProps>} [props.data.markdownEditorProps] - Markdown编辑器配置
 *
 * @example
 * ```tsx
 * <BrowserList
 *   data={{
 *     title: "网页内容",
 *     content: "# 标题\n这是网页内容",
 *     markdownEditorProps: {
 *       theme: 'dark'
 *     }
 *   }}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的浏览器列表组件
 *
 * @remarks
 * - 支持Markdown内容渲染
 * - 提供标题显示功能
 * - 支持自定义Markdown编辑器配置
 * - 在测试环境下优化性能
 * - 默认只读模式
 * - 支持响应式布局
 */
export const BrowserList: FC<{ data: BrowserItemInput }> = ({ data }) => {
  const isTestEnv = process.env.NODE_ENV === 'test';
  // 默认的MarkdownEditor配置
  const getDefaultProps = (): Partial<MarkdownEditorProps> => ({
    readonly: true,
    toc: false,
    style: { width: '100%' },
    contentStyle: { padding: 0 },
    // 测试环境下关闭打字机等额外效果，降低快照成本
    ...(isTestEnv ? { typewriter: false } : {}),
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

  // 使用 ConfigProvider 获取前缀类名
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('workspace-browser');

  const { wrapSSR, hashId } = useBrowserStyle(prefixCls);

  return wrapSSR(
    <div className={classNames(prefixCls, hashId)} data-testid="browser-list">
      {data.title && (
        <div className={classNames(`${prefixCls}-header`, hashId)}>
          <div className={classNames(`${prefixCls}-title`, hashId)}>
            {data.title}
          </div>
        </div>
      )}
      <MarkdownEditor
        {...getMergedProps(getDefaultProps())}
        initValue={data.content}
      />
    </div>,
  );
};
