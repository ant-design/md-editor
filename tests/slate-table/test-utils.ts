/** @jsxRuntime classic */
/** @jsx jsx */

import { BaseEditor, createEditor, Editor, Node } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { ReactEditor, withReact } from 'slate-react';
import { vi } from 'vitest';
import { withMarkdown } from '../../src/MarkdownEditor/editor/plugins/withMarkdown';
import { withTable } from '../../src/MarkdownEditor/utils/slate-table';

// Mock ReactEditor DOM methods
vi.mock('slate-react', () => ({
  ReactEditor: {
    toDOMNode: vi.fn(() => ({
      querySelector: vi.fn(() => ({
        textContent: '',
      })),
    })),
    findPath: vi.fn(() => [0]),
    toSlatePoint: vi.fn(),
    toSlateRange: vi.fn(),
  },
  withReact: (editor: any) => editor,
}));

export type TestEditor = BaseEditor & ReactEditor & HistoryEditor;

export const DEFAULT_TEST_WITH_TABLE_OPTIONS = {
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
} as const;

// JSX pragma for test fixtures
const jsx = (type: any, props: any, ...children: any[]): any => {
  if (typeof type === 'string') {
    if (type === 'cursor') {
      return { cursor: true };
    }
    if (type === 'anchor') {
      return { anchor: true };
    }
    if (type === 'focus') {
      return { focus: true };
    }
    if (type === 'text') {
      const text = children.join('');
      let textNode: any = { text };

      // Handle cursor/anchor/focus markers in text
      if (props && typeof props === 'object') {
        Object.assign(textNode, props);
      }

      return textNode;
    }

    const element: any = { type, children: children.flat().filter(Boolean) };
    if (props && typeof props === 'object') {
      Object.assign(element, props);
    }
    return element;
  }

  // Handle editor element
  if (type === 'editor') {
    const editorChildren = props?.children || children;
    return { children: editorChildren };
  }

  return type(props, ...children);
};

export { jsx };

export const withTest = (editor: TestEditor): TestEditor => {
  // Add test-specific behaviors
  return editor;
};

export const createTestEditor = (): TestEditor => {
  const editor = withTable(
    withMarkdown(withHistory(withReact(createEditor()))),
    DEFAULT_TEST_WITH_TABLE_OPTIONS,
  );
  editor.children = [{ type: 'paragraph', children: [{ text: '' }] }];
  return editor;
};

export const createTableNode = (rows: number = 2, cols: number = 2): Node => ({
  type: 'table',
  children: Array.from({ length: rows }).map(() => ({
    type: 'table-row',
    children: Array.from({ length: cols }).map(() => ({
      type: 'table-cell',
      children: [{ type: 'paragraph', children: [{ text: '' }] }],
    })),
  })),
});

export const createCellNode = (
  text: string = '',
  colSpan?: number,
  rowSpan?: number,
): Node => ({
  type: 'table-cell',
  ...(colSpan && { colSpan }),
  ...(rowSpan && { rowSpan }),
  children: [{ type: 'paragraph', children: [{ text }] }],
});

export const createRowNode = (cells: Node[]): Node => ({
  type: 'table-row',
  children: cells,
});

export const createComplexTable = (): Node => ({
  type: 'table',
  children: [
    // 第一行：普通单元格
    createRowNode([
      createCellNode('A1'),
      createCellNode('B1'),
      createCellNode('C1'),
    ]),
    // 第二行：包含合并单元格
    createRowNode([
      createCellNode('A2', 2), // colSpan = 2
      createCellNode('C2'),
    ]),
    // 第三行：包含 rowSpan
    createRowNode([
      createCellNode('A3', undefined, 2), // rowSpan = 2
      createCellNode('B3'),
      createCellNode('C3'),
    ]),
    // 第四行
    createRowNode([createCellNode('B4'), createCellNode('C4')]),
  ],
});

export const createEditorWithTable = (tableNode?: Node): TestEditor => {
  const editor = createTestEditor();
  const table = tableNode || createTableNode();

  editor.children = [
    { type: 'paragraph', children: [{ text: 'Before table' }] },
    table,
    { type: 'paragraph', children: [{ text: 'After table' }] },
  ];

  return editor;
};

export const normalizeEditor = (editor: TestEditor): void => {
  Editor.normalize(editor, { force: true });
};

// 创建一个简单的表格
export const createSimpleTable = (): Node => createTableNode(2, 2);

// 创建一个带有头部的表格
export const createTableWithHeader = (): Node => ({
  type: 'table',
  children: [
    {
      type: 'table-row',
      children: [
        {
          type: 'header-cell',
          children: [{ type: 'paragraph', children: [{ text: 'Header 1' }] }],
        },
        {
          type: 'header-cell',
          children: [{ type: 'paragraph', children: [{ text: 'Header 2' }] }],
        },
      ],
    },
    {
      type: 'table-row',
      children: [
        {
          type: 'table-cell',
          children: [{ type: 'paragraph', children: [{ text: 'Cell 1' }] }],
        },
        {
          type: 'table-cell',
          children: [{ type: 'paragraph', children: [{ text: 'Cell 2' }] }],
        },
      ],
    },
  ],
});
