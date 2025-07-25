/* eslint-disable no-param-reassign */
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
import {
  CardNode,
  CustomLeaf,
  Elements,
  ListNode,
  ParagraphNode,
} from '../../el';
import { ReactEditor } from '../slate-react';
import { getMediaType } from './dom';

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
    if (cur?.[0]?.type === 'table-cell') {
      path = Path.next(Path.parent(Path.parent(cur[1])));
    }
    if (cur?.[0]?.type === 'head') {
      path = Path.next(path);
    }
    if (cur?.[0]?.type === 'paragraph' && Node.string(cur[0])) {
      path = Path.next(cur[1]);
    }
    return path;
  }
  static findNext(editor: Editor, path: Path) {
    while (path.length) {
      if (Editor.hasPath(editor, Path.next(path))) {
        return Path.next(path);
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

  // 可清除的文本格式属性
  private static readonly CLEARABLE_MARKS = [
    'url',
    'strikethrough',
    'italic',
    'code',
    'bold',
    'color',
    'textColor',
    'highColor',
  ];

  /**
   * 清除编辑器中选中的文本的所有标记
   *
   * @param editor - 编辑器实例
   * @param split - 是否在格式边界处分割文本节点，默认为 false
   *
   * @description
   * 该方法执行以下操作：
   * 1. 移除选中文本的所有格式标记
   * 2. 处理列表项的提升和转换
   * 3. 将选中区域转换为段落格式
   *
   * 当 split=true 时，会在不同格式的边界处分割文本节点，
   * 这允许对部分文本应用/移除格式而不影响相邻文本
   */
  static clearMarks(editor: Editor, split = false) {
    if (!editor.selection) return;

    // 移除所有格式标记
    Transforms.unsetNodes(editor, EditorUtils.CLEARABLE_MARKS, {
      split,
      match: Text.isText,
    });

    const anchorPath = editor.selection.anchor.path;
    const parentPath = Path.parent(anchorPath);

    try {
      let node = Node.get(editor, parentPath);

      // 向上查找非段落的父节点
      if (
        node.type === 'paragraph' &&
        Editor.hasPath(editor, Path.parent(parentPath))
      ) {
        node = Node.get(editor, Path.parent(parentPath));
      }

      // 处理列表项的提升
      if (node.type === 'list-item') {
        Transforms.liftNodes(editor, {
          at: Path.parent(anchorPath),
          mode: 'highest',
        });
      }

      // 查找最高级别的选中元素节点
      const nodeEntries = Array.from(
        Editor.nodes(editor, {
          match: (n) => Element.isElement(n),
          mode: 'highest',
        }),
      );

      if (nodeEntries.length > 0) {
        const [selectNodes, selectPath] = nodeEntries[0];

        // 处理列表转段落的特殊情况
        if ((selectNodes as any).type === 'list') {
          Transforms.removeNodes(editor, {
            at: selectPath,
            voids: true,
          });

          const paragraphNodes = EditorUtils.listToParagraph(
            editor,
            selectNodes as ListNode,
          );
          if (paragraphNodes.length > 0) {
            Transforms.insertNodes(editor, paragraphNodes, {
              at: editor.selection,
            });
          }
          return;
        }
      }

      // 将选中区域转换为段落
      Transforms.setNodes(editor, { type: 'paragraph' }, { at: parentPath });
    } catch (error) {
      console.error('Error in clearMarks:', error);
    }
  }

  /**
   * 将列表节点转换为段落节点数组
   *
   * @param editor - 编辑器实例
   * @param listNode - 要处理的列表节点
   * @returns 从列表节点中提取的所有段落节点的数组
   *
   * @description
   * 该方法通过递归遍历列表节点及其子节点，提取所有段落节点，
   * 并将它们汇集成一个扁平化的数组。支持嵌套列表的处理。
   */
  static listToParagraph(editor: Editor, listNode: ListNode): ParagraphNode[] {
    if (!listNode.children || listNode.children.length === 0) {
      return [];
    }

    const paragraphNodes: ParagraphNode[] = [];

    const extractParagraphs = (children: any[]) => {
      children.forEach((item) => {
        if (!item?.children) return;

        item.children.forEach((child: any) => {
          if (child.type === 'paragraph') {
            paragraphNodes.push(child);
          } else if (child.type === 'list') {
            // 递归处理嵌套列表
            const nestedParagraphs = EditorUtils.listToParagraph(editor, child);
            paragraphNodes.push(...nestedParagraphs);
          }
        });
      });
    };

    extractParagraphs(listNode.children);

    return paragraphNodes.flat() as ParagraphNode[];
  }

  /**
   * 替换编辑器中当前选中的节点
   *
   * @param editor - 编辑器实例
   * @param newNode - 要插入的新节点数组
   *
   * @description
   * 该方法会查找当前选区中的最低块级节点，然后用新的节点替换它。
   * 替换过程包括：查找最低块级节点，选中整个节点，插入新节点来替换原内容。
   */
  static replaceSelectedNode = (editor: Editor, newNode: Elements[]) => {
    const nodeEntries = Array.from(
      Editor.nodes(editor, {
        mode: 'lowest',
      }),
    );

    if (nodeEntries.length === 0) {
      // 如果没有选中节点，则直接插入新节点
      Transforms.insertNodes(editor, newNode);
      return;
    }

    const [node, path] = nodeEntries[0] as [any, Path];

    if (Text.isText(node) && node.text === '') {
      // 如果是空文本节点，则操作其父节点
      const parentPath = Path.parent(path);

      Transforms.removeNodes(editor, { at: parentPath });
      Transforms.insertNodes(editor, newNode, {
        at: parentPath,
        select: true,
      });
    } else {
      // 直接插入新节点
      Transforms.insertNodes(editor, newNode, {
        select: true,
      });
    }
  };

  /**
   * 删除编辑器中的所有内容，并插入新的节点
   *
   * @param editor - 编辑器实例
   * @param insertNodes - 要插入的新节点数组。如果未提供，将插入默认段落节点
   */
  static deleteAll(editor: Editor, insertNodes?: Elements[]) {
    const allNodes = Array.from(
      Editor.nodes(editor, {
        at: [],
        match: (n) => Element.isElement(n),
        mode: 'highest',
        reverse: true,
      }),
    );

    if (allNodes.length > 0) {
      const firstNode = allNodes[allNodes.length - 1];
      const lastNode = allNodes[0];

      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, firstNode[1]),
          focus: Editor.end(editor, lastNode[1]),
        },
      });

      // 删除剩余的第一个节点
      if (Editor.hasPath(editor, [0])) {
        Transforms.delete(editor, { at: [0] });
      }
    }

    const nodesToInsert = insertNodes || [EditorUtils.p];
    Transforms.insertNodes(editor, nodesToInsert, { at: [0] });
  }

  /**
   * 重置编辑器的内容，并可选地插入新的节点和重置历史记录
   *
   * @param editor - 要重置的编辑器实例
   * @param insertNodes - 可选的插入节点数组。如果未提供，则使用默认段落节点
   * @param force - 可选的布尔值或历史记录对象。如果为布尔值，则强制重置历史记录；如果为历史记录对象，则使用提供的历史记录
   */
  static reset(
    editor: Editor,
    insertNodes?: Elements[],
    force?: boolean | History,
  ) {
    const nodesToInsert = insertNodes || [EditorUtils.p];

    // 深克隆节点以避免引用问题
    editor.children = JSON.parse(JSON.stringify(nodesToInsert));

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
   * 检查编辑器中是否有指定格式的活动节点
   *
   * @param editor - 编辑器实例
   * @param format - 要检查的格式名称
   * @param value - 可选的值，用于进一步验证格式是否匹配
   * @returns 如果存在匹配的格式节点，则返回 true；否则返回 false
   */
  static isFormatActive(editor: Editor, format: string, value?: any): boolean {
    try {
      const nodeEntries = Array.from(
        Editor.nodes(editor, {
          match: (n) => !!n[format],
          mode: 'lowest',
        }),
      );

      if (nodeEntries.length === 0) return false;

      const [node] = nodeEntries[0];
      return value ? (node as any)[format] === value : !!(node as any)[format];
    } catch (error) {
      console.error('Error checking format active:', error);
      return false;
    }
  }

  /**
   * 获取编辑器中选中文本的URL
   *
   * @param editor - 编辑器实例
   * @returns 返回选中文本的URL，如果没有则返回空字符串
   */
  static getUrl(editor: Editor): string {
    try {
      const nodeEntries = Array.from(
        Editor.nodes<any>(editor, {
          match: (n) => Text.isText(n) && !!n?.url,
          mode: 'lowest',
        }),
      );

      return nodeEntries.length > 0
        ? (nodeEntries[0][0]?.url as string) || ''
        : '';
    } catch (error) {
      console.error('Error getting URL:', error);
      return '';
    }
  }

  /**
   * 切换文本格式（加粗、斜体等）
   *
   * @param editor - 编辑器实例
   * @param format - 要切换的格式类型
   */
  static toggleFormat(editor: Editor, format: string) {
    if (!editor.selection) return;

    const selectedText = Editor.string(editor, editor.selection);
    if (!selectedText) return;

    const isActive = EditorUtils.isFormatActive(editor, format);

    Transforms.setNodes(
      editor,
      { [format]: isActive ? null : true },
      { match: Text.isText, split: true },
    );
  }

  /**
   * 为编辑器中的文本节点设置高亮颜色
   *
   * @param editor - 编辑器实例
   * @param color - 可选的高亮颜色字符串。如果未提供，则移除高亮颜色
   */
  static highColor(editor: Editor, color?: string) {
    if (!editor.selection) return;
    Transforms.setNodes(
      editor,
      { highColor: color },
      { match: Text.isText, split: true },
    );
  }

  /**
   * 设置文本对齐方式
   *
   * @param editor - 编辑器实例
   * @param alignment - 对齐方式：'left', 'center', 或 'right'
   */
  static setAlignment(editor: Editor, alignment: 'left' | 'center' | 'right') {
    if (!editor.selection) return;

    Transforms.setNodes(
      editor,
      { align: alignment },
      { match: (n) => Element.isElement(n) && !Editor.isEditor(n) },
    );
  }

  /**
   * 检查当前选中块的对齐方式
   *
   * @param editor - 编辑器实例
   * @param alignment - 要检查的对齐方式
   * @returns 是否处于指定的对齐方式
   */
  static isAlignmentActive(editor: Editor, alignment: string): boolean {
    try {
      const nodeEntries = Array.from(
        Editor.nodes(editor, {
          match: (n) => Element.isElement(n) && (n as any).align === alignment,
        }),
      );

      return nodeEntries.length > 0;
    } catch (error) {
      console.error('Error checking alignment active:', error);
      return false;
    }
  }

  /**
   * 检查编辑器末尾是否需要添加段落节点
   *
   * @param editor - 编辑器实例
   * @returns 如果添加了段落节点则返回 true，否则返回 false
   */
  static checkEnd(editor: Editor): boolean {
    try {
      const nodeEntries = Array.from(
        Editor.nodes<any>(editor, {
          at: [],
          mode: 'highest',
          match: (n) => Element.isElement(n),
          reverse: true,
        }),
      );

      if (nodeEntries.length === 0) return false;

      const [node, path] = nodeEntries[0];
      const nodeString = Node.string(node);
      const hasMediaChild =
        node?.children?.length === 1 && node?.children[0]?.type === 'media';

      if (node?.type !== 'paragraph' || nodeString || hasMediaChild) {
        Transforms.insertNodes(editor, EditorUtils.p, {
          at: Path.next(path),
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error in checkEnd:', error);
      return false;
    }
  }

  /**
   * 检查指定路径是否在编辑器末尾
   *
   * @param editor - 编辑器实例
   * @param path - 要检查的路径
   * @returns 如果路径在末尾则返回 true，否则返回 false
   */
  static checkSelEnd(editor: Editor, path: Path): boolean {
    try {
      let currentNode = Editor.node(editor, path);

      while (!Editor.isEditor(currentNode[0])) {
        if (Editor.hasPath(editor, Path.next(currentNode[1]))) {
          return false;
        }
        currentNode = Editor.node(editor, Path.parent(currentNode[1]));
      }

      return true;
    } catch (error) {
      console.error('Error in checkSelEnd:', error);
      return false;
    }
  }
  /**
   * 安全地查找元素对应的Slate路径
   *
   * @param editor - 编辑器实例
   * @param el - DOM元素
   * @returns 元素对应的路径，如果查找失败则返回编辑器起始路径
   */
  static findPath(editor: Editor, el: any): Path {
    try {
      return ReactEditor.findPath(editor, el);
    } catch (error) {
      console.error('find path error', error);
      return Editor.start(editor, []).path;
    }
  }

  /**
   * 创建媒体节点（图片、视频等）
   *
   * @param src - 媒体资源URL
   * @param type - 媒体类型
   * @param extraPros - 额外属性
   * @returns 创建的媒体节点
   */
  static createMediaNode(
    src: string | undefined,
    type: string,
    extraPros?: Record<string, any>,
  ): CardNode | { text: string } {
    if (!src) {
      return { text: '' };
    }

    try {
      const fullSrc = EditorUtils.normalizeUrl(src);
      const urlParams = EditorUtils.parseUrlParams(fullSrc);
      const altText = extraPros?.alt || urlParams.get('alt') || '';

      if (
        type === 'image' &&
        EditorUtils.isImageType(src, extraPros?.alt || type)
      ) {
        return EditorUtils.createImageNode(src, altText, urlParams, extraPros);
      }

      return EditorUtils.createGenericMediaNode(src, type, extraPros);
    } catch (error) {
      console.error('Error creating media node:', error, src);
      return EditorUtils.createGenericMediaNode(src, type, extraPros);
    }
  }

  /**
   * 标准化URL，添加协议前缀
   */
  private static normalizeUrl(src: string): string {
    if (src.match(/^(https?:\/\/|data:|file:)/)) {
      return src;
    }

    const origin = window.location.origin || '';
    return src.startsWith('/') ? `${origin}${src}` : `${origin}/${src}`;
  }

  /**
   * 解析URL参数
   */
  private static parseUrlParams(url: string): URLSearchParams {
    try {
      return new URL(url).searchParams;
    } catch {
      return new URLSearchParams();
    }
  }

  /**
   * 检查是否为图片类型
   */
  private static isImageType(src: string, alt: string): boolean {
    return ['image'].includes(getMediaType(src, alt));
  }

  /**
   * 创建图片节点
   */
  private static createImageNode(
    src: string,
    altText: string,
    urlParams: URLSearchParams,
    extraPros?: Record<string, any>,
  ): CardNode {
    return {
      type: 'card',
      block: urlParams.get('block') || false,
      children: [
        {
          type: 'card-before',
          children: [{ text: '' }],
        },
        {
          ...(extraPros || {}),
          block: urlParams.get('block') || false,
          type: 'image',
          url: src,
          mediaType: 'image',
          alt: altText,
          width: urlParams.get('width') || undefined,
          height: urlParams.get('height') || undefined,
          children: [{ text: '' }],
        } as any,
        {
          type: 'card-after',
          children: [{ text: '' }],
        },
      ],
    } as CardNode;
  }

  /**
   * 创建通用媒体节点
   */
  private static createGenericMediaNode(
    src: string,
    type: string,
    extraPros?: Record<string, any>,
  ): CardNode {
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

  /**
   * 用卡片节点包装普通节点
   *
   * @param node - 要包装的节点
   * @param props - 额外属性
   * @returns 包装后的卡片节点
   */
  static wrapperCardNode(node: any, props: Record<string, any> = {}): CardNode {
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
