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
import { MediaNode, TableCellNode } from '../el';
import { openMenus } from './components/Menu';
import { withMarkdown } from './plugins';
import { withErrorReporting } from './plugins/catchError';
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
  openInsertNetworkImage = false;
  webview = false;
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
  openSearch = false;
  focusSearch = false;
  searchRanges: Range[] = [];
  openInsertCompletion = false;
  insertCompletionText$ = new Subject<string>();
  highlightCache = new Map<object, Range[]>();
  private searchTimer = 0;
  refreshFloatBar = false;
  refreshTableAttr = false;
  openLangCompletion = false;
  langCompletionText = new Subject<string>();
  floatBar$ = new Subject<string>();
  mediaNode$ = new Subject<NodeEntry<MediaNode> | null>();
  openInsertLink$ = new Subject<Selection>();
  openLinkPanel = false;
  tableCellNode: null | NodeEntry<TableCellNode> = null;
  refreshHighlight = false;
  pauseCodeHighlight = false;
  domRect: DOMRect | null = null;
  container: null | HTMLDivElement = null;
  history = false;
  inputComposition = false;
  openFilePath: string | null = null;
  tableTask$ = new Subject<string>();
  viewImages: string[] = [];
  viewImageIndex = 0;
  openViewImage = false;
  get doc() {
    return this.container?.querySelector('.content') as HTMLDivElement;
  }

  doManual() {
    this.manual = true;
    setTimeout(() => (this.manual = false), 30);
  }

  constructor(webview = false, history = false) {
    this.webview = webview;
    this.history = history;
    this.dragStart = this.dragStart.bind(this);
    withErrorReporting(this.editor);
    makeAutoObservable(this, {
      searchRanges: false,
      editor: false,
      tableCellNode: false,
      inputComposition: false,
      openFilePath: false,
      container: false,
      highlightCache: false,
      dragEl: false,
      manual: false,
      openLinkPanel: false,
      initializing: false,
    });
  }
  openPreviewImages(el: MediaNode) {
    const nodes = Array.from(
      Editor.nodes<MediaNode>(this.editor, {
        at: [],
        match: (n) => n.type === 'media' && n.mediaType === 'image',
      }),
    );
    let index = nodes.findIndex((n) => n[0] === el);
    if (index < 0) {
      index = 0;
    }
    if (nodes.length) {
      this.viewImageIndex = index;
      this.viewImages = nodes
        .map((n) => {
          let realUrl = n[0].url;
          return realUrl!;
        })
        .filter((url) => !/^\w+:/.test(url) || /^\w+:/.test(url));
      if ((this, this.viewImages.length)) {
        this.openViewImage = true;
      }
    }
  }
  openTableMenus(e: MouseEvent | React.MouseEvent, head?: boolean) {
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
    let top = this.openSearch ? 46 : 0;
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

  matchSearch(scroll: boolean = true) {
    this.highlightCache.clear();
    this.searchRanges = [];
    if (!this.search.text) {
      this.search.currentIndex = 0;
      this.refreshHighlight = !this.refreshHighlight;
      return;
    }
    const nodes = Array.from(
      Editor.nodes<any>(this.editor, {
        at: [],
        match: (n) =>
          Element.isElement(n) &&
          ['paragraph', 'table-cell', 'code-line', 'head'].includes(n.type),
      }),
    );
    let matchCount = 0;
    const keyWord = this.search.text.toLowerCase();
    for (let n of nodes) {
      const [el, path] = n;
      const str = Node.string(el).toLowerCase();
      if (!str || /^\s+$/.test(str) || !str.includes(keyWord)) {
        continue;
      }
      let ranges: Range[] = [];
      for (let i = 0; i < el.children.length; i++) {
        const text = el.children[i].text?.toLowerCase();
        if (text && text.includes(keyWord)) {
          const sep = text.split(keyWord);
          let offset = 0;
          for (let j = 0; j < sep.length; j++) {
            if (j === 0) {
              offset += sep[j].length;
              continue;
            }
            ranges.push({
              anchor: {
                path: [...path, i],
                offset: offset,
              },
              focus: {
                path: [...path, i],
                offset: offset + keyWord.length,
              },
              current: matchCount === this.search.currentIndex,
              highlight: true,
            });
            offset += sep[j].length + keyWord.length;
            matchCount++;
          }
        }
      }
      this.searchRanges.push(...ranges);
      this.highlightCache.set(el, ranges);
    }
    if (this.search.currentIndex > matchCount - 1) {
      this.search.currentIndex = 0;
    }
    this.refreshHighlight = !this.refreshHighlight;
    if (scroll) requestIdleCallback(() => this.toPoint());
  }

  setOpenSearch(open: boolean) {
    this.openSearch = open;
    this.domRect = null;
    if (!open) {
      this.highlightCache.clear();
      this.searchRanges = [];
      this.refreshHighlight = !this.refreshHighlight;
    } else {
      this.focusSearch = !this.focusSearch;
      if (this.search.text) {
        this.matchSearch();
        this.toPoint();
      }
    }
  }

  setSearchText(text?: string) {
    this.searchRanges = [];
    this.search.currentIndex = 0;
    this.search.text = text || '';
    clearTimeout(this.searchTimer);
    this.searchTimer = window.setTimeout(() => {
      this.matchSearch();
    }, 300);
  }

  private changeCurrent() {
    this.searchRanges.forEach((r, i) => {
      this.searchRanges[i].current = i === this.search.currentIndex;
    });
    this.refreshHighlight = !this.refreshHighlight;
  }

  nextSearch() {
    if (this.search.currentIndex === this.searchRanges.length - 1) {
      this.search.currentIndex = 0;
    } else {
      this.search.currentIndex++;
    }
    this.changeCurrent();
    this.toPoint();
  }

  prevSearch() {
    if (this.search.currentIndex === 0) {
      this.search.currentIndex = this.searchRanges.length - 1;
    } else {
      this.search.currentIndex--;
    }
    this.changeCurrent();
    this.toPoint();
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

  private toPoint() {
    try {
      const cur = this.searchRanges[this.search.currentIndex];
      if (!cur) return;
      const node = Node.get(this.editor, Path.parent(cur.focus.path));
      const dom = ReactEditor.toDOMNode(this.editor, node);
      if (dom) {
        const top = this.offsetTop(dom);
        if (
          top > this.container!.scrollTop &&
          top < this.container!.scrollTop + window.innerHeight
        )
          return;
        this.container!.scroll({
          top: top - 100,
        });
      }
    } catch (e) {
      console.error('toPoint', e);
    }
  }

  private toPath(el: HTMLElement) {
    const node = ReactEditor.toSlateNode(this.editor, el);
    const path = ReactEditor.findPath(this.editor, node);
    return [path, node] as [Path, Node];
  }

  dragStart(e: React.DragEvent) {
    e.stopPropagation();
    this.readonly = true;
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
      }),
      { once: true },
    );
  }
}
