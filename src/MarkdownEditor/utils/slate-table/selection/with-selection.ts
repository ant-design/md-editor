import { Editor, Element, Operation, Path, Range } from 'slate';
import { WithTableOptions } from '../options';
import { TableCursor } from '../table-cursor';
import { Point, filledMatrix, hasCommon, isOfType } from '../utils';
import { NodeEntryWithContext } from '../utils/types';
import { EDITOR_TO_SELECTION, EDITOR_TO_SELECTION_SET } from '../weak-maps';

/**
 * 为编辑器添加表格选择功能的插件
 *
 * 该插件拦截 Slate 的选择操作（selection operations），
 * 当检测到用户在表格中进行跨单元格选择时，
 * 会自动处理合并单元格（rowSpan/colSpan）的选择逻辑
 *
 * @param editor - Slate 编辑器实例
 * @param options - 配置选项，包含 withSelection 标志
 * @returns 增强后的编辑器实例
 */
export function withSelection<T extends Editor>(
  editor: T,
  { withSelection }: WithTableOptions,
) {
  // 如果未启用选择功能，直接返回原编辑器
  if (!withSelection) {
    return editor;
  }

  const { apply } = editor;

  /**
   * 重写编辑器的 apply 方法，拦截选择操作
   *
   * 当用户在表格中拖拽选择多个单元格时，这个方法会：
   * 1. 检测选择是否跨越了表格单元格
   * 2. 计算包含合并单元格的完整选择区域
   * 3. 更新编辑器的选择状态
   */
  editor.apply = (op: Operation): void => {
    // 只处理选择操作，且必须有新的属性
    if (!Operation.isSelectionOperation(op) || !op.newProperties) {
      TableCursor.unselect(editor);
      return apply(op);
    }

    // 构建新的选择范围
    const selection = {
      ...editor.selection,
      ...op.newProperties,
    };

    // 确保选择是一个有效的范围
    if (!Range.isRange(selection)) {
      TableCursor.unselect(editor);
      return apply(op);
    }

    // 查找选择起始点所在的表格单元格
    const [fromEntry] = Editor.nodes(editor, {
      match: isOfType(editor, 'th', 'td'), // 匹配表头单元格或普通单元格
      at: Range.start(selection),
    });

    // 查找选择结束点所在的表格单元格
    const [toEntry] = Editor.nodes(editor, {
      match: isOfType(editor, 'th', 'td'),
      at: Range.end(selection),
    });

    // 如果起始点或结束点不在表格单元格中，取消表格选择
    if (!fromEntry || !toEntry) {
      TableCursor.unselect(editor);
      return apply(op);
    }

    const [, fromPath] = fromEntry;
    const [, toPath] = toEntry;

    // 如果选择在同一个单元格内，或者不在同一个表格中，取消表格选择
    if (
      Path.equals(fromPath, toPath) ||
      !hasCommon(editor, [fromPath, toPath], 'table')
    ) {
      TableCursor.unselect(editor);
      return apply(op);
    }

    // 获取表格的填充矩阵（filled matrix），用于表示表格的完整结构
    // 这个矩阵考虑了单元格的合并（rowSpan 和 colSpan），将虚拟单元格也填入矩阵中
    const filled = filledMatrix(editor, { at: fromPath });

    // 验证矩阵完整性并添加安全检查
    // filledMatrix 可能返回空数组的原因：
    // 1. fromPath 位置没有找到表格节点
    // 2. 表格结构不完整或损坏
    // 3. 表格没有 thead 或 tfoot 部分（matrices 函数只查找这两种类型）
    // 4. 编辑器状态不一致
    // 5. 表格使用了 tbody 而不是 thead/tfoot（这是最常见的原因）
    if (!filled || filled.length === 0) {
      TableCursor.unselect(editor);
      return apply(op);
    }

    // 查找初始边界坐标
    // from 和 to 分别表示选择区域的起始和结束点在矩阵中的坐标
    const from = Point.valueOf(0, 0);
    const to = Point.valueOf(0, 0);

    // 遍历填充矩阵，查找 fromPath 和 toPath 对应的坐标位置
    outer: for (let x = 0; x < filled.length; x++) {
      if (!filled[x]) continue; // 跳过未定义的行

      for (let y = 0; y < filled[x].length; y++) {
        const cell = filled[x][y];
        if (!cell) continue; // 跳过 null/undefined 单元格

        const [[, path]] = cell;

        // 找到起始路径对应的坐标
        if (Path.equals(fromPath, path)) {
          from.x = x;
          from.y = y;
        }

        // 找到结束路径对应的坐标
        if (Path.equals(toPath, path)) {
          to.x = x;
          to.y = y;
          break outer; // 找到结束点后跳出循环
        }
      }
    }

    // 计算选择区域的起始和结束坐标
    // 使用 Math.min 和 Math.max 确保 start 在 end 的左上角
    let start = Point.valueOf(Math.min(from.x, to.x), Math.min(from.y, to.y));
    let end = Point.valueOf(Math.max(from.x, to.x), Math.max(from.y, to.y));

    // 根据 rowSpan 和 colSpan 扩展选择区域
    // 这个循环确保选择区域包含所有相关的合并单元格
    for (;;) {
      const nextStart = Point.valueOf(start.x, start.y);
      const nextEnd = Point.valueOf(end.x, end.y);

      // 遍历当前选择区域内的所有单元格
      for (let x = nextStart.x; x <= nextEnd.x; x++) {
        for (let y = nextStart.y; y <= nextEnd.y; y++) {
          // 添加边界检查以防止访问未定义的数组元素
          if (!filled[x] || !filled[x][y]) {
            continue;
          }

          // 获取单元格的跨度信息
          // rtl: right-to-left (colSpan 从右到左的跨度)
          // ltr: left-to-right (colSpan 从左到右的跨度)
          // ttb: top-to-bottom (rowSpan 从上到下的跨度)
          // btt: bottom-to-top (rowSpan 从下到上的跨度)
          const [, { rtl, ltr, btt, ttb }] = filled[x][y];

          // 根据跨度信息扩展选择区域边界
          nextStart.x = Math.min(nextStart.x, x - (ttb - 1));
          nextStart.y = Math.min(nextStart.y, y - (rtl - 1));

          nextEnd.x = Math.max(nextEnd.x, x + (btt - 1));
          nextEnd.y = Math.max(nextEnd.y, y + (ltr - 1));
        }
      }

      // 如果选择区域没有变化，说明已经扩展到了最大范围
      if (Point.equals(start, nextStart) && Point.equals(end, nextEnd)) {
        break;
      }

      // 更新选择区域边界，继续下一轮扩展
      start = nextStart;
      end = nextEnd;
    }

    // 构建最终的选择矩阵和选择集合
    const selected: NodeEntryWithContext[][] = [];
    const selectedSet = new WeakSet<Element>();

    // 遍历最终确定的选择区域，收集所有被选中的单元格
    for (let x = start.x; x <= end.x; x++) {
      const cells: NodeEntryWithContext[] = [];
      for (let y = start.y; y <= end.y; y++) {
        // 添加边界检查以防止访问未定义的数组元素
        if (!filled[x] || !filled[x][y]) {
          continue;
        }

        // 获取单元格元素并添加到选择集合中
        const [[element]] = filled[x][y];
        selectedSet.add(element);
        cells.push(filled[x][y]);
      }
      selected.push(cells);
    }

    // 将选择结果存储到编辑器的弱映射中，用于后续的表格操作
    EDITOR_TO_SELECTION.set(editor, selected);
    EDITOR_TO_SELECTION_SET.set(editor, selectedSet);

    // 应用原始的选择操作
    apply(op);

    editor.selection = null;
  };

  return editor;
}
