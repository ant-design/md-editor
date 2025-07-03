import { CustomTypes, ExtendedType, Location } from 'slate';

type ElementType = ExtendedType<'Element', CustomTypes>['type'];

export interface WithTableOptions {
  blocks: {
    td: ElementType;
    th: ElementType;
    content: ElementType;
    tr: ElementType;
    table: ElementType;
    thead: ElementType;
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
    th: 'table-cell',
    content: 'paragraph',
    tr: 'table-row',
    table: 'table',
    thead: 'table-cell',
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
