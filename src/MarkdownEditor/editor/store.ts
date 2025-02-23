/* eslint-disable no-param-reassign */
import { makeAutoObservable } from 'mobx';
import React, { createContext, useContext } from 'react';
import { Subject } from 'rxjs';
import {
  BaseEditor,
  BaseSelection,
  Editor,
  Element,
  Node,
  NodeEntry,
  Path,
  Range,
  Selection,
  Transforms,
} from 'slate';
import { ReactEditor } from './slate-react';

import { Ace } from 'ace-builds';
import { parse } from 'querystring';
import { HistoryEditor } from 'slate-history';
import { CommentDataType, MarkdownEditorProps } from '..';
import { Elements, ListNode, TableCellNode } from '../el';
import { parserMdToSchema } from './parser/parserMdToSchema';
import { KeyboardTask, Methods, schemaToMarkdown } from './utils';
import { getOffsetLeft, getOffsetTop } from './utils/dom';
import { EditorUtils } from './utils/editorUtils';

export const EditorStoreContext = createContext<{
  store: EditorStore;
  typewriter: boolean;
  rootContainer?: React.MutableRefObject<HTMLDivElement | undefined>;
  setShowComment: (list: CommentDataType[]) => void;
  readonly: boolean;
  keyTask$: Subject<{
    key: Methods<KeyboardTask>;
    args?: any[];
  }>;
  editorProps: MarkdownEditorProps;
  markdownEditorRef: React.MutableRefObject<
    BaseEditor & ReactEditor & HistoryEditor
  >;
  markdownContainerRef: React.MutableRefObject<HTMLDivElement | null>;
} | null>(null);

export const useEditorStore = () => {
  return (
    useContext(EditorStoreContext)! || {
      store: {} as Record<string, any>,
      readonly: true,
      typewriter: false,
      editorProps: {} as MarkdownEditorProps,
      markdownEditorRef: {} as React.MutableRefObject<any>,
    }
  );
};

const SUPPORT_TYPING_TAG = ['table-cell', 'paragraph', 'head'];
/**
 * 编辑器存储类，用于管理Markdown编辑器的状态和操作。
 */
export class EditorStore {
  manual = false;
  initializing = false;
  sel: BaseSelection | undefined;
  selectTablePath: Path = [];
  refreshHighlight: boolean = false;
  highlightCache = new Map<object, Range[]>();
  focus = false;
  readonly = false;
  codes = new WeakMap<object, Ace.Editor>();
  private ableToEnter = new Set([
    'paragraph',
    'head',
    'blockquote',
    'code',
    'table',
    'list',
    'media',
    'attach',
  ]);
  SEL_CELLS: WeakMap<Editor, NodeEntry[]> = new WeakMap();
  CACHED_SEL_CELLS: WeakMap<Editor, NodeEntry[]> = new WeakMap();
  draggedElement: null | HTMLElement = null;
  openInsertCompletion = false;
  insertCompletionText$ = new Subject<string>();
  refreshFloatBar = false;
  openInsertLink$ = new Subject<Selection>();
  openLinkPanel = false;
  tableCellNode: null | NodeEntry<TableCellNode> = null;
  domRect: DOMRect | null = null;
  domRange: HTMLElement | null = null;
  container: null | HTMLDivElement = null;
  preSelection: null | Selection = null;
  inputComposition = false;
  tableTask$ = new Subject<
    | 'insertRowBefore'
    | 'insertRowAfter'
    | 'insertColBefore'
    | 'insertColAfter'
    | 'moveUpOneRow'
    | 'moveDownOneRow'
    | 'moveLeftOneCol'
    | 'moveRightOneCol'
    | 'removeCol'
    | 'removeRow'
    | 'in'
    | 'insertTableCellBreak'
  >();

  floatBarOpen: boolean = false;

  setFloatBarOpen(open: boolean) {
    this.floatBarOpen = open;
  }

  get doc() {
    return this.container?.querySelector(
      '.markdown-editor-content',
    ) as HTMLDivElement;
  }

