import { Editor } from 'slate';
import { NativeTableEditor } from './native-table-editor';

/**
 * 原生表格键盘事件处理
 * 提供基础的表格导航和操作功能
 */
export const NativeTableKeyboard = {
  /**
   * 处理表格中的键盘事件
   * @param editor - Slate 编辑器实例
   * @param event - 键盘事件
   * @returns 是否已处理该事件
   */
  handleKeyDown(editor: Editor, event: KeyboardEvent): boolean {
    // 只在表格单元格中处理特殊按键
    if (!NativeTableEditor.isInTableCell(editor)) {
      return false;
    }

    const { key, shiftKey } = event;

    switch (key) {
      case 'Tab':
        event.preventDefault();
        if (shiftKey) {
          NativeTableEditor.moveToPreviousCell(editor);
        } else {
          NativeTableEditor.moveToNextCell(editor);
        }
        return true;

      case 'Enter':
        // 在表格单元格中，Enter 键应该创建新段落而不是新行
        // 这里不做特殊处理，让默认行为生效
        return false;

      case 'ArrowUp':
        // 如果光标在单元格开头，移动到上一行
        if (editor.selection && editor.selection.anchor.offset === 0) {
          const cellEntry = NativeTableEditor.findTableCell(editor);
          if (cellEntry) {
            const [, cellPath] = cellEntry;
            const tableEntry = NativeTableEditor.findTable(editor);
            if (tableEntry) {
              const [, tablePath] = tableEntry;
              const rowIndex = cellPath[cellPath.length - 2];
              const colIndex = cellPath[cellPath.length - 1];

              if (rowIndex > 0) {
                const prevCellPath = [...tablePath, rowIndex - 1, colIndex];
                event.preventDefault();
                editor.select({ path: prevCellPath, offset: 0 });
                return true;
              }
            }
          }
        }
        return false;

      case 'ArrowDown':
        // 如果光标在单元格末尾，移动到下一行
        if (editor.selection && editor.selection.anchor.offset === 0) {
          const cellEntry = NativeTableEditor.findTableCell(editor);
          if (cellEntry) {
            const [, cellPath] = cellEntry;
            const tableEntry = NativeTableEditor.findTable(editor);
            if (tableEntry) {
              const [tableNode, tablePath] = tableEntry;
              const rowIndex = cellPath[cellPath.length - 2];
              const colIndex = cellPath[cellPath.length - 1];
              const rowCount = (tableNode as any).children.length;

              if (rowIndex < rowCount - 1) {
                const nextCellPath = [...tablePath, rowIndex + 1, colIndex];
                event.preventDefault();
                editor.select({ path: nextCellPath, offset: 0 });
                return true;
              }
            }
          }
        }
        return false;

      case 'ArrowLeft':
        // 如果光标在单元格开头，移动到左侧单元格
        if (editor.selection && editor.selection.anchor.offset === 0) {
          const cellEntry = NativeTableEditor.findTableCell(editor);
          if (cellEntry) {
            const [, cellPath] = cellEntry;
            const tableEntry = NativeTableEditor.findTable(editor);
            if (tableEntry) {
              const [, tablePath] = tableEntry;
              const rowIndex = cellPath[cellPath.length - 2];
              const colIndex = cellPath[cellPath.length - 1];

              if (colIndex > 0) {
                const leftCellPath = [...tablePath, rowIndex, colIndex - 1];
                event.preventDefault();
                editor.select({ path: leftCellPath, offset: 0 });
                return true;
              }
            }
          }
        }
        return false;

      case 'ArrowRight':
        // 如果光标在单元格末尾，移动到右侧单元格
        if (editor.selection && editor.selection.anchor.offset === 0) {
          const cellEntry = NativeTableEditor.findTableCell(editor);
          if (cellEntry) {
            const [tableNode, cellPath] = cellEntry;
            const tableEntry = NativeTableEditor.findTable(editor);
            if (tableEntry) {
              const [, tablePath] = tableEntry;
              const rowIndex = cellPath[cellPath.length - 2];
              const colIndex = cellPath[cellPath.length - 1];
              const colCount = ((tableNode as any).children[0] as any).children.length;

              if (colIndex < colCount - 1) {
                const rightCellPath = [...tablePath, rowIndex, colIndex + 1];
                event.preventDefault();
                editor.select({ path: rightCellPath, offset: 0 });
                return true;
              }
            }
          }
        }
        return false;

      case 'Delete':
      case 'Backspace':
        // 在表格单元格中，删除操作应该只影响当前单元格内容
        // 不删除整个单元格或表格结构
        return false;

      default:
        return false;
    }
  },

  /**
   * 检查是否应该处理键盘事件
   * @param editor - Slate 编辑器实例
   * @param event - 键盘事件
   * @returns 是否应该处理
   */
  shouldHandle(editor: Editor): boolean {
    return NativeTableEditor.isInTableCell(editor);
  },
};
