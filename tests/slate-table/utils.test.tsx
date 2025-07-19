import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { withTable } from '../../src/MarkdownEditor/utils/slate-table';
import {
  filledMatrix,
  hasCommon,
  isOfType,
  Point,
} from '../../src/MarkdownEditor/utils/slate-table/utils';
import {
  createTableNode,
  createTestEditor,
  DEFAULT_TEST_WITH_TABLE_OPTIONS,
} from './test-utils';

describe('slate-table utils', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Point', () => {
    it('should create a point with valueOf', () => {
      const point = Point.valueOf(2, 3);
      expect(point.x).toBe(2);
      expect(point.y).toBe(3);
    });

    it('should check point equality', () => {
      const point1 = Point.valueOf(2, 3);
      const point2 = Point.valueOf(2, 3);
      const point3 = Point.valueOf(1, 3);

      expect(Point.equals(point1, point2)).toBe(true);
      expect(Point.equals(point1, point3)).toBe(false);
    });
  });

  describe('isOfType', () => {
    it('should check if element is of specified type', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const tableCell = { type: 'table-cell', children: [] };
      const headerCell = { type: 'header-cell', children: [] };
      const paragraph = { type: 'paragraph', children: [] };

      const isCellType = isOfType(editor, 'td', 'th');

      expect(isCellType(tableCell, [])).toBe(true);
      expect(isCellType(headerCell, [])).toBe(true);
      expect(isCellType(paragraph, [])).toBe(false);
    });

    it('should return function that works with single type', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const tableElement = { type: 'table', children: [] };
      const paragraphElement = { type: 'paragraph', children: [] };

      const isTableType = isOfType(editor, 'table');

      expect(isTableType(tableElement, [])).toBe(true);
      expect(isTableType(paragraphElement, [])).toBe(false);
    });
  });

  describe('hasCommon', () => {
    it('should find common ancestor of specified type', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      const path1 = [0, 0, 0]; // First row, first cell
      const path2 = [0, 0, 1]; // First row, second cell

      const result = hasCommon(editor, [path1, path2], 'tr');
      expect(result).toBe(true);
    });

    it('should return false when no common ancestor exists', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      editor.children = [
        createTableNode(2, 2),
        { type: 'paragraph', children: [{ text: 'Outside table' }] },
      ];

      const path1 = [0, 0, 0]; // Inside table
      const path2 = [1]; // Outside table

      const result = hasCommon(editor, [path1, path2], 'table');
      expect(result).toBe(false);
    });

    it('should handle paths that share table ancestor', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      const path1 = [0, 0, 0]; // First row, first cell
      const path2 = [0, 1, 0]; // Second row, first cell

      const result = hasCommon(editor, [path1, path2], 'table');
      expect(result).toBe(true);
    });
  });

  describe('filledMatrix', () => {
    it('should create filled matrix for simple table', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      const matrix = filledMatrix(editor, { at: [0] });

      expect(matrix).toBeDefined();
      expect(Array.isArray(matrix)).toBe(true);
    });

    it('should handle table with merged cells', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const tableWithMergedCells = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                colSpan: 2,
                children: [
                  { type: 'paragraph', children: [{ text: 'Merged' }] },
                ],
              },
              {
                type: 'table-cell',
                children: [
                  { type: 'paragraph', children: [{ text: 'Cell3' }] },
                ],
              },
            ],
          },
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                children: [
                  { type: 'paragraph', children: [{ text: 'Cell4' }] },
                ],
              },
              {
                type: 'table-cell',
                children: [
                  { type: 'paragraph', children: [{ text: 'Cell5' }] },
                ],
              },
              {
                type: 'table-cell',
                children: [
                  { type: 'paragraph', children: [{ text: 'Cell6' }] },
                ],
              },
            ],
          },
        ],
      };

      editor.children = [tableWithMergedCells];

      const matrix = filledMatrix(editor, { at: [0] });

      expect(matrix).toBeDefined();
      expect(Array.isArray(matrix)).toBe(true);
    });

    it('should return empty array for invalid table paths', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      editor.children = [
        { type: 'paragraph', children: [{ text: 'Not a table' }] },
      ];

      const matrix = filledMatrix(editor, { at: [0] });

      expect(matrix).toBeDefined();
      expect(Array.isArray(matrix)).toBe(true);
    });

    it('should handle empty table', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const emptyTable = {
        type: 'table',
        children: [],
      };

      editor.children = [emptyTable];

      const matrix = filledMatrix(editor, { at: [0] });

      expect(matrix).toBeDefined();
      expect(Array.isArray(matrix)).toBe(true);
    });

    it('should handle table with rowSpan', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const tableWithRowSpan = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                rowSpan: 2,
                children: [
                  { type: 'paragraph', children: [{ text: 'Spans 2 rows' }] },
                ],
              },
              {
                type: 'table-cell',
                children: [
                  { type: 'paragraph', children: [{ text: 'Cell2' }] },
                ],
              },
            ],
          },
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                children: [
                  { type: 'paragraph', children: [{ text: 'Cell3' }] },
                ],
              },
            ],
          },
        ],
      };

      editor.children = [tableWithRowSpan];

      const matrix = filledMatrix(editor, { at: [0] });

      expect(matrix).toBeDefined();
      expect(Array.isArray(matrix)).toBe(true);
    });
  });

  describe('edge cases and error handling', () => {
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
        filledMatrix(editor, { at: [0] });
      }).not.toThrow();
    });

    it('should handle deeply nested paths gracefully', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      expect(() => {
        filledMatrix(editor, { at: [0, 0, 0, 0, 0, 0, 0] });
      }).toThrow('Cannot find a descendant at path');
    });

    it('should handle table with mixed cell types', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const mixedTable = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              {
                type: 'header-cell',
                children: [
                  { type: 'paragraph', children: [{ text: 'Header' }] },
                ],
              },
              {
                type: 'table-cell',
                children: [{ type: 'paragraph', children: [{ text: 'Cell' }] }],
              },
            ],
          },
        ],
      };

      editor.children = [mixedTable];

      const matrix = filledMatrix(editor, { at: [0] });

      expect(matrix).toBeDefined();
      expect(Array.isArray(matrix)).toBe(true);
    });

    it('should handle isOfType with non-existent types', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const isNonExistentType = isOfType(editor, 'table');
      const nonTableElement = { type: 'heading', children: [] };

      expect(isNonExistentType(nonTableElement, [])).toBe(false);
    });
  });
});
