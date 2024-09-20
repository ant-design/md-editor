/* eslint-disable no-param-reassign */
import { action, makeAutoObservable, runInAction } from 'mobx';
import React, { createContext, useContext } from 'react';
import { Subject } from 'rxjs';
import {
  BaseSelection,
  createEditor,
  Editor,
  Element,
  Node,
  NodeEntry,
  Path,
  Range,
  Selection,
  Transforms,
} from 'slate';
import { withHistory } from 'slate-history';
import { ReactEditor, withReact } from 'slate-react';

import { parse } from 'querystring';
import { MarkdownEditorProps } from '..';
import { ChartNode, Elements, ListNode, MediaNode, TableCellNode } from '../el';
import { openMenus } from './components/Menu';
import { parserMdToSchema } from './parser/parserMdToSchema';
import { withMarkdown } from './plugins';
import { withErrorReporting } from './plugins/catchError';
import { schemaToMarkdown } from './utils';
import { getOffsetLeft, getOffsetTop } from './utils/dom';
import { EditorUtils } from './utils/editorUtils';

export const EditorStoreContext = createContext<EditorStore | null>(null);
export const useEditorStore = () => {
  return useContext(EditorStoreContext)!;
};

const SUPPORT_TYPING_TAG = ['table-cell', 'code-line', 'paragraph', 'head'];
/**
 * 编辑器存储类，用于管理Markdown编辑器的状态和操作。
 *
 * @class EditorStore
 * @property {Editor} editor - 编辑器实例，包含Markdown、React和历史功能。
 * @property {boolean} manual - 手动模式标志。
 * @property {boolean} initializing - 初始化标志。
 * @property {BaseSelection | undefined} sel - 当前选择。
 * @property {boolean} focus - 焦点标志。
 * @property {boolean} readonly - 只读标志。
 * @property {Set<string>} ableToEnter - 可进入的元素集合。
 * @property {boolean} typewriter - 打字机模式标志。
 * @property {HTMLElement | null} draggedElement - 拖动的元素。
 * @property {boolean} openInsertCompletion - 插入完成标志。
 * @property {Subject<string>} insertCompletionText$ - 插入完成文本流。
 * @property {Map<object, Range[]>} highlightCache - 高亮缓存。
 * @property {boolean} refreshFloatBar - 刷新浮动栏标志。
 * @property {boolean} refreshTableAttr - 刷新表格属性标志。
 * @property {Subject<NodeEntry<MediaNode> | null>} mediaNode$ - 媒体节点流。
 * @property {Subject<Selection>} openInsertLink$ - 打开插入链接流。
 * @property {boolean} openLinkPanel - 打开链接面板标志。
 * @property {NodeEntry<TableCellNode> | null} tableCellNode - 表格单元格节点。
 * @property {NodeEntry<ChartNode> | null} chartNode - 图表节点。
 * @property {boolean} refreshHighlight - 刷新高亮标志。
 * @property {boolean} pauseCodeHighlight - 暂停代码高亮标志。
 * @property {DOMRect | null} domRect - DOM矩形。
 * @property {HTMLDivElement | null} container - 容器元素。
 * @property {boolean} inputComposition - 输入组合标志。
 * @property {MarkdownEditorProps} editorProps - 编辑器属性。
 * @property {Subject<string>} tableTask$ - 表格任务流。
 *
 * @method get doc - 获取编辑器文档元素。
 * @method doManual - 启用手动模式。
 * @method openTableMenus - 打开表格菜单。
 * @method findLatest - 查找最新的节点索引。
 * @method isLatestNode - 判断是否为最新节点。
 * @method insertLink - 插入链接。
 * @method insertNodes - 插入节点。
 * @method hideRanges - 隐藏范围。
 * @method offsetTop - 获取元素的顶部偏移量。
 * @method offsetLeft - 获取元素的左侧偏移量。
 * @method doRefreshHighlight - 刷新高亮。
 * @method setState - 设置状态。
 * @method toPath - 将元素转换为路径。
 * @method clearContent - 清空编辑器内容。
 * @method setMDContent - 设置Markdown内容。
 * @method setContent - 设置编辑器内容。
 * @method diffNode - 比较节点并更新。
 * @method updateNodeList - 更新节点列表。
 * @method dragStart - 拖动开始处理。
 */
export class EditorStore {
  editor = withMarkdown(withReact(withHistory(createEditor())), this);
  manual = false;
  initializing = false;
  sel: BaseSelection | undefined;
  focus = false;
  readonly = false;
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
  typewriter: boolean = false;
  draggedElement: null | HTMLElement = null;
  openInsertCompletion = false;
  insertCompletionText$ = new Subject<string>();
  highlightCache = new Map<object, Range[]>();
  refreshFloatBar = false;
  refreshTableAttr = false;
  mediaNode$ = new Subject<NodeEntry<MediaNode> | null>();
  openInsertLink$ = new Subject<Selection>();
  openLinkPanel = false;
  tableCellNode: null | NodeEntry<TableCellNode> = null;
  chartNode: null | NodeEntry<ChartNode> = null;
  refreshHighlight = false;
  pauseCodeHighlight = false;
  domRect: DOMRect | null = null;
  container: null | HTMLDivElement = null;
  inputComposition = false;
  editorProps: MarkdownEditorProps = {};
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

