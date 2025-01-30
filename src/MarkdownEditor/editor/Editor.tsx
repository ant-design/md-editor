/* eslint-disable react/no-children-prop */
import { message } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useRef } from 'react';
import { BaseRange, Editor, Element, Node, Range, Transforms } from 'slate';
import {
  CommentDataType,
  Elements,
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
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  Slate,
} from './slate-react';
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
    eleItemRender,
    reportMode,
    instance,
    ...editorProps
  }: {
    eleItemRender?: MarkdownEditorProps['eleItemRender'];
    onChange?: MarkdownEditorProps['onChange'];
    instance: MarkdownEditorInstance;
    className?: string;
    comment?: MarkdownEditorProps['comment'];
    prefixCls?: string;
    reportMode?: MarkdownEditorProps['reportMode'];
    titlePlaceholderContent?: string;
  } & MarkdownEditorProps) => {
    const { store, markdownEditorRef, readonly } = useEditorStore();
    const changedMark = useRef(false);
    const value = useRef<any[]>([EditorUtils.p]);
    const nodeRef = useRef<MarkdownEditorInstance>();

    const onKeyDown = useKeyboard(store, markdownEditorRef);
    const onChange = useOnchange(
      markdownEditorRef.current,
      store,
      editorProps.onChange,
    );
    const first = useRef(true);
    const highlight = useHighlight();

    /**
     * 初始化编辑器
     */
    const initialNote = async () => {
      if (instance) {
        nodeRef.current = instance;

        first.current = true;
        store.initializing = true;
        try {
          EditorUtils.reset(
            markdownEditorRef.current,
            editorProps.initSchemaValue?.length
              ? editorProps.initSchemaValue
              : undefined,
          );
          clearAllCodeCache(markdownEditorRef.current);
        } catch (e) {
          EditorUtils.deleteAll(markdownEditorRef.current);
        }
        setTimeout(() => {
          store.initializing = false;
        }, 10);
      } else {
        nodeRef.current = undefined;
      }
    };

    useEffect(() => {
      if (nodeRef.current !== instance) {
        initialNote();
      }
    }, [instance, markdownEditorRef.current]);

    const change = (v: any[]) => {
      if (first.current) {
        setTimeout(() => {
          first.current = false;
        }, 100);
        return;
      }
      value.current = v;
      onChange(v, markdownEditorRef.current.operations);

      if (
        !markdownEditorRef.current.operations?.every(
          (o) => o.type === 'set_selection',
        )
      ) {
        if (!changedMark.current) {
          changedMark.current = true;
        }
      }
    };

    const checkEnd = (e: React.MouseEvent) => {
      if (!store.focus) {
        markdownEditorRef.current.selection = null;
      }
      const target = e.target as HTMLDivElement;
      if (target.dataset.slateEditor) {
        const top = (target.lastElementChild as HTMLElement)?.offsetTop;
        if (
          store.container &&
          store.container.scrollTop + e.clientY - 60 > top
        ) {
          if (EditorUtils.checkEnd(markdownEditorRef.current)) {
            e.preventDefault();
          }
        }
      }
    };

    /**
     * 处理焦点事件, 隐藏所有的range
     * @description focus event
     */
    const onFocus = () => {
      store.setState((state) => (state.focus = true));
    };

    /**
     * 处理失去焦点事件,关掉所有的浮层
     * @description blur event
     * @param {React.FocusEvent<HTMLDivElement>} e
     */
    const onBlur = () => {
      store.setState((state) => {
        state.focus = false;
        state.tableCellNode = null;
      });
    };

    /**
     * 处理粘贴事件，会把粘贴的内容转换为对应的节点
     * @description paste event
     * @param {React.ClipboardEvent<HTMLDivElement>} e
     */
    const onPaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
      event.stopPropagation();
      event.preventDefault();
      const currentTextSelection = markdownEditorRef.current.selection;
      if (
        currentTextSelection &&
        currentTextSelection.anchor &&
        Editor.hasPath(
          markdownEditorRef.current,
          currentTextSelection.anchor.path,
        )
      ) {
        if (!Range.isCollapsed(currentTextSelection)) {
          Transforms.delete(markdownEditorRef.current, {
            at: currentTextSelection!,
            reverse: true,
          });
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
        Transforms.insertFragment(markdownEditorRef.current, fragment);
        return;
      }

      if (types.includes('text/html')) {
        try {
          const html = await event.clipboardData.getData('text/html');

          const rtf = await event.clipboardData.getData('text/rtf');

          if (html) {
            const success = await insertParsedHtmlNodes(
              markdownEditorRef.current,
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
              const selection =
                markdownEditorRef.current?.selection?.focus?.path;
              const at = selection
                ? EditorUtils.findNext(markdownEditorRef.current, selection)!
                : undefined;

              [url].flat(2).forEach((u) => {
                if (!u) return null;
                console.log('---->', at);
                Transforms.insertNodes(
                  markdownEditorRef.current,
                  EditorUtils.createMediaNode(u, 'image'),
                  {
                    at: [
                      at
                        ? at[0]
                        : markdownEditorRef.current.children.length - 1,
                    ],
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
        return;
      }

      if (types.includes('text/plain')) {
        const text = event.clipboardData.getData('text/plain');
        const selection = markdownEditorRef.current.selection;

        // 如果是表格或者代码块，直接插入文本
        if (selection?.focus) {
          const rangeNodes = Editor.node(markdownEditorRef.current, [
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
            Transforms.insertText(markdownEditorRef.current, text);
            return;
          }
        }

        try {
          if (text.startsWith('media://') || text.startsWith('attach://')) {
            const path = EditorUtils.findMediaInsertPath(
              markdownEditorRef.current,
            );
            const urlObject = new URL(text);
            let url = urlObject.searchParams.get('url');
            if (
              url &&
              !url.startsWith('http') &&
              !url.startsWith('blob:http')
            ) {
              url = toUnixPath(url);
            }
            if (path && url) {
              if (text.startsWith('media://')) {
                Transforms.insertNodes(
                  markdownEditorRef.current,
                  EditorUtils.createMediaNode(url!, 'image'),
                  { select: true, at: path },
                );
                event.preventDefault();
                const next = Editor.next(markdownEditorRef.current, {
                  at: path,
                });
                if (
                  next &&
                  next[0].type === 'paragraph' &&
                  !Node.string(next[0])
                ) {
                  Transforms.delete(markdownEditorRef.current, {
                    at: next[1],
                  });
                }
                return;
              }
              if (text.startsWith('attach://')) {
                Transforms.insertNodes(
                  markdownEditorRef.current,
                  {
                    type: 'attach',
                    name: urlObject.searchParams.get('name'),
                    size: Number(urlObject.searchParams.get('size') || 0),
                    url: url || undefined,
                  },
                  { select: true, at: path },
                );
                event.preventDefault();
                const next = Editor.next(markdownEditorRef.current, {
                  at: path,
                });
                if (
                  next &&
                  next[0].type === 'paragraph' &&
                  !Node.string(next[0])
                ) {
                  Transforms.delete(markdownEditorRef.current, {
                    at: next[1],
                  });
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
                const path = EditorUtils.findMediaInsertPath(
                  markdownEditorRef.current,
                );
                if (!path) return;
                Transforms.insertNodes(
                  markdownEditorRef.current,
                  EditorUtils.createMediaNode(text, 'image'),
                  { select: true, at: path },
                );
              }
            } else {
              store.insertLink(text);
            }
            return;
          }
        } catch (e) {}

        const [node] = Editor.nodes<Elements>(markdownEditorRef.current, {
          match: (n) => Element.isElement(n) && n.type === 'code',
        });

        if (node) {
          Transforms.insertFragment(
            markdownEditorRef.current,
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
          parseMarkdownToNodesAndInsert(markdownEditorRef.current, text);
          return;
        }
        Transforms.insertText(markdownEditorRef.current, text);
      }

      if (hasEditableTarget(markdownEditorRef.current, event.target)) {
        ReactEditor.insertData(markdownEditorRef.current, event.clipboardData);
        return;
      }
      return;
    };

    /**
     * 处理输入法开始事件
     */
    const onCompositionStart = (e: React.CompositionEvent) => {
      store.inputComposition = true;
      if (
        markdownEditorRef.current.selection &&
        Range.isCollapsed(markdownEditorRef.current.selection)
      ) {
        e.preventDefault();
      }
    };

    /**
     * 处理输入法结束事件
     */
    const onCompositionEnd = () => {
      store.inputComposition = false;
    };

    const onError = (e: React.SyntheticEvent) => {
      console.log('Editor error', e);
    };

    const childrenIsEmpty = useMemo(() => {
      if (!markdownEditorRef.current.children) return false;
      if (!Array.isArray(markdownEditorRef.current.children)) return;
      if (markdownEditorRef.current.children.length === 0) return false;
      return (
        value.current.filter(
          (v) => v.type === 'paragraph' && v.children?.at?.(0)?.text === '',
        ).length < 1
      );
    }, [markdownEditorRef.current.children]);

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
      if (props.element.type === 'table-cell') return defaultDom;
      if (props.element.type === 'table-row') return defaultDom;
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
            Editor.hasPath(markdownEditorRef.current, anchor.path) &&
            Editor.hasPath(markdownEditorRef.current, focus.path)
          ) {
            const newSelection = {
              anchor: {
                ...anchor,
                path: findLeafPath(markdownEditorRef.current, AnchorPath),
              },
              focus: {
                ...focus,
                path: findLeafPath(markdownEditorRef.current, FocusPath),
              },
            };

            const fragment = Editor.fragment(
              markdownEditorRef.current,
              newSelection,
            );
            if (fragment) {
              const str = Node.string({ children: fragment });
              const isStrEquals = str === item.refContent;
              const newAnchorPath = anchor.path;
              const newFocusPath = focus.path;

              if (
                isStrEquals &&
                isPath(newFocusPath) &&
                isPath(newAnchorPath) &&
                Editor.hasPath(markdownEditorRef.current, newAnchorPath) &&
                Editor.hasPath(markdownEditorRef.current, newFocusPath)
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
        return decorateList.concat(ranges as any[]);
      } catch (error) {
        console.log('error', error);
        return decorateList;
      }
    };
    return wrapSSR(
      <Slate
        editor={markdownEditorRef.current}
        initialValue={[EditorUtils.p]}
        onChange={change}
      >
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
          onSelect={() => {
            if (store.focus) {
              markdownEditorRef.current.selection =
                getSelectionFromDomSelection(
                  markdownEditorRef.current,
                  window.getSelection()!,
                );
              store.setState((state) => {
                state.preSelection = markdownEditorRef.current.selection;
              });
            }
          }}
          onCut={(event: React.ClipboardEvent<HTMLDivElement>) => {
            if (isEventHandled(event)) {
              return;
            }
            if (!hasEditableTarget(markdownEditorRef.current, event.target)) {
              const domSelection = window.getSelection();
              markdownEditorRef.current.selection =
                getSelectionFromDomSelection(
                  markdownEditorRef.current,
                  domSelection!,
                );
              if (markdownEditorRef.current.selection) {
                Transforms.delete(markdownEditorRef.current, {
                  at: markdownEditorRef.current.selection!,
                });
                return;
              }
            }
            event.preventDefault();
          }}
          onMouseDown={checkEnd}
          onFocus={onFocus}
          onBlur={onBlur}
          onPaste={onPaste}
          onCopy={(event: React.ClipboardEvent<HTMLDivElement>) => {
            if (isEventHandled(event)) {
              return;
            }
            if (!hasEditableTarget(markdownEditorRef.current, event.target)) {
              const domSelection = window.getSelection();
              markdownEditorRef.current.selection =
                getSelectionFromDomSelection(
                  markdownEditorRef.current,
                  domSelection!,
                );
              if (!markdownEditorRef.current.selection) {
                return;
              }
            }
            event.preventDefault();
            ReactEditor.setFragmentData(
              markdownEditorRef.current,
              event.clipboardData,
              'copy',
            );
            copySelectedBlocks(markdownEditorRef.current);
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
