/* eslint-disable no-param-reassign */
import { Ace } from 'ace-builds';
import {
  Editor,
  Element,
  Node,
  Path,
  Point,
  Range,
  Text,
  Transforms,
} from 'slate';
import { DOMNode } from 'slate-dom';
import { History } from 'slate-history';
import { CardNode, CustomLeaf } from '../../el';
import { ReactEditor } from '../slate-react';
import { EditorStore } from '../store';

export class EditorUtils {
  static get p() {
    return { type: 'paragraph', children: [{ text: '' }] } as const;
  }

  static hasPath(editor: Editor, path: Path) {
    return Editor.hasPath(editor, path);
  }
  static focus(editor: Editor) {
    try {
      ReactEditor.focus(editor);
    } catch (e) {
      console.error(e);
    }
  }
  static blur(editor: Editor) {
    try {
      ReactEditor.blur(editor);
    } catch (e) {
      console.error(e);
    }
  }

  static isPrevious(firstPath: Path, nextPath: Path) {
    return (
      Path.equals(Path.parent(firstPath), Path.parent(nextPath)) &&
      Path.compare(firstPath, nextPath) === -1
    );
  }
  static isNextPath(firstPath: Path, nextPath: Path) {
    return (
      Path.equals(Path.parent(firstPath), Path.parent(nextPath)) &&
      Path.compare(firstPath, nextPath) === 1
    );
  }

  static isDirtLeaf(leaf: CustomLeaf) {
    return (
      leaf.bold ||
      leaf.code ||
      leaf.italic ||
      leaf.strikethrough ||
      !!leaf?.url ||
      leaf.fnd ||
      leaf.fnc ||
      leaf.html ||
      leaf.highColor
    );
  }

  static focusAceEnd(editor: Ace.Editor) {
    const row = editor.session.getLength();
    const lineLength = editor.session.getLine(row - 1).length;
    editor.clearSelection();
    editor.focus();
    editor.moveCursorTo(row - 1, lineLength);
  }

  static selectPrev(store: EditorStore, path: Path) {
    const prePath = EditorUtils.findPrev(store.editor, path);
    if (prePath) {
      const node = Node.get(store.editor, prePath);
      if (node.type === 'code') {
        const ace = store.codes.get(node);
        if (ace) {
          EditorUtils.focusAceEnd(ace);
        }
        return true;
      } else {
        Transforms.select(store.editor, Editor.end(store.editor, prePath));
      }
      EditorUtils.focus(store.editor);
      return true;
    } else {
      return false;
    }
  }

  static focusAceStart(editor: Ace.Editor) {
    editor.focus();
    editor.clearSelection();
    editor.moveCursorTo(0, 0);
  }

  static selectNext(store: EditorStore, path: Path) {
    const nextPath = EditorUtils.findNext(store.editor, path);
    if (nextPath) {
      const node = Node.get(store.editor, nextPath);
      if (node.type === 'code') {
        const ace = store.codes.get(node);
        if (ace) {
          EditorUtils.focusAceStart(ace);
        }
        return true;
      } else {
        Transforms.select(store.editor, Editor.start(store.editor, nextPath));
      }
      EditorUtils.focus(store.editor);
      return true;
    } else {
      return false;
    }
  }

