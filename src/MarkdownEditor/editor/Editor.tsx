/* eslint-disable react/no-children-prop */
import { message } from 'antd';
import classNames from 'classnames';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { BaseRange, Editor, Element, Node, Range, Transforms } from 'slate';
import { Editable, ReactEditor, RenderElementProps, Slate } from 'slate-react';
import {
  CommentDataType,
  Elements,
  IEditor,
  MarkdownEditorInstance,
  MarkdownEditorProps,
} from '../index';
import { MElement, MLeaf } from './elements';
import { insertParsedHtmlNodes } from './plugins/insertParsedHtmlNodes';
import { parseMarkdownToNodesAndInsert } from './plugins/parseMarkdownToNodesAndInsert';
import {
  clearAllCodeCache,
  SetNodeToDecorations,
  useHighlight,
} from './plugins/useHighlight';
import { useKeyboard } from './plugins/useKeyboard';
import { useOnchange } from './plugins/useOnchange';
import { useEditorStore } from './store';
import { useStyle } from './style';
import { isMarkdown } from './utils';
import { getMediaType } from './utils/dom';
import {
  calcPath,
  EditorUtils,
  getRelativePath,
  getSelectionFromDomSelection,
  hasEditableTarget,
  isEventHandled,
  isPath,
} from './utils/editorUtils';
import { toUnixPath } from './utils/path';