  get doc() {
    return this.container?.querySelector(
      '.markdown-editor-content',
    ) as HTMLDivElement;
  }

  doManual() {
    this.manual = true;
    setTimeout(() => (this.manual = false), 30);
  }

  constructor() {
    this.dragStart = this.dragStart.bind(this);
    withErrorReporting(this.editor);
    makeAutoObservable(this, {
      editor: false,
      tableCellNode: false,
      inputComposition: false,
      container: false,
      highlightCache: false,
      draggedElement: false,
      manual: false,
      openLinkPanel: false,
      initializing: false,
    });
  }
  /**
   * 打开表格菜单。
   *
   * @param e - 鼠标事件或 React 鼠标事件。
   * @param head - 可选参数，表示是否为表头。
   *
   * 如果 `readonly` 为真，则不会执行任何操作。
   * 阻止事件传播并默认行为。
   * 调用 `openMenus` 函数，传递事件和菜单项数组。
   * 菜单项包括添加行、添加列、在表格单元格内换行、移动行或列、删除行或列等操作。
   */
  openTableMenus(e: MouseEvent | React.MouseEvent, head?: boolean) {
    if (this.readonly) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    openMenus(e, [
      {
        text: 'Add Row Above',
        click: () => this.tableTask$.next('insertRowBefore'),
      },
      {
        text: 'Add Row Below',
        key: 'cmd+enter',
        click: () => this.tableTask$.next('insertRowAfter'),
      },
      { hr: true },
      {
        text: 'Add Column Before',
        click: () => this.tableTask$.next('insertColBefore'),
      },
      {
        text: 'Add Column After',
        click: () => this.tableTask$.next('insertColAfter'),
      },
      { hr: true },
      {
        text: 'Line break within table-cell',
        key: 'cmd+shift+enter',
        click: () => this.tableTask$.next('insertTableCellBreak'),
      },
      {
        text: 'Move',
        children: [
          {
            text: 'Move Up One Row',
            disabled: head,
            click: () => this.tableTask$.next('moveUpOneRow'),
          },
          {
            text: 'Move Down One Row',
            disabled: head,
            click: () => this.tableTask$.next('moveDownOneRow'),
          },
          {
            text: 'Move Left One Col',
            click: () => this.tableTask$.next('moveLeftOneCol'),
          },
          {
            text: 'Move Right One Col',
            click: () => this.tableTask$.next('moveRightOneCol'),
          },
        ],
      },
      { hr: true },
      {
        text: 'Delete Col',
        click: () => this.tableTask$.next('removeCol'),
      },
      {
        text: 'Delete Row',
        key: 'cmd+shift+backspace',
        click: () => this.tableTask$.next('removeRow'),
      },
    ]);
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
      return this.findLatest(this.editor.children.at(-1)!, [
        this.editor.children.length - 1,
      ])
        .join('-')
        .startsWith(ReactEditor.findPath(this.editor, node).join('-'));
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
    const sel = this.editor.selection;
    if (!sel || !Range.isCollapsed(sel)) return;
    // @ts-ignore
    const [cur] = Editor.nodes<any>(this.editor, {
      match: (n) => Element.isElement(n),
      mode: 'lowest',
    });
    if (node.text && ['table-cell', 'paragraph'].includes(cur[0].type)) {
      Transforms.insertNodes(this.editor, node, { select: true });
    } else {
      // @ts-ignore
      const [par] = Editor.nodes<any>(this.editor, {
        match: (n) =>
          Element.isElement(n) && ['table', 'code', 'head'].includes(n.type),
      });
      Transforms.insertNodes(
        this.editor,
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
    Transforms.insertNodes(this.editor, nodes, options);
  }

  /**
   * 隐藏高亮范围的方法。
   *
   * 如果 `highlightCache` 中有缓存，则在 60 毫秒后清空缓存并刷新高亮状态。
   * 该方法使用 `setTimeout` 延迟执行，并在回调中使用 `runInAction` 确保状态更新。
   */
  hideRanges() {
    if (this.highlightCache.size) {
      setTimeout(() => {
        runInAction(() => {
          this.highlightCache.clear();
          this.refreshHighlight = !this.refreshHighlight;
        });
      }, 60);
    }
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

  doRefreshHighlight() {
    setTimeout(
      action(() => {
        this.refreshHighlight = !this.refreshHighlight;
      }),
      60,
    );
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
    const node = ReactEditor.toSlateNode(this.editor, el);
    const path = ReactEditor.findPath(this.editor, node);
    return [path, node] as [Path, Node];
  }

  /**
   *清空编辑器内容
   */
  clearContent() {
    Transforms.removeNodes(this.editor, {
      at: [],
    });
  }

  /**
   * 设置编辑器内容
   * @param md
   */
  setMDContent(md: string) {
    if (!md) return;
    if (md === schemaToMarkdown(this.editor.children)) return;
    const nodeList = parserMdToSchema(md).schema;
    this.setContent(nodeList);
  }

  /**
   * 设置编辑器内容，通过节点列表
   * @param nodeList
   */
  setContent(nodeList: Node[]) {
    this.editor.children = nodeList;
    this.editor.onChange();
    this.editor.insertText('\n');
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
    if (
      preNode?.type !== node?.type ||
      (node as Elements).type === 'code' ||
      (node as Elements).type === 'footnoteDefinition'
    ) {
      if (this.editor.hasPath(at)) {
        Transforms.removeNodes(this.editor, { at });
      }
      if (this.editor.hasPath(Path.next(at))) {
        Transforms.removeNodes(this.editor, { at: Path.next(at) });
      }
      Transforms.insertNodes(this.editor, [node], { at });
      return;
    }
    Transforms.setNodes(this.editor, node, { at });
    if (node.children) {
      node.children.forEach((child: any, index: any) => {
        if (preNode.children && preNode.children[index]) {
          this.diffNode(child, preNode.children[index], [...at, index]);
        } else {
          Transforms.insertNodes(this.editor, [child], {
            at: [...at, index],
          });
        }
      });
    } else {
      if (preNode.children) {
        Transforms.removeNodes(this.editor, { at });
        Transforms.insertNodes(this.editor, [node], { at });
      } else {
        Transforms.setNodes(this.editor, node, { at });
        if (node.text) {
          Transforms.insertText(this.editor, node.text, { at });
        }
      }
    }
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
    const childrenList = this.editor.children;

    const updateMap = new Map<number, Node>();

    nodeList.forEach((node, index) => {
      if (JSON.stringify(node) === JSON.stringify(childrenList?.at(index)))
        return;
      updateMap.set(index, node);
    });

    updateMap.forEach((node, key) => {
      this.diffNode(node, childrenList[key], [key]);
    });
    const maxSize = childrenList.length - nodeList.length;
    if (maxSize > 0) {
      childrenList.forEach((node, index) => {
        if (nodeList.at(index)) return;
        Transforms.removeNodes(this.editor, { at: [index] });
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
  dragStart(e: React.DragEvent) {
    e.stopPropagation();
    console.log(e);
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
        left:
          el.dataset.be === 'list-item' && !el.classList.contains('task')
            ? left - 16
            : left,
        top: top - 2,
      });
      points.push({
        el: el,
        left:
          el.dataset.be === 'list-item' && !el.classList.contains('task')
            ? left - 16
            : left,
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
        last = cur;
        const width =
          last.el.dataset.be === 'list-item'
            ? last.el.clientWidth + 20 + 'px'
            : last.el.clientWidth + 'px';
        if (!mark) {
          mark = document.createElement('div');
          mark.classList.add('move-mark');
          mark.style.width = width;
          mark.style.transform = `translate(${last.left}px, ${last.top}px)`;
          this.container!.append(mark);
        } else {
          mark.style.width = width;
          mark.style.transform = `translate(${last.left}px, ${last.top}px)`;
        }
      }
    };
    window.addEventListener('dragover', dragover);
    window.addEventListener(
      'dragend',
      action(() => {
        try {
          window.removeEventListener('dragover', dragover);
          this.readonly = false;
          if (mark) this.container!.removeChild(mark);
          if (last && this.draggedElement) {
            let [dragPath, dragNode] = this.toPath(this.draggedElement);
            let [targetPath] = this.toPath(last.el);
            let toPath =
              last.direction === 'top' ? targetPath : Path.next(targetPath);
            if (!Path.equals(targetPath, dragPath)) {
              const parent = Node.parent(this.editor, dragPath);
              if (
                Path.equals(Path.parent(targetPath), Path.parent(dragPath)) &&
                Path.compare(dragPath, targetPath) === -1
              ) {
                toPath = Path.previous(toPath);
              }
              let delPath = Path.parent(dragPath);
              const targetNode = Node.get(this.editor, targetPath);
              if (dragNode.type === 'list-item') {
                if (targetNode.type !== 'list-item') {
                  Transforms.delete(this.editor, { at: dragPath });
                  Transforms.insertNodes(
                    this.editor,
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
                  Transforms.moveNodes(this.editor, {
                    at: dragPath,
                    to: toPath,
                  });
                }
              } else {
                Transforms.moveNodes(this.editor, {
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
                Transforms.delete(this.editor, { at: delPath });
              }
            }
            if (dragNode?.type !== 'media')
              this.draggedElement!.draggable = false;
          }
          this.draggedElement = null;
        } catch (error) {
          console.error(error);
        }
      }),
      { once: true },
    );
  }
}
