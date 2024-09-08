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
import { ChartNode, MediaNode, TableCellNode } from '../el';
import { openMenus } from './components/Menu';
import { parserMdToSchema } from './parser/parser';
import { withMarkdown } from './plugins';
import { withErrorReporting } from './plugins/catchError';
import { schemaToMarkdown } from './utils';
import { getOffsetLeft, getOffsetTop } from './utils/dom';
import { EditorUtils } from './utils/editorUtils';

export const EditorStoreContext = createContext<EditorStore | null>(null);
export const useEditorStore = () => {
  return useContext(EditorStoreContext)!;
};

export class EditorStore {
  editor = withMarkdown(withReact(withHistory(createEditor())), this);
  search = {
    text: '',
    currentIndex: 0,
    refresh: false,
  };
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
  dragEl: null | HTMLElement = null;
  focusSearch = false;
  searchRanges: Range[] = [];
  openInsertCompletion = false;
  insertCompletionText$ = new Subject<string>();
  highlightCache = new Map<object, Range[]>();
  private searchTimer = 0;
  refreshFloatBar = false;
  refreshTableAttr = false;
  openLangCompletion = false;
  mediaNode$ = new Subject<NodeEntry<MediaNode> | null>();
  openInsertLink$ = new Subject<Selection>();
  openLinkPanel = false;
  tableCellNode: null | NodeEntry<TableCellNode> = null;
  chartNode: null | NodeEntry<ChartNode> = null;
  refreshHighlight = false;
  pauseCodeHighlight = false;
  domRect: DOMRect | null = null;
  container: null | HTMLDivElement = null;
  history = false;
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

  constructor(history = false) {
    this.history = history;
    this.dragStart = this.dragStart.bind(this);
    withErrorReporting(this.editor);
    makeAutoObservable(this, {
      searchRanges: false,
      editor: false,
      tableCellNode: false,
      inputComposition: false,
      container: false,
      highlightCache: false,
      dragEl: false,
      manual: false,
      openLinkPanel: false,
      initializing: false,
    });
  }
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

  isLatestNode(node: Node) {
    return (
      ReactEditor.findPath(this.editor, node).at(0) ===
      ReactEditor.findPath(this.editor, this.editor.children.at(-1)).at(0)
    );
  }

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
  insertNodes(nodes: Node | Node[], options?: any) {
    Transforms.insertNodes(this.editor, nodes, options);
  }
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
  }

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
      this.dragEl?.dataset?.be === 'list-item'
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
        this.dragEl?.dataset.be === 'list-item' &&
        (!pre || pre.classList.contains('check-item'))
      ) {
        continue;
      }
      if (el === this.dragEl) continue;
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
          if (last && this.dragEl) {
            let [dragPath, dragNode] = this.toPath(this.dragEl);
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
            if (dragNode?.type !== 'media') this.dragEl!.draggable = false;
          }
          this.dragEl = null;
        } catch (error) {
          console.error(error);
        }
      }),
      { once: true },
    );
  }
}
