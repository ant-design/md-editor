import { Element, NodeEntry } from 'slate';

export type CellElement = WithType<
  { rowSpan?: number; colSpan?: number } & Element
>;

/** Extends an element with the "type" property  */
export type WithType<T extends Element> = T & Record<'type', unknown>;

export type NodeEntryWithContext = [
  NodeEntry<CellElement>,
  {
    rtl: number; // right-to-left (colSpan)
    ltr: number; // left-to-right (colSpan)
    ttb: number; // top-to-bottom (rowSpan)
    btt: number; // bottom-to-top (rowSpan)
  },
];

export type SelectionMode = 'start' | 'end' | 'all';

export type Edge = 'start' | 'end' | 'top' | 'bottom';
