import {
  BlockOutlined,
  BoldOutlined,
  CheckSquareOutlined,
  CodeOutlined,
  CommentOutlined,
  DashOutlined,
  FileImageOutlined,
  FontSizeOutlined,
  HighlightOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  StrikethroughOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import MDEditor, { MDEditorProps, getCommands } from '@uiw/react-md-editor';
import React from 'react';

/**
 * Markdown Editor
 * @param props
 * @returns
 */
export const MarkDownEditor: React.FC<
  MDEditorProps & {
    dark?: boolean;
  }
> = (props) => {
  return (
    <div data-color-mode={props?.dark ? 'dark' : 'light'}>
      <MDEditor
        height={400}
        commands={
          getCommands()
            .map((item) => {
              if (item.name === 'bold') {
                item.icon = <BoldOutlined />;
                return item;
              }
              if (item.name === 'italic') {
                item.icon = <ItalicOutlined />;
                return item;
              }
              if (item.name === 'italic') {
                item.icon = <StrikethroughOutlined />;
                return item;
              }
              if (item.name === 'hr') {
                item.icon = <DashOutlined />;
                return item;
              }
              if (item.name === 'title') {
                item.icon = <FontSizeOutlined />;
                return item;
              }
              if (item.name === 'link') {
                item.icon = <LinkOutlined />;
                return item;
              }
              if (item.name === 'quote') {
                item.icon = <HighlightOutlined />;
                return item;
              }
              if (item.name === 'code') {
                item.icon = <CodeOutlined />;
                return item;
              }
              if (item.name === 'codeBlock') {
                item.icon = <BlockOutlined />;
                return item;
              }
              if (item.name === 'comment') {
                item.icon = <CommentOutlined />;
                return item;
              }
              if (item.name === 'image') {
                item.icon = <FileImageOutlined />;
                return item;
              }
              if (item.name === 'table') {
                item.icon = <TableOutlined />;
                return item;
              }
              if (item.name === 'unordered-list') {
                item.icon = <UnorderedListOutlined />;
                return item;
              }

              if (item.name === 'ordered-list') {
                item.icon = <OrderedListOutlined />;
                return item;
              }

              if (item.name === 'checked-list') {
                item.icon = <CheckSquareOutlined />;
                return item;
              }
              if (item.name === 'help') {
                return false;
              }
              return item;
            })
            .filter(Boolean) as any[]
        }
        {...props}
      />
    </div>
  );
};

export default MarkDownEditor;