  doManual() {
    this.manual = true;
    setTimeout(() => (this.manual = false), 30);
  }

  _editor: React.MutableRefObject<BaseEditor & ReactEditor & HistoryEditor>;

  get editor() {
    return this._editor.current;
  }

  constructor(
    _editor: React.MutableRefObject<BaseEditor & ReactEditor & HistoryEditor>,
  ) {
    this.dragStart = this.dragStart.bind(this);
    this._editor = _editor;
    makeAutoObservable(this, {
      _editor: false,
      sel: false,
      CACHED_SEL_CELLS: false,
      SEL_CELLS: false,
      preSelection: false,
      container: false,
      tableCellNode: false,
      editor: false,
      highlightCache: false,
      inputComposition: false,
      draggedElement: false,
      manual: false,
      openLinkPanel: false,
      initializing: false,
    });
  }

  /**
   * 查找最新的节点索引。
   *
   * @param node - 当前节点。
   * @param index - 当前索引路径。
   * @returns 最新节点的索引路径。
   */
  findLatest(node: Elements, index: number[]): number[] {
    if (Array.isArray((node as ListNode).children)) {
      if (
        (node as ListNode).children.length === 1 &&
        (SUPPORT_TYPING_TAG.includes((node as ListNode).type) ||
          !(node as ListNode).children[0].type)
      ) {
        return index;
      }

      return this.findLatest((node as ListNode).children.at(-1)!, [
        ...index,
        (node as ListNode).children.length - 1,
      ]);
    }
    return index;
  }
  /**
   * 检查给定节点是否是最新节点。用于展示 闪动光标
   *
   * @param node - 要检查的节点。
   * @returns 如果节点是最新节点，则返回 true；否则返回 false。
   */
  isLatestNode(node: Node) {
    try {
      return this.findLatest(this._editor.current.children.at(-1)!, [
        this._editor.current.children.length - 1,
      ])
        .join('-')
        .startsWith(ReactEditor.findPath(this._editor.current, node).join('-'));
    } catch (error) {
      return false;
    }
  }

  /**
   * 插入一个链接到编辑器中。
   *
   * @param filePath - 要插入的文件路径。如果路径以 'http' 开头，则链接文本为路径本身，否则为文件名。
   *
   * 该方法首先解析文件路径，并创建一个包含文本和 URL 的节点对象。
   * 然后，它检查当前编辑器的选区是否存在且未折叠。如果选区不存在或已折叠，则方法返回。
   *
   * 接下来，它查找当前选区所在的最低层级的元素节点。如果节点类型是 'table-cell' 或 'paragraph'，
   * 则在当前选区插入链接节点并选中它。
   *
   * 如果当前选区所在的元素节点类型不是 'table-cell' 或 'paragraph'，则查找包含当前选区的父级元素节点，
   * 并在其后插入一个包含链接节点的新段落。
   */
  insertLink(filePath: string) {
    const p = parse(filePath);
    const insertPath = filePath;
    let node = {
      text: filePath.startsWith('http') ? filePath : p.name,
      url: insertPath,
    };
    const sel = this._editor.current.selection;
    if (!sel || !Range.isCollapsed(sel)) return;
    // @ts-ignore
    const [cur] = Editor.nodes<any>(this._editor.current, {
      match: (n) => Element.isElement(n),
      mode: 'lowest',
    });
    if (node.text && ['table-cell', 'paragraph'].includes(cur[0].type)) {
      Transforms.insertNodes(this._editor.current, node, { select: true });
    } else {
      // @ts-ignore
      const [par] = Editor.nodes<any>(this._editor.current, {
        match: (n) =>
          Element.isElement(n) && ['table', 'code', 'head'].includes(n.type),
      });
      Transforms.insertNodes(
        this._editor.current,
        {
          type: 'paragraph',
          children: [node],
        },
        { select: true, at: Path.next(par[1]) },
      );
    }
  }