  static isTop(editor: Editor, path: Path) {
    const p = Editor.parent(editor, path);
    return Editor.isEditor(p[0]);
  }
  static findPrev(editor: Editor, path: Path) {
    while (path.length) {
      if (Path.hasPrevious(path)) {
        if (Node.get(editor, Path.previous(path))?.type === 'hr') {
          path = Path.previous(path);
        } else {
          return Path.previous(path);
        }
      } else {
        path = Path.parent(path);
      }
    }
    return [];
  }
  static findMediaInsertPath(editor: Editor) {
    const [cur] = Editor.nodes<any>(editor, {
      match: (n) => Element.isElement(n),
      mode: 'lowest',
    });
    if (!cur) return null;
    let path = cur[1];
    if (cur[0].type === 'table-cell') {
      path = Path.next(Path.parent(Path.parent(cur[1])));
    }
    if (cur[0].type === 'head') {
      path = Path.next(path);
    }
    if (cur[0].type === 'paragraph' && Node.string(cur[0])) {
      path = Path.next(cur[1]);
    }
    return path;
  }
  static findNext(editor: Editor, path: Path) {
    while (path.length) {
      if (Editor.hasPath(editor, Path.next(path))) {
        if (Node.get(editor, Path.next(path))?.type === 'hr') {
          path = Path.next(path);
        } else {
          return Path.next(path);
        }
      } else {
        path = Path.parent(path);
      }
    }
    return undefined;
  }
  static moveNodes(editor: Editor, from: Path, to: Path, index = 1) {
    let count = 0;
    while (Editor.hasPath(editor, from)) {
      if (count > 100) break;
      Transforms.moveNodes(editor, {
        at: from,
        to: [...to, index],
      });
      index++;
      count++;
    }
  }

  static moveAfterSpace(editor: Editor, path: Path) {
    const next = Editor.next(editor, { at: path });
    if (!next || !Text.isText(next[0])) {
      Transforms.transform(editor, {
        type: 'insert_node',
        path: Path.next(path),
        node: { text: '' },
      });
      Transforms.select(editor, Path.next(path));
    } else {
      Transforms.move(editor, { unit: 'offset' });
    }
  }

  static moveBeforeSpace(editor: Editor, path: Path) {
    if (!Path.hasPrevious(path)) {
      Transforms.transform(editor, {
        type: 'insert_node',
        path: path,
        node: { text: '' },
      });
    }
    Transforms.move(editor, { unit: 'offset', reverse: true });
  }

  /**
   * 清除编辑器中选中的文本的所有标记。
   *
   * @param editor - 编辑器实例。
   * @param split - 是否分割节点，默认为 false。
   *
   * 如果编辑器中没有选中的文本，则直接返回。
   * 使用 `Transforms.unsetNodes` 方法移除选中的文本节点中的以下标记：
   * - 'url'
   * - 'strikethrough'
   * - 'italic'
   * - 'code'
   * - 'bold'
   * - 'color'
   * - 'textColor'
   * - 'highColor'
   *
   * 获取选中节点的父节点，如果父节点是段落并且编辑器中存在该路径的父节点，
   * 则获取父节点的父节点。如果节点类型是列表项，则提升节点。
   * 最后，将选中节点的父节点类型设置为段落。
   */
  static clearMarks(editor: Editor, split = false) {
    if (!editor.selection) return;
    Transforms.unsetNodes(
      editor,
      [
        'url',
        'strikethrough',
        'italic',
        'code',
        'bold',
        'color',
        'textColor',
        'highColor',
      ],
      {
        split,
        match: Text.isText,
      },
    );
    const parent = Path.parent(editor.selection.anchor.path);

    let node = Node.get(editor, parent);
    if (
      node.type === 'paragraph' &&
      Editor.hasPath(editor, Path.parent(parent))
    ) {
      node = Node.get(editor, Path.parent(parent));
    }
    if (node.type === 'list-item') {
      Transforms.liftNodes(editor, {
        at: Path.parent(editor.selection.anchor.path),
        mode: 'highest',
      });
    }
    Transforms.setNodes(
      editor,
      { type: 'paragraph' },
      { at: Path.parent(editor.selection.anchor.path) },
    );
  }

