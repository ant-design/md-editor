/**
 * @fileoverview Ace编辑器核心组件
 * 负责Ace编辑器的初始化、配置和事件处理
 */

import ace, { Ace } from 'ace-builds';
import isHotkey from 'is-hotkey';
import { useCallback, useEffect, useRef } from 'react';
import { Editor, Path, Transforms } from 'slate';
import { ReactEditor } from '../../../MarkdownEditor/editor/slate-react';
import { useEditorStore } from '../../../MarkdownEditor/editor/store';
import { aceLangs, modeMap } from '../../../MarkdownEditor/editor/utils/ace';
import { EditorUtils } from '../../../MarkdownEditor/editor/utils/editorUtils';
import { CodeNode } from '../../../MarkdownEditor/el';

interface AceEditorProps {
  element: CodeNode;
  onUpdate: (data: Partial<CodeNode>) => void;
  onShowBorderChange: (show: boolean) => void;
  onHideChange: (hide: boolean) => void;
  path: Path;
}

export function AceEditor({
  element,
  onUpdate,
  onShowBorderChange,
  onHideChange,
  path,
}: AceEditorProps) {
  const { store, editorProps, readonly } = useEditorStore();

  // 各种引用
  const codeRef = useRef(element.value || '');
  const pathRef = useRef<Path>(path);
  const posRef = useRef({ row: 0, column: 0 });
  const pasted = useRef(false);
  const debounceTimer = useRef(0);
  const editorRef = useRef<Ace.Editor>();
  const dom = useRef<HTMLDivElement>(null);

  // 更新路径引用
  useEffect(() => {
    pathRef.current = path;
  }, [path]);

  // 键盘事件处理
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 删除空代码块
      if (isHotkey('backspace', e)) {
        if (!codeRef.current) {
          const currentPath = ReactEditor.findPath(store.editor, element);
          Transforms.delete(store.editor, { at: currentPath });
          Transforms.insertNodes(
            store.editor,
            { type: 'paragraph', children: [{ text: '' }] },
            { at: currentPath },
          );
          Transforms.select(
            store.editor,
            Editor.start(store.editor, currentPath),
          );
          ReactEditor.focus(store.editor);
        }
      }

      // Cmd/Ctrl + Enter: 插入新段落
      if (isHotkey('mod+enter', e) && pathRef.current) {
        EditorUtils.focus(store.editor);
        Transforms.insertNodes(
          store.editor,
          { type: 'paragraph', children: [{ text: '' }] },
          { at: Path.next(pathRef.current), select: true },
        );
        e.stopPropagation();
        return;
      }

      // 转发键盘事件
      const newEvent = new KeyboardEvent(e.type, e);
      window.dispatchEvent(newEvent);
    },
    [element, store.editor],
  );

  // 配置编辑器事件
  const setupEditorEvents = useCallback(
    (codeEditor: Ace.Editor) => {
      // 禁用默认查找快捷键
      codeEditor.commands.addCommand({
        name: 'disableFind',
        bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
        exec: () => {},
      });

      const textarea = dom.current!.querySelector('textarea');

      // 聚焦事件
      codeEditor.on('focus', () => {
        onShowBorderChange(false);
        onHideChange(false);
      });

      // 失焦事件
      codeEditor.on('blur', () => {
        codeEditor.selection.clearSelection();
      });

      // 光标变化事件
      codeEditor.selection.on('changeCursor', () => {
        setTimeout(() => {
          const pos = codeEditor.getCursorPosition();
          posRef.current = { row: pos.row, column: pos.column };
        });
      });

      // 粘贴事件
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

      // 键盘事件
      textarea?.addEventListener('keydown', handleKeyDown);

      // 内容变化事件
      codeEditor.on('change', () => {
        if (readonly) return;
        clearTimeout(debounceTimer.current);
        debounceTimer.current = window.setTimeout(() => {
          onUpdate({ value: codeEditor.getValue() });
          codeRef.current = codeEditor.getValue();
        }, 100);
      });
    },
    [onUpdate, onShowBorderChange, onHideChange, readonly, handleKeyDown],
  );

  // 初始化 Ace 编辑器
  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    if (!dom.current) return;

    const codeEditor = ace.edit(dom.current!, {
      useWorker: false,
      value: element.value,
      fontSize: 12,
      animatedScroll: true,
      maxLines: Infinity,
      wrap: true,
      tabSize: 4,
      readOnly: readonly,
      showPrintMargin: false,
      ...(editorProps.codeProps || {}),
    } as Ace.EditorOptions);

    editorRef.current = codeEditor;

    // 设置语法高亮
    setTimeout(() => {
      let lang = element.language as string;
      if (modeMap.has(lang)) {
        lang = modeMap.get(lang)!;
      }
      if (aceLangs.has(lang)) {
        codeEditor.session.setMode(`ace/mode/${lang}`);
      }
    }, 16);

    if (readonly) return;

    // 配置编辑器事件
    setupEditorEvents(codeEditor);

    return () => {
      codeEditor.destroy();
    };
  }, [
    setupEditorEvents,
    readonly,
    element.value,
    element.language,
    editorProps.codeProps,
  ]);

  // 监听外部值变化
  useEffect(() => {
    if (element.value !== codeRef.current) {
      editorRef.current?.setValue(element.value || 'plain text');
      editorRef.current?.clearSelection();
    }
  }, [element.value]);

  // 暴露设置语言的方法
  const setLanguage = useCallback(
    (changeLang: string) => {
      let lang = changeLang.toLowerCase();
      if (element.language?.toLowerCase() === lang) return;

      onUpdate({ language: lang });

      if (modeMap.has(lang)) {
        lang = modeMap.get(lang)!;
      }

      if (aceLangs.has(lang)) {
        editorRef.current?.session.setMode(`ace/mode/${lang}`);
      } else {
        editorRef.current?.session.setMode(`ace/mode/text`);
      }
    },
    [element, onUpdate],
  );

  return {
    dom,
    editorRef,
    setLanguage,
    focusEditor: () => editorRef.current?.focus(),
  };
}
