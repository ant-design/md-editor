import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { Transforms } from 'slate';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { withTable } from '../../src/MarkdownEditor/utils/slate-table';
import { EDITOR_TO_WITH_TABLE_OPTIONS } from '../../src/MarkdownEditor/utils/slate-table/weak-maps';
import {
  createTableNode,
  createTestEditor,
  DEFAULT_TEST_WITH_TABLE_OPTIONS,
} from './test-utils';

describe('withTable plugin integration', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('plugin initialization', () => {
    it('should properly initialize withTable plugin', () => {
      const baseEditor = createTestEditor();
      const editor = withTable(baseEditor, DEFAULT_TEST_WITH_TABLE_OPTIONS);

      expect(EDITOR_TO_WITH_TABLE_OPTIONS.has(editor)).toBe(true);
      expect(EDITOR_TO_WITH_TABLE_OPTIONS.get(editor)).toEqual(
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
    });

    it('should extend editor with table functionality', () => {
      const baseEditor = createTestEditor();
      const editor = withTable(baseEditor, DEFAULT_TEST_WITH_TABLE_OPTIONS);

      // Check if editor has been extended (basic functionality test)
      expect(typeof editor.insertNode).toBe('function');
      expect(typeof editor.deleteFragment).toBe('function');
      expect(typeof editor.insertText).toBe('function');
    });

    it('should handle multiple plugin instances', () => {
      const baseEditor1 = createTestEditor();
      const baseEditor2 = createTestEditor();

      const editor1 = withTable(baseEditor1, DEFAULT_TEST_WITH_TABLE_OPTIONS);
      const editor2 = withTable(baseEditor2, {
        ...DEFAULT_TEST_WITH_TABLE_OPTIONS,
        withSelection: false,
      });

      expect(EDITOR_TO_WITH_TABLE_OPTIONS.get(editor1)?.withSelection).toBe(
        true,
      );
      expect(EDITOR_TO_WITH_TABLE_OPTIONS.get(editor2)?.withSelection).toBe(
        false,
      );
    });
  });

  describe('table structure validation', () => {
    it('should validate proper table structure', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const validTable = createTableNode(2, 2);
      editor.children = [validTable];

      // Should not throw with valid structure
      expect(() => {
        Transforms.select(editor, { path: [0, 0, 0, 0, 0], offset: 0 });
      }).not.toThrow();
    });

    it('should handle table with missing cells', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const incompleteTable = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                children: [
                  { type: 'paragraph', children: [{ text: 'Cell 1' }] },
                ],
              },
              // Missing second cell
            ],
          },
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                children: [
                  { type: 'paragraph', children: [{ text: 'Cell 2' }] },
                ],
              },
              {
                type: 'table-cell',
                children: [
                  { type: 'paragraph', children: [{ text: 'Cell 3' }] },
                ],
              },
            ],
          },
        ],
      };

      editor.children = [incompleteTable];

      // Should handle gracefully
      expect(() => {
        Transforms.select(editor, { path: [0], offset: 0 });
      }).not.toThrow();
    });

    it('should handle empty table rows', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const tableWithEmptyRow = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [],
          },
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                children: [{ type: 'paragraph', children: [{ text: 'Cell' }] }],
              },
            ],
          },
        ],
      };

      editor.children = [tableWithEmptyRow];

      expect(() => {
        Transforms.select(editor, { path: [0], offset: 0 });
      }).not.toThrow();
    });
  });

  describe('editor operations with tables', () => {
    it('should handle text insertion in table cells', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const table = createTableNode(2, 2);
      editor.children = [table];

      Transforms.select(editor, { path: [0, 0, 0, 0, 0], offset: 0 });

      expect(() => {
        editor.insertText('Hello');
      }).not.toThrow();
    });

    it('should handle text deletion in table cells', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const table = createTableNode(2, 2);
      editor.children = [table];

      // Add some text first
      Transforms.select(editor, { path: [0, 0, 0, 0, 0], offset: 0 });
      editor.insertText('Hello World');

      // Then try to delete
      Transforms.select(editor, {
        anchor: { path: [0, 0, 0, 0, 0], offset: 0 },
        focus: { path: [0, 0, 0, 0, 0], offset: 5 },
      });

      expect(() => {
        editor.deleteFragment();
      }).not.toThrow();
    });

    it('should handle node insertion in table context', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const table = createTableNode(2, 2);
      editor.children = [table];

      Transforms.select(editor, { path: [0, 0, 0, 0], offset: 1 });

      const newParagraph = {
        type: 'paragraph',
        children: [{ text: 'New paragraph' }],
      };

      expect(() => {
        Transforms.insertNodes(editor, newParagraph);
      }).not.toThrow();
    });
  });

  describe('selection management', () => {
    it('should maintain selection state across operations', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const table = createTableNode(3, 3);
      editor.children = [table];

      // Set initial selection with valid path for 3x3 table
      // [0, 1, 1, 0, 0] = table -> row 1 -> cell 1 -> paragraph -> text
      Transforms.select(editor, { path: [0, 1, 1, 0, 0], offset: 0 });
      
      const initialSelection = editor.selection;
      expect(initialSelection).toBeDefined();

      // Perform operation that should maintain selection
      editor.insertText('Test');

      expect(editor.selection).toBeDefined();
    });    it('should handle selection across multiple cells', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const table = createTableNode(2, 2);
      editor.children = [table];

      // Select across cells
      const crossCellSelection = {
        anchor: { path: [0, 0, 0, 0, 0], offset: 0 },
        focus: { path: [0, 0, 0, 1, 0], offset: 0 },
      };

      expect(() => {
        Transforms.select(editor, crossCellSelection);
      }).not.toThrow();
    });

    it('should handle selection outside table context', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      editor.children = [
        { type: 'paragraph', children: [{ text: 'Before table' }] },
        createTableNode(2, 2),
        { type: 'paragraph', children: [{ text: 'After table' }] },
      ];

      // Select in paragraph outside table
      Transforms.select(editor, { path: [0, 0], offset: 0 });

      expect(editor.selection).toBeDefined();
      expect(() => {
        editor.insertText('Modified ');
      }).not.toThrow();
    });
  });

  describe('configuration variations', () => {
    it('should handle different block type configurations', () => {
      const customOptions = {
        ...DEFAULT_TEST_WITH_TABLE_OPTIONS,
        blocks: {
          ...DEFAULT_TEST_WITH_TABLE_OPTIONS.blocks,
          td: 'header-cell' as const, // Use supported type
          table: 'table' as const,
        },
      };

      const editor = withTable(createTestEditor(), customOptions);
      const options = EDITOR_TO_WITH_TABLE_OPTIONS.get(editor);

      expect(options?.blocks.td).toBe('header-cell');
      expect(options?.blocks.table).toBe('table');
    });

    it('should handle disabled features', () => {
      const minimalOptions = {
        ...DEFAULT_TEST_WITH_TABLE_OPTIONS,
        withDelete: false,
        withFragments: false,
        withInsertText: false,
        withNormalization: false,
        withSelection: false,
        withSelectionAdjustment: false,
      };

      const editor = withTable(createTestEditor(), minimalOptions);
      const options = EDITOR_TO_WITH_TABLE_OPTIONS.get(editor);

      expect(options?.withDelete).toBe(false);
      expect(options?.withFragments).toBe(false);
      expect(options?.withInsertText).toBe(false);
      expect(options?.withNormalization).toBe(false);
      expect(options?.withSelection).toBe(false);
      expect(options?.withSelectionAdjustment).toBe(false);
    });

    it('should handle partial configuration overrides', () => {
      const partialOptions = {
        ...DEFAULT_TEST_WITH_TABLE_OPTIONS,
        withSelection: false,
        blocks: {
          ...DEFAULT_TEST_WITH_TABLE_OPTIONS.blocks,
          th: 'paragraph' as const, // Use supported type
        },
      };

      const editor = withTable(createTestEditor(), partialOptions);
      const options = EDITOR_TO_WITH_TABLE_OPTIONS.get(editor);

      expect(options?.withSelection).toBe(false);
      expect(options?.withDelete).toBe(true); // Should keep default
      expect(options?.blocks.th).toBe('paragraph');
      expect(options?.blocks.td).toBe('table-cell'); // Should keep default
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle malformed table structures gracefully', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const malformedTable = {
        type: 'table',
        children: [
          {
            // Missing type property
            children: [
              {
                type: 'table-cell',
                children: [],
              },
            ],
          },
        ],
      };

      editor.children = [malformedTable];

      expect(() => {
        Transforms.select(editor, { path: [0], offset: 0 });
      }).not.toThrow();
    });

    it('should handle operations on empty editor', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      editor.children = [];

      expect(() => {
        editor.insertText('Text in empty editor');
      }).not.toThrow();
    });

    it('should handle deeply nested table operations', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const nestedStructure = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        children: [{ text: 'Deeply nested content' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      editor.children = [nestedStructure];

      expect(() => {
        Transforms.select(editor, { path: [0, 0, 0, 0, 0, 0], offset: 0 });
      }).not.toThrow();
    });

    it('should handle rapid successive operations', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const table = createTableNode(2, 2);
      editor.children = [table];

      Transforms.select(editor, { path: [0, 0, 0, 0, 0], offset: 0 });

      expect(() => {
        // Simulate rapid typing
        for (let i = 0; i < 10; i++) {
          editor.insertText(i.toString());
        }
      }).not.toThrow();
    });
  });
});
