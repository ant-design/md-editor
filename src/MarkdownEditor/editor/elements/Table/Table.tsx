import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Node } from 'slate';
import stringWidth from 'string-width';
import { RenderElementProps } from '../../slate-react';
import { useEditorStore } from '../../store';
import { TableNode } from '../../types/Table';
import { ReadonlyTableComponent } from './ReadonlyTableComponent';
import useScrollShadow from './useScrollShadow';

/**
 * 表格组
 *
 * @param {RenderElementProps} props - 渲染元素的属性。
 *
 * @returns {JSX.Element} 表格组件的 JSX 元素。
 *
 * @component
 *
 * @example
 * ```tsx
 * <Table {...props} />
 * ```
 *
 * @remarks
 * 该组件使用了多个 React 钩子函数，包括 `useState`、`useEffect`、`useCallback` 和 `useRef`。
 *
 * - `useState` 用于管理组件的状态。
 * - `useEffect` 用于处理组件挂载和卸载时的副作用。
 * - `useCallback` 用于优化回调函数的性能。
 * - `useRef` 用于获取 DOM 元素的引用。
 *
 * 组件还使用了 `IntersectionObserver` 来检测表格是否溢出，并相应地添加或移除 CSS 类。
 *
 * @see https://reactjs.org/docs/hooks-intro.html React Hooks
 */
