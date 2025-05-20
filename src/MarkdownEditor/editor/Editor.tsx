/* eslint-disable react/no-children-prop */
import { message } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  BaseRange,
  BaseSelection,
  Editor,
  Node,
  Path,
  Range,
  Transforms,
} from 'slate';
import {
  CommentDataType,
  Elements,
  MarkdownEditorInstance,
  MarkdownEditorProps,
} from '../BaseMarkdownEditor';
import { MElement, MLeaf } from './elements';
import { insertParsedHtmlNodes } from './plugins/insertParsedHtmlNodes';
import { parseMarkdownToNodesAndInsert } from './plugins/parseMarkdownToNodesAndInsert';

import { useDebounceFn } from '@ant-design/pro-components';
import { useRefFunction } from '../../hooks/useRefFunction';
import { PluginContext } from '../plugin';
import { useHighlight } from './plugins/useHighlight';
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
import { isMarkdown, MARKDOWN_EDITOR_EVENTS } from './utils';
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

export type MEditorProps = {
  eleItemRender?: MarkdownEditorProps['eleItemRender'];
  onChange?: MarkdownEditorProps['onChange'];
  instance: MarkdownEditorInstance;
  className?: string;
  comment?: MarkdownEditorProps['comment'];
  prefixCls?: string;
  reportMode?: MarkdownEditorProps['reportMode'];
  placeholder?: string;
} & MarkdownEditorProps;

const genTableMinSize = (
  elements: Elements[],
  config?: {
    minColumn?: number;
    minRows?: number;
  },
) => {
  if (!config) return elements;

  elements.forEach((element) => {
    if (element.children) {
      genTableMinSize(element.children, config);
    }
  });
};

/**
 * Slate Markdown编辑器组件
 *
 * 基于Slate.js的Markdown编辑器，支持丰富的编辑功能，包括文本编辑、表格、代码块、媒体插入、链接等。
 * 通过MobX进行状态管理，支持多种编辑器事件和操作。
 *
 * @param {Object} props - 编辑器属性
 * @param {Function} props.eleItemRender - 自定义元素渲染函数，用于自定义编辑器中的元素渲染
 * @param {boolean} [props.reportMode] - 是否为报告模式，影响样式渲染
 * @param {MarkdownEditorInstance} [props.instance] - 编辑器实例，用于控制和访问编辑器
 * @param {Object} [props.tagInputProps] - 标签输入相关配置
 * @param {boolean} [props.tagInputProps.enable] - 是否启用标签输入功能
 * @param {string} [props.tagInputProps.prefixCls='$'] - 标签前缀字符
 * @param {Object} [props.textAreaProps] - 文本区域相关配置
 * @param {string} [props.textAreaProps.placeholder] - 文本区域占位文本
 * @param {string} [props.placeholder] - 编辑器占位文本
 * @param {Function} [props.onChange] - 内容变化回调函数
 * @param {Array} [props.initSchemaValue] - 初始化编辑器的值
 * @param {Object} [props.tableConfig] - 表格相关配置
 * @param {Object} [props.image] - 图片相关配置
 * @param {Function} [props.image.upload] - 图片上传函数
 * @param {Object} [props.fncProps] - 脚注相关配置
 * @param {Function} [props.fncProps.onFootnoteDefinitionChange] - 脚注定义变化回调
 * @param {Object} [props.comment] - 注释相关配置
 * @param {boolean} [props.comment.enable] - 是否启用注释功能
 * @param {Array} [props.comment.commentList] - 注释列表
 * @param {string} [props.prefixCls] - 组件前缀类名
 * @param {string} [props.className] - 自定义CSS类名
 * @param {Object} [props.style] - 自定义样式
 *
 * @returns {JSX.Element} Markdown编辑器组件
 */
