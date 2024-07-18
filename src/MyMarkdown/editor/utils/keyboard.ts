import isHotkey from 'is-hotkey';
import { action, runInAction } from 'mobx';
import { useCallback, useEffect } from 'react';
import { Subject } from 'rxjs';
import { Editor, Element, Node, Path, Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { AttachNode, MediaNode } from '../../el';
import { useSubject } from '../../hooks/subscribe';
import { parserMdToSchema } from '../parser/parser';
import { EditorStore } from '../store';
import { EditorUtils } from './editorUtils';

export type Methods<T> = {
  [P in keyof T]: T[P] extends Function ? P : never;
}[keyof T];

export class KeyboardTask {
  store: EditorStore;
  editor: EditorStore['editor'];

  constructor(store: EditorStore) {
    this.store = store;
    this.editor = store.editor;
  }

  get curNodes() {
    return Editor.nodes<any>(this.editor, {
      mode: 'lowest',
      match: (m) => {
        console.log(m);
        return Element.isElement(m);
      },
    });
  }

  private openFloatBar() {
    setTimeout(() => {
      try {
        const domRange = window.getSelection()?.getRangeAt(0);
        const rect = domRange?.getBoundingClientRect();
        if (rect) {
          this.store.setState((state) => (state.domRect = rect));
        }
      } catch (e) {}
    });
  }

  selectAll() {
    const [node] = this.curNodes;
    if (node?.[0]?.type === 'table-cell') {
      Transforms.select(this.editor, Path.parent(Path.parent(node[1])));
    } else if (node?.[0]?.type === 'code-line') {
      Transforms.select(this.editor, Path.parent(node[1]));
    } else {
      Transforms.select(this.editor, {
        anchor: Editor.start(this.editor, []),
        focus: Editor.end(this.editor, []),
      });
    }
  }

  selectLine() {
    if (this.editor.selection) {
      const [node] = Editor.nodes<any>(this.editor, {
        mode: 'lowest',
        match: (m) => Element.isElement(m),
      });
      Transforms.select(
        this.editor,
        Path.parent(this.editor.selection.anchor.path),
      );
      const text =
        Node.leaf(this.editor, this.editor.selection.anchor.path).text || '';
      if (text && node?.[0].type !== 'code-line') {
        this.openFloatBar();
      }
    }
  }

  selectFormat() {
    if (this.editor.selection) {
      const [node] = Editor.nodes<any>(this.editor, {
        mode: 'lowest',
        match: (m) => Element.isElement(m),
      });
      Transforms.select(this.editor, this.editor.selection.anchor.path);
      if (
        node?.[0].type !== 'code-line' &&
        !Range.isCollapsed(this.editor.selection)
      ) {
        this.openFloatBar();
      }
    }
  }

  selectWord() {
    const sel = this.editor.selection;
    if (sel && Range.isCollapsed(sel)) {
      const text = Node.leaf(this.editor, sel.anchor.path).text || '';
      let start = sel.anchor.offset;
      let end = start;
      const next = text.slice(start);
      const pre = text.slice(0, start);
      let m1 = next.match(/^(\w+)/);
      if (m1) {
        end += m1[1].length;
        let m2 = pre.match(/(\w+)$/);
        if (m2) start = start - m2[1].length;
      } else {
        m1 = next.match(/^([\u4e00-\u9fa5]+)/);
        if (m1) {
          end += m1[1].length;
          let m2 = pre.match(/([\u4e00-\u9fa5]+)$/);
          if (m2) start = start - m2[1].length;
        } else {
          let m2 = pre.match(/(\w+)$/);
          if (!m2) m2 = pre.match(/([\u4e00-\u9fa5]+)$/);
          if (m2) start -= m2[1].length;
        }
      }
      if (start === sel.anchor.offset && end === sel.anchor.offset && next) {
        end = start + 1;
      }
      Transforms.select(this.editor, {
        anchor: { path: sel.anchor.path, offset: start },
        focus: { path: sel.anchor.path, offset: end },
      });
      const [node] = this.curNodes;
      if (
        node?.[0].type !== 'code-line' &&
        !Range.isCollapsed(this.editor.selection!)
      )
        this.openFloatBar();
    }
  }

  async pastePlainText() {
    const text = await navigator.clipboard.readText();
    if (text) {
      const [node] = this.curNodes;
      if (node[0].type === 'code-line') {
        Transforms.insertFragment(
          this.editor,
          text.split('\n').map((c: any) => {
            return { type: 'code-line', children: [{ text: c }] };
          }),
        );
        setTimeout(() => {
          runInAction(() => {
            this.store.refreshHighlight = !this.store.refreshHighlight;
          });
        }, 60);
      } else if (node[0].type === 'table-cell') {
        Editor.insertText(this.editor, text.replace(/\n/g, ' '));
      } else {
        Editor.insertText(this.editor, text);
      }
    }
  }

  async pasteMarkdownCode() {
    const markdownCode = await navigator.clipboard.readText();
    if (markdownCode) {
      const [node] = this.curNodes;
      const res = await parserMdToSchema(markdownCode);

      if (
        node[0].type === 'paragraph' &&
        !Node.string(node[0]) &&
        node[0].children.length === 1
      ) {
        Transforms.delete(this.editor, { at: node[1] });
        Transforms.insertNodes(this.editor, res.schema, {
          at: node[1],
          select: true,
        });
        return;
      }
      if (
        res.schema[0]?.type === 'paragraph' &&
        ['paragraph', 'table-cell'].includes(node[0].type)
      ) {
        const first = res.schema.shift();
        Editor.insertNode(this.editor, first.children);
      }
      if (res.schema.length) {
        if (['code-line', 'table-cell'].includes(node[0].type)) {
          const [block] = Editor.nodes<any>(this.editor, {
            match: (n) => ['table', 'code', 'paragraph'].includes(n.type),
            mode: 'lowest',
          });
          Transforms.insertNodes(this.editor, res.schema, {
            at: Path.next(block[1]),
            select: true,
          });
        } else {
          Transforms.insertNodes(this.editor, res.schema, {
            at: Path.next(node[1]),
            select: true,
          });
        }
      }
    }
    setTimeout(() => {
      runInAction(
        () => (this.store!.refreshHighlight = !this.store!.refreshHighlight),
      );
    }, 100);
  }

  head(level: number) {
    const [node] = this.curNodes;
    if (
      node &&
      ['paragraph', 'head'].includes(node[0].type) &&
      EditorUtils.isTop(this.editor, node[1])
    ) {
      Transforms.setNodes(
        this.editor,
        { type: 'head', level },
        { at: node[1] },
      );
    }
  }

  paragraph() {
    const [node] = this.curNodes;
    if (node && ['head'].includes(node[0].type)) {
      Transforms.setNodes(this.editor, { type: 'paragraph' }, { at: node[1] });
    }
  }

  increaseHead() {
    const [node] = this.curNodes;
    if (
      node &&
      ['paragraph', 'head'].includes(node[0].type) &&
      EditorUtils.isTop(this.editor, node[1])
    ) {
      if (node[0].type === 'paragraph') {
        Transforms.setNodes(
          this.editor,
          { type: 'head', level: 4 },
          { at: node[1] },
        );
      } else if (node[0].level === 1) {
        Transforms.setNodes(
          this.editor,
          { type: 'paragraph' },
          { at: node[1] },
        );
      } else {
        Transforms.setNodes(
          this.editor,
          { level: node[0].level - 1 },
          { at: node[1] },
        );
      }
    }
  }

  decreaseHead() {
    const [node] = this.curNodes;
    if (
      node &&
      ['paragraph', 'head'].includes(node[0].type) &&
      EditorUtils.isTop(this.editor, node[1])
    ) {
      if (node[0].type === 'paragraph') {
        Transforms.setNodes(
          this.editor,
          { type: 'head', level: 1 },
          { at: node[1] },
        );
      } else if (node[0].level === 4) {
        Transforms.setNodes(
          this.editor,
          { type: 'paragraph' },
          { at: node[1] },
        );
      } else {
        Transforms.setNodes(
          this.editor,
          { level: node[0].level + 1 },
          { at: node[1] },
        );
      }
    }
  }

  insertQuote() {
    const [node] = this.curNodes;
    if (!['paragraph', 'head'].includes(node[0].type)) return;
    if (Node.parent(this.editor, node[1]).type === 'blockquote') {
      Transforms.unwrapNodes(this.editor, { at: Path.parent(node[1]) });
      return;
    }
    if (node[0].type === 'head') {
      Transforms.setNodes(
        this.editor,
        {
          type: 'paragraph',
        },
        { at: node[1] },
      );
    }
    Transforms.wrapNodes(this.editor, {
      type: 'blockquote',
      children: [],
    });
  }

  insertTable() {
    const [node] = this.curNodes;
    if (node && ['paragraph', 'head'].includes(node[0].type)) {
      const path =
        node[0].type === 'paragraph' && !Node.string(node[0])
          ? node[1]
          : Path.next(node[1]);
      Transforms.insertNodes(
        this.editor,
        {
          type: 'table',
          children: [
            {
              type: 'table-row',
              children: [
                { type: 'table-cell', title: true, children: [{ text: '' }] },
                {
                  type: 'table-cell',
                  title: true,
                  children: [{ text: '' }],
                },
                { type: 'table-cell', title: true, children: [{ text: '' }] },
              ],
            },
            {
              type: 'table-row',
              children: [
                { type: 'table-cell', children: [{ text: '' }] },
                {
                  type: 'table-cell',
                  children: [{ text: '' }],
                },
                { type: 'table-cell', children: [{ text: '' }] },
              ],
            },
            {
              type: 'table-row',
              children: [
                { type: 'table-cell', children: [{ text: '' }] },
                {
                  type: 'table-cell',
                  children: [{ text: '' }],
                },
                { type: 'table-cell', children: [{ text: '' }] },
              ],
            },
          ],
        },
        { at: path },
      );
      if (node[0].type === 'paragraph' && !Node.string(node[0])) {
        Transforms.delete(this.editor, { at: Path.next(path) });
      }
      Transforms.select(this.editor, Editor.start(this.editor, path));
    }
  }

  insertCode(type?: 'mermaid' | 'html') {
    const [node] = this.curNodes;
    if (node && ['paragraph', 'head'].includes(node[0].type)) {
      const path =
        node[0].type === 'paragraph' && !Node.string(node[0])
          ? node[1]
          : Path.next(node[1]);
      let children = [{ type: 'code-line', children: [{ text: '' }] }];
      let lang = '';
      if (type === 'mermaid') {
        lang = 'mermaid';
        children = 'flowchart TD\n    Start --> Stop'.split('\n').map((c) => ({
          type: 'code-line',
          children: [{ text: c }],
        }));
      }

      if (type === 'html') {
        lang = 'html';
        children = [
          {
            type: 'code-line',
            children: [{ text: '<div style="text-align:center">text</div>' }],
          },
        ];
      }
      Transforms.insertNodes(
        this.editor,
        {
          type: 'code',
          language: lang ? lang : undefined,
          children: children,
          render: type === 'html' ? true : undefined,
        },
        { at: path },
      );

      Transforms.select(this.editor, Editor.end(this.editor, path));
    }
  }

  horizontalLine() {
    const [node] = this.curNodes;
    if (node && ['paragraph', 'head'].includes(node[0].type)) {
      const path =
        node[0].type === 'paragraph' && !Node.string(node[0])
          ? node[1]
          : Path.next(node[1]);
      Transforms.insertNodes(
        this.editor,
        {
          type: 'hr',
          children: [{ text: '' }],
        },
        { at: path },
      );
      if (Editor.hasPath(this.editor, Path.next(path))) {
        Transforms.select(
          this.editor,
          Editor.start(this.editor, Path.next(path)),
        );
      } else {
        Transforms.insertNodes(
          this.editor,
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
          { at: Path.next(path), select: true },
        );
      }
    }
  }

  list(mode: 'ordered' | 'unordered' | 'task') {
    const [node] = this.curNodes;
    if (node && ['paragraph'].includes(node[0].type)) {
      const parent = Editor.parent(this.editor, node[1]);
      if (parent[0].type === 'list-item' && !Path.hasPrevious(node[1])) {
        Transforms.setNodes(
          this.editor,
          {
            order: mode === 'ordered',
            task: mode === 'task',
          },
          { at: Path.parent(parent[1]) },
        );
        const listItems = Array.from<any>(
          Editor.nodes(this.editor, {
            match: (n) => n.type === 'list-item',
            at: Path.parent(parent[1]),
            reverse: true,
            mode: 'lowest',
          }),
        );
        Transforms.setNodes(
          this.editor,
          { start: undefined },
          { at: Path.parent(parent[1]) },
        );
        for (let l of listItems) {
          Transforms.setNodes(
            this.editor,
            { checked: mode === 'task' ? l[0].checked || false : undefined },
            { at: l[1] },
          );
        }
      } else {
        const text = EditorUtils.cutText(
          this.editor,
          Editor.start(this.editor, node[1]),
        );
        Transforms.delete(this.editor, { at: node[1] });
        Transforms.insertNodes(
          this.editor,
          {
            type: 'list',
            order: mode === 'ordered',
            task: mode === 'task',
            children: [
              {
                type: 'list-item',
                checked: mode === 'task' ? false : undefined,
                children: [{ type: 'paragraph', children: text }],
              },
            ],
          },
          { at: node[1], select: true },
        );
      }
    }
  }

  format(type: string) {
    EditorUtils.toggleFormat(this!.editor, type);
  }

  clear() {
    if (this.editor.selection)
      EditorUtils.clearMarks(
        this.editor,
        !Range.isCollapsed(this.editor.selection),
      );
  }

  image() {
    runInAction(() => {
      this.store.openInsertNetworkImage = true;
    });
  }

  localImage(type: 'image' | 'video' = 'image') {}

  insertMedia() {
    EditorUtils.blur(this.store.editor);
    this.store.openInsertNetworkImage = true;
  }

  undo() {
    try {
      this.store.editor.undo();
    } catch (e) {}
  }

  redo() {
    try {
      this.store.editor.redo();
    } catch (e) {}
  }
}

export const keyTask$ = new Subject<{
  key: Methods<KeyboardTask>;
  args?: any[];
}>();

const keyMap: [string, Methods<KeyboardTask>, any[]?, boolean?][] = [
  ['mod+shift+l', 'selectLine'],
  ['mod+e', 'selectFormat'],
  ['mod+d', 'selectWord'],
  ['mod+a', 'selectAll'],
  ['mod+option+v', 'pasteMarkdownCode'],
  ['mod+shift+v', 'pastePlainText'],
  ['mod+1', 'head', [1]],
  ['mod+2', 'head', [2]],
  ['mod+3', 'head', [3]],
  ['mod+4', 'head', [4]],
  ['mod+0', 'paragraph'],
  ['mod+]', 'increaseHead'],
  ['mod+[', 'decreaseHead'],
  ['option+q', 'insertQuote'],
  ['mod+option+t', 'insertTable'],
  ['mod+option+c', 'insertCode'],
  ['mod+option+/', 'horizontalLine'],
  ['mod+option+o', 'list', ['ordered']],
  ['mod+option+u', 'list', ['unordered']],
  ['mod+option+s', 'list', ['task']],
  ['mod+b', 'format', ['bold']],
  ['mod+i', 'format', ['italic']],
  ['mod+shift+s', 'format', ['strikethrough']],
  ['option+`', 'format', ['code']],
  ['mod+\\', 'clear'],
  ['mod+option+p', 'image'],
  ['mod+p', 'localImage'],
  ['mod+shift+p', 'insertMedia'],
  ['mod+option+m', 'insertCode', ['mermaid']],
];

export const useSystemKeyboard = (store: EditorStore) => {
  const task = new KeyboardTask(store);
  useSubject(keyTask$, ({ key, args }) => {
    // @ts-ignore
    task[key](...(args || []));
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keydown = useCallback(
    action((e: KeyboardEvent) => {
      if (!store) return;

      if (isHotkey('esc', e)) {
        if (store.openSearch) {
          store.setOpenSearch(false);
        }
      }
      if (isHotkey('mod+c', e) || isHotkey('mod+x', e)) {
        const [node] = Editor.nodes<MediaNode | AttachNode>(store.editor, {
          mode: 'lowest',
          match: (m) =>
            Element.isElement(m) && (m.type === 'media' || m.type === 'attach'),
        });
        if (!node) return;
        let readlUrl = node[0].url as string;

        if (node[0].type === 'media') {
          const url = `media://file?url=${readlUrl}&height=${
            node[0].height || ''
          }`;
          window.api.copyToClipboard(url);
          if (isHotkey('mod+x', e)) {
            Transforms.delete(store.editor, { at: node[1] });
            ReactEditor.focus(store.editor);
          }
        }
        if (node[0].type === 'attach') {
          const url = `attach://file?size=${node[0].size}&name=${node[0].name}&url=${node[0].url}`;
          window.api.copyToClipboard(url);
          if (isHotkey('mod+x', e)) {
            Transforms.delete(store.editor, { at: node[1] });
            ReactEditor.focus(store.editor);
          }
        }
      }

      if (isHotkey('backspace', e)) {
        if (!store.focus) return;
        const [node] = task.curNodes;
        if (node?.[0].type === 'media') {
          e.preventDefault();
          Transforms.removeNodes(task.editor, { at: node[1] });
          Transforms.insertNodes(task.editor, EditorUtils.p, {
            at: node[1],
            select: true,
          });
          ReactEditor.focus(task.editor);
        }
      }
      if (isHotkey('arrowUp', e) || isHotkey('arrowDown', e)) {
        const [node] = task.curNodes;
        if (node?.[0].type === 'media') {
          e.preventDefault();
          if (isHotkey('arrowUp', e)) {
            Transforms.select(
              task.editor,
              Editor.end(
                task.editor,
                EditorUtils.findPrev(task.editor, node[1]),
              ),
            );
          } else {
            Transforms.select(
              task.editor,
              Editor.start(
                task.editor,
                EditorUtils.findNext(task.editor, node[1]),
              ),
            );
          }
          ReactEditor.focus(task.editor);
        }
      }
      for (let key of keyMap) {
        if (isHotkey(key[0], e)) {
          e.preventDefault();
          e.stopPropagation();
          if (!key[3] && !store.focus) return;
          // @ts-ignore
          task[key[1]](...(key[2] || []));
          break;
        }
      }
    }),
    [],
  );

  useEffect(() => {
    window.addEventListener('keydown', keydown);
    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, []);
};
