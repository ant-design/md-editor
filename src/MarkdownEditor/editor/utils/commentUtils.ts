/**
 * 评论处理工具函数
 *
 * 将复杂的评论选区处理逻辑从 Editor.tsx 中提取出来，消除深层嵌套
 */

import { BaseSelection, Editor, Range } from 'slate';
import { CommentDataType } from '../../types';
import { findByPathAndText, findLeafPath, isPath } from './editorUtils';

// 编辑器类型，使用 any 避免类型检查问题，因为运行时已做充分检查
type EditorType = any;

/**
 * 从选区创建新的选区对象
 */
const createSelectionFromPoints = (
  editor: EditorType,
  anchor: { path: number[]; offset: number },
  focus: { path: number[]; offset: number },
): BaseSelection | null => {
  if (!isPath(anchor.path) || !isPath(focus.path)) return null;
  if (!Editor.hasPath(editor, anchor.path)) return null;
  if (!Editor.hasPath(editor, focus.path)) return null;

  return {
    anchor: {
      path: findLeafPath(editor, anchor.path),
      offset: anchor.offset,
    },
    focus: {
      path: findLeafPath(editor, focus.path),
      offset: focus.offset,
    },
  } as BaseSelection;
};

/**
 * 处理直接选区（anchor 和 focus 都存在）
 */
const processDirectSelection = (
  editor: EditorType,
  item: CommentDataType,
): { selection: BaseSelection | null; fragment: any } | null => {
  const { anchor, focus } = item.selection || {};
  if (!anchor || !focus) return null;

  const newSelection = createSelectionFromPoints(editor, anchor, focus);
  if (!newSelection) return null;

  const fragment = Editor.fragment(editor, newSelection);
  return { selection: newSelection, fragment };
};

/**
 * 处理引用内容选区（通过 refContent 查找）
 */
const processRefContentSelection = (
  editor: EditorType,
  item: CommentDataType,
): { selection: BaseSelection | null; fragment: any } | null => {
  if (!item.refContent) return null;

  const findDom = findByPathAndText(editor, item.path, item.refContent).at(0);
  if (!findDom) return null;

  const { anchor, focus } = item.selection || {};
  if (!anchor || !focus) return null;

  const newSelection: BaseSelection = {
    anchor: {
      ...anchor,
      path: findLeafPath(editor, findDom.path),
      offset: findDom.offset.start,
    },
    focus: {
      ...focus,
      path: findLeafPath(editor, findDom.path),
      offset: findDom.offset.end,
    },
  };

  const fragment = Editor.fragment(editor, newSelection);
  return { selection: newSelection, fragment };
};

/**
 * 处理表格或卡片节点的选区
 */
const processTableOrCardSelection = (
  editor: EditorType,
  item: CommentDataType,
): { selection: BaseSelection | null; fragment: any } | null => {
  const { focus } = item.selection || {};
  if (!focus?.path || !isPath(focus.path)) return null;
  if (!Editor.hasPath(editor, focus.path)) return null;

  try {
    const [node] = Editor.node(editor, item.path);
    const nodeType = (node as any)?.type;

    if (nodeType !== 'table' && nodeType !== 'card') return null;

    const startPoint = Editor.start(editor, item.path);
    const endPoint = Editor.end(editor, item.path);

    const newSelection: BaseSelection = {
      anchor: startPoint,
      focus: endPoint,
    };

    const fragment = Editor.fragment(editor, newSelection);
    return { selection: newSelection, fragment };
  } catch (error) {
    console.error('Error selecting table node:', error);
    return null;
  }
};

/**
 * 处理单个评论项的选区
 */
export const processCommentItemSelection = (
  editor: EditorType,
  item: CommentDataType,
): { selection: BaseSelection | null; fragment: any } | null => {
  // 优先尝试直接选区
  const directResult = processDirectSelection(editor, item);
  if (directResult) return directResult;

  // 尝试引用内容选区
  const refResult = processRefContentSelection(editor, item);
  if (refResult) return refResult;

  // 最后尝试表格或卡片选区
  return processTableOrCardSelection(editor, item);
};

/**
 * 验证选区路径是否有效
 */
const isValidSelectionPath = (
  editor: EditorType,
  selection: BaseSelection,
): boolean => {
  if (!selection || !('anchor' in selection) || !('focus' in selection)) {
    return false;
  }
  const { anchor, focus } = selection;
  if (!isPath(anchor.path) || !isPath(focus.path)) return false;
  if (!Editor.hasPath(editor, anchor.path)) return false;
  if (!Editor.hasPath(editor, focus.path)) return false;
  return true;
};

/**
 * 创建评论范围对象
 */
export const createCommentRange = (
  selection: BaseSelection & {
    anchor: { path: number[]; offset: number };
    focus: { path: number[]; offset: number };
  },
  itemList: CommentDataType[],
  item: CommentDataType,
): Range => {
  const updateTime = itemList
    .map((i) => i.updateTime)
    .sort()
    .join(',');

  return {
    anchor: {
      path: selection.anchor.path,
      offset: selection.anchor.offset,
    },
    focus: {
      path: selection.focus.path,
      offset: selection.focus.offset,
    },
    data: itemList,
    comment: true,
    id: item.id,
    selection,
    updateTime,
  } as Range;
};

/**
 * 处理评论装饰的主函数
 */
export const processCommentDecoration = (
  editor: EditorType,
  path: number[],
  commentMap: Map<string, Map<string, CommentDataType[]>>,
): Range[] => {
  const ranges: Range[] = [];
  const pathKey = path.join(',');
  const itemMap = commentMap.get(pathKey);
  if (!itemMap) return ranges;

  itemMap.forEach((itemList) => {
    itemList.forEach((item) => {
      const result = processCommentItemSelection(editor, item);
      if (!result?.selection || !result.fragment) return;

      if (!isValidSelectionPath(editor, result.selection)) return;

      if (!('anchor' in result.selection) || !('focus' in result.selection)) {
        return;
      }

      const range = createCommentRange(result.selection, itemList, item);
      ranges.push(range);
    });
  });

  return ranges;
};