  /**
   * 插入节点到编辑器中。
   *
   * @param nodes - 要插入的节点，可以是单个节点或节点数组。
   * @param options - 可选参数，用于指定插入节点的选项。
   */
  insertNodes(nodes: Node | Node[], options?: any) {
    Transforms.insertNodes(this._editor.current, nodes, options);
  }

  /**
   * 计算指定 HTML 元素相对于文档顶部的偏移量。
   *
   * @param node - 要计算偏移量的 HTML 元素。
   * @returns 元素相对于文档顶部的偏移量（以像素为单位）。
   */
  offsetTop(node: HTMLElement) {
    let top = 0;
    const doc = this.doc;
    while (doc?.contains(node.offsetParent) && doc !== node) {
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement;
    }
    return top;
  }

  offsetLeft(node: HTMLElement) {
    let left = 0;
    const doc = this.doc;
    while (doc.contains(node) && doc !== node) {
      left += node.offsetLeft;
      node = node.offsetParent as HTMLElement;
    }
    return left;
  }

  setState(value: (state: EditorStore) => void) {
    if (value instanceof Function) {
      value(this);
    } else {
      for (let key of Object.keys(value)) {
        // @ts-ignore
        this[key] = value[key];
      }
    }
  }

  private toPath(el: HTMLElement) {
    const node = ReactEditor.toSlateNode(this._editor.current, el);
    const path = ReactEditor.findPath(this._editor.current, node);
    return [path, node] as [Path, Node];
  }

  /**
   *清空编辑器内容
   */
  clearContent() {
    Transforms.removeNodes(this._editor.current, {});
  }

  /**
   * 设置编辑器内容
   * @param md
   */
  setMDContent(md?: string) {
    if (md === undefined) return;
    if (md === schemaToMarkdown(this._editor.current.children)) return;
    const nodeList = parserMdToSchema(md).schema;
    this.setContent(nodeList);
  }

  /**
   * 设置编辑器内容，通过节点列表
   * @param nodeList
   */
  setContent(nodeList: Node[]) {
    this._editor.current.children = nodeList;
    this._editor.current.onChange();
    this._editor.current.insertText('\n');
  }

  /**
   * 比较两个节点并更新编辑器中的节点。
   *
   * @param node - 当前节点。
   * @param preNode - 之前的节点。
   * @param at - 节点在编辑器中的路径。
   *
   * 如果 `preNode` 和 `node` 的类型不同，或者节点类型为 'code' 或 'footnoteDefinition'，
   * 则删除当前路径和下一个路径的节点，并插入新的节点。
   *
   * 如果 `node` 有子节点，则递归比较和更新子节点。
   *
   * 如果 `node` 没有子节点但 `preNode` 有子节点，则删除当前路径的节点并插入新的节点。
   *
   * 如果 `node` 和 `preNode` 都没有子节点，则更新当前路径的节点，并插入文本（如果有）。
   */
  diffNode = (node: Node, preNode: Node, at: number[]) => {
    // 如果上个节点不存在，但是本次有，直接插入
    if (node && !preNode) {
      if (this._editor.current.hasPath(Path.parent(at))) {
        Transforms.insertNodes(this._editor.current, node, { at });
        return;
      }
      if (node && node.type === 'list-item') {
        this.diffNode(node, preNode, Path.parent(at));
      } else {
        this.diffNode(node, preNode, Path.next(Path.parent(at)));
      }
      return;
    }

    if (node.type !== preNode.type) {
      Transforms.removeNodes(this._editor.current, {
        at,
      });
      Transforms.insertNodes(this._editor.current, node, { at });
      return;
    }

    if (node.type === preNode.type) {
      if (node.type === 'list-item') {
        Transforms.removeNodes(this._editor.current, {
          at,
        });
        Transforms.insertNodes(this._editor.current, node, { at });
        return;
      }
      Transforms.setNodes(this._editor.current, node, { at });
      if (node.text) {
        Transforms.insertText(this._editor.current, node.text, { at });
      }
    }

    if (node.children) {
      node.children.forEach((child: any, index: any) => {
        if (!this._editor.current.hasPath(at)) {
          Transforms.insertNodes(this._editor.current, child, { at });
          return;
        }
        this.diffNode(child, preNode.children[index], [...at, index]);
      });
      return;
    }
    return;
  };

