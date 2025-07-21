import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { Transforms } from 'slate';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TableCursor } from '../../src/MarkdownEditor/utils/slate-table/table-cursor';
import {
  createComplexTable,
  createEditorWithTable,
  createTableNode,
  createTableWithHeader,
  TestEditor,
} from './test-utils';

describe('TableCursor', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('isInTable', () => {
    it('should return true when cursor is inside a table', () => {
      const editor = createEditorWithTable();

      // 将光标移动到表格内的第一个单元格
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });

      expect(TableCursor.isInTable(editor)).toBe(true);
    });

    it('should return false when cursor is outside a table', () => {
      const editor = createEditorWithTable();

      // 将光标移动到表格前的段落
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      });

      expect(TableCursor.isInTable(editor)).toBe(false);
    });

    it('should return false when there is no selection', () => {
      const editor = createEditorWithTable();
      editor.selection = null;

      expect(TableCursor.isInTable(editor)).toBe(false);
    });
  });

  describe('isOnEdge', () => {
    let editor: TestEditor;

    beforeEach(() => {
      editor = createEditorWithTable();
    });

    it('should return false when not in a table cell', () => {
      // 移动到表格外
      Transforms.select(editor, { path: [0, 0], offset: 0 });

      expect(TableCursor.isOnEdge(editor, 'start')).toBe(false);
      expect(TableCursor.isOnEdge(editor, 'end')).toBe(false);
      expect(TableCursor.isOnEdge(editor, 'top')).toBe(false);
      expect(TableCursor.isOnEdge(editor, 'bottom')).toBe(false);
    });

    it('should return false when no selection exists', () => {
      editor.selection = null;

      expect(TableCursor.isOnEdge(editor, 'start')).toBe(false);
    });
  });

  describe('isInFirstCell', () => {
    it('should return true when in first cell', () => {
      const editor = createEditorWithTable();

      // 移动到第一个单元格
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });

      expect(TableCursor.isInFirstCell(editor)).toBe(true);
    });

    it('should return false when not in first cell', () => {
      const editor = createEditorWithTable();

      // 移动到第二个单元格
      Transforms.select(editor, {
        anchor: { path: [1, 0, 1, 0], offset: 0 },
        focus: { path: [1, 0, 1, 0], offset: 0 },
      });

      expect(TableCursor.isInFirstCell(editor)).toBe(false);
    });

    it('should return false when not in table', () => {
      const editor = createEditorWithTable();

      // 移动到表格外
      Transforms.select(editor, { path: [0, 0], offset: 0 });

      expect(TableCursor.isInFirstCell(editor)).toBe(false);
    });

    it('should return false when no selection', () => {
      const editor = createEditorWithTable();
      editor.selection = null;

      expect(TableCursor.isInFirstCell(editor)).toBe(false);
    });
  });

  describe('isInLastCell', () => {
    it('should return true when in last cell', () => {
      const editor = createEditorWithTable();

      // 移动到最后一个单元格
      Transforms.select(editor, {
        anchor: { path: [1, 1, 1, 0], offset: 0 },
        focus: { path: [1, 1, 1, 0], offset: 0 },
      });

      expect(TableCursor.isInLastCell(editor)).toBe(true);
    });

    it('should return false when not in last cell', () => {
      const editor = createEditorWithTable();

      // 移动到第一个单元格
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });

      expect(TableCursor.isInLastCell(editor)).toBe(false);
    });
  });

  describe('isInFirstRow', () => {
    it('should return true when in first row', () => {
      const editor = createEditorWithTable();

      // 移动到第一行的任意单元格
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });

      expect(TableCursor.isInFirstRow(editor)).toBe(true);
    });

    it('should return false when not in first row', () => {
      const editor = createEditorWithTable();

      // 移动到第二行
      Transforms.select(editor, {
        anchor: { path: [1, 1, 0, 0], offset: 0 },
        focus: { path: [1, 1, 0, 0], offset: 0 },
      });

      expect(TableCursor.isInFirstRow(editor)).toBe(false);
    });

    it('should return false when no selection', () => {
      const editor = createEditorWithTable();
      editor.selection = null;

      expect(TableCursor.isInFirstRow(editor)).toBe(false);
    });
  });

  describe('isInLastRow', () => {
    it('should return true when in last row', () => {
      const editor = createEditorWithTable();

      // 移动到最后一行
      Transforms.select(editor, {
        anchor: { path: [1, 1, 0, 0], offset: 0 },
        focus: { path: [1, 1, 0, 0], offset: 0 },
      });

      expect(TableCursor.isInLastRow(editor)).toBe(true);
    });

    it('should return false when not in last row', () => {
      const editor = createEditorWithTable();

      // 移动到第一行
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });

      expect(TableCursor.isInLastRow(editor)).toBe(false);
    });
  });

  describe('navigation methods', () => {
    describe('forward', () => {
      it('should return false when no selection', () => {
        const editor = createEditorWithTable();
        editor.selection = null;

        const result = TableCursor.forward(editor);
        expect(result).toBe(false);
      });

      it('should return false when not in table', () => {
        const editor = createEditorWithTable();

        // 移动到表格外
        Transforms.select(editor, { path: [0, 0], offset: 0 });

        const result = TableCursor.forward(editor);
        expect(result).toBe(false);
      });
    });

    describe('backward', () => {
      it('should return false when no selection', () => {
        const editor = createEditorWithTable();
        editor.selection = null;

        const result = TableCursor.backward(editor);
        expect(result).toBe(false);
      });

      it('should return false when not in table', () => {
        const editor = createEditorWithTable();

        // 移动到表格外
        Transforms.select(editor, { path: [0, 0], offset: 0 });

        const result = TableCursor.backward(editor);
        expect(result).toBe(false);
      });
    });

    describe('upward', () => {
      it('should return false when no selection', () => {
        const editor = createEditorWithTable();
        editor.selection = null;

        const result = TableCursor.upward(editor);
        expect(result).toBe(false);
      });

      it('should return false when not in table', () => {
        const editor = createEditorWithTable();

        // 移动到表格外
        Transforms.select(editor, { path: [0, 0], offset: 0 });

        const result = TableCursor.upward(editor);
        expect(result).toBe(false);
      });
    });

    describe('downward', () => {
      it('should return false when no selection', () => {
        const editor = createEditorWithTable();
        editor.selection = null;

        const result = TableCursor.downward(editor);
        expect(result).toBe(false);
      });

      it('should return false when not in table', () => {
        const editor = createEditorWithTable();

        // 移动到表格外
        Transforms.select(editor, { path: [0, 0], offset: 0 });

        const result = TableCursor.downward(editor);
        expect(result).toBe(false);
      });
    });
  });

  describe('complex table scenarios', () => {
    it('should handle tables with merged cells', () => {
      const complexTable = createComplexTable();
      const editor = createEditorWithTable(complexTable);

      // 移动到表格第一个单元格
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });

      expect(TableCursor.isInTable(editor)).toBe(true);
      expect(TableCursor.isInFirstCell(editor)).toBe(true);
      expect(TableCursor.isInFirstRow(editor)).toBe(true);
    });

    it('should handle tables with header cells', () => {
      const tableWithHeader = createTableWithHeader();
      const editor = createEditorWithTable(tableWithHeader);

      // 移动到表头单元格
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });

      expect(TableCursor.isInTable(editor)).toBe(true);
      expect(TableCursor.isInFirstCell(editor)).toBe(true);
      expect(TableCursor.isInFirstRow(editor)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle single cell tables', () => {
      const editor = createEditorWithTable(createTableNode(1, 1));

      // 移动到唯一的单元格
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });

      expect(TableCursor.isInTable(editor)).toBe(true);
      expect(TableCursor.isInFirstCell(editor)).toBe(true);
      expect(TableCursor.isInLastCell(editor)).toBe(true);
      expect(TableCursor.isInFirstRow(editor)).toBe(true);
      expect(TableCursor.isInLastRow(editor)).toBe(true);
    });

    it('should handle methods that require withSelection option', () => {
      const editor = createEditorWithTable();

      // 测试需要 withSelection 选项的方法
      expect(() => {
        const selection = TableCursor.selection(editor);
        for (const row of selection) {
          expect(Array.isArray(row)).toBe(true);
        }
      }).not.toThrow();

      expect(() => {
        TableCursor.unselect(editor);
      }).not.toThrow();

      // 测试 isSelected 方法
      const testElement = { type: 'table-cell', children: [] };
      const result = TableCursor.isSelected(editor, testElement);
      expect(typeof result).toBe('boolean');
    });

    it('should handle tables with no cells', () => {
      const editor = createEditorWithTable();
      // 创建一个空的表格结构
      editor.children = [
        { type: 'paragraph', children: [{ text: 'Before table' }] },
        { type: 'table', children: [] },
        { type: 'paragraph', children: [{ text: 'After table' }] },
      ];

      // 尝试移动到表格
      Transforms.select(editor, { path: [1], offset: 0 });

      // 虽然光标在表格节点上，但由于表格没有单元格，isInTable 仍然返回 true
      // 这是因为 isInTable 只检查是否有 table 类型的祖先节点
      expect(TableCursor.isInTable(editor)).toBe(true);
    });
  });
});
