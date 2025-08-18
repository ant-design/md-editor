import mermaid from 'mermaid';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useGetSetState } from 'react-use';
import { CodeNode } from '../../MarkdownEditor/el';

/**
 * Mermaid 组件 - Mermaid图表渲染组件
 *
 * 该组件使用Mermaid库渲染图表，支持流程图、时序图、甘特图等。
 * 提供图表渲染、错误处理、延迟渲染等功能。
 *
 * @component
 * @description Mermaid图表渲染组件，支持各种Mermaid图表类型
 * @param {Object} props - 组件属性
 * @param {CodeNode} props.el - 代码节点，包含Mermaid图表代码
 * @param {string} [props.el.value] - Mermaid图表代码字符串
 *
 * @example
 * ```tsx
 * <Mermaid
 *   el={{
 *     type: 'code',
 *     value: 'graph TD\nA[开始] --> B[处理] --> C[结束]'
 *   }}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的Mermaid图表组件
 *
 * @remarks
 * - 基于Mermaid库实现图表渲染
 * - 支持多种图表类型（流程图、时序图、甘特图等）
 * - 提供延迟渲染优化性能
 * - 包含错误处理机制
 * - 支持空状态显示
 * - 提供美观的样式设计
 * - 禁用文本选择
 * - 居中显示图表
 * - 自动生成唯一ID
 */
export const Mermaid = (props: { el: CodeNode }) => {
  const [state, setState] = useGetSetState({
    code: '',
    error: '',
  });
  const divRef = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const id = useMemo(
    () => 'm' + (Date.now() + Math.ceil(Math.random() * 1000)),
    [],
  );
  const render = useCallback(async () => {
    mermaid
      .render(id, state().code)
      .then((res) => {
        setState({ error: '' });
        divRef.current!.innerHTML = res.svg;
      })
      .catch(() => {
        mermaid.parse(state().code).catch((e) => {
          setState({ error: e.toString(), code: '' });
        });
      })
      .finally(() => {
        document.querySelector('#d' + id)?.classList.add('hidden');
      });
  }, []);

  useEffect(() => {
    const code = props.el.value || '';
    if (state().code !== code) {
      clearTimeout(timer.current);
      timer.current = window.setTimeout(
        () => {
          setState({ code: code });
          if (state().code) {
            render();
          } else {
            setState({ error: '' });
          }
        },
        !state().code ? 0 : 300,
      );
    }
    return () => window.clearTimeout(timer.current);
  }, [props.el]);

  return (
    <div
      style={{
        marginBottom: '0.75em',
        cursor: 'default',
        userSelect: 'none',
        padding: '0.75rem 0',
        backgroundColor: 'rgba(15, 17, 20, 0.05)',
        borderRadius: '0.25em',
        display: 'flex',
        justifyContent: 'center',
      }}
      contentEditable={false}
    >
      <div
        contentEditable={false}
        ref={divRef}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          visibility: state().code && !state().error ? 'visible' : 'hidden',
        }}
      ></div>
      {state().error && (
        <div style={{ textAlign: 'center', color: 'rgba(239, 68, 68, 0.8)' }}>
          {state().error}
        </div>
      )}
      {!state().code && !state().error && (
        <div style={{ textAlign: 'center', color: '#6B7280' }}>Empty</div>
      )}
    </div>
  );
};
