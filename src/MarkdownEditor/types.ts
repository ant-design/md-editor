import { Ace } from 'ace-builds';
import { AnchorProps, ImageProps } from 'antd';
import React from 'react';
import { BaseEditor, Selection } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { TagPopupProps } from './editor/elements/TagPopup';
import { EditorStore } from './editor/store';
import { InsertAutocompleteProps } from './editor/tools/InsertAutocomplete';
import { CustomLeaf, Elements } from './el';

/**
 * @typedef CommentDataType
 * @description 表示评论数据的类型。
 *
 * @property {Selection} selection - 用户选择的文本范围。
 * @property {number[]} path - 文档中选择路径的数组。
 * @property {number} anchorOffset - 选择范围的起始偏移量。
 * @property {number} focusOffset - 选择范围的结束偏移量。
 * @property {string} refContent - 参考内容。
 * @property {string} commentType - 评论的类型。
 * @property {string} content - 评论的内容。
 * @property {number} time - 评论的时间戳。
 * @property {string | number} id - 评论的唯一标识符。
 * @property {Object} [user] - 用户信息（可选）。
 * @property {string} user.name - 用户名。
 * @property {string} [user.avatar] - 用户头像（可选）。
 */
export type CommentDataType = {
  selection: Selection;
  path: number[];
  updateTime?: number;
  anchorOffset: number;
  focusOffset: number;
  refContent: string;
  commentType: string;
  content: string;
  time: number | string;
  id: string | number;
  user?: {
    name: string;
    avatar?: string;
  };
};

/**
 * 编辑器接口定义
 * @interface IEditor
 *
 * @property {IEditor[]} [children] - 子编辑器列表
 * @property {boolean} [expand] - 是否展开
 * @property {any[]} [schema] - 编辑器模式配置
 * @property {any} [history] - 编辑器历史记录
 */
export type IEditor = {
  children?: IEditor[];
  expand?: boolean;
};

/**
 * MarkdownEditor 实例
 */
export interface MarkdownEditorInstance {
  range?: any;
  store: EditorStore;
  markdownContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  markdownEditorRef: React.MutableRefObject<
    BaseEditor & ReactEditor & HistoryEditor
  >;
  exportHtml: (filename?: string) => void;
}

/**
 * MarkdownEditor 的 props
 * @param props
 */
export type MarkdownEditorProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  tagInputProps?: {
    enable?: boolean;
    placeholder?: string;
  } & TagPopupProps;
  fncProps?: {
    render: (
      props: CustomLeaf<Record<string, any>> & { children: React.ReactNode },
      defaultDom: React.ReactNode,
    ) => React.ReactNode;
    onOriginUrlClick?: (url?: string) => void;
    onFootnoteDefinitionChange?: (
      data: {
        id: any;
        placeholder: any;
        origin_text: any;
        url: any;
        origin_url: any;
      }[],
    ) => void;
  };

  /**
   * 代码高亮配置
   */
  codeProps?: {
    Languages?: string[];
    hideToolBar?: boolean;
  } & Partial<Ace.EditorOptions>;

  anchorProps?: AnchorProps;
  /**
   * 配置图片数据
   */
  image?: {
    upload?: (file: File[] | string[]) => Promise<string[] | string>;
    render?: (
      props: ImageProps,
      defaultDom: React.ReactNode,
    ) => React.ReactNode;
  };

  insertAutocompleteProps?: InsertAutocompleteProps;
  eleItemRender?: (
    ele: RenderElementProps,
    defaultDom: React.ReactNode,
  ) => React.ReactNode;
  initValue?: string;
  /**
   * 只读模式
   */
  readonly?: boolean;
  /**
   * 样式
   */
  style?: React.CSSProperties;
  /**
   * 内容样式
   */
  contentStyle?: React.CSSProperties;
  /**
   * 工具栏配置
   */
  toolbarConfig?: {
    show?: boolean;
    items?: string[];
  };
  /**
   * 表格配置
   */
  tableConfig?: {
    minColumn?: number;
    minRows?: number;
    actions?: {
      fullScreen?: 'modal' | 'drawer';
      download?: 'csv';
      copy?: 'md' | 'html' | 'csv';
    };
    excelMode?: boolean;
    previewTitle?: string;
  };
  /**
   * 插件配置
   */
  plugins?: any[];
  /**
   * 变更回调
   */
  onChange?: (value: string, schema: Elements[]) => void;
  /**
   * 选择变更回调
   */
  onSelectionChange?: (selection: any) => void;
  comment?: {
    /**
     * 是否启用评论功能
     */
    enable?: boolean;
    /**
     * 评论数据
     */
    commentList?: CommentDataType[];
    loadMentions?: (text: string) => Promise<{ name: string }[]>;
    /**
     * 添加评论的回调函数
     */
    onSubmit?: (id: string | number, comment: CommentDataType) => void;
    /**
     * 删除评论的回调函数
     */
    onDelete?: (id: string | number, comment: CommentDataType) => void;
    editorRender?: (dom: React.ReactNode) => React.ReactNode;
    onClick?: (id: string | number, comment: CommentDataType) => void;
    onEdit?: (id: string | number, comment: CommentDataType) => void;
    deleteConfirmText?: string;
    mentionsPlaceholder?: string;
    listItemRender?: (
      defaultDom: {
        checkbox: React.JSX.Element | null;
        mentionsUser: React.JSX.Element | null;
        children: any;
      },
      comment: CommentDataType,
    ) => React.ReactNode;
  };

  /**
   * 其他属性
   */
  [key: string]: any;
};