  /**
   * 更新节点列表的方法。
   *
   * @param nodeList - 新的节点列表。
   *
   * 该方法会比较新的节点列表和当前编辑器中的子节点列表，
   * 并根据差异更新编辑器中的节点。
   *
   * 首先，它会创建一个映射来存储需要更新的节点。
   * 然后，它会遍历新的节点列表，并将需要更新的节点添加到映射中。
   * 接着，它会根据映射中的信息调用 `diffNode` 方法来更新节点。
   * 最后，如果当前编辑器中的子节点比新的节点列表多，
   * 它会移除多余的节点。
   */
  updateNodeList(nodeList: Node[]) {
    const childrenList = this._editor.current.children;
    const updateMap = new Map<number, Node>();

    nodeList
      .filter((item: any) => {
        if (item.type === 'p' && item.children.length === 0) {
          return false;
        }
        if (item.type === 'list' && item.children.length === 0) {
          return false;
        }
        if (item.type === 'listItem' && item.children.length === 0) {
          return false;
        }
        return true;
      })
      .forEach((node, index) => {
        if (JSON.stringify(node) === JSON.stringify(childrenList?.at(index))) {
          return;
        }
        updateMap.set(index, node);
      });

    try {
      updateMap.forEach((node, key) => {
        this.diffNode(node, childrenList[key], [key]);
      });
    } catch (error) {
      console.log('run', error);
      this._editor.current.children = nodeList;
    }

    const maxSize = childrenList.length - nodeList.length;
    if (maxSize > 0) {
      childrenList.forEach((node, index) => {
        if (nodeList.at(index)) return;
        if (this._editor.current.hasPath([index])) {
          Transforms.removeNodes(this._editor.current, { at: [index] });
        }
      });
    }
  }

