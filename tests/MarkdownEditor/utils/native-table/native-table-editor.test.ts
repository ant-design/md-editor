import { createEditor, Editor, Node, Transforms } from 'slate';
import { describe, expect, it } from 'vitest';
import { NativeTableEditor } from '../../../../src/MarkdownEditor/utils/native-table/native-table-editor';

/**
 * 创建测试用的编辑器实例
 */
const createTestEditor = (initialValue?: Node[]): Editor => {
  const editor = createEditor();

  // 设置初始值
  if (initialValue) {
    editor.children = initialValue;
  } else {
    editor.children = [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ];
  }

  // 设置选中位置
  Transforms.select(editor, {
    path: [0, 0],
    offset: 0,
  });

  return editor;
};

/**
 * 创建一个基础表格节点
 */
const createTableNode = (rows: number, cols: number): Node => {
  return {
    type: 'table',
    children: Array.from({ length: rows }).map(() => ({
      type: 'table-row',
      children: Array.from({ length: cols }).map(() => ({
        type: 'table-cell',
        children: [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ],
      })),
    })),
  };
};

describe('NativeTableEditor', () => {
  describe('insertTable', () => {
    it('应该插入默认的 2x2 表格', () => {
      const editor = createTestEditor();

      NativeTableEditor.insertTable(editor);

      expect(editor.children).toHaveLength(2); // 原有段落 + 新表格
      const table = editor.children[1] as any;
      expect(table.type).toBe('table');
      expect(table.children).toHaveLength(2); // 2 行
      expect(table.children[0].children).toHaveLength(2); // 2 列
    });

    it('应该插入指定行列数的表格', () => {
      const editor = createTestEditor();

      NativeTableEditor.insertTable(editor, { rows: 3, cols: 4 });

      const table = editor.children[1] as any;
      expect(table.type).toBe('table');
      expect(table.children).toHaveLength(3); // 3 行
      expect(table.children[0].children).toHaveLength(4); // 4 列
    });

    it('应该处理行数小于1的情况，默认为1', () => {
      const editor = createTestEditor();

      NativeTableEditor.insertTable(editor, { rows: 0, cols: 2 });

      const table = editor.children[1] as any;
      expect(table.children).toHaveLength(1); // 至少1行
    });

    it('应该处理列数小于1的情况，默认为1', () => {
      const editor = createTestEditor();

      NativeTableEditor.insertTable(editor, { rows: 2, cols: -1 });

      const table = editor.children[1] as any;
      expect(table.children[0].children).toHaveLength(1); // 至少1列
    });

    it('应该在指定位置插入表格', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'first' }] },
        { type: 'paragraph', children: [{ text: 'second' }] },
      ]);

      NativeTableEditor.insertTable(editor, { at: [1] });

      expect(editor.children).toHaveLength(3);
      const table = editor.children[1] as any;
      expect(table.type).toBe('table');
    });

    it('应该为每个单元格创建段落节点', () => {
      const editor = createTestEditor();

      NativeTableEditor.insertTable(editor, { rows: 2, cols: 2 });

      const table = editor.children[1] as any;
      const cell = table.children[0].children[0];
      expect(cell.type).toBe('table-cell');
      expect(cell.children).toHaveLength(1);
      expect(cell.children[0].type).toBe('paragraph');
      expect(cell.children[0].children[0].text).toBe('');
    });
  });

  describe('removeTable', () => {
    it('应该删除表格', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'before' }] },
        table,
        { type: 'paragraph', children: [{ text: 'after' }] },
      ]);

      // 选择表格内的位置
      Transforms.select(editor, {
        path: [1, 0, 0, 0, 0],
        offset: 0,
      });

      NativeTableEditor.removeTable(editor);

      expect(editor.children).toHaveLength(2); // 只剩下 before 和 after
      expect((editor.children[0] as any).children[0].text).toBe('before');
      expect((editor.children[1] as any).children[0].text).toBe('after');
    });

    it('应该在没有表格时不执行任何操作', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      const childrenBefore = [...editor.children];
      NativeTableEditor.removeTable(editor);

      expect(editor.children).toEqual(childrenBefore);
    });

    it('应该删除指定位置的表格', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
        table,
      ]);

      NativeTableEditor.removeTable(editor, [1]);

      expect(editor.children).toHaveLength(1);
      expect((editor.children[0] as any).type).toBe('paragraph');
    });
  });

  describe('findTable', () => {
    it('应该找到表格节点', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
        table,
      ]);

      Transforms.select(editor, {
        path: [1, 0, 0, 0, 0],
        offset: 0,
      });

      const tableEntry = NativeTableEditor.findTable(editor);

      expect(tableEntry).toBeDefined();
      expect(tableEntry![0]).toEqual(table);
      expect(tableEntry![1]).toEqual([1]);
    });

    it('应该在不在表格中时返回 undefined', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      const tableEntry = NativeTableEditor.findTable(editor);

      expect(tableEntry).toBeUndefined();
    });

    it('应该找到指定位置的表格', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
        table,
      ]);

      const tableEntry = NativeTableEditor.findTable(editor, [1, 0, 0]);

      expect(tableEntry).toBeDefined();
      expect(tableEntry![1]).toEqual([1]);
    });
  });

  describe('findTableRow', () => {
    it('应该找到表格行节点', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 1, 0, 0, 0],
        offset: 0,
      });

      const rowEntry = NativeTableEditor.findTableRow(editor);

      expect(rowEntry).toBeDefined();
      expect(rowEntry![1]).toEqual([0, 1]);
      expect((rowEntry![0] as any).type).toBe('table-row');
    });

    it('应该在不在表格行中时返回 undefined', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      const rowEntry = NativeTableEditor.findTableRow(editor);

      expect(rowEntry).toBeUndefined();
    });
  });

  describe('findTableCell', () => {
    it('应该找到表格单元格节点', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 1, 0, 0],
        offset: 0,
      });

      const cellEntry = NativeTableEditor.findTableCell(editor);

      expect(cellEntry).toBeDefined();
      expect(cellEntry![1]).toEqual([0, 0, 1]);
      expect((cellEntry![0] as any).type).toBe('table-cell');
    });

    it('应该在不在表格单元格中时返回 undefined', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      const cellEntry = NativeTableEditor.findTableCell(editor);

      expect(cellEntry).toBeUndefined();
    });
  });

  describe('isInTable', () => {
    it('应该在表格中返回 true', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      expect(NativeTableEditor.isInTable(editor)).toBe(true);
    });

    it('应该在不在表格中返回 false', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      expect(NativeTableEditor.isInTable(editor)).toBe(false);
    });
  });

  describe('isInTableRow', () => {
    it('应该在表格行中返回 true', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      expect(NativeTableEditor.isInTableRow(editor)).toBe(true);
    });

    it('应该在不在表格行中返回 false', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      expect(NativeTableEditor.isInTableRow(editor)).toBe(false);
    });
  });

  describe('isInTableCell', () => {
    it('应该在表格单元格中返回 true', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      expect(NativeTableEditor.isInTableCell(editor)).toBe(true);
    });

    it('应该在不在表格单元格中返回 false', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      expect(NativeTableEditor.isInTableCell(editor)).toBe(false);
    });
  });

  describe('insertTableRow', () => {
    it('应该在当前行下方插入新行', () => {
      const table = createTableNode(2, 3);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      NativeTableEditor.insertTableRow(editor);

      const updatedTable = editor.children[0] as any;
      expect(updatedTable.children).toHaveLength(3); // 2 + 1
      expect(updatedTable.children[1].children).toHaveLength(3); // 保持列数
    });

    it('应该在当前行上方插入新行', () => {
      const table = createTableNode(2, 3);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 1, 0, 0, 0],
        offset: 0,
      });

      NativeTableEditor.insertTableRow(editor, { position: 'above' });

      const updatedTable = editor.children[0] as any;
      expect(updatedTable.children).toHaveLength(3); // 2 + 1
      expect(updatedTable.children[1].children).toHaveLength(3); // 保持列数
    });

    it('应该在不在表格中时不执行任何操作', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      const childrenBefore = [...editor.children];
      NativeTableEditor.insertTableRow(editor);

      expect(editor.children).toEqual(childrenBefore);
    });

    it('应该为新行创建正确数量的单元格', () => {
      const table = createTableNode(2, 4);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      NativeTableEditor.insertTableRow(editor);

      const updatedTable = editor.children[0] as any;
      expect(updatedTable.children[1].children).toHaveLength(4);
    });
  });

  describe('removeTableRow', () => {
    it('应该删除当前行', () => {
      const table = createTableNode(3, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 1, 0, 0, 0],
        offset: 0,
      });

      NativeTableEditor.removeTableRow(editor);

      const updatedTable = editor.children[0] as any;
      expect(updatedTable.children).toHaveLength(2); // 3 - 1
    });

    it('应该在只有一行时删除整个表格', () => {
      const table = createTableNode(1, 2);
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'before' }] },
        table,
        { type: 'paragraph', children: [{ text: 'after' }] },
      ]);

      Transforms.select(editor, {
        path: [1, 0, 0, 0, 0],
        offset: 0,
      });

      NativeTableEditor.removeTableRow(editor);

      expect(editor.children).toHaveLength(2); // before + after
      expect((editor.children[0] as any).children[0].text).toBe('before');
      expect((editor.children[1] as any).children[0].text).toBe('after');
    });

    it('应该在不在表格中时不执行任何操作', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      const childrenBefore = [...editor.children];
      NativeTableEditor.removeTableRow(editor);

      expect(editor.children).toEqual(childrenBefore);
    });
  });

  describe('insertTableColumn', () => {
    it('应该在当前列右侧插入新列', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      NativeTableEditor.insertTableColumn(editor);

      const updatedTable = editor.children[0] as any;
      expect(updatedTable.children[0].children).toHaveLength(3); // 2 + 1
      expect(updatedTable.children[1].children).toHaveLength(3); // 每行都增加
    });

    it('应该在当前列左侧插入新列', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 1, 0, 0],
        offset: 0,
      });

      NativeTableEditor.insertTableColumn(editor, { position: 'left' });

      const updatedTable = editor.children[0] as any;
      expect(updatedTable.children[0].children).toHaveLength(3); // 2 + 1
      expect(updatedTable.children[1].children).toHaveLength(3); // 每行都增加
    });

    it('应该在不在表格中时不执行任何操作', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      const childrenBefore = [...editor.children];
      NativeTableEditor.insertTableColumn(editor);

      expect(editor.children).toEqual(childrenBefore);
    });

    it('应该为每一行插入新单元格', () => {
      const table = createTableNode(3, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      NativeTableEditor.insertTableColumn(editor);

      const updatedTable = editor.children[0] as any;
      expect(updatedTable.children).toHaveLength(3); // 行数不变
      updatedTable.children.forEach((row: any) => {
        expect(row.children).toHaveLength(3); // 每行都是 2 + 1
      });
    });
  });

  describe('removeTableColumn', () => {
    it('应该删除当前列', () => {
      const table = createTableNode(2, 3);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 1, 0, 0],
        offset: 0,
      });

      NativeTableEditor.removeTableColumn(editor);

      const updatedTable = editor.children[0] as any;
      expect(updatedTable.children[0].children).toHaveLength(2); // 3 - 1
      expect(updatedTable.children[1].children).toHaveLength(2); // 每行都减少
    });

    it('应该在只有一列时删除整个表格', () => {
      const table = createTableNode(2, 1);
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'before' }] },
        table,
        { type: 'paragraph', children: [{ text: 'after' }] },
      ]);

      Transforms.select(editor, {
        path: [1, 0, 0, 0, 0],
        offset: 0,
      });

      NativeTableEditor.removeTableColumn(editor);

      expect(editor.children).toHaveLength(2); // before + after
      expect((editor.children[0] as any).children[0].text).toBe('before');
      expect((editor.children[1] as any).children[0].text).toBe('after');
    });

    it('应该在不在表格中时不执行任何操作', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      const childrenBefore = [...editor.children];
      NativeTableEditor.removeTableColumn(editor);

      expect(editor.children).toEqual(childrenBefore);
    });

    it('应该删除每一行的对应列', () => {
      const table = createTableNode(3, 3);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 1, 0, 0],
        offset: 0,
      });

      NativeTableEditor.removeTableColumn(editor);

      const updatedTable = editor.children[0] as any;
      expect(updatedTable.children).toHaveLength(3); // 行数不变
      updatedTable.children.forEach((row: any) => {
        expect(row.children).toHaveLength(2); // 每行都是 3 - 1
      });
    });
  });

  describe('moveToNextCell', () => {
    it('应该移动到右侧单元格', () => {
      const table = createTableNode(2, 3);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      NativeTableEditor.moveToNextCell(editor);

      expect(editor.selection?.anchor.path).toEqual([0, 0, 1, 0, 0]);
    });

    it('应该在行末时移动到下一行开头', () => {
      const table = createTableNode(2, 3);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 2, 0, 0],
        offset: 0,
      });

      NativeTableEditor.moveToNextCell(editor);

      expect(editor.selection?.anchor.path).toEqual([0, 1, 0, 0, 0]);
    });

    it('应该在最后一个单元格时不移动', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 1, 1, 0, 0],
        offset: 0,
      });

      const pathBefore = [...editor.selection!.anchor.path];
      NativeTableEditor.moveToNextCell(editor);

      expect(editor.selection?.anchor.path).toEqual(pathBefore);
    });

    it('应该在不在表格中时不执行任何操作', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      const pathBefore = [...editor.selection!.anchor.path];
      NativeTableEditor.moveToNextCell(editor);

      expect(editor.selection?.anchor.path).toEqual(pathBefore);
    });
  });

  describe('moveToPreviousCell', () => {
    it('应该移动到左侧单元格', () => {
      const table = createTableNode(2, 3);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 1, 0, 0],
        offset: 0,
      });

      NativeTableEditor.moveToPreviousCell(editor);

      expect(editor.selection?.anchor.path).toEqual([0, 0, 0, 0, 0]);
    });

    it('应该在行首时移动到上一行末尾', () => {
      const table = createTableNode(2, 3);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 1, 0, 0, 0],
        offset: 0,
      });

      NativeTableEditor.moveToPreviousCell(editor);

      expect(editor.selection?.anchor.path).toEqual([0, 0, 2, 0, 0]);
    });

    it('应该在第一个单元格时不移动', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      const pathBefore = [...editor.selection!.anchor.path];
      NativeTableEditor.moveToPreviousCell(editor);

      expect(editor.selection?.anchor.path).toEqual(pathBefore);
    });

    it('应该在不在表格中时不执行任何操作', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      const pathBefore = [...editor.selection!.anchor.path];
      NativeTableEditor.moveToPreviousCell(editor);

      expect(editor.selection?.anchor.path).toEqual(pathBefore);
    });
  });

  describe('边界情况和错误处理', () => {
    it('应该处理空编辑器', () => {
      const editor = createTestEditor([]);

      expect(() => {
        NativeTableEditor.isInTable(editor);
      }).not.toThrow();
    });

    it('应该处理无效的表格结构', () => {
      const invalidTable = {
        type: 'table',
        children: [],
      };
      const editor = createTestEditor([invalidTable]);

      expect(() => {
        NativeTableEditor.insertTableRow(editor);
      }).not.toThrow();
    });

    it('应该处理没有子节点的表格行', () => {
      const invalidTable = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [],
          },
        ],
      };
      const editor = createTestEditor([invalidTable]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      expect(() => {
        NativeTableEditor.insertTableColumn(editor);
      }).not.toThrow();
    });
  });
});
