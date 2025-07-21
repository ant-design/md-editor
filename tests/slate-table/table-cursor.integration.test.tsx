import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { Transforms } from 'slate';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TableCursor } from '../../src/MarkdownEditor/utils/slate-table/table-cursor';
import { createEditorWithTable, createTableNode } from './test-utils';

describe('TableCursor 简单集成测试', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('基本功能测试', () => {
    it('应该正确识别表格内外状态', () => {
      const editor = createEditorWithTable(createTableNode(2, 2));

      // 在表格外
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      });
      expect(TableCursor.isInTable(editor)).toBe(false);

      // 在表格内
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });
      expect(TableCursor.isInTable(editor)).toBe(true);
    });

    it('应该正确识别第一个和最后一个单元格', () => {
      const editor = createEditorWithTable(createTableNode(2, 2));

      // 第一个单元格
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });
      expect(TableCursor.isInFirstCell(editor)).toBe(true);
      expect(TableCursor.isInLastCell(editor)).toBe(false);

      // 最后一个单元格
      Transforms.select(editor, {
        anchor: { path: [1, 1, 1, 0], offset: 0 },
        focus: { path: [1, 1, 1, 0], offset: 0 },
      });
      expect(TableCursor.isInFirstCell(editor)).toBe(false);
      expect(TableCursor.isInLastCell(editor)).toBe(true);
    });

    it('应该正确识别第一行和最后一行', () => {
      const editor = createEditorWithTable(createTableNode(3, 2));

      // 第一行
      Transforms.select(editor, {
        anchor: { path: [1, 0, 1, 0], offset: 0 },
        focus: { path: [1, 0, 1, 0], offset: 0 },
      });
      expect(TableCursor.isInFirstRow(editor)).toBe(true);
      expect(TableCursor.isInLastRow(editor)).toBe(false);

      // 最后一行
      Transforms.select(editor, {
        anchor: { path: [1, 2, 0, 0], offset: 0 },
        focus: { path: [1, 2, 0, 0], offset: 0 },
      });
      expect(TableCursor.isInFirstRow(editor)).toBe(false);
      expect(TableCursor.isInLastRow(editor)).toBe(true);

      // 中间行
      Transforms.select(editor, {
        anchor: { path: [1, 1, 1, 0], offset: 0 },
        focus: { path: [1, 1, 1, 0], offset: 0 },
      });
      expect(TableCursor.isInFirstRow(editor)).toBe(false);
      expect(TableCursor.isInLastRow(editor)).toBe(false);
    });
  });

  describe('导航方法的基本功能', () => {
    it('应该在没有选择时返回 false', () => {
      const editor = createEditorWithTable();
      editor.selection = null;

      expect(TableCursor.forward(editor)).toBe(false);
      expect(TableCursor.backward(editor)).toBe(false);
      expect(TableCursor.upward(editor)).toBe(false);
      expect(TableCursor.downward(editor)).toBe(false);
    });

    it('应该在表格外时返回 false', () => {
      const editor = createEditorWithTable();

      // 移动到表格外
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      });

      expect(TableCursor.forward(editor)).toBe(false);
      expect(TableCursor.backward(editor)).toBe(false);
      expect(TableCursor.upward(editor)).toBe(false);
      expect(TableCursor.downward(editor)).toBe(false);
    });

    it('应该支持不同的选择模式', () => {
      const editor = createEditorWithTable();

      // 移动到第一个单元格
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });

      // 测试基本导航
      const forwardResult = TableCursor.forward(editor);
      expect(forwardResult).toBe(true);

      const backwardResult = TableCursor.backward(editor);
      expect(backwardResult).toBe(true);

      // 测试使用选择模式的导航
      const forwardWithModeResult = TableCursor.forward(editor, {
        mode: 'start',
      });
      expect(forwardWithModeResult).toBe(true);

      const upwardWithModeResult = TableCursor.upward(editor, { mode: 'end' });
      expect(upwardWithModeResult).toBe(true);

      // 对于 downward，由于我们可能已经在最后一行，所以可能返回 false
      // 重新定位到第一行进行测试
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });
      const downwardWithModeResult = TableCursor.downward(editor, {
        mode: 'all',
      });
      expect(downwardWithModeResult).toBe(true);
    });
  });

  describe('边界条件', () => {
    it('应该处理单单元格表格', () => {
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

    it('应该处理 isOnEdge 的基本情况', () => {
      const editor = createEditorWithTable();

      // 没有选择时应该返回 false
      editor.selection = null;
      expect(TableCursor.isOnEdge(editor, 'start')).toBe(false);
      expect(TableCursor.isOnEdge(editor, 'end')).toBe(false);
      expect(TableCursor.isOnEdge(editor, 'top')).toBe(false);
      expect(TableCursor.isOnEdge(editor, 'bottom')).toBe(false);

      // 在表格外时应该返回 false
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      });
      expect(TableCursor.isOnEdge(editor, 'start')).toBe(false);
    });
  });

  describe('与选择相关的方法', () => {
    it('应该正确处理需要 withSelection 选项的方法', () => {
      const editor = createEditorWithTable();

      // 这些方法应该不抛出错误
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
  });

  describe('reverse 选项测试', () => {
    it('应该支持 reverse 选项', () => {
      const editor = createEditorWithTable(createTableNode(2, 2));

      // 测试正常顺序
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });
      expect(TableCursor.isInFirstCell(editor)).toBe(true);
      expect(TableCursor.isInFirstCell(editor, { reverse: false })).toBe(true);

      // 测试反序
      Transforms.select(editor, {
        anchor: { path: [1, 1, 1, 0], offset: 0 },
        focus: { path: [1, 1, 1, 0], offset: 0 },
      });
      expect(TableCursor.isInFirstCell(editor, { reverse: true })).toBe(true);

      // 测试行的反序
      Transforms.select(editor, {
        anchor: { path: [1, 0, 0, 0], offset: 0 },
        focus: { path: [1, 0, 0, 0], offset: 0 },
      });
      expect(TableCursor.isInFirstRow(editor)).toBe(true);
      expect(TableCursor.isInFirstRow(editor, { reverse: false })).toBe(true);

      Transforms.select(editor, {
        anchor: { path: [1, 1, 0, 0], offset: 0 },
        focus: { path: [1, 1, 0, 0], offset: 0 },
      });
      expect(TableCursor.isInFirstRow(editor, { reverse: true })).toBe(true);
    });
  });
});
