import ace, { Ace } from 'ace-builds';
import React, { useEffect, useRef } from 'react';
import { aceLangs, modeMap } from '../../MarkdownEditor/editor/utils/ace';

// 确保 ResizeObserver 在测试环境中可用
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    constructor(callback: any) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    private callback: any;
  } as any;
}

interface AceEditorWrapperProps {
  /** 代码内容 */
  value: string;
  /** 语言类型 */
  language?: string;
  /** 变更回调 */
  onChange?: (value: string) => void;
  /** 是否只读 */
  readonly?: boolean;
  /** 自定义样式 */
  className?: string;
  /** 编辑器高度 */
  height?: string | number;
  /** 编辑器配置选项 */
  options?: Partial<Ace.EditorOptions>;
}

/**
 * AceEditor包装组件
 *
 * 完全独立的AceEditor实现，不依赖其他组件
 * 提供基础的代码编辑功能，支持语法高亮、只读模式等
 */
export const AceEditorWrapper: React.FC<AceEditorWrapperProps> = ({
  value,
  language = 'text',
  onChange,
  readonly = false,
  className = '',
  height = '100%',
  options = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Ace.Editor>();
  const valueRef = useRef(value);

  // 初始化编辑器
  useEffect(() => {
    if (!containerRef.current) return;

    const codeEditor = ace.edit(containerRef.current, {
      useWorker: false,
      value: value,
      fontSize: 12,
      animatedScroll: true,
      maxLines: Infinity,
      wrap: true,
      tabSize: 4,
      readOnly: readonly,
      showPrintMargin: false,
      showLineNumbers: true,
      showGutter: true,
      ...options,
    });

    editorRef.current = codeEditor;

    // 设置语法高亮
    setTimeout(() => {
      let lang = language.toLowerCase();
      if (modeMap.has(lang)) {
        lang = modeMap.get(lang)!;
      }
      if (aceLangs.has(lang)) {
        codeEditor.session.setMode(`ace/mode/${lang}`);
      }
    }, 16);

    // 配置编辑器事件
    if (!readonly && onChange) {
      codeEditor.on('change', () => {
        const newValue = codeEditor.getValue();
        if (newValue !== valueRef.current) {
          valueRef.current = newValue;
          onChange(newValue);
        }
      });
    }

    return () => {
      codeEditor?.destroy();
    };
  }, []);

  // 更新值
  useEffect(() => {
    if (editorRef.current && value !== valueRef.current) {
      editorRef.current.setValue(value);
      valueRef.current = value;
    }
  }, [value]);

  // 更新语言
  useEffect(() => {
    if (editorRef.current) {
      let lang = language.toLowerCase();
      if (modeMap.has(lang)) {
        lang = modeMap.get(lang)!;
      }
      if (aceLangs.has(lang)) {
        editorRef.current.session.setMode(`ace/mode/${lang}`);
      } else {
        editorRef.current.session.setMode(`ace/mode/text`);
      }
    }
  }, [language]);

  // 更新只读状态
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setReadOnly(readonly);
    }
  }, [readonly]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: '100%',
      }}
    />
  );
};

export default AceEditorWrapper;
