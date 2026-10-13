/**
 * @fileoverview Ace编辑器核心组件
 *
 * 负责Ace编辑器的初始化、配置和事件处理，包括：
 * - 编辑器生命周期管理
 * - 语法高亮配置
 * - 主题动态切换
 * - 键盘事件处理
 * - 内容变化监听
 * - 与 Slate 编辑器的集成
 *
 * @see {@link https://ace.c9.io/} Ace Editor 官方文档
 */

import type { Ace } from 'ace-builds';
import isHotkey from 'is-hotkey';
import { useEffect, useRef, useState } from 'react';
import { Node, type Editor, type Path } from 'slate';
import { useRefFunction } from '../../../Hooks/useRefFunction';
import partialParse from '../../../MarkdownEditor/editor/parser/json-parse';
import { useEditorStore } from '../../../MarkdownEditor/editor/store';
import { getAceLangs, modeMap } from '../../../MarkdownEditor/editor/utils/ace';
import {
  handleCodeBlockAceKeyDown,
  isCodeBlockElement,
  setCodeBlockNodes,
} from '../../../MarkdownEditor/editor/utils/codeBlockBehavior';
import { getCodeBlockPlainText } from '../../../MarkdownEditor/editor/utils/codeBlockPlainText';
import { EditorUtils } from '../../../MarkdownEditor/editor/utils/editorUtils';
import { findElementPath } from '../../../MarkdownEditor/editor/utils/findElementPath';
import { CodeNode } from '../../../MarkdownEditor/el';
import { loadAceEditor, loadAceTheme } from '../loadAceEditor';

/**
 * AceEditor 组件属性接口
 *
 * @interface AceEditorProps
 * @property {CodeNode} element - 代码块节点数据
 * @property {Function} onUpdate - 更新代码块内容的回调
 * @property {Function} onShowBorderChange - 边框显示状态变化回调
 * @property {Function} onHideChange - 隐藏状态变化回调
 * @property {Path} path - 代码块在文档中的路径
 * @property {boolean} [isSelected] - 是否被选中
 * @property {Function} [onSelectionChange] - 选中状态变化回调
 */
interface AceEditorProps {
  element: CodeNode;
  onUpdate: (data: Partial<CodeNode>) => void;
  onShowBorderChange: (show: boolean) => void;
  onHideChange: (hide: boolean) => void;
  path?: Path;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  theme: string;
  enabled?: boolean;
}

interface PendingCodeDraft {
  editor: Editor;
  element: CodeNode;
  originalValue: string;
  value: string;
}

/**
 * AceEditor 组件
 *
 * 封装 Ace Editor 的核心功能，提供代码编辑、语法高亮、主题切换等能力。
 *
 * @component
 * @param {AceEditorProps} props - 组件属性
 * @returns {Object} 返回包含 DOM 引用、编辑器引用、语言设置等方法的对象
 *
 * @example
 * ```tsx
 * const { dom, setLanguage, focusEditor } = AceEditor({
 *   element: codeNode,
 *   onUpdate: (data) => console.log('更新:', data),
 *   onShowBorderChange: (show) => setBorder(show),
 *   onHideChange: (hide) => setHide(hide),
 *   path: [0, 1],
 * });
 * ```
 *
 * @remarks
 * - 支持 100+ 种编程语言
 * - 支持多种主题切换
 * - 自动处理键盘事件和快捷键
 * - 与 Slate 编辑器深度集成
 */