export const ReadonlyTable = ({
  hashId,
  children,
  ...props
}: {
  children: React.ReactNode;
  hashId: string;
} & RenderElementProps<TableNode>) => {
  const { readonly, markdownContainerRef } = useEditorStore();
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const baseCls = getPrefixCls('md-editor-content-table');
  const tableTargetRef = useRef<HTMLTableElement>(null);

  // 总是调用 hooks，避免条件调用
  const [tableRef, scrollState] = useScrollShadow();

  // 只在编辑模式下进行复杂的列宽计算
  const colWidths = useMemo(() => {
    // readonly 模式下使用简化计算
    if (readonly) {
      const otherProps = props.element?.otherProps as any;
      if (otherProps?.colWidths) {
        return otherProps.colWidths;
      }
      const columnCount = props.element?.children?.[0]?.children?.length || 0;
      if (columnCount === 0) return [];
      return Array(columnCount).fill(120); // 固定宽度
    }

    // 如果在props中存在，直接使用以避免计算
    if (props.element?.otherProps?.colWidths) {
      return props.element?.otherProps?.colWidths as number[];
    }

    if (typeof window === 'undefined' || !props.element?.children?.length)
      return [];

    const tableRows = props.element.children;
    if (!tableRows?.[0]?.children?.length) return [];

    // 只获取一次容器宽度
    const containerWidth =
      (markdownContainerRef?.current?.querySelector('.ant-md-editor-content')
        ?.clientWidth || 400) - 32;
    const maxColumnWidth = containerWidth / 4;
    const minColumnWidth = 60;

    const columnCount = tableRows?.[0]?.children?.length || 0;
    const rowsToSample = Math.min(5, tableRows.length);

    // 一次性计算宽度
    const calculatedWidths = Array.from(
      { length: columnCount },
      (_, colIndex) => {
        const cellWidths = [];

        for (let rowIndex = 0; rowIndex < rowsToSample; rowIndex++) {
          const cell = tableRows[rowIndex]?.children?.[colIndex];
          if (cell) {
            const textWidth = stringWidth(Node.string(cell)) * 12;
            cellWidths.push(textWidth);
          }
        }

        return Math.min(
          Math.max(minColumnWidth, ...cellWidths),
          maxColumnWidth,
        );
      },
    );

    // 如果表格少于5行且总宽度超过容器宽度，则均匀分配宽度
    if (tableRows.length < 5) {
      const totalWidth = calculatedWidths.reduce(
        (sum, width) => sum + width,
        0,
      );
      if (totalWidth > containerWidth) {
        const evenWidth = Math.max(
          minColumnWidth,
          Math.floor(containerWidth / columnCount),
        );
        return Array(columnCount).fill(evenWidth);
      }
    }

    return calculatedWidths;
  }, [
    readonly,
    props.element?.otherProps?.colWidths,
    props.element?.children?.length,
    props.element?.children?.[0]?.children?.length,
    markdownContainerRef,
  ]);

  // 只在编辑模式下添加resize事件监听
  useEffect(() => {
    if (readonly || typeof window === 'undefined') return;

    const resize = () => {
      if (process.env.NODE_ENV === 'test') return;
      let maxWidth = colWidths
        ? colWidths?.reduce((a: number, b: number) => a + b, 0) + 8
        : 0;

      const minWidth = markdownContainerRef?.current?.querySelector(
        '.ant-md-editor-content',
      )?.clientWidth;

      const dom = tableRef.current as HTMLDivElement;
      if (dom) {
        setTimeout(() => {
          dom.style.minWidth = `min(${((minWidth || 200) * 0.95).toFixed(0)}px,${maxWidth || minWidth || 'xxx'}px,300px)`;
        }, 200);
      }
    };
    document.addEventListener('md-resize', resize);
    window.addEventListener('resize', resize);
    resize();
    return () => {
      document.removeEventListener('md-resize', resize);
      window.removeEventListener('resize', resize);
    };
  }, [colWidths, readonly, markdownContainerRef, tableRef]);

  useEffect(() => {
    if (readonly) return;
    document.dispatchEvent(
      new CustomEvent('md-resize', {
        detail: {},
      }),
    );
  }, [readonly]);

  // 缓存表格DOM，减少重复渲染
  const tableDom = useMemo(
    () => (
      <table
        ref={tableTargetRef}
        style={{
          userSelect: 'none',
        }}
        className={classNames(`${baseCls}-editor-table`, hashId)}
        onDragStart={(e) => {
          // 阻止拖拽开始事件
          e.preventDefault();
          return false;
        }}
      >
        <colgroup>
          {(colWidths || []).map((colWidth: number, index: number) => {
            return (
              <col
                key={index}
                style={{
                  width: colWidth,
                  minWidth: colWidth,
                  maxWidth: colWidth,
                }}
              />
            );
          }) || null}
        </colgroup>
        <tbody
          style={{
            userSelect: 'none',
          }}
        >
          {children}
        </tbody>
      </table>
    ),
    [colWidths, children, hashId, baseCls],
  );

  // 缓存boxShadow样式，只在scrollState变化时重新计算
  const boxShadowStyle = useMemo(
    () => ({
      flex: 1,
      minWidth: 0,
      boxShadow: readonly
        ? undefined
        : `
      ${scrollState.vertical.hasScroll && !scrollState.vertical.isAtStart ? 'inset 0 8px 8px -8px rgba(0,0,0,0.1)' : ''}
      ${scrollState.vertical.hasScroll && !scrollState.vertical.isAtEnd ? 'inset 0 -8px 8px -8px rgba(0,0,0,0.1)' : ''}
      ${scrollState.horizontal.hasScroll && !scrollState.horizontal.isAtStart ? 'inset 8px 0 8px -8px rgba(0,0,0,0.1)' : ''}
      ${scrollState.horizontal.hasScroll && !scrollState.horizontal.isAtEnd ? 'inset -8px 0 8px -8px rgba(0,0,0,0.1)' : ''}
    `,
    }),
    [scrollState, readonly],
  );

  // readonly 模式渲染 - 使用优化的组件
  if (readonly) {
    return (
      <ReadonlyTableComponent
        hashId={hashId}
        element={props.element}
        baseCls={baseCls}
      >
        {children}
      </ReadonlyTableComponent>
    );
  }

  // 编辑模式渲染
  return (
    <div
      className={classNames(baseCls, hashId)}
      ref={tableRef}
      style={boxShadowStyle}
      onDragStart={(e) => {
        // 阻止拖拽开始时的文字选择
        e.preventDefault();
      }}
      onDoubleClick={(e) => {
        // 阻止双击选择文字
        e.preventDefault();
      }}
    >
      {tableDom}
    </div>
  );
};
