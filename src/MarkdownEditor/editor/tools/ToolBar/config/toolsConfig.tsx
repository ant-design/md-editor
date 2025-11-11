import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
} from '@ant-design/icons';
import React, { useContext } from 'react';
import { Editor, Element } from 'slate';
import { I18nContext } from '../../../../../I18n';
import { EditorUtils } from '../../../utils/editorUtils';

const LineCode = React.memo(() => {
  return (
    <svg viewBox="0 0 1024 1024" version="1.1" width="1.3em" height="1.3em">
      <path
        fill="currentColor"
        d="M153.770667 517.558857l200.387047-197.241905L302.86019 268.190476 48.761905 518.290286l254.439619 243.614476 50.590476-52.833524-200.021333-191.512381zM658.285714 320.316952L709.583238 268.190476l254.098286 250.09981L709.241905 761.904762l-50.590476-52.833524 200.021333-191.512381L658.285714 320.316952z m-112.981333-86.186666L393.99619 785.554286l70.534096 19.358476 151.30819-551.399619-70.534095-19.358476z"
      />
    </svg>
  );
});

LineCode.displayName = 'LineCode';

export const isCodeNode = (editor: any) => {
  if (!editor) return false;
  const [node] = Editor.nodes(editor, {
    match: (n: any) => Element.isElement(n),
    mode: 'lowest',
  });
  return node && ((node as any)[0] as any).type === 'code';
};

export const useToolsConfig = () => {
  const { locale } = useContext(I18nContext);

  return [
    {
      key: 'bold',
      type: 'bold',
      title: locale?.['toolbar.bold'] || '加粗',
      icon: <BoldOutlined />,
    },
    {
      key: 'italic',
      title: locale?.['toolbar.italic'] || '斜体',
      type: 'italic',
      icon: <ItalicOutlined />,
    },
    {
      key: 'strikethrough',
      title: locale?.['toolbar.strikethrough'] || '删除线',
      type: 'strikethrough',
      icon: <StrikethroughOutlined />,
    },
    {
      key: 'inline-code',
      title: locale?.['toolbar.inlineCode'] || '行内代码',
      type: 'code',
      icon: <LineCode />,
    },
    {
      key: 'align-left',
      title: locale?.['toolbar.alignLeft'] || '左对齐',
      type: 'align-left',
      icon: <AlignLeftOutlined />,
      onClick: (editor: any) => {
        if (!isCodeNode(editor)) {
          EditorUtils.setAlignment(editor, 'left');
        }
      },
      isActive: (editor: any) =>
        EditorUtils?.isAlignmentActive?.(editor, 'left'),
    },
    {
      key: 'align-center',
      title: locale?.['toolbar.alignCenter'] || '居中对齐',
      type: 'align-center',
      icon: <AlignCenterOutlined />,
      onClick: (editor: any) => {
        if (!isCodeNode(editor)) {
          EditorUtils.setAlignment(editor, 'center');
        }
      },
      isActive: (editor: any) =>
        EditorUtils?.isAlignmentActive?.(editor, 'center'),
    },
    {
      key: 'align-right',
      title: locale?.['toolbar.alignRight'] || '右对齐',
      type: 'align-right',
      icon: <AlignRightOutlined />,
      onClick: (editor: any) => {
        if (!isCodeNode(editor)) {
          EditorUtils.setAlignment(editor, 'right');
        }
      },
      isActive: (editor: any) =>
        EditorUtils?.isAlignmentActive?.(editor, 'right'),
    },
  ];
};

export type ToolsKeyType =
  | 'redo'
  | 'undo'
  | 'clear'
  | 'head'
  | 'divider'
  | 'color'
  | 'table'
  | 'column'
  | 'quote'
  | 'code'
  | 'b-list'
  | 'n-list'
  | 't-list'
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'inline-code'
  | 'divider'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'link'
  | 'align-left'
  | 'align-center'
  | 'align-right';
