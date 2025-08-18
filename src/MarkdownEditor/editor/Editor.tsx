/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/no-children-prop */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  BaseRange,
  BaseSelection,
  Editor,
  Node,
  Range,
  Transforms,
} from 'slate';
import {
  CommentDataType,
  Elements,
  MarkdownEditorInstance,
  MarkdownEditorProps,
  parserMdToSchema,
} from '../BaseMarkdownEditor';
import { MElement, MLeaf } from './elements';

import { useDebounceFn } from '@ant-design/pro-components';
import { useRefFunction } from '../../hooks/useRefFunction';
import { PluginContext } from '../plugin';
import {
  handleFilesPaste,
  handleHtmlPaste,
  handleHttpLinkPaste,
  handlePlainTextPaste,
  handleSlateMarkdownFragment,
  handleSpecialTextPaste,
  handleTagNodePaste,
  shouldInsertTextDirectly,
} from './plugins/handlePaste';
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
import { MARKDOWN_EDITOR_EVENTS, parserSlateNodeToMarkdown } from './utils';
import {
  EditorUtils,
  findLeafPath,
  getSelectionFromDomSelection,
  hasEditableTarget,
  isEventHandled,
  isPath,
} from './utils/editorUtils';

export type MEditorProps = {
  eleItemRender?: MarkdownEditorProps['eleItemRender'];
  leafRender?: MarkdownEditorProps['leafRender'];
  onChange?: MarkdownEditorProps['onChange'];
  instance: MarkdownEditorInstance;
  className?: string;
  comment?: MarkdownEditorProps['comment'];
  prefixCls?: string;
  reportMode?: MarkdownEditorProps['reportMode'];
  placeholder?: string;
} & MarkdownEditorProps;

/**
 * 生成表格最小尺寸配置
 *
 * 该函数用于设置表格的最小列数和行数，确保表格的基本结构。
 *
 * @param {Elements[]} elements - 编辑器元素数组
 * @param {Object} [config] - 配置对象
 * @param {number} [config.minColumn] - 最小列数
 * @param {number} [config.minRows] - 最小行数
 */
const genTableMinSize = (
  elements: Elements[],
  config?: {
    minColumn?: number;
    minRows?: number;
  },
) => {
  if (!config) return elements;

  elements.forEach((element) => {
    if ((element as any).children) {
      genTableMinSize((element as any).children, config);
    }
  });
};

/**
 * SlateMarkdownEditor 组件 - Slate Markdown编辑器组件
 *
 * 基于Slate.js的Markdown编辑器，支持丰富的编辑功能，包括文本编辑、表格、代码块、媒体插入、链接等。
 * 通过MobX进行状态管理，支持多种编辑器事件和操作。
 *
 * @component
 * @description 基于Slate.js的Markdown编辑器组件
 * @param {MEditorProps} props - 编辑器属性
 * @param {Function} [props.eleItemRender] - 自定义元素渲染函数
 * @param {Function} [props.leafRender] - 自定义叶子节点渲染函数
 * @param {Function} [props.onChange] - 内容变化回调
 * @param {MarkdownEditorInstance} props.instance - 编辑器实例
 * @param {string} [props.className] - 自定义CSS类名
 * @param {CommentDataType} [props.comment] - 评论数据
 * @param {string} [props.prefixCls] - 前缀类名
 * @param {boolean} [props.reportMode] - 是否为报告模式
 * @param {string} [props.placeholder] - 占位符文本
 *
 * @example
 * ```tsx
 * <SlateMarkdownEditor
 *   instance={editorInstance}
 *   onChange={(value) => console.log('内容变化:', value)}
 *   placeholder="请输入Markdown内容..."
 *   reportMode={false}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的Markdown编辑器组件
 *
 * @remarks
 * - 基于Slate.js实现
 * - 支持丰富的Markdown语法
 * - 提供自定义渲染功能
 * - 支持插件系统
 * - 集成状态管理
 * - 支持键盘快捷键
 * - 提供粘贴处理
 * - 支持错误边界
 * - 响应式布局
 */