export const SlateMarkdownEditor = observer(
  ({ eleItemRender, reportMode, instance, ...editorProps }: MEditorProps) => {
    const { store, markdownEditorRef, markdownContainerRef, readonly } =
      useEditorStore();

    const changedMark = useRef(false);
    const value = useRef<any[]>([EditorUtils.p]);
    const nodeRef = useRef<MarkdownEditorInstance>();
    const { prefixCls = '$' } = editorProps.tagInputProps || {};

    const onKeyDown = useKeyboard(store, markdownEditorRef, editorProps);
    const onChange = useOnchange(
      markdownEditorRef.current,
      store,
      editorProps.onChange,
    );
    const high = useHighlight(store);
    const first = useRef(true);

    const handleKeyDown = useRefFunction(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (
          editorProps.tagInputProps?.enable &&
          [prefixCls].flat(2)?.includes(event?.key)
        ) {
          event.preventDefault();
          event.stopPropagation();
          Transforms.insertNodes(markdownEditorRef.current, [
            {
              code: true,
              tag: true,
              autoOpen: true,
              text: event?.key + ' ',
              triggerText: event?.key,
            },
          ]);
          return;
        }
        onKeyDown(event);
      },
    );

    /**
     * 初始化编辑器
     */
    const initialNote = async () => {
      if (instance) {
        nodeRef.current = instance;
        first.current = true;
        store.initializing = true;
        const tableConfig = editorProps.tableConfig;
        genTableMinSize(editorProps.initSchemaValue || [], tableConfig);
        try {
          EditorUtils.reset(
            markdownEditorRef.current,
            editorProps.initSchemaValue?.length
              ? editorProps.initSchemaValue
              : undefined,
          );
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

    /**
     * 处理Slate编辑器内容变化事件
     *
     * 负责更新值引用、触发onChange回调，以及标记内容变化状态
     *
     * @param v 编辑器的新值
     */
    const onSlateChange = useRefFunction((v: any[]) => {
      // 忽略初始化时的第一次变化
      if (first.current) {
        setTimeout(() => {
          first.current = false;
        }, 100);
        return;
      }

      // 更新当前值引用
      value.current = v;
      // 触发onChange回调
      onChange(v, markdownEditorRef.current.operations);
      // 检查是否存在非选区变化操作，如有则标记内容已变更
      const hasContentChanges = markdownEditorRef.current.operations?.some(
        (op) => op.type !== 'set_selection',
      );
      if (hasContentChanges && !changedMark.current) {
        changedMark.current = true;
      }
    });

    /**
     * 处理鼠标点击事件，检查是否需要将光标定位到内容末尾
     *
     * 当用户点击编辑器底部区域时，将光标定位到编辑器内容末尾，
     * 提供更直观的编辑体验。
     *
     * @param e 鼠标事件
     * @returns 布尔值表示是否阻止默认行为
     */
    const checkEnd = useRefFunction((e: React.MouseEvent) => {
      // 如果启用打字机模式或为只读模式，不处理定位逻辑
      if (editorProps?.typewriter) return;
      if (readonly) return;

      // 当编辑器失去焦点时，清除选区
      if (!store.focus) {
        markdownEditorRef.current.selection = null;
      }

      // 获取目标元素
      const target = e.target as HTMLDivElement;

      // 如果启用文本区域模式，不处理定位逻辑
      if (editorProps.textAreaProps?.enable) {
        return false;
      }

      // 检查是否点击在编辑器内容区域
      if (target.dataset.slateEditor) {
        // 获取最后一个元素的顶部位置
        const top = (target.lastElementChild as HTMLElement)?.offsetTop;

        // 判断点击位置是否在编辑器内容底部区域
        // 当点击位置距离顶部的距离大于最后一个元素的顶部位置时，认为点击在底部区域
        if (
          store.container &&
          store.container.scrollTop + e.clientY - 60 > top
        ) {
          // 尝试将光标设置到编辑器内容末尾
          if (EditorUtils.checkEnd(markdownEditorRef.current)) {
            e.preventDefault();
          }
        }
      }
    });

    /**
     * 处理焦点事件, 隐藏所有的range
     * @description focus event
     */
    const onFocus = () => {
      if (readonly) return;
      store.setState((state) => (state.focus = true));
    };

    /**
     * 处理失去焦点事件,关掉所有的浮层
     * @description blur event
     * @param {React.FocusEvent<HTMLDivElement>} e
     */
    const onBlur = () => {
      if (readonly) return;
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

      if (currentTextSelection) {
        const [curNode] = Editor?.node(
          markdownEditorRef.current,
          currentTextSelection.focus.path!,
        );
        if (curNode.tag) {
          const text = event.clipboardData.getData('text/plain');
          if (text) {
            Transforms.insertText(markdownEditorRef.current, text, {
              at: currentTextSelection.focus,
            });
            return;
          }
        }
      }

      const types = event.clipboardData.types;
      if (types.includes('application/x-slate-md-fragment')) {
        const encoded = event.clipboardData.getData(
          'application/x-slate-md-fragment',
        );
        try {
          const fragment = JSON.parse(encoded).map((node: any) => {
            if (node.type === 'card') {
              return {
                ...node,
                children: [
                  {
                    type: 'card-before',
                    children: [{ text: '' }],
                  },
                  ...node.children,
                  {
                    type: 'card-after',
                    children: [{ text: '' }],
                  },
                ],
              };
            }
            return node;
          });

          if (editorProps.textAreaProps?.enable) {
            if (
              fragment.length === 1 &&
              fragment?.at(0).type === 'paragraph' &&
              currentTextSelection
            ) {
              const text = event.clipboardData.getData('text/plain');
              if (text) {
                Transforms.insertText(markdownEditorRef.current, text, {
                  at: currentTextSelection.focus,
                });
                return;
              }
              return;
            }
          }

          if (fragment.length === 0) return;
          EditorUtils.replaceSelectedNode(markdownEditorRef.current, fragment);
          return;
        } catch (error) {
          console.log('error', error);
        }
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
            const hideLoading = message.loading('上传中...');
            try {
              const url = [];
              for await (const file of fileList) {
                const serverUrl = await editorProps.image?.upload?.([file]);
                url.push(serverUrl);
              }
              const selection =
                markdownEditorRef.current?.selection?.focus?.path;
              const node = Node.get(
                markdownEditorRef.current,
                Path.parent(selection!)!,
              );

              const at = selection
                ? EditorUtils.findNext(markdownEditorRef.current, selection)!
                : undefined;

              [url].flat(2).forEach((u) => {
                if (!u) return null;
                Transforms.insertNodes(
                  markdownEditorRef.current,
                  EditorUtils.createMediaNode(u, 'image'),
                  {
                    at: [
                      ...(node.type === 'table-cell' ||
                      node.type === 'column-cell'
                        ? selection!
                        : at
                          ? at
                          : [markdownEditorRef.current.children.length - 1]),
                    ],
                  },
                );
              });
              message.success('上传成功');
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
        if (!text) return;
        const selection = markdownEditorRef.current.selection;

        // 如果是表格或者代码块，直接插入文本
        if (selection?.focus) {
          const rangeNodes = Editor?.node(markdownEditorRef.current, [
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
                    at: selection!,
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
                    at: selection!,
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
                  { select: true, at: selection! },
                );
              }
            } else {
              store.insertLink(text);
            }
            return;
          }
        } catch (e) {
          console.log('insert error', e);
          return;
        }

        if (isMarkdown(text)) {
          parseMarkdownToNodesAndInsert(markdownEditorRef.current, text);
          return;
        }
        Transforms.insertText(markdownEditorRef.current, text, {
          at: selection!,
        });
        return;
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
      store.container?.classList.add('composition');
      store.inputComposition = true;

      const focusPath = markdownEditorRef.current.selection?.focus.path || [];
      if (focusPath.length > 0) {
        const node = Node.get(
          markdownEditorRef.current,
          markdownEditorRef.current.selection?.focus.path || [],
        );
        if (node) {
          const dom = ReactEditor.toDOMNode(markdownEditorRef.current, node);
          if (dom) {
            dom
              .querySelector('.tag-popup-input')
              ?.classList.add('tag-popup-input-composition');
          }
        }
      }

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
      store.container?.classList.remove('composition');

      const focusPath = markdownEditorRef.current.selection?.focus.path || [];
      if (focusPath.length > 0) {
        const node = Node.get(
          markdownEditorRef.current,
          markdownEditorRef.current.selection?.focus.path || [],
        );
        if (node) {
          const dom = ReactEditor.toDOMNode(markdownEditorRef.current, node);
          if (dom) {
            dom
              .querySelector('.tag-popup-input')
              ?.classList.remove('tag-popup-input-composition');
          }
        }
      }
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
      placeholderContent:
        editorProps?.textAreaProps?.placeholder || editorProps?.placeholder,
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

    const plugins = useContext(PluginContext);

    const elementRenderElement = (props: RenderElementProps) => {
      const defaultDom = (
        <ErrorBoundary
          fallbackRender={() => {
            return null;
          }}
        >
          <MElement {...props} children={props.children} readonly={readonly} />
        </ErrorBoundary>
      );

      for (const plugin of plugins) {
        const Component = plugin.elements?.[props.element.type];
        if (Component) return <Component {...props} />;
      }

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
          tagInputProps={editorProps.tagInputProps}
        />
      );
    };

    const decorateFn = (e: any) => {
      const decorateList: any[] | undefined = high(e) || [];
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
                  id: item.id,
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

    const handleSelectionChange = useDebounceFn(async () => {
      if (store.focus) {
        // 选中时，更新选区,并且触发选区变化事件
        const event = new CustomEvent<BaseSelection>(
          MARKDOWN_EDITOR_EVENTS.SELECTIONCHANGE,
          {
            detail: markdownEditorRef.current.selection,
          },
        );
        markdownContainerRef?.current?.dispatchEvent(event);
        store.setState((state) => {
          state.preSelection = markdownEditorRef.current.selection;
        });
      }
    }, 160);

    /**
     * 处理复制和剪切的共享逻辑
     * @param event 剪贴板事件
     * @param operationType 操作类型 ('copy' | 'cut')
     * @returns 是否处理了事件
     */
    const handleClipboardCopy = useRefFunction(
      (
        event: React.ClipboardEvent<HTMLDivElement>,
        operationType: 'copy' | 'cut',
      ): boolean => {
        // 1. 如果事件已被处理，则直接返回
        if (isEventHandled(event)) {
          return false;
        }

        // 2. 检查目标元素是否可编辑，如果不可编辑，则从DOM选区中获取编辑器选区
        if (
          operationType === 'copy' &&
          !hasEditableTarget(markdownEditorRef.current, event.target)
        ) {
          const domSelection = window.getSelection();
          markdownEditorRef.current.selection = getSelectionFromDomSelection(
            markdownEditorRef.current,
            domSelection!,
          );
        } else if (operationType === 'cut') {
          const domSelection = window.getSelection();
          markdownEditorRef.current.selection = getSelectionFromDomSelection(
            markdownEditorRef.current,
            domSelection!,
          );
        }

        // 如果无法获取选区，则直接返回
        if (!markdownEditorRef.current.selection) {
          return false;
        }

        // 3. 处理复制/剪切选中内容
        if (markdownEditorRef.current?.selection) {
          // 阻止默认行为和事件冒泡
          event.preventDefault();
          event.stopPropagation();

          const editor = markdownEditorRef.current;
          const data = event?.clipboardData;

          // 复制纯文本内容
          const selectedText = Editor.string(editor, editor.selection!);
          data.setData('text/plain', selectedText || '');

          // 复制HTML内容
          const tempDiv = document.createElement('div');
          const domRange = ReactEditor.toDOMRange(
            editor,
            editor.selection as Range,
          );
          const selectedHtml = domRange.cloneContents();
          tempDiv.appendChild(selectedHtml);
          data.setData('text/html', tempDiv.innerHTML);
          tempDiv?.remove();

          // 设置Slate编辑器特定的片段数据，用于保留格式信息
          data.setData(
            'application/x-slate-md-fragment',
            JSON.stringify(editor?.getFragment() || []),
          );

          // 4. 设置剪贴板的片段数据
          ReactEditor.setFragmentData(
            markdownEditorRef.current,
            event.clipboardData,
            operationType,
          );

          // 5. 如果是剪切操作，删除选中内容
          if (operationType === 'cut') {
            Transforms.delete(markdownEditorRef.current, {
              at: markdownEditorRef.current.selection!,
            });
          }

          return true;
        }

        return false;
      },
    );

    useEffect(() => {
      const footnoteDefinitionList = markdownEditorRef.current.children
        .filter((item) => item.type === 'footnoteDefinition')
        .map((item, index) => {
          return {
            id: item.id || index,
            placeholder: item.identifier,
            origin_text: item.value,
            url: item.url,
            origin_url: item.url,
          };
        });
      editorProps?.fncProps?.onFootnoteDefinitionChange?.(
        footnoteDefinitionList,
      );
    }, [markdownEditorRef.current.children]);

    return wrapSSR(
      <>
        <Slate
          editor={markdownEditorRef.current}
          initialValue={[EditorUtils.p]}
          onChange={onSlateChange}
        >
          <Editable
            decorate={decorateFn}
            onError={onError}
            onDragOver={(e) => e.preventDefault()}
            readOnly={readonly}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            className={classNames(
              editorProps.className,
              `${baseClassName}-${readonlyCls}`,
              `${baseClassName}`,
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
              handleSelectionChange?.cancel();
              handleSelectionChange?.run();
            }}
            onCut={(event: React.ClipboardEvent<HTMLDivElement>) => {
              const handled = handleClipboardCopy(event, 'cut');
              if (!handled) {
                event.preventDefault();
              }
            }}
            onMouseDown={checkEnd}
            onFocus={onFocus}
            onBlur={onBlur}
            onPaste={onPaste}
            onCopy={(event: React.ClipboardEvent<HTMLDivElement>) => {
              handleClipboardCopy(event, 'copy');
            }}
            renderElement={elementRenderElement}
            onKeyDown={handleKeyDown}
            renderLeaf={renderMarkdownLeaf}
          />
        </Slate>
      </>,
    );
  },
);