  /**
   * 处理拖拽开始事件。
   *
   * @param e - React 拖拽事件对象。
   *
   * 此方法会在拖拽开始时调用，主要功能包括：
   * - 阻止事件传播。
   * - 初始化拖拽相关的元素和位置数据。
   * - 添加拖拽过程中和拖拽结束时的事件监听器。
   *
   * 内部步骤：
   * 1. 根据拖拽元素的数据集，确定哪些元素可以作为拖拽目标。
   * 2. 遍历所有符合条件的元素，计算它们的位置信息并存储。
   * 3. 在拖拽过程中，根据鼠标位置动态更新拖拽标记的位置。
   * 4. 在拖拽结束时，移除事件监听器和拖拽标记，并根据拖拽目标位置更新编辑器内容。
   */
  dragStart(e: any) {
    e.stopPropagation();
    const img = document.createElement('img');
    img.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 1, 1);
    type MovePoint = {
      el: HTMLDivElement;
      direction: 'top' | 'bottom';
      top: number;
      left: number;
    };
    const ableToEnter =
      this.draggedElement?.dataset?.be === 'list-item'
        ? new Set([
            'paragraph',
            'head',
            'blockquote',
            'code',
            'table',
            'list',
            'list-item',
            'media',
            'attach',
          ])
        : this.ableToEnter;
    let mark: null | HTMLDivElement = null;
    const els = document.querySelectorAll<HTMLDivElement>('[data-be]');
    const points: MovePoint[] = [];
    // @ts-ignore
    for (let el of els) {
      if (!ableToEnter.has(el.dataset.be!)) continue;
      if (el.classList.contains('frontmatter')) continue;
      const pre = el.previousSibling as HTMLElement;
      if (
        el.dataset.be === 'paragraph' &&
        this.draggedElement?.dataset.be === 'list-item' &&
        (!pre || pre.classList.contains('check-item'))
      ) {
        continue;
      }
      if (el === this.draggedElement) continue;
      const top = getOffsetTop(el, this.container!);
      const left = getOffsetLeft(el, this.container!);
      points.push({
        el: el,
        direction: 'top',
        left: left,
        top: top,
      });
      points.push({
        el: el,
        left: left,
        direction: 'bottom',
        top: top + el.clientHeight + 2,
      });
    }
    let last: MovePoint | null = null;
    const dragover = (e: DragEvent) => {
      e.preventDefault();
      const top = e.clientY - 40 + this.container!.scrollTop;
      let distance = 1000000;
      let cur: MovePoint | null = null;
      for (let p of points) {
        let curDistance = Math.abs(p.top - top);
        if (curDistance < distance) {
          cur = p;
          distance = curDistance;
        }
      }
      if (cur) {
        const rect = this.container!.getBoundingClientRect();
        const scrollTop = this.container!.scrollTop;
        const scrollLeft = this.container!.scrollLeft;
        last = cur;
        const width =
          last.el.dataset.be === 'list-item'
            ? last.el.clientWidth + 20 + 'px'
            : last.el.clientWidth + 'px';
        if (!mark) {
          mark = document.createElement('div');
          mark.classList.add('move-mark');
          mark.style.width = width;
          mark.style.height = '2px';

          mark.style.transform = `translate(${last.left - rect.left - scrollLeft}px, ${last.top - rect.top - scrollTop}px)`;
          this.container?.parentElement!.append(mark);
        } else {
          mark.style.width = width;
          mark.style.transform = `translate(${last.left - rect.left - scrollLeft}px, ${last.top - rect.top - scrollTop}px)`;
        }
      }
    };
    window.addEventListener('dragover', dragover);
    window.addEventListener(
      'dragend',
      () => {
        try {
          console.log('dragend');
          window.removeEventListener('dragover', dragover);
          this.readonly = false;
          if (mark) this.container?.parentElement!.removeChild(mark);
          if (last && this.draggedElement) {
            let [dragPath, dragNode] = this.toPath(this.draggedElement);
            let [targetPath] = this.toPath(last.el);
            let toPath =
              last.direction === 'top' ? targetPath : Path.next(targetPath);
            if (!Path.equals(targetPath, dragPath)) {
              const parent = Node.parent(this._editor.current, dragPath);
              if (
                Path.equals(Path.parent(targetPath), Path.parent(dragPath)) &&
                Path.compare(dragPath, targetPath) === -1
              ) {
                toPath = Path.previous(toPath);
              }
              let delPath = Path.parent(dragPath);
              const targetNode = Node.get(this._editor.current, targetPath);
              if (dragNode.type === 'list-item') {
                if (targetNode.type !== 'list-item') {
                  Transforms.delete(this._editor.current, { at: dragPath });
                  Transforms.insertNodes(
                    this._editor.current,
                    {
                      ...parent,
                      children: [EditorUtils.copy(dragNode)],
                    },
                    { at: toPath, select: true },
                  );
                  if (parent.children?.length === 1) {
                    if (
                      EditorUtils.isNextPath(Path.parent(dragPath), targetPath)
                    ) {
                      delPath = Path.next(Path.parent(dragPath));
                    } else {
                      delPath = Path.parent(dragPath);
                    }
                  }
                } else {
                  Transforms.moveNodes(this._editor.current, {
                    at: dragPath,
                    to: toPath,
                  });
                }
              } else {
                Transforms.moveNodes(this._editor.current, {
                  at: dragPath,
                  to: toPath,
                });
              }
              if (parent.children?.length === 1) {
                if (
                  Path.equals(Path.parent(toPath), Path.parent(delPath)) &&
                  Path.compare(toPath, delPath) !== 1
                ) {
                  delPath = Path.next(delPath);
                }
                Transforms.delete(this._editor.current, { at: delPath });
              }
            }
            if (dragNode?.type !== 'media')
              this.draggedElement!.draggable = false;
          }
          this.draggedElement = null;
        } catch (error) {
          console.error(error);
        }
      },
      { once: true },
    );
  }
}
