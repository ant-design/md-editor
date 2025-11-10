import React, { useEffect, useMemo, useRef } from 'react';
import { useGetSetState } from 'react-use';
import { useIntersectionOnce } from '../../Hooks/useIntersectionOnce';
import { CodeNode } from '../../MarkdownEditor/el';

type MermaidApi = typeof import('mermaid').default;

let mermaidLoader: Promise<MermaidApi> | null = null;

export const loadMermaid = async (): Promise<MermaidApi> => {
  if (typeof window === 'undefined') {
    throw new Error('Mermaid 仅在浏览器环境中可用');
  }

  if (!mermaidLoader) {
    mermaidLoader = import('mermaid')
      .then((module) => {
        const api = module.default;
        if (api?.initialize) {
          api.initialize({ startOnLoad: false });
        }
        return api;
      })
      .catch((error) => {
        mermaidLoader = null;
        throw error;
      });
  }

  return mermaidLoader;
};

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
export const Mermaid = (props: { element: CodeNode }) => {
  const isBrowser = typeof window !== 'undefined';
  const [state, setState] = useGetSetState({
    code: '',
    error: '',
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const mermaidRef = useRef<MermaidApi | null>(null);
  const id = useMemo(
    () => 'm' + (Date.now() + Math.ceil(Math.random() * 1000)),
    [],
  );
  const isVisible = useIntersectionOnce(containerRef);

  useEffect(() => {
    if (!isBrowser) {
      return undefined;
    }
    console.log('props---', props);
    const nextCode = props.element.value || '';
    const currentState = state();

    if (!isVisible) {
      return undefined;
    }

    if (currentState.code === nextCode && currentState.error === '') {
      return undefined;
    }

    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }

    if (!nextCode) {
      timer.current = window.setTimeout(() => {
        setState({ code: '', error: '' });
        if (divRef.current) {
          divRef.current.innerHTML = '';
        }
        timer.current = null;
      }, 0);
      return () => {
        if (timer.current !== null) {
          window.clearTimeout(timer.current);
          timer.current = null;
        }
      };
    }

    const delay = currentState.code ? 300 : 0;

    timer.current = window.setTimeout(async () => {
      try {
        const api = mermaidRef.current ?? (await loadMermaid());
        mermaidRef.current = api;
        const { svg } = await api.render(id, nextCode);
        if (divRef.current) {
          divRef.current.innerHTML = svg;
        }
        setState({ code: nextCode, error: '' });
      } catch (error) {
        const api = mermaidRef.current;
        if (api) {
          try {
            await api.parse(nextCode);
          } catch (parseError) {
            setState({ error: String(parseError), code: '' });
            return;
          }
        }
        setState({ error: String(error), code: '' });
      } finally {
        document.querySelector('#d' + id)?.classList.add('hidden');
      }
      timer.current = null;
    }, delay);

    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [isBrowser, props?.element?.value, id, isVisible, setState, state]);

  if (!isBrowser) {
    return null;
  }

  const snapshot = state();

  return (
    <div
      ref={containerRef}
      style={{
        marginBottom: '0.75em',
        cursor: 'default',
        userSelect: 'none',
        padding: '0.75rem 0',
        borderRadius: '1em',
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
          visibility: snapshot.code && !snapshot.error ? 'visible' : 'hidden',
        }}
      ></div>
      {snapshot.error && (
        <div style={{ textAlign: 'center', color: 'rgba(239, 68, 68, 0.8)' }}>
          {snapshot.error}
        </div>
      )}
      {!snapshot.code && !snapshot.error && (
        <div style={{ textAlign: 'center', color: '#6B7280' }}>Empty</div>
      )}
    </div>
  );
};
