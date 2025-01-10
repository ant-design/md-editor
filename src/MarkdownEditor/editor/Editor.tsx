/* eslint-disable react/no-children-prop */
import { message } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react';
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
import { copySelectedBlocks } from './plugins/copySelectedBlocks';
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
  EditorUtils,
  findLeafPath,
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
  } & MarkdownEditorProps) => {
    const { store, readonly } = useEditorStore();
    const changedMark = useRef(false);
    const editor = store.editor;
    const value = useRef<any[]>([EditorUtils.p]);
    const saveTimer = useRef(0);
    const nodeRef = useRef<IEditor>();

    const onKeyDown = useKeyboard(store);
    const onChange = useOnchange(editor, store, editorProps.onChange);
    const first = useRef(true);
    const highlight = useHighlight();
    const save = useCallback(async () => {}, [note]);

    const initialNote = useCallback(async () => {
      clearTimeout(saveTimer.current);
      if (note) {
        nodeRef.current = note;

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
        setTimeout(() => {
          store.initializing = false;
        }, 10);
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
        }

        if (!editor.operations?.every((o) => o.type === 'set_selection')) {
          if (!changedMark.current) {
            changedMark.current = true;
          }
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
        if (
          store.editor.selection &&
          store.editor.selection.anchor &&
          Editor.hasPath(store.editor, store.editor.selection.anchor.path)
        ) {
          if (!Range.isCollapsed(store.editor.selection!)) {
            Transforms.delete(store.editor, { at: store.editor.selection! });
          }
        }

        const types = event.clipboardData.types;
        console.log('types', types);
        if (types.includes('application/x-slate-fragment')) {
          const encoded = event.clipboardData.getData(
            'application/x-slate-fragment',
          );
          const decoded = decodeURIComponent(window.atob(encoded));
          const fragment = JSON.parse(decoded);
          Transforms.insertFragment(store.editor, fragment);
          return;
        }

        if (types.includes('text/html')) {
          try {
            const html = await event.clipboardData.getData('text/html');

            const rtf = await event.clipboardData.getData('text/rtf');

            console.log('paste', html);
            if (html) {
              const success = await insertParsedHtmlNodes(
                editor,
                html,
                editorProps,
                rtf,
              );
              if (success) {
                return;
              }
            }
          } catch (error) {
            console.log('error', error);
          }
        }

        if (types.includes('Files')) {
          try {
            const fileList = event.clipboardData.files;
            if (fileList.length > 0) {
              const hideLoading = message.loading('Uploading...');
              try {
                const url = [];
                for await (const file of fileList) {
                  const serverUrl = await editorProps.image?.upload?.([file]);
                  url.push(serverUrl);
                }

                if (store.editor.selection?.focus.path) {
                  Transforms.delete(store.editor, {
                    at: store.editor.selection.focus.path!,
                  });
                }
                [url].flat(2).forEach((u) => {
                  Transforms.insertNodes(
                    store.editor,
                    {
                      type: 'media',
                      url: u,
                      children: [
                        {
                          type: 'card-before',
                          children: [{ text: '' }],
                        },
                        {
                          type: 'card-after',
                          children: [{ text: '' }],
                        },
                      ],
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
        }

        if (types.includes('text/plain')) {
          const text = event.clipboardData.getData('text/plain');
          const selection = store.editor.selection;

          // 如果是表格或者代码块，直接插入文本
          if (selection?.focus) {
            const rangeNodes = Editor.node(editor, [
              selection.focus.path.at(0)!,
            ]);
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

          try {
            if (text.startsWith('media://') || text.startsWith('attach://')) {
              const path = EditorUtils.findMediaInsertPath(store.editor);
              const urlObject = new URL(text);
              let url = urlObject.searchParams.get('url');
              if (
                url &&
                !url.startsWith('http') &&
                !url.startsWith('blob:http')
              ) {
                url = toUnixPath(url);
              }
              if (path) {
                if (text.startsWith('media://')) {
                  Transforms.insertNodes(
                    store.editor,
                    {
                      type: 'media',
                      height: urlObject.searchParams.get('height')
                        ? +urlObject.searchParams.get('height')!
                        : undefined,
                      url: url || undefined,
                      children: [
                        {
                          type: 'card-before',
                          children: [{ text: '' }],
                        },
                        {
                          type: 'card-after',
                          children: [{ text: '' }],
                        },
                      ],
                    },
                    { select: true, at: path },
                  );
                  event.preventDefault();
                  const next = Editor.next(store.editor, { at: path });
                  if (
                    next &&
                    next[0].type === 'paragraph' &&
                    !Node.string(next[0])
                  ) {
                    Transforms.delete(store.editor, { at: next[1] });
                  }
                  return;
                }
                if (text.startsWith('attach://')) {
                  Transforms.insertNodes(
                    store.editor,
                    {
                      type: 'attach',
                      name: urlObject.searchParams.get('name'),
                      size: Number(urlObject.searchParams.get('size') || 0),
                      url: url || undefined,
                      children: [
                        {
                          type: 'card-before',
                          children: [{ text: '' }],
                        },
                        {
                          type: 'card-after',
                          children: [{ text: '' }],
                        },
                      ],
                    },
                    { select: true, at: path },
                  );
                  event.preventDefault();
                  const next = Editor.next(store.editor, { at: path });
                  if (
                    next &&
                    next[0].type === 'paragraph' &&
                    !Node.string(next[0])
                  ) {
                    Transforms.delete(store.editor, { at: next[1] });
                  }
                  return;
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
                      children: [
                        {
                          type: 'card-before',
                          children: [{ text: '' }],
                        },
                        {
                          type: 'card-after',
                          children: [{ text: '' }],
                        },
                      ],
                    },
                    { select: true, at: path },
                  );
                }
              } else {
                store.insertLink(text);
              }
              return;
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

          if (isMarkdown(text)) {
            parseMarkdownToNodesAndInsert(editor, text);
            return;
          }
          Transforms.insertText(editor, text);
        }

        if (hasEditableTarget(editor, event.target)) {
          ReactEditor.insertData(editor, event.clipboardData);
          return;
        }
      },
      [note],
    );

    /**
     * 处理输入法开始事件
     */
    const onCompositionStart = useCallback((e: React.CompositionEvent) => {
      store.inputComposition = true;
      if (editor.selection && Range.isCollapsed(editor.selection)) {
        e.preventDefault();
      }
    }, []);

    /**
     * 处理输入法结束事件
     */
    const onCompositionEnd = useCallback(() => {
      store.inputComposition = false;
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
      if (readonly) return 'readonly';
      return store.focus || !childrenIsEmpty ? 'focus' : '';
    }, [readonly, store.focus, !childrenIsEmpty]);

    const { wrapSSR, hashId } = useStyle(`${editorProps.prefixCls}-content`, {
      titlePlaceholderContent: editorProps.titlePlaceholderContent,
    });

    const baseClassName = `${editorProps.prefixCls}-content`;

    const commentMap = useMemo(() => {
      const map = new Map<string, Map<string, CommentDataType[]>>();
      editorProps?.comment?.commentList?.forEach((c) => {
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
    }, [editorProps?.comment?.commentList]);

    const elementRenderElement = (props: RenderElementProps) => {
      const defaultDom = (
        <MElement {...props} children={props.children} readonly={readonly} />
      );
      if (!eleItemRender) return defaultDom;
      return eleItemRender(props, defaultDom) as React.ReactElement;
    };

    const renderMarkdownLeaf = (props: any) => {
      return (
        <MLeaf
          {...props}
          fncProps={editorProps.fncProps}
          comment={editorProps?.comment}
          children={props.children}
          hashId={hashId}
        />
      );
    };
    const decorateFn = (e: any) => {
      const decorateList = highlight(e);
      if (!editorProps?.comment) return decorateList;
      if (editorProps?.comment?.enable === false) return decorateList;
      if (commentMap.size === 0) return decorateList;

      try {
        const ranges: BaseRange[] = [];
        const [, path] = e;
        const itemMap = commentMap.get(path.join(','));
        if (!itemMap) return decorateList;
        itemMap.forEach((itemList) => {
          const item = itemList[0];
          const { anchor, focus } = item.selection || {};
          if (!anchor || !focus) return decorateList;
          const AnchorPath = anchor.path;
          const FocusPath = focus.path;

          if (
            isPath(FocusPath) &&
            isPath(AnchorPath) &&
            Editor.hasPath(editor, anchor.path) &&
            Editor.hasPath(editor, focus.path)
          ) {
            const newSelection = {
              anchor: { ...anchor, path: findLeafPath(editor, AnchorPath) },
              focus: { ...focus, path: findLeafPath(editor, FocusPath) },
            };

            const fragment = Editor.fragment(editor, newSelection);
            if (fragment) {
              const str = Node.string({ children: fragment });
              const isStrEquals = str === item.refContent;
              const newAnchorPath = anchor.path;
              const newFocusPath = focus.path;

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
          }
        });
        return decorateList.concat(ranges);
      } catch (error) {
        console.log('error', error);
        return decorateList;
      }
    };
    return wrapSSR(
      <Slate editor={editor} initialValue={[EditorUtils.p]} onChange={change}>
        <SetNodeToDecorations />
        <Editable
          decorate={decorateFn}
          onError={onError}
          onDragOver={(e) => e.preventDefault()}
          readOnly={readonly}
          className={classNames(
            `${baseClassName}-${readonlyCls}`,
            `${baseClassName}`,
            editorProps.className,
            {
              [`${baseClassName}-report`]: reportMode,
              [`${baseClassName}-edit`]: !readonly,
            },
            hashId,
          )}
          style={
            reportMode
              ? {
                  fontSize: 16,
                  ...editorProps.style,
                }
              : {
                  fontSize: 14,
                  ...editorProps.style,
                }
          }
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
            copySelectedBlocks(editor);
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
