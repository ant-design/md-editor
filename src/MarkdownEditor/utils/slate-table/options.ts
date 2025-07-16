import { ExtendedType, Location } from 'slate';
import { TableCustomElement } from '../../editor/elements/Table';

type TableElementType = ExtendedType<'Element', TableCustomElement>['type'];

export interface WithTableOptions {
  blocks: {
    td: TableElementType;
    th: TableElementType;
    content: TableElementType;
    tr: TableElementType;
    table: TableElementType;
    tfoot: TableElementType;
    thead: TableElementType;
  };
  withDelete: boolean;
  withFragments: boolean;
  withInsertText: boolean;
  withNormalization: boolean;
  withSelection: boolean;
  withSelectionAdjustment: boolean;
}

export const DEFAULT_WITH_TABLE_OPTIONS = {
  blocks: {
    td: 'table-cell',
    th: 'header-cell',
    content: 'paragraph',
    tr: 'table-row',
    table: 'table',
    tfoot: 'table-footer',
    thead: 'table-head',
  },
  withDelete: true,
  withFragments: true,
  withInsertText: true,
  withNormalization: true,
  withSelection: true,
  withSelectionAdjustment: true,
} as const satisfies WithTableOptions;

export interface InsertTableOptions {
  rows: number;
  cols: number;
  at?: Location;
}

export const DEFAULT_INSERT_TABLE_OPTIONS = {
  rows: 2,
  cols: 2,
} as const satisfies InsertTableOptions;
