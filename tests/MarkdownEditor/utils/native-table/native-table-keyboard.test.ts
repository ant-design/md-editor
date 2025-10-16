import { createEditor, Editor, Node, Transforms } from 'slate';
import { describe, expect, it, vi } from 'vitest';
import { NativeTableEditor } from '../../../../src/MarkdownEditor/utils/native-table/native-table-editor';
import { NativeTableKeyboard } from '../../../../src/MarkdownEditor/utils/native-table/native-table-keyboard';

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
            children: [{ text: 'test' }],
          },
        ],
      })),
    })),
  };
};

/**
 * 创建模拟的键盘事件
 */
const createKeyboardEvent = (
  key: string,
  options: { shiftKey?: boolean } = {},
): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', {
    key,
    shiftKey: options.shiftKey || false,
    bubbles: true,
    cancelable: true,
  });

  // 添加 preventDefault spy
  vi.spyOn(event, 'preventDefault');

  return event;
};

describe('NativeTableKeyboard', () => {
  describe('handleKeyDown', () => {
    describe('Tab 键导航', () => {
      it('应该在按下 Tab 时移动到下一个单元格', () => {
        const table = createTableNode(2, 3);
        const editor = createTestEditor([table]);

        Transforms.select(editor, {
          path: [0, 0, 0, 0, 0],
          offset: 0,
        });

        const event = createKeyboardEvent('Tab');
        const handled = NativeTableKeyboard.handleKeyDown(editor, event);

        expect(handled).toBe(true);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(editor.selection?.anchor.path).toEqual([0, 0, 1, 0, 0]);
      });

      it('应该在按下 Shift+Tab 时移动到上一个单元格', () => {
        const table = createTableNode(2, 3);
        const editor = createTestEditor([table]);

        Transforms.select(editor, {
          path: [0, 0, 1, 0, 0],
          offset: 0,
        });

        const event = createKeyboardEvent('Tab', { shiftKey: true });
        const handled = NativeTableKeyboard.handleKeyDown(editor, event);

        expect(handled).toBe(true);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(editor.selection?.anchor.path).toEqual([0, 0, 0, 0, 0]);
      });

      it('应该在不在表格中时不处理 Tab', () => {
        const editor = createTestEditor([
          { type: 'paragraph', children: [{ text: 'text' }] },
        ]);

        Transforms.select(editor, {
          path: [0, 0],
          offset: 0,
        });

        const event = createKeyboardEvent('Tab');
        const handled = NativeTableKeyboard.handleKeyDown(editor, event);

        expect(handled).toBe(false);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('应该在行末按 Tab 时移动到下一行', () => {
        const table = createTableNode(2, 2);
        const editor = createTestEditor([table]);

        Transforms.select(editor, {
          path: [0, 0, 1, 0, 0],
          offset: 0,
        });

        const event = createKeyboardEvent('Tab');
        NativeTableKeyboard.handleKeyDown(editor, event);

        expect(editor.selection?.anchor.path).toEqual([0, 1, 0, 0, 0]);
      });

      it('应该在行首按 Shift+Tab 时移动到上一行末尾', () => {
        const table = createTableNode(2, 2);
        const editor = createTestEditor([table]);

        Transforms.select(editor, {
          path: [0, 1, 0, 0, 0],
          offset: 0,
        });

        const event = createKeyboardEvent('Tab', { shiftKey: true });
        NativeTableKeyboard.handleKeyDown(editor, event);

        expect(editor.selection?.anchor.path).toEqual([0, 0, 1, 0, 0]);
      });
    });

    describe('Enter 键', () => {
      it('应该在表格单元格中不特殊处理 Enter 键', () => {
        const table = createTableNode(2, 2);
        const editor = createTestEditor([table]);

        Transforms.select(editor, {
          path: [0, 0, 0, 0, 0],
          offset: 0,
        });

        const event = createKeyboardEvent('Enter');
        const handled = NativeTableKeyboard.handleKeyDown(editor, event);

        expect(handled).toBe(false);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('应该在不在表格中时不处理 Enter', () => {
        const editor = createTestEditor([
          { type: 'paragraph', children: [{ text: 'text' }] },
        ]);

        Transforms.select(editor, {
          path: [0, 0],
          offset: 0,
        });

        const event = createKeyboardEvent('Enter');
        const handled = NativeTableKeyboard.handleKeyDown(editor, event);

        expect(handled).toBe(false);
      });
    });

    describe('方向键导航', () => {
      describe('ArrowUp', () => {
        it('应该在单元格开头按上键时移动到上一行', () => {
          const table = createTableNode(3, 2);
          const editor = createTestEditor([table]);

          Transforms.select(editor, {
            path: [0, 1, 0, 0, 0],
            offset: 0,
          });

          const event = createKeyboardEvent('ArrowUp');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(true);
          expect(event.preventDefault).toHaveBeenCalled();
          expect(editor.selection?.anchor.path).toEqual([0, 0, 0, 0, 0]);
        });

        it('应该在第一行时不处理上键', () => {
          const table = createTableNode(2, 2);
          const editor = createTestEditor([table]);

          Transforms.select(editor, {
            path: [0, 0, 0, 0, 0],
            offset: 0,
          });

          const event = createKeyboardEvent('ArrowUp');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(false);
        });

        it('应该在光标不在开头时不处理上键', () => {
          const table = createTableNode(2, 2);
          const editor = createTestEditor([table]);

          Transforms.select(editor, {
            path: [0, 1, 0, 0, 0],
            offset: 1,
          });

          const event = createKeyboardEvent('ArrowUp');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(false);
        });

        it('应该在不在表格中时不处理上键', () => {
          const editor = createTestEditor([
            { type: 'paragraph', children: [{ text: 'text' }] },
          ]);

          Transforms.select(editor, {
            path: [0, 0],
            offset: 0,
          });

          const event = createKeyboardEvent('ArrowUp');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(false);
        });
      });

      describe('ArrowDown', () => {
        it('应该在单元格开头按下键时移动到下一行', () => {
          const table = createTableNode(3, 2);
          const editor = createTestEditor([table]);

          Transforms.select(editor, {
            path: [0, 0, 0, 0, 0],
            offset: 0,
          });

          const event = createKeyboardEvent('ArrowDown');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(true);
          expect(event.preventDefault).toHaveBeenCalled();
          expect(editor.selection?.anchor.path).toEqual([0, 1, 0, 0, 0]);
        });

        it('应该在最后一行时不处理下键', () => {
          const table = createTableNode(2, 2);
          const editor = createTestEditor([table]);

          Transforms.select(editor, {
            path: [0, 1, 0, 0, 0],
            offset: 0,
          });

          const event = createKeyboardEvent('ArrowDown');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(false);
        });

        it('应该在光标不在开头时不处理下键', () => {
          const table = createTableNode(2, 2);
          const editor = createTestEditor([table]);

          Transforms.select(editor, {
            path: [0, 0, 0, 0, 0],
            offset: 1,
          });

          const event = createKeyboardEvent('ArrowDown');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(false);
        });

        it('应该在不在表格中时不处理下键', () => {
          const editor = createTestEditor([
            { type: 'paragraph', children: [{ text: 'text' }] },
          ]);

          Transforms.select(editor, {
            path: [0, 0],
            offset: 0,
          });

          const event = createKeyboardEvent('ArrowDown');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(false);
        });
      });

      describe('ArrowLeft', () => {
        it('应该在单元格开头按左键时移动到左侧单元格', () => {
          const table = createTableNode(2, 3);
          const editor = createTestEditor([table]);

          Transforms.select(editor, {
            path: [0, 0, 1, 0, 0],
            offset: 0,
          });

          const event = createKeyboardEvent('ArrowLeft');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(true);
          expect(event.preventDefault).toHaveBeenCalled();
          expect(editor.selection?.anchor.path).toEqual([0, 0, 0, 0, 0]);
        });

        it('应该在第一列时不处理左键', () => {
          const table = createTableNode(2, 2);
          const editor = createTestEditor([table]);

          Transforms.select(editor, {
            path: [0, 0, 0, 0, 0],
            offset: 0,
          });

          const event = createKeyboardEvent('ArrowLeft');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(false);
        });

        it('应该在光标不在开头时不处理左键', () => {
          const table = createTableNode(2, 2);
          const editor = createTestEditor([table]);

          Transforms.select(editor, {
            path: [0, 0, 1, 0, 0],
            offset: 1,
          });

          const event = createKeyboardEvent('ArrowLeft');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(false);
        });

        it('应该在不在表格中时不处理左键', () => {
          const editor = createTestEditor([
            { type: 'paragraph', children: [{ text: 'text' }] },
          ]);

          Transforms.select(editor, {
            path: [0, 0],
            offset: 0,
          });

          const event = createKeyboardEvent('ArrowLeft');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(false);
        });
      });

      describe('ArrowRight', () => {
        it('应该在单元格开头按右键时移动到右侧单元格', () => {
          const table = createTableNode(2, 3);
          const editor = createTestEditor([table]);

          Transforms.select(editor, {
            path: [0, 0, 0, 0, 0],
            offset: 0,
          });

          const event = createKeyboardEvent('ArrowRight');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(true);
          expect(event.preventDefault).toHaveBeenCalled();
          expect(editor.selection?.anchor.path).toEqual([0, 0, 1, 0, 0]);
        });

        it('应该在最后一列时不处理右键', () => {
          const table = createTableNode(2, 2);
          const editor = createTestEditor([table]);

          Transforms.select(editor, {
            path: [0, 0, 1, 0, 0],
            offset: 0,
          });

          const event = createKeyboardEvent('ArrowRight');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(false);
        });

        it('应该在光标不在开头时不处理右键', () => {
          const table = createTableNode(2, 2);
          const editor = createTestEditor([table]);

          Transforms.select(editor, {
            path: [0, 0, 0, 0, 0],
            offset: 1,
          });

          const event = createKeyboardEvent('ArrowRight');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(false);
        });

        it('应该在不在表格中时不处理右键', () => {
          const editor = createTestEditor([
            { type: 'paragraph', children: [{ text: 'text' }] },
          ]);

          Transforms.select(editor, {
            path: [0, 0],
            offset: 0,
          });

          const event = createKeyboardEvent('ArrowRight');
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(false);
        });
      });
    });

    describe('Delete 和 Backspace 键', () => {
      it('应该在表格单元格中不特殊处理 Delete 键', () => {
        const table = createTableNode(2, 2);
        const editor = createTestEditor([table]);

        Transforms.select(editor, {
          path: [0, 0, 0, 0, 0],
          offset: 0,
        });

        const event = createKeyboardEvent('Delete');
        const handled = NativeTableKeyboard.handleKeyDown(editor, event);

        expect(handled).toBe(false);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('应该在表格单元格中不特殊处理 Backspace 键', () => {
        const table = createTableNode(2, 2);
        const editor = createTestEditor([table]);

        Transforms.select(editor, {
          path: [0, 0, 0, 0, 0],
          offset: 0,
        });

        const event = createKeyboardEvent('Backspace');
        const handled = NativeTableKeyboard.handleKeyDown(editor, event);

        expect(handled).toBe(false);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    describe('其他按键', () => {
      it('应该不处理其他按键', () => {
        const table = createTableNode(2, 2);
        const editor = createTestEditor([table]);

        Transforms.select(editor, {
          path: [0, 0, 0, 0, 0],
          offset: 0,
        });

        const keys = ['a', 'A', 'Space', 'Escape', 'Home', 'End'];
        keys.forEach((key) => {
          const event = createKeyboardEvent(key);
          const handled = NativeTableKeyboard.handleKeyDown(editor, event);

          expect(handled).toBe(false);
          expect(event.preventDefault).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('shouldHandle', () => {
    it('应该在表格单元格中返回 true', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      expect(NativeTableKeyboard.shouldHandle(editor)).toBe(true);
    });

    it('应该在不在表格单元格中返回 false', () => {
      const editor = createTestEditor([
        { type: 'paragraph', children: [{ text: 'text' }] },
      ]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      expect(NativeTableKeyboard.shouldHandle(editor)).toBe(false);
    });

    it('应该在表格行但不在单元格中返回 false', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0],
        offset: 0,
      });

      expect(NativeTableKeyboard.shouldHandle(editor)).toBe(false);
    });
  });

  describe('边界情况', () => {
    it('应该处理没有选择的情况', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      editor.selection = null;

      const event = createKeyboardEvent('Tab');
      const handled = NativeTableKeyboard.handleKeyDown(editor, event);

      expect(handled).toBe(false);
    });

    it('应该处理空表格', () => {
      const emptyTable = {
        type: 'table',
        children: [],
      };
      const editor = createTestEditor([emptyTable]);

      Transforms.select(editor, {
        path: [0],
        offset: 0,
      });

      const event = createKeyboardEvent('Tab');

      expect(() => {
        NativeTableKeyboard.handleKeyDown(editor, event);
      }).not.toThrow();
    });

    it('应该处理单行单列的表格', () => {
      const table = createTableNode(1, 1);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      const tabEvent = createKeyboardEvent('Tab');
      NativeTableKeyboard.handleKeyDown(editor, tabEvent);

      // 应该保持在同一位置(没有下一个单元格)
      expect(editor.selection?.anchor.path).toEqual([0, 0, 0, 0, 0]);
    });

    it('应该处理复杂的表格结构', () => {
      const table = createTableNode(5, 10);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 2, 5, 0, 0],
        offset: 0,
      });

      const event = createKeyboardEvent('Tab');
      const handled = NativeTableKeyboard.handleKeyDown(editor, event);

      expect(handled).toBe(true);
      expect(editor.selection?.anchor.path).toEqual([0, 2, 6, 0, 0]);
    });

    it('应该处理最后一个单元格的 Tab 键', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 1, 1, 0, 0],
        offset: 0,
      });

      const event = createKeyboardEvent('Tab');
      NativeTableKeyboard.handleKeyDown(editor, event);

      // 应该保持在同一位置(已经是最后一个单元格)
      expect(editor.selection?.anchor.path).toEqual([0, 1, 1, 0, 0]);
    });

    it('应该处理第一个单元格的 Shift+Tab 键', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      const event = createKeyboardEvent('Tab', { shiftKey: true });
      NativeTableKeyboard.handleKeyDown(editor, event);

      // 应该保持在同一位置(已经是第一个单元格)
      expect(editor.selection?.anchor.path).toEqual([0, 0, 0, 0, 0]);
    });
  });

  describe('与 NativeTableEditor 集成', () => {
    it('应该正确使用 NativeTableEditor.isInTableCell', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      const isInCell = NativeTableEditor.isInTableCell(editor);
      const shouldHandle = NativeTableKeyboard.shouldHandle(editor);

      expect(isInCell).toBe(shouldHandle);
    });

    it('应该正确使用 NativeTableEditor.moveToNextCell', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 0, 0, 0],
        offset: 0,
      });

      const event = createKeyboardEvent('Tab');
      NativeTableKeyboard.handleKeyDown(editor, event);

      // 验证位置变化与 NativeTableEditor.moveToNextCell 行为一致
      expect(editor.selection?.anchor.path).toEqual([0, 0, 1, 0, 0]);
    });

    it('应该正确使用 NativeTableEditor.moveToPreviousCell', () => {
      const table = createTableNode(2, 2);
      const editor = createTestEditor([table]);

      Transforms.select(editor, {
        path: [0, 0, 1, 0, 0],
        offset: 0,
      });

      const event = createKeyboardEvent('Tab', { shiftKey: true });
      NativeTableKeyboard.handleKeyDown(editor, event);

      // 验证位置变化与 NativeTableEditor.moveToPreviousCell 行为一致
      expect(editor.selection?.anchor.path).toEqual([0, 0, 0, 0, 0]);
    });
  });
});