export function AceEditor({
  element,
  onUpdate,
  onShowBorderChange,
  onHideChange,
  isSelected = false,
  onSelectionChange,
  enabled = true,
  ...props
}: AceEditorProps) {
  const { store, editorProps, readonly } = useEditorStore();
  const codePlainSource = getCodeBlockPlainText(element);

  // 各种引用
  const codeRef = useRef(codePlainSource);
  const pasted = useRef(false);
  const debounceTimer = useRef(0);
  const editorRef = useRef<Ace.Editor | null>(null);
  const composingRef = useRef(false);
  const pendingDraftRef = useRef<PendingCodeDraft | null>(null);
  const dom = useRef<HTMLDivElement>(null);
  // 记录 Ace 会话当前使用的语言，用于语言变更时动态切换而不是销毁重建
  const aceLanguageRef = useRef<string | null | undefined>(element.language);
  const modeRequestRef = useRef(0);

  // Ace Editor 异步加载状态
  const [aceLoaded, setAceLoaded] = useState(false);
  const aceModuleRef = useRef<typeof import('ace-builds') | null>(null);

  // 异步加载 Ace Editor 库
  useEffect(() => {
    if (!enabled) return;
    if (process.env.NODE_ENV === 'test') {
      // 测试环境跳过加载
      setAceLoaded(true);
      return;
    }

    let cancelled = false;
    loadAceEditor()
      .then((aceModule) => {
        if (cancelled) return;
        aceModuleRef.current = aceModule;
        setAceLoaded(true);
      })
      .catch((error) => {
        if (!cancelled) console.error('Failed to load Ace Editor:', error);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  // 键盘：空块删除、Mod+Enter 跳出；Enter/Tab 等由 Ace 处理，不再 dispatch 到 window
  const handleKeyDown = useRefFunction((e: KeyboardEvent) => {
    if (
      readonly ||
      composingRef.current ||
      e.isComposing ||
      e.keyCode === 229
    ) {
      return;
    }
    const currentPath = findElementPath(store.editor, element, {
      matchKey: true,
      search: true,
    });
    if (
      !currentPath ||
      !isCodeBlockElement(Node.get(store.editor, currentPath))
    ) {
      return;
    }
    const result = handleCodeBlockAceKeyDown(
      store.editor,
      currentPath,
      e,
      editorRef.current?.getValue() ?? codeRef.current,
    );
    if (result === 'handled') {
      if (isHotkey('mod+enter', e)) {
        EditorUtils.focus(store.editor);
      }
      return;
    }
  });

  const commitCodeValue = useRefFunction((codeEditor: Ace.Editor) => {
    if (readonly || composingRef.current || editorRef.current !== codeEditor) {
      return;
    }
    const draft = pendingDraftRef.current;
    if (!draft) return;
    pendingDraftRef.current = null;
    if (draft.editor !== store.editor) return;
    const currentPath = findElementPath(store.editor, draft.element, {
      matchKey: true,
      search: true,
    });
    if (!currentPath) return;
    const currentNode = Node.get(store.editor, currentPath);
    if (
      !isCodeBlockElement(currentNode) ||
      getCodeBlockPlainText(currentNode) !== draft.originalValue
    ) {
      return;
    }
    const value = draft.value;
    if (value === codeRef.current) return;
    onUpdate({ value });
    codeRef.current = value;
  });

  const flushPendingDraft = useRefFunction(() => {
    const draft = pendingDraftRef.current;
    if (!draft || draft.editor !== store.editor) {
      return;
    }
    const currentPath = findElementPath(store.editor, draft.element, {
      matchKey: true,
      search: true,
    });
    if (!currentPath) return;
    const currentNode = Node.get(store.editor, currentPath);
    if (
      !isCodeBlockElement(currentNode) ||
      getCodeBlockPlainText(currentNode) !== draft.originalValue
    ) {
      return;
    }
    // Preserve accepted input when effects restart (including Fast Refresh),
    // or the view closes. The identity/value checks protect newer documents.
    setCodeBlockNodes(store.editor, currentPath, { value: draft.value });
    codeRef.current = draft.value;
  });

  const queueCodeValue = useRefFunction((codeEditor: Ace.Editor) => {
    if (readonly || composingRef.current || editorRef.current !== codeEditor) {
      return;
    }
    const currentPath = findElementPath(store.editor, element, {
      matchKey: true,
      search: true,
    });
    if (!currentPath) return;
    const currentNode = Node.get(store.editor, currentPath);
    if (!isCodeBlockElement(currentNode)) return;
    pendingDraftRef.current = {
      editor: store.editor,
      element: currentNode,
      originalValue: getCodeBlockPlainText(currentNode),
      value: codeEditor.getValue(),
    };
    clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      commitCodeValue(codeEditor);
    }, 100);
  });

  // 配置编辑器事件
  const setupEditorEvents = useRefFunction((codeEditor: Ace.Editor) => {
    let blurTimer = 0;
    let pasteTimer = 0;
    let active = true;
    // 禁用默认查找快捷键
    codeEditor.commands.addCommand({
      name: 'disableFind',
      bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
      exec: () => {},
    });

    const textarea = dom.current!.querySelector('textarea');
    const onCompositionStart = () => {
      composingRef.current = true;
      clearTimeout(debounceTimer.current);
    };
    const onCompositionEnd = () => {
      composingRef.current = false;
      queueCodeValue(codeEditor);
    };

    // 聚焦事件
    codeEditor.on('focus', () => {
      clearTimeout(blurTimer);
      onShowBorderChange(false);
      onHideChange(false);
    });

    // 失焦事件
    codeEditor.on('blur', () => {
      codeEditor.selection.clearSelection();
    });

    // 粘贴事件
    codeEditor.on('paste', (e) => {
      if (pasted.current) {
        e.text = '';
      } else {
        pasted.current = true;
        pasteTimer = window.setTimeout(() => {
          pasted.current = false;
        }, 60);
      }
    });
    codeEditor.on('focus', () => {
      onSelectionChange?.(true);
    });
    codeEditor.on('blur', () => {
      clearTimeout(blurTimer);
      blurTimer = window.setTimeout(() => {
        if (active) onSelectionChange?.(false);
      }, 160);
    });

    // 键盘事件
    textarea?.addEventListener('keydown', handleKeyDown);
    textarea?.addEventListener('compositionstart', onCompositionStart);
    textarea?.addEventListener('compositionend', onCompositionEnd);

    // 内容变化事件
    codeEditor.on('change', () => {
      if (readonly || composingRef.current) return;
      queueCodeValue(codeEditor);
    });

    return () => {
      active = false;
      clearTimeout(blurTimer);
      clearTimeout(pasteTimer);
      pasted.current = false;
      textarea?.removeEventListener('keydown', handleKeyDown);
      textarea?.removeEventListener('compositionstart', onCompositionStart);
      textarea?.removeEventListener('compositionend', onCompositionEnd);
      composingRef.current = false;
      clearTimeout(debounceTimer.current);
    };
  });

  const setAceMode = useRefFunction(
    async (
      codeEditor: Ace.Editor,
      language: string | null | undefined,
      fallbackToText = true,
    ) => {
      const request = ++modeRequestRef.current;
      let lang = (language || '') as string;
      if (modeMap.has(lang)) {
        lang = modeMap.get(lang)!;
      }

      const aceLangs = await getAceLangs();
      if (
        editorRef.current !== codeEditor ||
        request !== modeRequestRef.current
      ) {
        return;
      }

      const mode = aceLangs.has(lang)
        ? `ace/mode/${lang}`
        : fallbackToText
          ? 'ace/mode/text'
          : null;

      if (!mode) return;

      try {
        const session = codeEditor.getSession();
        if (editorRef.current === codeEditor && session) {
          session.setMode(mode);
        }
      } catch (error) {
        console.warn('Failed to set Ace Editor mode:', error);
      }
    },
  );

  // 初始化 Ace 编辑器（仅在库加载完成后）
  // 注意： intentionally 不将 editorProps.codeProps 列入依赖，因其对象引用在父组件内容更新时会频繁变化，
  // 导致编辑器被不必要地销毁重建。codeProps 的配置在初始化时已应用，主题等动态变更由独立 effect 处理。
  // element.language 同样不列为依赖，语言切换由独立的 effect 处理，避免流式渲染中 language
  // 逐字符变化时触发编辑器销毁重建。
  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    if (!enabled || !aceLoaded || !aceModuleRef.current || !dom.current) return;

    const codeProps = editorProps.codeProps || {};

    // A mode transition can flush the pending draft in the previous cleanup.
    let value = codeRef.current;
    const shouldFormatJsonInAce =
      element.language === 'json' && element.otherProps?.finished !== false;
    if (shouldFormatJsonInAce) {
      try {
        value = JSON.stringify(partialParse(value), null, 2);
      } catch (e) {}
    }

    // ace-builds 模块的默认导出就是 ace 对象
    // 使用类型断言确保类型正确
    const aceModule = aceModuleRef.current as any;
    const ace = aceModule.default || aceModule;
    const codeEditor = ace.edit(dom.current!, {
      useWorker: false,
      value,
      fontSize: 12,
      animatedScroll: true,
      maxLines: Infinity,
      wrap: true,
      tabSize: 4,
      readOnly: readonly,
      showPrintMargin: false,
      showLineNumbers: true,
      showGutter: true,
      ...codeProps,
    } as Ace.EditorOptions);

    editorRef.current = codeEditor;
    aceLanguageRef.current = element.language;

    // 设置语法高亮
    const modeTimer = window.setTimeout(() => {
      setAceMode(codeEditor, aceLanguageRef.current, false);
    }, 16);

    const cleanupEvents = !readonly ? setupEditorEvents(codeEditor) : undefined;

    return () => {
      clearTimeout(modeTimer);
      clearTimeout(debounceTimer.current);
      if (!readonly) flushPendingDraft();
      pendingDraftRef.current = null;
      cleanupEvents?.();
      if (editorRef.current === codeEditor) {
        editorRef.current = null;
      }
      codeEditor.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aceLoaded, enabled, readonly, setupEditorEvents]);

  // 语言切换时动态更新 Ace 会话模式，无需销毁重建编辑器
  useEffect(() => {
    if (!enabled || !editorRef.current || !aceLoaded) return;
    if (aceLanguageRef.current === element.language) return;

    aceLanguageRef.current = element.language;

    setAceMode(editorRef.current, element.language);
  }, [element.language, aceLoaded, enabled, setAceMode]);

  // 监听外部值变化
  useEffect(() => {
    let value = codePlainSource;

    // 流式 JSON：partialParse + JSON.stringify 会随不完整结构变化而整块改写，
    // 与 Slate 原文的 startsWith 关系断裂，反复 setValue 造成闪动；闭合后再格式化。
    const shouldFormatJsonInAce =
      element.language === 'json' && element.otherProps?.finished !== false;
    if (shouldFormatJsonInAce) {
      try {
        value = JSON.stringify(partialParse(value), null, 2);
      } catch (e) {}
    }

    if (value === codeRef.current) return;

    const editor = editorRef.current;
    const prev = codeRef.current;
    codeRef.current = value;

    if (!editor) return;

    // 流式渲染时内容只会在末尾追加。通过检测 value.startsWith(prev) 来判断是否为纯追加，
    // 若是则调用 session.insert 在末尾插入增量内容，避免 setValue 清空重写导致的闪动。
    const isAppend = value.startsWith(prev);
    if (isAppend) {
      const delta = value.slice(prev.length);
      const doc = editor.session.getDocument();
      const lastRow = doc.getLength() - 1;
      const lastCol = doc.getLine(lastRow).length;
      editor.session.insert({ row: lastRow, column: lastCol }, delta);
    } else {
      editor.setValue(value);
      editor.clearSelection();
    }
  }, [codePlainSource, element.language, element.otherProps?.finished]);

  // 监听主题变化
  useEffect(() => {
    if (!enabled || !editorRef.current || !aceLoaded) return;

    const theme = editorProps.codeProps?.theme || props.theme || 'github';

    const codeEditor = editorRef.current;
    let cancelled = false;
    loadAceTheme(theme)
      .then(() => {
        if (!cancelled && editorRef.current === codeEditor) {
          codeEditor.setTheme(`ace/theme/${theme}`);
        }
      })
      .catch((error) => {
        if (!cancelled && editorRef.current === codeEditor) {
          console.warn(`Failed to load theme: ${theme}`, error);
          codeEditor.setTheme('ace/theme/github');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [editorProps.codeProps?.theme, props.theme, aceLoaded, enabled, readonly]);

  // 暴露设置语言的方法
  const setLanguage = useRefFunction(async (changeLang: string) => {
    let lang = changeLang.toLowerCase();
    if (element.language?.toLowerCase() === lang) return;

    onUpdate({ language: lang });

    if (modeMap.has(lang)) {
      lang = modeMap.get(lang)!;
    }

    if (editorRef.current) {
      setAceMode(editorRef.current, lang);
    }
  });

  return {
    dom,
    editorRef,
    loading: !aceLoaded,
    setLanguage,
    focusEditor: () => editorRef.current?.focus(),
    isSelected,
    onSelectionChange,
  };
}
