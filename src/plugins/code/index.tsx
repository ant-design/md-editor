/**
 * @fileoverview 代码编辑器插件主文件
 * 提供基于 Ace Editor 的代码编辑功能，支持多种编程语言语法高亮
 * @author Code Plugin Team
 */

import ace, { Ace } from 'ace-builds';
import { Modal } from 'antd';
import isHotkey from 'is-hotkey';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useGetSetState } from 'react-use';
import { Editor, Path, Transforms } from 'slate';
import { ReactEditor } from '../../MarkdownEditor/editor/slate-react';
import { useEditorStore } from '../../MarkdownEditor/editor/store';
import { DragHandle } from '../../MarkdownEditor/editor/tools/DragHandle';
import { aceLangs, modeMap } from '../../MarkdownEditor/editor/utils/ace';
import { EditorUtils } from '../../MarkdownEditor/editor/utils/editorUtils';
import { CodeNode, ElementProps } from '../../MarkdownEditor/el';
import { useSelStatus } from '../../MarkdownEditor/hooks/editor';
import { useFullScreenHandle } from '../../MarkdownEditor/hooks/useFullScreenHandle';
import { CodeToolbar, LanguageSelectorProps } from './components';

/**
 * 代码编辑器组件
 *
 * 功能特性：
 * - 基于 Ace Editor 的代码编辑
 * - 支持 100+ 种编程语言语法高亮
 * - 支持代码复制、全屏编辑
 * - 支持 HTML 代码实时预览
 * - 支持拖拽排序
 * - 响应式布局适配
 *
 * 编辑器特性：
 * - 自动缩进和语法检查
 * - 自定义快捷键支持
 * - 实时内容同步到 Slate 编辑器
 * - 支持只读和编辑模式切换
 *
 * @param props - 代码节点的属性，包含代码内容、语言类型等信息
 * @returns React 代码编辑器元素
 *
 * @example
 * ```tsx
 * // 在 Slate 编辑器中使用
 * <CodeElement
 *   element={{
 *     type: 'code',
 *     language: 'javascript',
 *     value: 'console.log("Hello World");'
 *   }}
 *   attributes={slateAttributes}
 *   children={slateChildren}
 * />
 * ```
 */
