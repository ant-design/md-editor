/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/no-children-prop */
import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
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
 * @param {Function} [props.fncProps] - 脚注相关配置
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
export const SlateMarkdownEditor = ({
  eleItemRender,
  leafRender,
  reportMode,
  instance,
  ...editorProps
}: MEditorProps) => {
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

  const onKeyDown = useKeyboard(store, markdownEditorRef, editorProps);
  const onChange = useOnchange(markdownEditorRef.current, editorProps.onChange);
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

  const { wrapSSR, hashId } = useStyle(`${editorProps.prefixCls}-content`, {
    placeholderContent:
      editorProps?.textAreaProps?.placeholder || editorProps?.placeholder,
  });

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

    const handleMouseUp = () => {
      handleSelectionChange.run();
    };

    container.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mouseup', handleMouseUp);
      handleSelectionChange.cancel();
    };
  }, [readonly, markdownContainerRef?.current]);

  useEffect(() => {
    if (nodeRef.current !== instance) {
      initialNote();
    }
  }, [instance, markdownEditorRef.current]);

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
    editorProps?.fncProps?.onFootnoteDefinitionChange?.(footnoteDefinitionList);
  }, [markdownEditorRef.current?.children]);

  // 非hook变量声明
  const { prefixCls = '$' } = editorProps.tagInputProps || {};
  const baseClassName = `${editorProps.prefixCls}-content`;

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
    if (editorProps?.typewriter) return;
    if (readonly) {
      // 点击时清除工具栏
      setDomRect?.(null);
      return;
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
          editorProps,
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
          editorProps,
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
          editorProps,
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

  const onError = (e: React.SyntheticEvent) => {
    console.log('Editor error', e);
  };

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
    if (!eleItemRender) return renderedDom;
    if (props.element.type === 'table-cell') return renderedDom;
    if (props.element.type === 'table-row') return renderedDom;

    return eleItemRender(props, renderedDom) as React.ReactElement;
  };

  const renderMarkdownLeaf = (props: any) => {
    const defaultDom = (
      <MLeaf
        {...props}
        fncProps={editorProps.fncProps}
        comment={editorProps?.comment}
        children={props.children}
        hashId={hashId}
        tagInputProps={editorProps.tagInputProps}
      />
    );

    if (!leafRender) return defaultDom;

    return leafRender(
      {
        ...props,
        fncProps: editorProps.fncProps,
        comment: editorProps?.comment,
        hashId: hashId,
        tagInputProps: editorProps.tagInputProps,
      },
      defaultDom,
    ) as React.ReactElement;
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
              [`${baseClassName}-compact`]: editorProps.compact,
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
            handleClipboardCopy(event, 'copy');
          }}
          renderElement={elementRenderElement}
          onKeyDown={handleKeyDown}
          renderLeaf={renderMarkdownLeaf}
        />
      </Slate>
    </>,
  );
};