  /**
   * 删除编辑器中的所有内容，并插入新的节点（如果提供）。
   *
   * @param editor - 编辑器实例。
   * @param insertNodes - 要插入的新节点数组。如果未提供，将插入默认节点。
   */
  static deleteAll(editor: Editor, insertNodes?: any[]) {
    const nodes = Array.from(
      Editor.nodes(editor, {
        at: [],
        match: (n) => Element.isElement(n),
        mode: 'highest',
        reverse: true,
      }),
    );
    if (nodes.length) {
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, nodes[nodes.length - 1][1]),
          focus: Editor.end(editor, nodes[0][1]),
        },
      });
      Transforms.delete(editor, { at: [0] });
    }
    if (!insertNodes) insertNodes = [EditorUtils.p];
    Transforms.insertNodes(editor, insertNodes, { at: [0] });
  }

  /**
   * 重置编辑器的内容，并可选地插入新的节点和强制重置历史记录。
   *
   * @param editor - 要重置的编辑器实例。
   * @param insertNodes - 可选的插入节点数组。如果未提供，则使用默认节点。
   * @param force - 可选的布尔值或历史记录对象。如果为布尔值，则强制重置历史记录；如果为历史记录对象，则使用提供的历史记录。
   */
  static reset(editor: Editor, insertNodes?: any[], force?: boolean | History) {
    if (!insertNodes) insertNodes = [EditorUtils.p];
    editor.children = JSON.parse(JSON.stringify(insertNodes));
    if (force) {
      editor.history =
        typeof force === 'boolean' ? { redos: [], undos: [] } : force;
    }
    editor.onChange();
  }

  /**
   * 检查选区是否完全包含在指定节点路径中。
   *
   * @param editor - 编辑器实例。
   * @param sel - 选区范围。
   * @param nodePath - 节点路径。
   * @returns 如果选区完全包含在节点路径中，则返回 true，否则返回 false。
   */
  static includeAll(editor: Editor, sel: Range, nodePath: Path) {
    const [start, end] = Range.edges(sel);
    return (
      Point.compare(start, Editor.start(editor, nodePath)) !== 1 &&
      Point.compare(end, Editor.end(editor, nodePath)) !== -1
    );
  }

  static copy(data: object) {
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * 复制指定范围内的文本内容。
   *
   * @param editor - 编辑器实例。
   * @param start - 文本复制的起始位置。
   * @param end - （可选）文本复制的结束位置。如果未提供，则复制从起始位置到文档末尾的所有文本。
   * @returns 返回指定范围内的文本内容。
   */
  static copyText(editor: Editor, start: Point, end?: Point) {
    let leaf = Node.leaf(editor, start.path);
    let text = '';

    // Handle first leaf node from start offset
    text += leaf.text?.slice(start.offset) || '';

    // Get next nodes until we reach the end point
    let next = Editor.next(editor, { at: start.path });
    while (next) {
      if (end && Path.equals(next[1], end.path)) {
        // If we reach the end path, slice until end offset
        text += next[0].text?.slice(0, end.offset) || '';
        break;
      } else {
        // Add full text content of intermediate nodes
        text += next[0].text || '';
        next = Editor.next(editor, { at: next[1] });
      }
    }

    return text;
  }

  /**
   * 从编辑器中剪切文本。
   *
   * @param editor - 编辑器实例。
   * @param start - 开始位置的点。
   * @param end - 结束位置的点（可选）。
   * @returns 剪切的文本数组，每个元素为一个 CustomLeaf 对象。
   */
  static cutText(editor: Editor, start: Point, end?: Point) {
    let leaf = Node.leaf(editor, start.path);
    let texts: CustomLeaf[] = [
      { ...leaf, text: leaf.text?.slice(start.offset) || '' },
    ];
    let next = Editor.next(editor, { at: start.path });
    while (next) {
      if (end && Path.equals(next[1], end.path)) {
        texts.push({
          ...next[0],
          text: next[0].text?.slice(0, end.offset) || '',
        });
        break;
      } else {
        texts.push(next[0]);
        next = Editor.next(editor, { at: next[1] });
      }
    }
    return texts;
  }

  /**
   * 检查编辑器中是否有指定格式的活动节点。
   *
   * @param editor - 编辑器实例。
   * @param format - 要检查的格式名称。
   * @param value - 可选的值，用于进一步验证格式是否匹配。
   * @returns 如果存在匹配的格式节点，则返回 true；否则返回 false。
   */
  static isFormatActive(editor: Editor, format: string, value?: any) {
    try {
      const [match] = Editor.nodes(editor, {
        match: (n) => !!n[format],
        mode: 'lowest',
      });
      //@ts-ignore
      return value ? match?.[0]?.[format] === value : !!match;
    } catch (e) {
      return false;
    }
  }

  static getUrl(editor: Editor) {
    const [match] = Editor.nodes<any>(editor, {
      match: (n) => Text.isText(n) && !!n?.url,
      mode: 'lowest',
    });
    return (match?.[0]?.url as string) || '';
  }

  static toggleFormat(editor: Editor, format: any) {
    const str = editor.selection ? Editor.string(editor, editor.selection) : '';
    if (str) {
      const isActive = EditorUtils.isFormatActive(editor, format);
      Transforms.setNodes(
        editor,
        { [format]: isActive ? null : true },
        { match: Text.isText, split: true },
      );
    }
  }

  /**
   * 为编辑器中的文本节点设置高亮颜色。
   *
   * @param editor - 编辑器实例。
   * @param color - 可选的高亮颜色字符串。如果未提供，则移除高亮颜色。
   */
  static highColor(editor: Editor, color?: string) {
    Transforms.setNodes(
      editor,
      { highColor: color },
      { match: Text.isText, split: true },
    );
  }

  static checkEnd(editor: Editor) {
    const [node] = Editor.nodes<any>(editor, {
      at: [],
      mode: 'highest',
      match: (n) => Element.isElement(n),
      reverse: true,
    });
    if (
      (node && node[0].type !== 'paragraph') ||
      Node.string(node[0]) ||
      (node?.[0]?.children?.length === 1 &&
        node?.[0]?.children[0]?.type === 'media')
    ) {
      Transforms.insertNodes(editor, EditorUtils.p, {
        at: Path.next(node[1]),
      });
      setTimeout(() => {
        ReactEditor.focus(editor);
        Transforms.select(editor, Path.next(node[1]));
      });
      return true;
    } else {
      return false;
    }
  }

  static checkSelEnd(editor: Editor, path: Path) {
    let end = true;
    let cur = Editor?.node(editor, path);
    while (!Editor.isEditor(cur[0])) {
      if (Editor.hasPath(editor, Path.next(cur[1]))) {
        end = false;
        break;
      } else {
        cur = Editor?.node(editor, Path.parent(cur[1]));
      }
    }
    return end;
  }
  static findPath(editor: Editor, el: any) {
    try {
      return ReactEditor.findPath(editor, el);
    } catch (e) {
      console.error('find path error', e);
      return Editor.start(editor, []).path;
    }
  }

  static createMediaNode(
    src: string | undefined,
    type: string,
    extraPros?: Record<string, any>,
  ) {
    if (!src) {
      return { text: '' };
    }
    return {
      type: 'card',
      children: [
        {
          type: 'card-before',
          children: [{ text: '' }],
        },
        {
          ...(extraPros || {}),
          type: 'media',
          url: src,
          children: [{ text: '' }],
          mediaType: type,
        },
        {
          type: 'card-after',
          children: [{ text: '' }],
        },
      ],
    } as CardNode;
  }

  static wrapperCardNode(node: any, props: Record<string, any> = {}) {
    return {
      type: 'card',
      ...props,
      children: [
        {
          type: 'card-before',
          children: [{ text: '' }],
        },
        node,
        {
          type: 'card-after',
          children: [{ text: '' }],
        },
      ],
    } as CardNode;
  }
}