export const SlateMarkdownEditor = (props: MEditorProps) => {
  // 所有hooks必须在组件顶部按固定顺序调用
  const {
    store,
    markdownEditorRef,
    markdownContainerRef,
    readonly,
    setDomRect,
  } = useEditorStore();

  const changedMark = useRef(false);
  const value = useRef<any[]>([EditorUtils.p]);
  const nodeRef = useRef<MarkdownEditorInstance>();
  const first = useRef(true);

  const plugins = useContext(PluginContext);

  const onKeyDown = useKeyboard(store, markdownEditorRef, props);
  const onChange = useOnchange(markdownEditorRef.current, props.onChange);
  const high = useHighlight(store);

  const childrenIsEmpty = useMemo(() => {
    if (!markdownEditorRef.current?.children) return false;
    if (!Array.isArray(markdownEditorRef.current.children)) return false;
    if (markdownEditorRef.current.children.length === 0) return false;
    return (
      value.current.filter(
        (v) => v.type === 'paragraph' && v.children?.at?.(0)?.text === '',
      ).length < 1
    );
  }, [markdownEditorRef.current?.children]);

  const readonlyCls = useMemo(() => {
    if (readonly) return 'readonly';
    return !childrenIsEmpty ? 'focus' : '';
  }, [readonly, !childrenIsEmpty]);

  const { wrapSSR, hashId } = useStyle(`${props.prefixCls}-content`, {
    placeholderContent: props?.textAreaProps?.placeholder || props?.placeholder,
  });

  const commentMap = useMemo(() => {
    const map = new Map<string, Map<string, CommentDataType[]>>();
    props?.comment?.commentList?.forEach((c) => {
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
  }, [props?.comment?.commentList]);

  const handleSelectionChange = useDebounceFn(async () => {
    if (!readonly) {
      // 非只读模式下的选区处理
      const event = new CustomEvent<BaseSelection>(
        MARKDOWN_EDITOR_EVENTS.SELECTIONCHANGE,
        {
          detail: markdownEditorRef.current.selection,
        },
      );
      markdownContainerRef?.current?.dispatchEvent(event);
      return;
    }
    if (typeof window === 'undefined') return;
    // 只读模式下的选区处理
    const domSelection = window.getSelection();
    if (!domSelection) {
      setDomRect?.(null);
      return;
    }

    try {
      const selection = getSelectionFromDomSelection(
        markdownEditorRef.current,
        domSelection,
      );

      if (selection) {
        // 更新编辑器的选区
        markdownEditorRef.current.selection = selection;

        // 触发选区变化事件
        const event = new CustomEvent<BaseSelection>(
          MARKDOWN_EDITOR_EVENTS.SELECTIONCHANGE,
          {
            detail: selection,
          },
        );
        markdownContainerRef?.current?.dispatchEvent(event);

        // 只有在有实际选中文本时才显示工具栏
        if (!Range.isCollapsed(selection)) {
          const range = ReactEditor.toDOMRange(
            markdownEditorRef.current,
            selection,
          );
          const rect = range?.getBoundingClientRect();
          if (rect) {
            setDomRect?.(rect);
          } else {
            setDomRect?.(null);
          }
        } else {
          setDomRect?.(null);
        }
      } else {
        setDomRect?.(null);
      }
    } catch (error) {
      console.error('Selection change error:', error);
    }
  }, 100);

  // 添加选区变化的监听
  useEffect(() => {
    const container = markdownContainerRef?.current;
    if (!container) return;

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      handleSelectionChange.run();
    };
    container.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mouseup', handleMouseUp);
      handleSelectionChange.cancel();
    };
  }, [readonly, markdownContainerRef?.current]);

  useEffect(() => {
    if (nodeRef.current !== props.instance) {
      initialNote();
    }
  }, [props.instance, markdownEditorRef.current]);

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
    props?.fncProps?.onFootnoteDefinitionChange?.(footnoteDefinitionList);
  }, [markdownEditorRef.current?.children]);

  // 非hook变量声明
  const { prefixCls = '$' } = props.tagInputProps || {};
  const baseClassName = `${props.prefixCls}-content`;

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

  const checkEnd = useRefFunction((e: React.MouseEvent) => {
    // 如果启用打字机模式或为只读模式，不处理定位逻辑
    if (props?.typewriter) return;
    if (readonly) {
      // 点击时清除工具栏
      setDomRect?.(null);
      return;
    }

    // 获取目标元素
    const target = e.target as HTMLDivElement;

    // 如果启用文本区域模式，不处理定位逻辑
    if (props.textAreaProps?.enable) {
      return false;
    }

    // 检查是否点击在编辑器内容区域
    if (target.dataset.slateEditor) {
      // 获取最后一个元素的顶部位置
      const top = (target.lastElementChild as HTMLElement)?.offsetTop;

      // 判断点击位置是否在编辑器内容底部区域
      // 当点击位置距离顶部的距离大于最后一个元素的顶部位置时，认为点击在底部区域
      if (
        markdownContainerRef.current &&
        markdownContainerRef.current.scrollTop + e.clientY - 60 > top
      ) {
        // 尝试将光标设置到编辑器内容末尾
        if (EditorUtils.checkEnd(markdownEditorRef.current)) {
          e.preventDefault();
        }
      }
    }
  });

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
        event.clipboardData?.clearData();
        const editor = markdownEditorRef.current;
        // 复制HTML内容
        const tempDiv = document.createElement('div');
        const domRange = ReactEditor.toDOMRange(
          editor,
          editor.selection as Range,
        );
        const selectedHtml = domRange.cloneContents();
        tempDiv.appendChild(selectedHtml);
        event.clipboardData.setData('text/html', tempDiv.innerHTML);
        tempDiv?.remove();

        // 设置Slate编辑器特定的片段数据，用于保留格式信息
        event.clipboardData.setData(
          'application/x-slate-md-fragment',
          JSON.stringify(editor?.getFragment() || []),
        );
        event.clipboardData.setData(
          'text/plain',
          parserSlateNodeToMarkdown(editor?.getFragment()),
        );
        event.clipboardData.setData(
          'text/markdown',
          parserSlateNodeToMarkdown(editor?.getFragment()),
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

        // 阻止默认行为和事件冒泡
        event.preventDefault();

        return true;
      }

      return false;
    },
  );

  const handleKeyDown = useRefFunction(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        props.tagInputProps?.enable &&
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
    if (props.instance) {
      nodeRef.current = props.instance;
      first.current = true;
      const tableConfig = props.tableConfig;
      genTableMinSize(props.initSchemaValue || [], tableConfig);
      try {
        EditorUtils.reset(
          markdownEditorRef.current,
          props.initSchemaValue?.length ? props.initSchemaValue : undefined,
        );
      } catch (e) {
        EditorUtils.deleteAll(markdownEditorRef.current);
      }
    } else {
      nodeRef.current = undefined;
    }
  };

  useEffect(() => {
    if (nodeRef.current !== props.instance) {
      initialNote();
    }
  }, [props.instance, markdownEditorRef.current]);

  /**
   * 处理粘贴事件，会把粘贴的内容转换为对应的节点
   * @description paste event
   * @param {React.ClipboardEvent<HTMLDivElement>} e
   */
  const onPaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
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
      const nodeList = Editor?.node(
        markdownEditorRef.current,
        currentTextSelection.focus.path!,
      );
      const curNode = nodeList?.at(0);
      if (
        handleTagNodePaste(
          markdownEditorRef.current,
          currentTextSelection,
          event.clipboardData,
          curNode,
        )
      ) {
        return;
      }
    }

    const types = event.clipboardData?.types || ['text/plain'];

    // 1. 首先尝试处理 slate-md-fragment
    if (types.includes('application/x-slate-md-fragment')) {
      if (
        handleSlateMarkdownFragment(
          markdownEditorRef.current,
          event.clipboardData,
          currentTextSelection,
        )
      ) {
        return;
      }
    }

    // 2. 然后尝试处理 HTML
    if (types.includes('text/html')) {
      if (
        await handleHtmlPaste(
          markdownEditorRef.current,
          event.clipboardData,
          props,
        )
      ) {
        return;
      }
    }

    // 3. 处理文件
    if (types.includes('Files')) {
      if (
        await handleFilesPaste(
          markdownEditorRef.current,
          event.clipboardData,
          props,
        )
      ) {
        return;
      }
    }

    if (types.includes('text/markdown')) {
      const text =
        event.clipboardData?.getData?.('text/markdown')?.trim() || '';
      if (text) {
        Transforms.insertFragment(
          markdownEditorRef.current,
          parserMdToSchema(text, plugins).schema,
        );
      }

      return;
    }
    // 4. 处理纯文本
    if (types.includes('text/plain')) {
      const text = event.clipboardData?.getData?.('text/plain')?.trim() || '';
      if (!text) return;

      const selection = markdownEditorRef.current.selection;

      // 如果是表格或者代码块，直接插入文本
      if (shouldInsertTextDirectly(markdownEditorRef.current, selection)) {
        Transforms.insertText(markdownEditorRef.current, text);
        return;
      }

      try {
        // 处理特殊文本格式（media:// 和 attach:// 链接）
        if (
          handleSpecialTextPaste(markdownEditorRef.current, text, selection)
        ) {
          return;
        }

        // 处理 HTTP 链接
        if (
          handleHttpLinkPaste(markdownEditorRef.current, text, selection, store)
        ) {
          return;
        }

        // 处理普通文本
        if (
          await handlePlainTextPaste(
            markdownEditorRef.current,
            text,
            selection,
            plugins,
          )
        ) {
          return;
        }
      } catch (e) {
        console.log('insert error', e);
      }
    }

    // 5. 如果前面的处理都失败了，才使用默认的插入行为
    if (hasEditableTarget(markdownEditorRef.current, event.target)) {
      ReactEditor.insertData(markdownEditorRef.current, event.clipboardData);
    }
  };

  /**
   * 处理输入法开始事件
   */
  const onCompositionStart = (e: React.CompositionEvent) => {
    markdownContainerRef.current?.classList.add('composition');
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
    markdownContainerRef.current?.classList.remove('composition');

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

  const elementRenderElement = useCallback(
    (props: RenderElementProps) => {
      const defaultDom = (
        <ErrorBoundary
          fallbackRender={() => {
            return null;
          }}
        >
          <MElement {...props} children={props.children} readonly={readonly} />
        </ErrorBoundary>
      );

      let renderedDom = defaultDom;

      // First check for plugin components
      for (const plugin of plugins) {
        const Component = plugin.elements?.[props.element.type];
        if (Component) {
          renderedDom = <Component {...props} />;
          break;
        }
      }

      // Then allow eleItemRender to process the result
      if (!props.eleItemRender) return renderedDom;
      if (props.element.type === 'table-cell') return renderedDom;
      if (props.element.type === 'table-row') return renderedDom;

      return props.eleItemRender(props, renderedDom) as React.ReactElement;
    },
    [props.eleItemRender, plugins, readonly],
  );

  const renderMarkdownLeaf = useCallback(
    (props: any) => {
      const defaultDom = (
        <MLeaf
          {...props}
          fncProps={props.fncProps}
          comment={props?.comment}
          children={props.children}
          hashId={hashId}
          tagInputProps={props.tagInputProps}
        />
      );

      if (!props.leafRender) return defaultDom;

      return props.leafRender(
        {
          ...props,
          fncProps: props.fncProps,
          comment: props?.comment,
          hashId: hashId,
          tagInputProps: props.tagInputProps,
        },
        defaultDom,
      ) as React.ReactElement;
    },
    [
      props.leafRender,
      hashId,
      props.fncProps,
      props.tagInputProps,
      props?.comment,
    ],
  );

  const decorateFn = (e: any) => {
    const decorateList: any[] | undefined = high(e) || [];
    if (!props?.comment) return decorateList;
    if (props?.comment?.enable === false) return decorateList;
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

  return wrapSSR(
    <>
      <Slate
        editor={markdownEditorRef.current}
        initialValue={[EditorUtils.p]}
        onChange={onSlateChange}
      >
        <Editable
          decorate={decorateFn}
          onDragOver={(e) => e.preventDefault()}
          readOnly={readonly}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="none"
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          className={classNames(
            props.className,
            `${baseClassName}-${readonlyCls}`,
            `${baseClassName}`,
            {
              [`${baseClassName}-report`]: props.reportMode,
              [`${baseClassName}-edit`]: !readonly,
              [`${baseClassName}-compact`]: props.compact,
            },
            hashId,
          )}
          style={
            props.reportMode
              ? {
                  fontSize: 16,
                  ...props.style,
                }
              : {
                  fontSize: 14,
                  ...props.style,
                }
          }
          onSelect={handleSelectionChange.run}
          onCut={(event: React.ClipboardEvent<HTMLDivElement>) => {
            const handled = handleClipboardCopy(event, 'cut');
            if (!handled) {
              event.preventDefault();
            }
          }}
          onBlur={() => {
            // 失去焦点时清除工具栏
            setDomRect?.(null);
          }}
          onMouseDown={checkEnd}
          onPaste={(event: React.ClipboardEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();
            onPaste(event);
          }}
          onCopy={(event: React.ClipboardEvent<HTMLDivElement>) => {
            const handled = handleClipboardCopy(event, 'copy');
            if (!handled) {
              event.preventDefault();
            }
          }}
          renderElement={elementRenderElement}
          onKeyDown={handleKeyDown}
          renderLeaf={renderMarkdownLeaf}
        />
      </Slate>
    </>,
  );
};
