import React, { type FC } from 'react';
import { MarkdownEditor, MarkdownEditorProps } from '../../MarkdownEditor';
import './index.less';

export interface BrowserItemInput {
  title?: string;
  content: string;
  markdownEditorProps?: Partial<MarkdownEditorProps>;
}

export const BrowserList: FC<{ data: BrowserItemInput }> = ({ data }) => {
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
      ...data.markdownEditorProps,
    };
  };

  return (
    <div className="chat-browser-list">
      {data.title && (
        <div className="chat-browser-header">
          <div className="chat-browser-title">{data.title}</div>
        </div>
      )}
      <MarkdownEditor
        {...getMergedProps(getDefaultProps())}
        initValue={data.content}
      />
    </div>
  );
};
