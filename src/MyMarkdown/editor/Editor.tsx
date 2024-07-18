/* eslint-disable react/no-children-prop */
import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { isAbsolute, join, relative } from 'path';
import React, { useCallback, useEffect, useRef } from 'react';
import { Editor, Element, Node, Range, Transforms } from 'slate';
import { Editable, Slate } from 'slate-react';
import { IFileItem } from '../index';
import { MElement, MLeaf } from './elements';
import { htmlParser } from './plugins/htmlParser';
import { clearAllCodeCache } from './plugins/useHighlight';
import { useKeyboard } from './plugins/useKeyboard';
import { useOnchange } from './plugins/useOnchange';
import { useEditorStore } from './store';
import { mediaType } from './utils/dom';
import { EditorUtils } from './utils/editorUtils';
import { toUnixPath } from './utils/path';

export const MEditor = observer(({ note }: { note: IFileItem }) => {
  const store = useEditorStore();

  const changedMark = useRef(false);
  const editor = store.editor;
  const value = useRef<any[]>([EditorUtils.p]);
  const saveTimer = useRef(0);
  const nodeRef = useRef<IFileItem>();
  const renderElement = useCallback(
    (props: any) => <MElement {...props} children={props.children} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: any) => <MLeaf {...props} children={props.children} />,
    [],
  );
  const keydown = useKeyboard(store);
  const onChange = useOnchange(editor, store);
  const first = useRef(true);
  const save = useCallback(async () => {}, [note]);

  const initialNote = useCallback(async () => {
    clearTimeout(saveTimer.current);
    if (note) {
      nodeRef.current = note;
      store.setState((state) => {
        state.pauseCodeHighlight = true;
      });
      first.current = true;
      store.initializing = true;
      try {
        EditorUtils.reset(
          editor,
          note.schema?.length ? note.schema : undefined,
          note.history || true,
        );
        clearAllCodeCache(editor);
      } catch (e) {
        EditorUtils.deleteAll(editor);
      }
      requestIdleCallback(() => {
        store.initializing = false;
        store.setState((state) => (state.pauseCodeHighlight = false));
        requestIdleCallback(() => {
          store.setState((state) => (state.refreshHighlight = !state.refreshHighlight));
        });
      });
    } else {
      nodeRef.current = undefined;
    }
  }, [note]);

  useEffect(() => {
    if (nodeRef.current !== note) {
      initialNote();
    }
  }, [note, editor]);

  const change = useCallback(
    (v: any[]) => {
      if (first.current) {
        setTimeout(() => {
          first.current = false;
        }, 100);
        return;
      }
      value.current = v;
      onChange(v, editor.operations);
      if (note) {
        note.schema = v;
        note.history = editor.history;

        // @ts-ignore
        note.sel = editor.selection;
      }
      if (editor.operations[0]?.type === 'set_selection') {
        try {
          runInAction(() => (store.openLangCompletion = false));
        } catch (e) {}
      }
      if (!editor.operations?.every((o) => o.type === 'set_selection')) {
        if (!changedMark.current) {
          changedMark.current = true;
        }
        runInAction(() => {
          note.refresh = !note.refresh;
        });
        clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(() => {
          save();
        }, 3000);
      }
    },
    [note],
  );

  const checkEnd = useCallback(
    (e: React.MouseEvent) => {
      if (!store.focus) {
        store.editor.selection = null;
      }
      const target = e.target as HTMLDivElement;
      if (target.dataset.slateEditor) {
        const top = (target.lastElementChild as HTMLElement)?.offsetTop;
        if (store.container && store.container.scrollTop + e.clientY - 60 > top) {
          if (EditorUtils.checkEnd(editor)) {
            e.preventDefault();
          }
        }
      }
    },
    [note],
  );

  const drop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const node = note;
      if (!node.folder) {
        const type = mediaType(node.filePath);
        if (node.ext === 'md' || type === 'other') {
          Transforms.insertNodes(store.editor, {
            text: node.filename,
            url: toUnixPath(relative(join(note.filePath, '..'), node.filePath)),
          });
        } else {
          EditorUtils.focus(store.editor);
          const path = EditorUtils.findMediaInsertPath(store.editor);
          if (path) {
            Transforms.insertNodes(
              store.editor,
              {
                type: 'media',
                url: toUnixPath(relative(join(note.filePath, '..'), node.filePath)),
                children: [{ text: '' }],
              },
              { at: path, select: true },
            );
          }
        }
        return;
      }
    },
    [note],
  );

  const focus = useCallback(() => {
    store.setState((state) => (state.focus = true));
    store.hideRanges();
  }, []);

  const blur = useCallback(() => {
    store.setState((state) => {
      state.focus = false;
      state.tableCellNode = null;
      state.refreshTableAttr = !state.refreshTableAttr;
      setTimeout(
        action(() => {
          store.openLangCompletion = false;
        }),
        30,
      );
    });
  }, []);

  const paste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (!Range.isCollapsed(store.editor.selection!)) {
        Transforms.delete(store.editor, { at: store.editor.selection! });
      }
      const text = await navigator.clipboard.readText();
      if (text) {
        try {
          if (text.startsWith('media://') || text.startsWith('attach://')) {
            const path = EditorUtils.findMediaInsertPath(store.editor);
            let insert = false;
            const urlObject = new URL(text);
            let url = urlObject.searchParams.get('url');
            if (url && !url.startsWith('http')) {
              url = toUnixPath(url);
            }
            if (path) {
              if (text.startsWith('media://')) {
                insert = true;
                Transforms.insertNodes(
                  store.editor,
                  {
                    type: 'media',
                    height: urlObject.searchParams.get('height')
                      ? +urlObject.searchParams.get('height')!
                      : undefined,
                    url: url || undefined,
                    children: [{ text: '' }],
                  },
                  { select: true, at: path },
                );
              }
              if (text.startsWith('attach://')) {
                insert = true;
                Transforms.insertNodes(
                  store.editor,
                  {
                    type: 'attach',
                    name: urlObject.searchParams.get('name'),
                    size: Number(urlObject.searchParams.get('size') || 0),
                    url: url || undefined,
                    children: [{ text: '' }],
                  },
                  { select: true, at: path },
                );
              }
              if (insert) {
                e.preventDefault();
                const next = Editor.next(store.editor, { at: path });
                if (next && next[0].type === 'paragraph' && !Node.string(next[0])) {
                  Transforms.delete(store.editor, { at: next[1] });
                }
              }
            }
          }
          if (text.startsWith('http') || isAbsolute(text)) {
            e.preventDefault();
            e.stopPropagation();
            if (['image', 'video', 'audio'].includes(mediaType(text))) {
              if (text.startsWith('http')) {
                const path = EditorUtils.findMediaInsertPath(store.editor);
                if (!path) return;
                Transforms.insertNodes(
                  store.editor,
                  {
                    type: 'media',
                    url: text,
                    children: [{ text: '' }],
                  },
                  { select: true, at: path },
                );
              }
            } else {
              store.insertLink(text);
            }
          }
        } catch (e) {
          console.log('paste text error', text, e);
        }
      }

      if (text) {
        //@ts-ignore
        const [node] = Editor.nodes<Element>(editor, {
          match: (n) => Element.isElement(n) && n.type === 'code',
        });
        if (node) {
          Transforms.insertFragment(
            editor,
            //@ts-ignore
            text.split('\n').map((c) => {
              return { type: 'code-line', children: [{ text: c.replace(/\t/g, ' '.repeat(2)) }] };
            }),
          );
          e.stopPropagation();
          e.preventDefault();
          return;
        }
      }
      let paste = e.clipboardData.getData('text/html');
      if (paste && htmlParser(editor, paste)) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    [note],
  );

  const compositionStart = useCallback((e: React.CompositionEvent) => {
    store.inputComposition = true;
    runInAction(() => (store.pauseCodeHighlight = true));
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      e.preventDefault();
    }
  }, []);

  const compositionEnd = useCallback((e: React.CompositionEvent) => {
    store.inputComposition = false;
    if (store.pauseCodeHighlight) runInAction(() => (store.pauseCodeHighlight = false));
  }, []);

  const onError = useCallback((e: React.SyntheticEvent) => {
    console.log('Editor error', e);
    //@ts-ignore
    if (import.meta.env.DEV) {
      console.warn('Editor exception', e);
    }
  }, []);

  return (
    <Slate editor={editor} initialValue={[EditorUtils.p]} onChange={change}>
      <Editable
        onError={onError}
        onDragOver={(e) => e.preventDefault()}
        readOnly={store.readonly}
        className={`edit-area  ${store.focus ? 'focus' : ''}`}
        style={{
          fontSize: 16,
        }}
        onMouseDown={checkEnd}
        onDrop={drop}
        onFocus={focus}
        onBlur={blur}
        onPaste={paste}
        onCompositionStart={compositionStart}
        onCompositionEnd={compositionEnd}
        renderElement={renderElement}
        onKeyDown={keydown}
        renderLeaf={renderLeaf}
      />
    </Slate>
  );
});
