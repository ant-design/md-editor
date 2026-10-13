import classNames from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useGetSetState } from 'react-use';
import { getSlateElementPlainText } from '../../MarkdownEditor/editor/utils/codeBlockPlainText';
import { CodeNode } from '../../MarkdownEditor/el';
import { loadKatex } from './loadKatex';

/**
 * Katex 组件 - KaTeX 数学公式渲染组件
 *
 * 该组件使用KaTeX库渲染数学公式，支持LaTeX语法，提供错误处理和延迟渲染。
 * 包含公式渲染、错误状态管理、占位符显示等功能。
 *
 * @component
 * @description KaTeX 数学公式渲染组件，支持LaTeX语法渲染
 * @param {Object} props - 组件属性
 * @param {CodeNode} props.el - 代码节点，包含公式内容
 * @param {string} [props.el.value] - LaTeX公式字符串
 *
 * @example
 * ```tsx
 * <Katex
 *   el={{
 *     type: 'code',
 *     value: '\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n'
 *   }}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的数学公式组件
 *
 * @remarks
 * - 基于KaTeX库实现数学公式渲染
 * - 支持LaTeX数学语法
 * - 提供延迟渲染优化性能
 * - 包含错误处理机制
 * - 支持占位符显示
 * - 提供美观的样式设计
 * - 禁用文本选择
 * - 居中显示公式
 */
export const Katex = (props: { el: CodeNode }) => {
  const [state, setState] = useGetSetState({
    code: '',
    error: '',
  });
  const [katexLoaded, setKatexLoaded] = useState(false);
  const katexRef = useRef<typeof import('katex').default | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const katexSource = getSlateElementPlainText(props.el);
  const isUnfinished = props.el.otherProps?.finished === false;
  const [loadError, setLoadError] = useState(false);

  // Keep incomplete streaming formulas as source until their fence closes.
  useEffect(() => {
    if (isUnfinished || katexRef.current) return;
    if (process.env.NODE_ENV === 'test') {
      setKatexLoaded(true);
      return;
    }

    let cancelled = false;
    void loadKatex().then(
      (katexModule) => {
        if (cancelled) return;
        katexRef.current = katexModule.default;
        setLoadError(false);
        setKatexLoaded(true);
      },
      (error) => {
        if (cancelled) return;
        console.error('Failed to load Katex:', error);
        setLoadError(true);
        setKatexLoaded(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [isUnfinished]);

  useEffect(() => {
    if (isUnfinished || !katexSource.trim()) {
      if (divRef.current) divRef.current.textContent = '';
      setState({ code: '', error: '' });
      return;
    }
    if (!katexLoaded || !katexRef.current) return;

    const timeout = window.setTimeout(
      () => {
        if (!divRef.current || !katexRef.current) return;
        try {
          katexRef.current.render(katexSource, divRef.current, {
            strict: false,
            output: 'htmlAndMathml',
            throwOnError: false,
            displayMode: true,
            macros: {
              '\\f': '#1f(#2)',
            },
          });
          setState({ code: katexSource, error: '' });
        } catch (error) {
          divRef.current.textContent = '';
          setState({ code: '', error: String(error) });
        }
      },
      state().code ? 300 : 0,
    );
    return () => window.clearTimeout(timeout);
  }, [katexSource, isUnfinished, katexLoaded, setState, state]);

  const showSource =
    !!katexSource.trim() &&
    (isUnfinished ||
      !katexLoaded ||
      !state().code.trim() ||
      loadError ||
      !!state().error);
  return (
    <div
      style={{
        marginBottom: '0.75em',
        cursor: 'default',
        userSelect: 'none',
        textAlign: 'center',
        backgroundColor: 'rgba(107, 114, 128, 0.05)',
        paddingTop: '1em',
        paddingBottom: '1em',
        borderRadius: '0.25em',
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
      contentEditable={false}
      aria-busy={
        !isUnfinished &&
        !!katexSource.trim() &&
        !loadError &&
        !state().error &&
        state().code !== katexSource
      }
    >
      <div
        ref={divRef}
        className={classNames('katex-container', {
          hidden: showSource || !state().code.trim(),
        })}
        style={{
          maxWidth: '100%',
          overflowX: 'auto',
          display: showSource || !state().code.trim() ? 'none' : undefined,
        }}
      />
      {showSource && (
        <pre
          style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
          }}
        >
          {katexSource}
        </pre>
      )}
      {!showSource && !state().code.trim() && (
        <div style={{ textAlign: 'center', color: '#6B7280' }}>Formula</div>
      )}
    </div>
  );
};
