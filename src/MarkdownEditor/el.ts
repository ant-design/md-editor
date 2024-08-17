import { BaseEditor, BaseElement } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { RenderElementProps } from 'slate-react/dist/components/editable';

type Align = 'left' | 'center' | 'right';

export type CodeNode = {
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
  };
  language?: string;
  render?: boolean;
  frontmatter?: boolean;
  h?: number;
};

export type CodeLineNode = {
  type: 'code-line';
  children: BaseElement['children'];
  num?: number;
};

export type ParagraphNode = {
  type: 'paragraph';
  children: BaseElement['children'];
  h?: number;
};

export type TableNode = {
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
  };
};

export type DescriptionNode = {
  type: 'description';
  children: TableCellNode[];
};

export type ColumnNode = {
  type: 'column-group';
  children: ColumnCellNode[];
};

export type ColumnCellNode = {
  type: 'column-cell';
  children: BaseElement['children'];
};

export type TableRowNode = { type: 'table-row'; children: TableCellNode[] };

export type TableCellNode = {
  type: 'table-cell';
  title?: boolean;
  align?: Align;
  //@ts-ignore
  children: BaseElement['children'];
};

export type BlockQuoteNode = {
  type: 'blockquote';
  children: (BlockQuoteNode | ParagraphNode)[];
};

export type ListNode = {
  type: 'list';
  children: ListItemNode[];
  order?: boolean;
  start?: number;
  task?: boolean;
  h?: number;
};

export type ChartTypeConfig = {
  chartType: string;
  x?: string;
  y?: string;
  [key: string]: any;
};

export type ChartNode = {
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
  };
};

export type ListItemNode = {
  type: 'list-item';
  children: BaseElement['children'];
  checked?: boolean;
};

export type HeadNode = {
  type: 'head';
  children: BaseElement['children'];
  level: number;
  h?: number;
};

export type HrNode = { type: 'hr'; children: undefined };

export type BreakNode = { type: 'break' };

export type MediaNode = {
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

export type AttachNode = {
  type: 'attach';
  name: string;
  size: number;
  url: string;
};

export type SchemaNode<T> = {
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

export type Elements =
  | CodeNode
  | DescriptionNode
  | SchemaNode<{ valueType: string }>
  | ColumnCellNode
  | ColumnNode
  | CodeLineNode
  | ParagraphNode
  | TableNode
  | TableRowNode
  | TableCellNode
  | BlockQuoteNode
  | ListNode
  | ListItemNode
  | HeadNode
  | HrNode
  | MediaNode
  | BreakNode
  | ChartNode
  | AttachNode;

export type CustomLeaf = {
  bold?: boolean | null;
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
};

export type NodeTypes<T extends Elements = Elements> = T['type'];

export type MapValue<T> = T extends Map<any, infer I>
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
