import { BaseEditor, BaseElement } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor, RenderElementProps } from './editor/slate-react';

type Align = 'left' | 'center' | 'right';

export type CodeNode<T = Record<string, any>> = {
  contextProps?: T;
  type: 'code';
  children: {
    type: 'code-line';
    children: BaseElement['children'];
    num?: number;
  }[];
  otherProps?: {
    className?: string;
    highlight?: boolean;
    language?: string;
    render?: boolean;
    frontmatter?: boolean;
  } & T;
  language?: string;
  render?: boolean;
  frontmatter?: boolean;
  h?: number;
};

export type CodeLineNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'code-line';
  children: BaseElement['children'];
  num?: number;
};

export type ParagraphNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'paragraph';
  children: BaseElement['children'];
  h?: number;
};

export type FootnoteDefinitionNode<T = Record<string, any>> = {
  contextProps?: T;
  identifier: string;
  otherProps?: T;
  type: 'footnoteDefinition';
  children: BaseElement['children'];
  h?: number;
};

export type CardNode<T = any> = {
  type: 'card';
  children: (CardBeforeNode | CardAfterNode | T)[];
};

export type CardBeforeNode = {
  type: 'card-before';
  children: BaseElement['children'];
};

export type CardAfterNode = {
  type: 'card-after';
  children: BaseElement['children'];
};

export type TableNode<T = Record<string, any>> = {
  contextProps?: T;
  type: 'table';
  children: TableRowNode[];
  otherProps?: {
    showSource?: boolean;
    config: ChartTypeConfig | ChartTypeConfig[];
    columns: {
      title: string;
      dataIndex: string;
      key: string;
    }[];
    dataSource: any[];
  } & T;
};

export type DescriptionNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'description';
  children: TableCellNode[];
};

export type ColumnNode<T = Record<string, any>> = {
  contextProps?: T;
  type: 'column-group';
  children: ColumnCellNode[];
  otherProps?: {
    elementType: string;
  } & T;
};

export type ColumnCellNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'column-cell';
  children: BaseElement['children'];
};

export type TableRowNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'table-row';
  children: TableCellNode[];
};

export type TableCellNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'table-cell';
  title?: boolean;
  align?: Align;
  //@ts-ignore
  children: BaseElement['children'];
};

export type BlockQuoteNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'blockquote';
  children: (BlockQuoteNode | ParagraphNode)[];
};

export type ListNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'list';
  children: ListItemNode[];
  order?: boolean;
  start?: number;
  task?: boolean;
  h?: number;
};

export type ChartTypeConfig<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  chartType: string;
  x?: string;
  y?: string;
  [key: string]: any;
};

export type ChartNode<T = Record<string, any>> = {
  contextProps?: T;
  type: 'chart';
  children: TableNode['children'];
  otherProps?: {
    showSource?: boolean;
    config: ChartTypeConfig | ChartTypeConfig[];
    columns: {
      title: string;
      dataIndex: string;
      key: string;
    }[];
    dataSource: any[];
  } & T;
};

export type ListItemNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'list-item';
  children: BaseElement['children'];
  checked?: boolean;
  mentions: {
    id: string;
    name: string;
  }[];
  id: string;
};

export type HeadNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'head';
  children: BaseElement['children'];
  level: number;
  h?: number;
};

export type HrNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'hr';
  children: undefined;
};

export type BreakNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'break';
};

export type MediaNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'media';
  url?: string;
  alt: string;
  downloadUrl?: string;
  height?: number;
  width?: number;
  docId?: string;
  hash?: string;
  h?: number;
  align?: 'left' | 'right';
  mediaType?: string;
};

export type LinkCardNode<T = Record<string, any>> = {
  otherProps?: T;
  contextProps?: T;
  type: 'link-card';
  url?: string;
  icon?: string;
  description?: string;
  title?: string;
  name?: string;
  alt: string;
};

export type AttachNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'attach';
  name: string;
  size: number;
  url: string;
};

export type SchemaNode<T = Record<string, any>> = {
  contextProps?: T;
  type: 'schema' | 'apaasify';
  children: {
    type: 'code-line';
    children: BaseElement['children'];
    num?: number;
  }[];
  otherProps?: {
    highlight?: boolean;
    language?: string;
    render?: boolean;
    frontmatter?: boolean;
  } & T;
  value: Record<string, any> | Record<string, any>[];
  language?: string;
  render?: boolean;
  frontmatter?: boolean;
  h?: number;
};

export type Elements<T = Record<string, any>> =
  | CodeNode<T>
  | DescriptionNode<T>
  | FootnoteDefinitionNode<T>
  | SchemaNode<{ valueType: string } & T>
  | ColumnCellNode<T>
  | ColumnNode<T>
  | CodeLineNode<T>
  | ParagraphNode<T>
  | TableNode<T>
  | TableRowNode<T>
  | TableCellNode<T>
  | BlockQuoteNode<T>
  | ListNode<T>
  | ListItemNode<T>
  | HeadNode<T>
  | HrNode<T>
  | MediaNode<T>
  | BreakNode<T>
  | ChartNode<T>
  | AttachNode<T>
  | LinkCardNode<T>
  | CardNode
  | CardBeforeNode
  | CardAfterNode;

export type CustomLeaf<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  bold?: boolean | null;
  identifier?: string;
  code?: boolean | null;
  italic?: boolean | null;
  strikethrough?: boolean | null;
  color?: string;
  highColor?: string;
  url?: string;
  text?: string;
  highlight?: boolean | null;
  current?: boolean | null;
  html?: string;
  // footnote
  fnc?: boolean;
  fnd?: boolean;
  comment?: boolean;
  data?: Record<string, any>;
};

export type NodeTypes<T extends Elements = Elements> = T['type'];

export type MapValue<T> =
  T extends Map<any, infer I>
    ? I
    : T extends WeakMap<any, infer I>
      ? I
      : unknown;

declare module 'slate' {
  interface BaseElement {
    align?: Align;
  }
  interface BaseRange {
    color?: string;
    highlight?: boolean;
    current?: boolean;
  }

  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: Elements & BaseElement;
    // Element: CustomElement
    Text: CustomLeaf;
  }
}

export interface ElementProps<T = Elements> extends RenderElementProps {
  element: T;
}
