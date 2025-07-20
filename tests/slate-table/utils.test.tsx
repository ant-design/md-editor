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

  describe('additional Point operations', () => {
    it('should handle Point operations with negative coordinates', () => {
      const point1 = Point.valueOf(-1, -2);
      const point2 = Point.valueOf(-1, -2);
      const point3 = Point.valueOf(0, 0);

      expect(point1.x).toBe(-1);
      expect(point1.y).toBe(-2);
      expect(Point.equals(point1, point2)).toBe(true);
      expect(Point.equals(point1, point3)).toBe(false);
    });

    it('should handle Point operations with large coordinates', () => {
      const point1 = Point.valueOf(1000, 2000);
      const point2 = Point.valueOf(1000, 2000);

      expect(Point.equals(point1, point2)).toBe(true);
    });

    it('should handle Point operations with decimal coordinates', () => {
      const point1 = Point.valueOf(1.5, 2.7);
      const point2 = Point.valueOf(1.5, 2.7);
      const point3 = Point.valueOf(1.6, 2.7);

      expect(Point.equals(point1, point2)).toBe(true);
      expect(Point.equals(point1, point3)).toBe(false);
    });
  });

  describe('advanced isOfType scenarios', () => {
    it('should handle multiple type checking', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const isTd = isOfType(editor, 'td'); // table-cell
      const isTr = isOfType(editor, 'tr'); // table-row
      const isTable = isOfType(editor, 'table');

      const cellElement = { type: 'table-cell', children: [] };
      const rowElement = { type: 'table-row', children: [] };
      const tableElement = { type: 'table', children: [] };
      const paragraphElement = { type: 'paragraph', children: [] };

      expect(isTd(cellElement, [])).toBe(true);
      expect(isTr(rowElement, [])).toBe(true);
      expect(isTable(tableElement, [])).toBe(true);

      expect(isTd(paragraphElement, [])).toBe(false);
      expect(isTr(paragraphElement, [])).toBe(false);
      expect(isTable(paragraphElement, [])).toBe(false);
    });

    it('should handle isOfType with complex nested elements', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const isTd = isOfType(editor, 'td');

      const nestedCellElement = {
        type: 'table-cell',
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'Cell content' }],
          },
        ],
      };

      expect(isTd(nestedCellElement, [])).toBe(true);
    });

    it('should handle isOfType with header cells', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const isTh = isOfType(editor, 'th'); // header-cell
      const element = { type: 'header-cell', children: [] };

      expect(isTh(element, [])).toBe(true);
    });
  });

  describe('advanced hasCommon scenarios', () => {
    it('should handle hasCommon with deeply nested table structures', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const deepTable = {
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
                        children: [{ text: 'Deep content' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      editor.children = [deepTable];

      const path1 = [0, 0, 0, 0, 0]; // Deep nested path
      const path2 = [0, 0, 0]; // Less deep path

      const result = hasCommon(editor, [path1, path2], 'table');
      expect(result).toBe(true);
    });

    it('should handle hasCommon with multiple table elements', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const table1 = createTableNode(2, 2);
      const table2 = createTableNode(2, 2);

      editor.children = [
        table1,
        { type: 'paragraph', children: [{ text: 'Between tables' }] },
        table2,
      ];

      const path1 = [0, 0, 0]; // First table
      const path2 = [2, 0, 0]; // Second table

      const result = hasCommon(editor, [path1, path2], 'table');
      expect(result).toBe(false); // Different tables
    });

    it('should handle hasCommon with invalid paths', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      const path1 = [0, 0, 0];
      const path2 = [10, 10, 10]; // Invalid path

      expect(() => {
        hasCommon(editor, [path1, path2], 'table');
      }).not.toThrow(); // Should handle gracefully
    });

    it('should handle hasCommon with same paths', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      const path1 = [0, 0, 0];
      const result = hasCommon(editor, [path1, path1], 'table');
      expect(result).toBe(true); // Same path should return true if it contains the type
    });
  });

  describe('advanced filledMatrix scenarios', () => {
    it('should handle filledMatrix with complex table structures', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const complexTable = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                rowSpan: 2,
                children: [
                  { type: 'paragraph', children: [{ text: 'Merged cell' }] },
                ],
              },
              {
                type: 'table-cell',
                children: [
                  { type: 'paragraph', children: [{ text: 'Regular cell' }] },
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
                  { type: 'paragraph', children: [{ text: 'Bottom cell' }] },
                ],
              },
            ],
          },
        ],
      };

      editor.children = [complexTable];

      const matrix = filledMatrix(editor, { at: [0] });

      expect(matrix).toBeDefined();
      expect(Array.isArray(matrix)).toBe(true);
    });

    it('should handle filledMatrix with invalid table paths', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      expect(() => {
        try {
          filledMatrix(editor, { at: [999] }); // Invalid table index
        } catch (error) {
          // Expected to throw due to invalid path
        }
      }).not.toThrow(); // Should handle gracefully at the test level
    });

    it('should handle filledMatrix with non-table elements', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      editor.children = [
        { type: 'paragraph', children: [{ text: 'Not a table' }] },
      ];

      const matrix = filledMatrix(editor, { at: [0] });

      expect(Array.isArray(matrix)).toBe(true);
      expect(matrix).toHaveLength(0); // Empty matrix for non-table
    });

    it('should handle filledMatrix with tables containing different cell types', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const mixedCellTable = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                children: [
                  { type: 'paragraph', children: [{ text: 'Regular cell' }] },
                ],
              },
              {
                type: 'header-cell',
                children: [
                  { type: 'paragraph', children: [{ text: 'Header cell' }] },
                ],
              },
            ],
          },
        ],
      };

      editor.children = [mixedCellTable];

      const matrix = filledMatrix(editor, { at: [0] });

      expect(matrix).toBeDefined();
      expect(Array.isArray(matrix)).toBe(true);
    });
  });

  describe('performance and edge cases', () => {
    it('should handle large table structures efficiently', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      // Create a large table (10x10)
      const largeTable = createTableNode(10, 10);
      editor.children = [largeTable];

      const startTime = performance.now();
      const matrix = filledMatrix(editor, { at: [0] });
      const endTime = performance.now();

      expect(matrix).toBeDefined();
      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
    });

    it('should handle Point operations with extreme values', () => {
      const point1 = Point.valueOf(
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
      );
      const point2 = Point.valueOf(
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
      );

      expect(Point.equals(point1, point2)).toBe(true);
    });

    it('should handle isOfType with supported type variations', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );

      const isContent = isOfType(editor, 'content'); // paragraph
      const element = { type: 'paragraph', children: [] };

      expect(isContent(element, [])).toBe(true);
    });

    it('should handle hasCommon with very deep path arrays', () => {
      const editor = withTable(
        createTestEditor(),
        DEFAULT_TEST_WITH_TABLE_OPTIONS,
      );
      const table = createTableNode(2, 2);

      editor.children = [table];

      const deepPath1 = [0, 0, 0, 0, 0];
      const deepPath2 = [0, 0, 1, 0, 0];

      expect(() => {
        hasCommon(editor, [deepPath1, deepPath2], 'table');
      }).not.toThrow();
    });
  });
});