export function CodeElement(props: ElementProps<CodeNode>) {
  // 全屏功能 Hook
  const handle = useFullScreenHandle();
  // 编辑器状态管理
  const { store, markdownEditorRef, editorProps, readonly } = useEditorStore();

  // 组件内部状态
  const [state, setState] = useGetSetState({
    showBorder: false, // 是否显示选中边框
    htmlStr: '', // HTML 预览内容
    hide: false, // 是否隐藏编辑器
    lang: props.element.language || '', // 当前语言
  });

  // 各种引用
  const containerRef = useRef<HTMLDivElement>(null); // 容器引用
  const codeRef = useRef(props.element.value || ''); // 代码内容引用
  const pathRef = useRef<Path>(); // Slate 路径引用
  const posRef = useRef({ row: 0, column: 0 }); // 光标位置引用
  const pasted = useRef(false); // 粘贴状态引用
  const debounceTimer = useRef(0); // 防抖定时器引用
  const editorRef = useRef<Ace.Editor>(); // Ace 编辑器实例引用
  const dom = useRef<HTMLDivElement>(null); // Ace 编辑器 DOM 引用

  // 获取选中状态和路径
  const [selected, path] = useSelStatus(props.element);
  pathRef.current = path;

  /**
   * 更新代码节点数据
   * 将 Ace 编辑器的内容同步到 Slate 编辑器
   */
  const update = useCallback(
    (data: Partial<CodeNode>) => {
      const code = editorRef.current?.getValue() || '';
      codeRef.current = code;
      Transforms.setNodes(store.editor, data, { at: path });
    },
    [path],
  );

  // 处理编辑器选中状态的边框显示
  useEffect(() => {
    if (
      selected &&
      !editorRef.current?.isFocused() &&
      ReactEditor.isFocused(markdownEditorRef.current)
    ) {
      setState({ showBorder: true });
    } else if (state().showBorder) {
      setState({ showBorder: false });
    }
  }, [selected, path]);

  /**
   * 设置编程语言
   * 更新语言类型并切换 Ace 编辑器的语法高亮模式
   */
  const setLanguage = useCallback(
    (changeLang: string) => {
      let lang = changeLang.toLowerCase();
      if (props.element.language?.toLowerCase() === lang) return;

      // 更新节点数据
      update({ language: lang });

      // 处理语言映射
      if (modeMap.has(lang)) {
        lang = modeMap.get(lang)!;
      }

      // 设置 Ace 编辑器的语法高亮模式
      if (aceLangs.has(lang)) {
        editorRef.current?.session.setMode(`ace/mode/${lang}`);
      } else {
        editorRef.current?.session.setMode(`ace/mode/text`);
      }
    },
    [props.element, props.element.children],
  );

  // 工具栏事件处理器
  const handleCloseClick = useCallback(() => {
    setState({
      hide: false,
    });
  }, []);

  const handleRunHtml = useCallback(() => {
    try {
      setState({
        htmlStr: props.element?.value,
      });
    } catch (error) {
      // HTML 执行失败时静默处理
    }
  }, [props.element?.value]);

  const handleFullScreenToggle = useCallback(() => {
    if (handle.active) {
      handle.exit();
    } else {
      handle.enter();
    }
  }, [handle]);

  // 组装语言选择器属性
  const languageSelectorProps: LanguageSelectorProps = {
    element: props.element,
    containerRef,
    setLanguage,
  };

  // 组装工具栏属性
  const toolbarProps = {
    element: props.element,
    readonly,
    onCloseClick: handleCloseClick,
    onRunHtml: handleRunHtml,
    onFullScreenToggle: handleFullScreenToggle,
    isFullScreen: handle.active,
    languageSelectorProps,
  };

  // 初始化 Ace 编辑器
  useEffect(() => {
    // 测试环境跳过编辑器初始化
    if (process.env.NODE_ENV === 'test') return;
    if (!dom.current) return;

    // 创建 Ace 编辑器实例
    const codeEditor = ace.edit(dom.current!, {
      useWorker: false, // 禁用 Web Worker 以避免跨域问题
      value: props.element.value,
      fontSize: 12,
      animatedScroll: true,
      maxLines: Infinity, // 允许无限行数
      wrap: true, // 启用自动换行
      tabSize: 4,
      readOnly: readonly,
      showPrintMargin: false, // 隐藏打印边距线
      ...(editorProps.codeProps || {}), // 合并自定义配置
    } as Ace.EditorOptions);

    editorRef.current = codeEditor;
    let lang = props.element.language as string;

    // 延时设置语法高亮模式，确保编辑器已完全初始化
    setTimeout(() => {
      if (modeMap.has(lang)) {
        lang = modeMap.get(lang)!;
      }
      if (aceLangs.has(lang)) {
        codeEditor.session.setMode(`ace/mode/${lang}`);
      }
    }, 16);

    editorRef.current = codeEditor;

    // 只读模式下直接返回，不添加交互功能
    if (readonly) return;

    // 禁用默认的查找快捷键，避免与全局快捷键冲突
    codeEditor.commands.addCommand({
      name: 'disableFind',
      bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
      exec: () => {}, // 空函数，禁用默认行为
    });

    // 获取编辑器的文本区域元素
    const textarea = dom.current!.querySelector('textarea');

    // 编辑器聚焦事件
    codeEditor.on('focus', () => {
      setState({ showBorder: false, hide: false });
    });

    // 编辑器失焦事件
    codeEditor.on('blur', () => {
      codeEditor.selection.clearSelection();
    });

    // 光标位置变化事件
    codeEditor.selection.on('changeCursor', () => {
      setTimeout(() => {
        const pos = codeEditor.getCursorPosition();
        posRef.current = { row: pos.row, column: pos.column };
      });
    });

    // 粘贴事件处理，防止重复粘贴
    codeEditor.on('paste', (e) => {
      if (pasted.current) {
        e.text = '';
      } else {
        pasted.current = true;
        setTimeout(() => {
          pasted.current = false;
        }, 60);
      }
    });

    // 键盘事件处理
    textarea?.addEventListener('keydown', (e) => {
      // 处理删除整个代码块的逻辑
      if (isHotkey('backspace', e)) {
        if (!codeRef.current) {
          const currentPath = ReactEditor.findPath(store.editor, props.element);
          Transforms.delete(store.editor, { at: currentPath });
          Transforms.insertNodes(
            store.editor,
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
            { at: currentPath },
          );
          Transforms.select(
            store.editor,
            Editor.start(store.editor, currentPath),
          );
          ReactEditor.focus(store.editor);
        }
      }

      // 处理 Cmd/Ctrl + Enter 快捷键：在下方插入新段落
      if (isHotkey('mod+enter', e) && pathRef.current) {
        EditorUtils.focus(store.editor);
        Transforms.insertNodes(
          store.editor,
          { type: 'paragraph', children: [{ text: '' }] },
          {
            at: Path.next(pathRef.current),
            select: true,
          },
        );
        e.stopPropagation();
        return;
      }

      // 转发键盘事件到全局
      const newEvent = new KeyboardEvent(e.type, e);
      window.dispatchEvent(newEvent);
    });

    // 内容变化事件，使用防抖优化性能
    codeEditor.on('change', () => {
      if (readonly) return;
      clearTimeout(debounceTimer.current);
      debounceTimer.current = window.setTimeout(() => {
        update({ value: codeEditor.getValue() });
      }, 100); // 100ms 防抖延迟
    });

    // 设置编辑器只读状态
    if (readonly) {
      codeEditor?.setReadOnly(true);
    } else {
      codeEditor?.setReadOnly(false);
    }

    // 组件卸载时销毁编辑器实例
    return () => {
      codeEditor.destroy();
    };
  }, []);

  // 监听外部代码值变化，同步到编辑器
  useEffect(() => {
    if (props.element.value !== codeRef.current) {
      editorRef.current?.setValue(props.element.value || 'plain text');
      editorRef.current?.clearSelection();
    }
  }, [props.element.value]);

  // 渲染组件
  return useMemo(() => {
    // 隐藏配置型 HTML 代码块
    if (props.element.language === 'html' && props.element?.isConfig) {
      return null;
    }

    // 只读模式下的思考块特殊渲染
    if (props.element.language === 'think' && readonly) {
      return (
        <div
          style={{
            color: '#8b8b8b',
            whiteSpace: 'pre-wrap',
            margin: 0,
            borderLeft: '2px solid #e5e5e5',
            paddingLeft: '1em',
          }}
        >
          {props.element?.value}
        </div>
      );
    }

    // 主要的代码编辑器渲染
    return (
      <div
        {...props.attributes}
        contentEditable={false}
        className={'ace-el drag-el'}
        data-be={'code'}
        ref={containerRef}
        tabIndex={-1}
        onBlur={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        data-lang={props.element.language}
      >
        {/* 拖拽手柄（非前置配置块） */}
        {!props.element.frontmatter && <DragHandle />}

        {/* 全屏容器 */}
        <div
          contentEditable={false}
          ref={handle.node}
          style={{
            backgroundColor: handle.active
              ? 'rgb(252, 252, 252)'
              : 'transparent',
            padding: handle.active ? '2em' : undefined,
            userSelect: 'none',
          }}
        >
          {/* 编辑器主容器 */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              editorRef.current?.focus();
            }}
            style={{
              padding: state().hide ? 0 : undefined,
              marginBottom: state().hide ? 0 : undefined,
              boxSizing: 'border-box',
              backgroundColor: state().showBorder
                ? 'rgba(59, 130, 246, 0.1)' // 选中时的蓝色背景
                : state().hide
                  ? 'transparent'
                  : 'rgb(252, 252, 252)', // 默认浅灰背景
              maxHeight: 400,
              overflow: 'auto',
              position: 'relative',
              height: state().hide ? 0 : 'auto',
              opacity: state().hide ? 0 : 1,
              border: handle.active ? '1px solid #0000001a;' : undefined,
            }}
            className={`ace-container drag-el ${
              props.element.frontmatter ? 'frontmatter' : ''
            }`}
          >
            {/* 工具栏（非前置配置且未隐藏） */}
            {!props.element.frontmatter &&
              !editorProps.codeProps?.hideToolBar && (
                <CodeToolbar {...toolbarProps} />
              )}

            {/* Ace 编辑器容器 */}
            <div ref={dom} style={{ height: 200, lineHeight: '22px' }}></div>

            {/* 隐藏的内容副本（用于搜索和 SEO） */}
            <div
              style={{
                height: '0.5px',
                overflow: 'hidden',
                opacity: 0,
                pointerEvents: 'none',
              }}
            >
              {props.element?.value?.replaceAll('\n', ' ')}
              {props.children}
            </div>
          </div>
        </div>

        {/* HTML 预览模态框 */}
        <Modal
          open={!!state().htmlStr}
          destroyOnHidden
          title="html执行结果"
          footer={null}
          styles={{
            body: {
              padding: 0,
              margin: 0,
              boxSizing: 'border-box',
            },
          }}
          width="80vw"
          onCancel={() => {
            setState({ htmlStr: '' });
          }}
          afterClose={() => {
            setState({ htmlStr: '' });
          }}
        >
          <iframe
            style={{
              outline: 0,
              border: 'none',
              height: '60vh',
            }}
            width="100%"
            srcDoc={state().htmlStr}
          ></iframe>
        </Modal>
      </div>
    );
  }, [
    props.element,
    props.element.children,
    props.element.value,
    state().showBorder,
    state().hide,
    state().lang,
    handle.active,
    selected,
    path,
  ]);
}