export const getDefaultView = (value: any): Window | null => {
  return (
    (value && value.ownerDocument && value.ownerDocument.defaultView) || null
  );
};

export const isDOMNode = (value: any): value is DOMNode => {
  const window = getDefaultView(value);
  return !!window && value instanceof window.Node;
};

export const isEventHandled = <
  EventType extends React.SyntheticEvent<unknown, unknown>,
>(
  event: EventType,
  handler?: (event: EventType) => void,
) => {
  if (!handler) {
    return false;
  }
  handler(event);
  return event.isDefaultPrevented() || event.isPropagationStopped();
};

export const hasTarget = (
  editor: ReactEditor,
  target: EventTarget | null,
): target is DOMNode => {
  return isDOMNode(target) && ReactEditor.hasDOMNode(editor, target);
};

function checkText(domPoint: any) {
  if (!isDOMNode(domPoint)) {
    return false;
  }
  let leafNode = domPoint?.parentElement?.closest('[data-slate-leaf]');
  if (!leafNode) {
    return false;
  }
  const textNode = leafNode.closest('[data-slate-node="text"]')!;
  return !!textNode;
}

export const isTargetInsideVoid = (
  editor: ReactEditor,
  target: EventTarget | null,
): boolean => {
  const slateNode =
    hasTarget(editor, target) && ReactEditor.toSlateNode(editor, target);
  // @ts-ignore
  return Editor.isVoid(editor, slateNode);
};