export const MEditor = observer(
  ({
    note,
    eleItemRender,
    reportMode,
    ...editorProps
  }: {
    note: IEditor;
    eleItemRender?: MarkdownEditorProps['eleItemRender'];
    onChange?: MarkdownEditorProps['onChange'];
    instance: MarkdownEditorInstance;
    className?: string;
    comment?: MarkdownEditorProps['comment'];
    prefixCls?: string;
    reportMode?: MarkdownEditorProps['reportMode'];
    titlePlaceholderContent?: string;
  }) => {
    const store = useEditorStore();

    const changedMark = useRef(false);
    const editor = store.editor;
    const value = useRef<any[]>([EditorUtils.p]);
    const saveTimer = useRef(0);
    const nodeRef = useRef<IEditor>();
    const elementRenderElement = useCallback((props: RenderElementProps) => {
      const defaultDom = <MElement {...props} children={props.children} />;
      if (!eleItemRender) return defaultDom;
      return eleItemRender(props, defaultDom) as React.ReactElement;
    }, []);

    const onKeyDown = useKeyboard(store);
    const onChange = useOnchange(editor, store, editorProps.onChange);
    const first = useRef(true);
    const highlight = useHighlight();
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
          if (
            store.container &&
            store.container.scrollTop + e.clientY - 60 > top
          ) {
            if (EditorUtils.checkEnd(editor)) {
              e.preventDefault();
            }
          }
        }
      },
      [note],
    );

    /**
     * 处理焦点事件, 隐藏所有的range
     * @description focus event
     */
    const onFocus = useCallback(() => {
      store.setState((state) => (state.focus = true));
      store.hideRanges();
    }, []);

    /**
     * 处理失去焦点事件,关掉所有的浮层
     * @description blur event
     * @param {React.FocusEvent<HTMLDivElement>} e
     */
    const onBlur = useCallback(() => {
      store.setState((state) => {
        state.focus = false;
        state.tableCellNode = null;
        state.refreshTableAttr = !state.refreshTableAttr;
      });
    }, []);

    /**
     * 处理粘贴事件，会把粘贴的内容转换为对应的节点
     * @description paste event
     * @param {React.ClipboardEvent<HTMLDivElement>} e
     */
    const onPaste = useCallback(
      async (event: React.ClipboardEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();

        if (!Range.isCollapsed(store.editor.selection!)) {
          if (store.editor.selection && store.editor.selection.anchor) {
            Transforms.delete(store.editor, { at: store.editor.selection! });
          }
        }

        const selection = store.editor.selection;
        const text = event.clipboardData.getData('text/plain');

        // 如果是表格或者代码块，直接插入文本
        if (selection?.focus) {
          const rangeNodes = Editor.node(editor, [selection.focus.path.at(0)!]);
          if (!rangeNodes) return;
          const rangeNode = rangeNodes.at(0) as Elements;
          if (
            rangeNode.type === 'table-cell' ||
            rangeNode.type === 'table-row' ||
            rangeNode.type === 'table' ||
            rangeNode.type === 'code' ||
            rangeNode.type === 'schema' ||
            rangeNode.type === 'apaasify' ||
            rangeNode.type === 'description'
          ) {
            Transforms.insertText(editor, text);
            return;
          }
        }

        if (isMarkdown(text)) {
          parseMarkdownToNodesAndInsert(editor, text);
          return;
        }

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
                event.preventDefault();
                const next = Editor.next(store.editor, { at: path });
                if (
                  next &&
                  next[0].type === 'paragraph' &&
                  !Node.string(next[0])
                ) {
                  Transforms.delete(store.editor, { at: next[1] });
                }
              }
            }
          }
          if (text.startsWith('http')) {
            event.preventDefault();
            event.stopPropagation();
            if (['image', 'video', 'audio'].includes(getMediaType(text))) {
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
        } catch (e) {}

        const [node] = Editor.nodes<Elements>(editor, {
          match: (n) => Element.isElement(n) && n.type === 'code',
        });

        if (node) {
          Transforms.insertFragment(
            editor,
            //@ts-ignore
            text.split('\n').map((c) => {
              return {
                type: 'code-line',
                children: [{ text: c.replace(/\t/g, ' '.repeat(2)) }],
              };
            }),
          );
          return;
        }

        try {
          const paste = await event.clipboardData.getData('text/html');
          if (paste) {
            const success = insertParsedHtmlNodes(editor, paste);
            if (success) {
              return;
            }
          }
        } catch (error) {
          console.log('error', error);
        }

        try {
          const fileList = event.clipboardData.files;
          if (fileList.length > 0) {
            const hideLoading = message.loading('Uploading...');
            try {
              const url = [];
              for (const file of fileList) {
                url.push(file);
              }

              if (store.editor.selection?.focus.path) {
                Transforms.delete(store.editor, {
                  at: store.editor.selection.focus.path!,
                });
              }
              [url].flat(1).forEach((u) => {
                Transforms.insertNodes(
                  store.editor,
                  {
                    type: 'media',
                    url: u,
                    children: [{ text: '' }],
                  },
                  {
                    select: true,
                    at: store.editor.selection
                      ? Editor.after(
                          store.editor,
                          store.editor.selection.focus.path,
                        )!
                      : Editor.end(store.editor, []),
                  },
                );
              });
              message.success('Upload success');
            } catch (error) {
              console.log('error', error);
            } finally {
              hideLoading();
            }

            event.preventDefault();
            event.stopPropagation();
            return;
          }
        } catch (error) {
          console.log('error', error);
        }
        if (hasEditableTarget(editor, event.target)) {
          ReactEditor.insertData(editor, event.clipboardData);
          return;
        }

        Transforms.removeNodes(editor, {
          at: editor.selection!,
          match: (n) => n.type === 'media' || n.type === 'attach',
        });
        Transforms.insertText(editor, text);
      },
      [note],
    );

    /**
     * 处理输入法开始事件
     */
    const onCompositionStart = useCallback((e: React.CompositionEvent) => {
      store.inputComposition = true;
      runInAction(() => (store.pauseCodeHighlight = true));
      if (editor.selection && Range.isCollapsed(editor.selection)) {
        e.preventDefault();
      }
    }, []);

    /**
     * 处理输入法结束事件
     */
    const onCompositionEnd = useCallback(() => {
      store.inputComposition = false;
      if (store.pauseCodeHighlight)
        runInAction(() => (store.pauseCodeHighlight = false));
    }, []);

    const onError = useCallback((e: React.SyntheticEvent) => {
      console.log('Editor error', e);
    }, []);

    const childrenIsEmpty = useMemo(() => {
      if (!editor.children) return false;
      if (!Array.isArray(editor.children)) return;
      if (editor.children.length === 0) return false;
      return (
        value.current.filter(
          (v) => v.type === 'paragraph' && v.children?.at?.(0)?.text === '',
        ).length < 1
      );
    }, [editor.children]);

    const readonlyCls = useMemo(() => {
      if (store.readonly) return 'readonly';
      return store.focus || !childrenIsEmpty ? 'focus' : '';
    }, [store.readonly, store.focus, !childrenIsEmpty]);

    const { wrapSSR, hashId } = useStyle(`${editorProps.prefixCls}-content`, {
      titlePlaceholderContent: editorProps.titlePlaceholderContent,
    });

    const baseClassName = `${editorProps.prefixCls}-content`;
    const commentMap = useMemo(() => {
      const map = new Map<string, Map<string, CommentDataType[]>>();
      editorProps.comment?.commentList?.forEach((c) => {
        c.updateTime = Date.now();
        const path = c.path.join(',');
        if (map.has(path)) {
          const childrenMap = map.get(path);
          const selection = JSON.stringify(c.selection);
          if (childrenMap?.has(selection)) {
            childrenMap.set(selection, [
              ...(childrenMap.get(selection) || []),
              c,
            ]);
            map.set(path, childrenMap);
            return;
          } else if (childrenMap) {
            childrenMap?.set(selection, [c]);
            map.set(path, childrenMap);
            return;
          }
        }
        const childrenMap = new Map<string, CommentDataType[]>();
        childrenMap.set(JSON.stringify(c.selection), [c]);
        map.set(path, childrenMap);
      });
      return map;
    }, [editorProps.comment?.commentList]);

    const renderMarkdownLeaf = useCallback(
      (props: any) => {
        return (
          <MLeaf
            {...props}
            comment={editorProps.comment}
            children={props.children}
            hashId={hashId}
          />
        );
      },
      [commentMap],
    );

    const decorateFn = useCallback(
      (e: any) => {
        const decorateList = highlight(e);
        if (!editorProps.comment) return decorateList;
        if (editorProps?.comment?.enable === false) return decorateList;
        if (commentMap.size === 0) return decorateList;
        const ranges: BaseRange[] = [];
        const [, path] = e;
        const itemMap = commentMap.get(path.join(','));
        if (!itemMap) return decorateList;
        let newPath = path;
        if (Array.isArray(path) && path[path.length - 1] !== 0) {
          newPath = [...path, 0];
        }
        itemMap.forEach((itemList) => {
          const item = itemList[0];
          const { anchor, focus } = item.selection || {};
          if (!anchor || !focus) return decorateList;
          const relativePath = getRelativePath(newPath, anchor.path);
          const AnchorPath = calcPath(anchor.path, relativePath);
          const FocusPath = calcPath(focus.path, relativePath);

          if (
            isPath(FocusPath) &&
            isPath(AnchorPath) &&
            Editor.hasPath(editor, AnchorPath) &&
            Editor.hasPath(editor, FocusPath)
          ) {
            const newSelection = {
              anchor: { ...anchor, path: AnchorPath },
              focus: { ...focus, path: FocusPath },
            };
            const fragement = Editor.fragment(editor, newSelection);
            const str = Node.string({ children: fragement });
            const isStrEquals = str === item.refContent;
            const relativePath = getRelativePath(newPath, anchor.path);
            const newAnchorPath = calcPath(anchor.path, relativePath);
            const newFocusPath = calcPath(focus.path, relativePath);

            if (
              isStrEquals &&
              isPath(newFocusPath) &&
              isPath(newAnchorPath) &&
              Editor.hasPath(editor, newAnchorPath) &&
              Editor.hasPath(editor, newFocusPath)
            ) {
              ranges.push({
                anchor: { path: newAnchorPath, offset: anchor.offset },
                focus: { path: newFocusPath, offset: focus.offset },
                data: itemList,
                comment: true,
                updateTime: itemList
                  .map((i) => i.updateTime)
                  .sort()
                  .join(','),
              } as Range);
            }
          }
        });

        return decorateList.concat(ranges);
      },
      [commentMap, highlight],
    );
    return wrapSSR(
      <Slate editor={editor} initialValue={[EditorUtils.p]} onChange={change}>
        <SetNodeToDecorations />
        <Editable
          decorate={decorateFn}
          onError={onError}
          onDragOver={(e) => e.preventDefault()}
          readOnly={store.readonly}
          className={classNames(
            `${baseClassName}-${readonlyCls}`,
            `${baseClassName}`,
            editorProps.className,
            {
              [`${baseClassName}-report`]: reportMode,
            },
            hashId,
          )}
          style={
            reportMode
              ? {
                  fontSize: 16,
                }
              : {
                  fontSize: 14,
                }
          }
          autoFocus
          onMouseDown={checkEnd}
          onFocus={onFocus}
          onBlur={onBlur}
          onPaste={onPaste}
          onCopy={(event: React.ClipboardEvent<HTMLDivElement>) => {
            if (isEventHandled(event)) {
              return;
            }
            if (!hasEditableTarget(editor, event.target)) {
              const domSelection = window.getSelection();
              editor.selection = getSelectionFromDomSelection(
                editor,
                domSelection!,
              );
              if (!editor.selection) {
                return;
              }
            }
            event.preventDefault();
            ReactEditor.setFragmentData(editor, event.clipboardData, 'copy');
          }}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          renderElement={elementRenderElement}
          onKeyDown={onKeyDown}
          renderLeaf={renderMarkdownLeaf}
        />
      </Slate>,
    );
  },
);
