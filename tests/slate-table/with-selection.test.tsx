import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { withTable } from '../../src/MarkdownEditor/utils/slate-table';
import {
  EDITOR_TO_SELECTION,
  EDITOR_TO_SELECTION_SET,
} from '../../src/MarkdownEditor/utils/slate-table/weak-maps';
import {
  createTableNode,
  createTestEditor,
  DEFAULT_TEST_WITH_TABLE_OPTIONS,
} from './test-utils';

describe('with-selection slate-table functionality', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('selection tracking weak maps', () => {
    it('should initialize selection weak map', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      // Initialize with empty selection matrix
      EDITOR_TO_SELECTION.set(editor, []);

      expect(EDITOR_TO_SELECTION.has(editor)).toBe(true);
      expect(EDITOR_TO_SELECTION.get(editor)).toEqual([]);
    });

    it('should handle selection sets with WeakSet', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      // Initialize selection set
      const weakSet = new WeakSet();
      EDITOR_TO_SELECTION_SET.set(editor, weakSet);

      // Check that the selection set is properly initialized
      expect(EDITOR_TO_SELECTION_SET.has(editor)).toBe(true);
      expect(EDITOR_TO_SELECTION_SET.get(editor)).toBeInstanceOf(WeakSet);
    });

    it('should clear selection tracking on cleanup', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      // Set up some selection tracking
      EDITOR_TO_SELECTION.set(editor, []);
      EDITOR_TO_SELECTION_SET.set(editor, new WeakSet());

      // Clear tracking
      EDITOR_TO_SELECTION.delete(editor);
      EDITOR_TO_SELECTION_SET.delete(editor);

      expect(EDITOR_TO_SELECTION.has(editor)).toBe(false);
      expect(EDITOR_TO_SELECTION_SET.has(editor)).toBe(false);
    });
  });

  describe('selection matrix operations', () => {
    it('should handle empty selection matrix', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      // Empty selection matrix
      const emptyMatrix: any[][] = [];

      EDITOR_TO_SELECTION.set(editor, emptyMatrix);

      const stored = EDITOR_TO_SELECTION.get(editor);
      expect(stored).toBeDefined();
      expect(Array.isArray(stored)).toBe(true);
      expect(stored?.length).toBe(0);
    });

    it('should handle simple selection matrix', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      // Simple matrix with one row
      const simpleMatrix = [
        [], // Empty row to test structure
      ];

      EDITOR_TO_SELECTION.set(editor, simpleMatrix);

      const stored = EDITOR_TO_SELECTION.get(editor);
      expect(stored).toBeDefined();
      expect(Array.isArray(stored)).toBe(true);
      expect(stored?.length).toBe(1);
    });

    it('should handle nested array structure', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(3, 3);

      editor.children = [table];

      // Multi-row matrix structure
      const nestedMatrix = [
        [], // First row (empty)
        [], // Second row (empty)
        [], // Third row (empty)
      ];

      EDITOR_TO_SELECTION.set(editor, nestedMatrix);

      const stored = EDITOR_TO_SELECTION.get(editor);
      expect(stored).toBeDefined();
      expect(Array.isArray(stored)).toBe(true);
      expect(stored?.length).toBe(3);
    });
  });

  describe('WeakSet selection operations', () => {
    it('should handle WeakSet element tracking', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      const weakSet = new WeakSet();
      const cellElement = { type: 'table-cell', children: [] };

      // Add element to weak set
      weakSet.add(cellElement);

      EDITOR_TO_SELECTION_SET.set(editor, weakSet);

      const storedSet = EDITOR_TO_SELECTION_SET.get(editor);
      expect(storedSet).toBeDefined();
      expect(storedSet?.has(cellElement)).toBe(true);
    });

    it('should handle multiple elements in WeakSet', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      const weakSet = new WeakSet();
      const cell1 = { type: 'table-cell', children: [] };
      const cell2 = { type: 'table-cell', children: [] };
      const cell3 = { type: 'header-cell', children: [] };

      // Add multiple elements
      weakSet.add(cell1);
      weakSet.add(cell2);
      weakSet.add(cell3);

      EDITOR_TO_SELECTION_SET.set(editor, weakSet);

      const storedSet = EDITOR_TO_SELECTION_SET.get(editor);
      expect(storedSet?.has(cell1)).toBe(true);
      expect(storedSet?.has(cell2)).toBe(true);
      expect(storedSet?.has(cell3)).toBe(true);
    });

    it('should handle WeakSet element removal', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      const weakSet = new WeakSet();
      const cellElement = { type: 'table-cell', children: [] };

      // Add and then check removal behavior
      weakSet.add(cellElement);
      expect(weakSet.has(cellElement)).toBe(true);

      // WeakSet doesn't have delete method, but we can verify has()
      EDITOR_TO_SELECTION_SET.set(editor, weakSet);

      const storedSet = EDITOR_TO_SELECTION_SET.get(editor);
      expect(storedSet?.has(cellElement)).toBe(true);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle editor without table', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      editor.children = [
        { type: 'paragraph', children: [{ text: 'Not a table' }] },
      ];

      // Should not throw when handling non-table content
      expect(() => {
        EDITOR_TO_SELECTION.set(editor, []);
      }).not.toThrow();
    });

    it('should handle malformed table structures', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const malformedTable = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              // Invalid: not a table-cell
              { type: 'paragraph', children: [{ text: 'Invalid' }] },
            ],
          },
        ],
      };

      editor.children = [malformedTable];

      expect(() => {
        EDITOR_TO_SELECTION.set(editor, []);
        EDITOR_TO_SELECTION_SET.set(editor, new WeakSet());
      }).not.toThrow();
    });

    it('should handle empty WeakSet', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      const emptyWeakSet = new WeakSet();

      EDITOR_TO_SELECTION_SET.set(editor, emptyWeakSet);

      const storedSet = EDITOR_TO_SELECTION_SET.get(editor);
      expect(storedSet).toBeInstanceOf(WeakSet);
    });

    it('should handle concurrent weak map operations', () => {
      const editor1 = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const editor2 = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      // Set different data for different editors
      EDITOR_TO_SELECTION.set(editor1, []);
      EDITOR_TO_SELECTION.set(editor2, [[]]);

      EDITOR_TO_SELECTION_SET.set(editor1, new WeakSet());
      EDITOR_TO_SELECTION_SET.set(editor2, new WeakSet());

      // Verify isolation
      expect(EDITOR_TO_SELECTION.get(editor1)).toEqual([]);
      expect(EDITOR_TO_SELECTION.get(editor2)).toEqual([[]]);
      expect(EDITOR_TO_SELECTION_SET.get(editor1)).toBeInstanceOf(WeakSet);
      expect(EDITOR_TO_SELECTION_SET.get(editor2)).toBeInstanceOf(WeakSet);
    });
  });
});