export function getSelectionFromDomSelection(
  editor: ReactEditor,
  domSelection: Selection,
): Range | null {
  const { anchorNode, focusNode } = domSelection;
  const anchorNodeSelectable =
    hasTarget(editor, anchorNode) || isTargetInsideVoid(editor, anchorNode);

  const focusNodeSelectable =
    hasTarget(editor, focusNode) || isTargetInsideVoid(editor, focusNode);
  const check = checkText(anchorNode) && checkText(focusNode);
  if (anchorNodeSelectable && focusNodeSelectable && check) {
    try {
      const range = ReactEditor.toSlateRange(editor, domSelection, {
        exactMatch: true,
        suppressThrow: false,
      });
      return range;
    } catch (error) {
      console.log('getSelectionFromDomSelection error', error);
      return null;
    }
  }
  return null;
}

/**
 * 检查目标是否为可编辑的 DOM 节点。
 *
 * @param editor - React 编辑器实例。
 * @param target - 事件目标，可能为 null。
 * @returns 如果目标是可编辑的 DOM 节点，则返回 true。
 */
export const hasEditableTarget = (
  editor: ReactEditor,
  target: EventTarget | null,
): target is DOMNode => {
  return (
    isDOMNode(target) &&
    ReactEditor.hasDOMNode(editor, target, { editable: true })
  );
};

export function getPointStrOffset(editor: Editor, point: Point) {
  const nodes = Node.fragment(editor, {
    anchor: { path: Node.first(editor, point.path)[1], offset: 0 },
    focus: point,
  });
  const str = Node.string({
    type: '',
    children: nodes,
  } as any);
  return str.length;
}

export function getRelativePath(path: string | any[], anther: string | any[]) {
  const newPath = [...path];
  const newAnther = [...anther];
  const relativeLen = path.length - anther.length;
  if (relativeLen > 0) {
    newAnther.unshift(new Array(relativeLen).fill(0));
  } else if (relativeLen < 0) {
    return new Array(anther.length).fill(0);
    newPath.unshift(new Array(-relativeLen).fill(0));
  }

  const relativePath = [];
  for (let i = 0; i < newPath.length; i++) {
    if (newPath[i] !== newAnther[i]) {
      relativePath.push(newPath[i] - newAnther[i]);
    } else {
      relativePath.push(0);
    }
  }
  return relativePath;
}

export function calcPath(path: string | any[], anther: string | any[]) {
  const newPath = [...path];
  const newAnther = [...anther];
  const relativeLen = path.length - anther.length;
  if (relativeLen > 0) {
    newAnther.unshift(new Array(relativeLen).fill(0));
  } else if (relativeLen < 0) {
    newPath.unshift(new Array(-relativeLen).fill(0));
  }

  const relativePath = [];
  for (let i = 0; i < newPath.length; i++) {
    relativePath.push(newPath[i] + newAnther[i]);
  }
  return relativePath;
}

export function isPath(path: string | any[]) {
  for (let i = 0; i < path.length; i++) {
    const num = path[i];
    if (!(isFinite(num) && num >= 0)) {
      return false;
    }
  }
  return true;
}

export function findLeafPath(editor: Editor, path: Path) {
  const node = Editor.leaf(editor, path, {
    edge: 'end',
  });
  if (!node) return path;
  return node[1];
}
