import { BaseEditor, BaseElement } from 'slate';
import { HistoryEditor } from 'slate-history';
import { TableCustomElement } from './editor/elements/Table';
import { ReactEditor, RenderElementProps } from './editor/slate-react';

type Align = 'left' | 'center' | 'right';

export interface DetailedSettings {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
}

export type CodeNode<T = Record<string, any>> = {
  contextProps?: T;
  type: 'code';
  otherProps?: {
    className?: string;
    language?: string;
    render?: boolean;
    frontmatter?: boolean;
  } & T;
  children: [{ text: string }];
  language?: string;
  render?: boolean;
  frontmatter?: boolean;
  h?: number;
  value: string;
  katex?: boolean;
  isConfig?: boolean;
};

export type ParagraphNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'paragraph';
  align?: Align;
  children: BaseElement['children'];
  h?: number;
};

export type FootnoteDefinitionNode<T = Record<string, any>> = {
  contextProps?: T;
  identifier: string;
  otherProps?: T;
  url?: string;
  value?: string;
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
  children: BaseElement['children'];
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
  align?: Align;
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
  children: BaseElement['children'];
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
  block?: boolean;
  hash?: string;
  h?: number;
  children: BaseElement['children'];
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
  children: BaseElement['children'];
};

export type AttachNode<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  type: 'attach';
  name: string;
  size: number;
  url: string;
  children: BaseElement['children'];
};

export type SchemaNode<T = Record<string, any>> = {
  contextProps?: T;
  type: 'schema' | 'apaasify';
  otherProps?: {
    language?: string;
    render?: boolean;
    frontmatter?: boolean;
  } & T;
  children: [text: string];
  value: Record<string, any> | Record<string, any>[];
  language?: string;
  render?: boolean;
  frontmatter?: boolean;
  h?: number;
};

export type Elements<T = Record<string, any>> =
  | CodeNode<T>
  | FootnoteDefinitionNode<T>
  | SchemaNode<{ valueType: string } & T>
  | ParagraphNode<T>
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
  | CardAfterNode
  | TableCustomElement;

export type CustomLeaf<T = Record<string, any>> = {
  contextProps?: T;
  otherProps?: T;
  bold?: boolean | null;
  identifier?: string;
  code?: boolean | null;
  tag?: boolean | null;
  italic?: boolean | null;
  strikethrough?: boolean | null;
  color?: string;
  highColor?: string;
  url?: string;
  text?: string;
  current?: boolean | null;
  html?: string;
  // footnote
  fnc?: boolean;
  fnd?: boolean;
  comment?: boolean;
  id?: string;
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
    current?: boolean;
  }

  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: Elements & BaseElement;
    // Element: CustomElement
    //@ts-ignore
    Text: CustomLeaf;
  }
}

export type InlineKatexNode = {
  type: 'inline-katex';
  value: string;
  children: BaseElement['children'];
};

export interface ElementProps<T = Elements> extends RenderElementProps {
  element: T;
}
