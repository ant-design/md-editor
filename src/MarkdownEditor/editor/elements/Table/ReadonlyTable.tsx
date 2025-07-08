import { CopyOutlined, FullscreenOutlined } from '@ant-design/icons';
import { ConfigProvider, Modal, Popover } from 'antd';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Node } from 'slate';
import stringWidth from 'string-width';
import { I18nContext } from '../../../../i18n';
import { parserSlateNodeToMarkdown, TableNode } from '../../../index';
import { ActionIconBox } from '../../components';
import { RenderElementProps } from '../../slate-react';
import { useEditorStore } from '../../store';
import useScrollShadow from './useScrollShadow';
export * from './TableCell';

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
  const { editorProps, readonly, markdownContainerRef } = useEditorStore();
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const {
    actions = {
      download: 'csv',
      fullScreen: 'modal',
      copy: 'md',
    },
  } = editorProps?.tableConfig || {};

  const baseCls = getPrefixCls('md-editor-content-table');

  const tableTargetRef = useRef<HTMLTableElement>(null);
  const modelTargetRef = useRef<HTMLDivElement>(null);

  const [tableRef, scrollState] = useScrollShadow();

  const [previewOpen, setPreviewOpen] = useState(false);
  const i18n = useContext(I18nContext);

  const colWidths = useMemo(() => {
    // 如果在props中存在，直接使用以避免计算
    if (props.element?.otherProps?.colWidths) {
      return props.element?.otherProps?.colWidths;
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
    props.element?.otherProps?.colWidths,
    props.element?.children?.length,
    props.element?.children?.[0]?.children?.length,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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
  }, [colWidths]);

  useEffect(() => {
    document.dispatchEvent(
      new CustomEvent('md-resize', {
        detail: {},
      }),
    );
  }, []);
  return useMemo(() => {
    const dom = (
      <table
        ref={tableTargetRef}
        style={{
          userSelect: 'none',
        }}
        className={classNames(`${baseCls}-editor-table`, hashId)}
      >
        <colgroup>
          {(colWidths || []).map((colWidth: any, index: any) => {
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
        <tbody data-slate-node="element">{children}</tbody>
      </table>
    );
    if (!readonly)
      return (
        <div
          className={classNames(baseCls, hashId)}
          ref={tableRef}
          style={{
            flex: 1,
            minWidth: 0,
            boxShadow: `
                      ${scrollState.vertical.hasScroll && !scrollState.vertical.isAtStart ? 'inset 0 8px 8px -8px rgba(0,0,0,0.1)' : ''}
                      ${scrollState.vertical.hasScroll && !scrollState.vertical.isAtEnd ? 'inset 0 -8px 8px -8px rgba(0,0,0,0.1)' : ''}
                      ${scrollState.horizontal.hasScroll && !scrollState.horizontal.isAtStart ? 'inset 8px 0 8px -8px rgba(0,0,0,0.1)' : ''}
                      ${scrollState.horizontal.hasScroll && !scrollState.horizontal.isAtEnd ? 'inset -8px 0 8px -8px rgba(0,0,0,0.1)' : ''}
                    `,
          }}
        >
          {dom}
        </div>
      );
    return (
      <>
        <Popover
          trigger={['click', 'hover']}
          arrow={false}
          styles={{
            body: {
              padding: 8,
            },
          }}
          align={{
            offset: [4, 40],
          }}
          zIndex={999}
          placement="topLeft"
          content={
            <div
              style={{
                display: 'flex',
                gap: 8,
              }}
            >
              {actions.fullScreen ? (
                <ActionIconBox
                  title={i18n?.locale?.fullScreen || '全屏'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewOpen(true);
                  }}
                >
                  <FullscreenOutlined />
                </ActionIconBox>
              ) : null}
              {actions.copy ? (
                <ActionIconBox
                  title={i18n?.locale?.copy || '复制'}
                  onClick={() => {
                    if (location.protocol !== 'https:') {
                      copy(parserSlateNodeToMarkdown([props.element]));
                      return;
                    }
                    const clipboardItems: ClipboardItems = [];
                    navigator?.clipboard.write([
                      new ClipboardItem({
                        'application/x-slate-md-fragment': new Blob(
                          [JSON.stringify(props.element)],
                          { type: 'application/x-slate-md-fragment' },
                        ),
                      }),
                    ]);
                    if (actions.copy === 'html') {
                      clipboardItems.push(
                        new ClipboardItem({
                          'text/plain': new Blob(
                            [tableTargetRef.current?.innerHTML || ''],
                            { type: 'text/plain' },
                          ),
                        }),
                      );
                    }
                    if (actions.copy === 'md') {
                      clipboardItems.push(
                        new ClipboardItem({
                          'text/plain': new Blob(
                            [parserSlateNodeToMarkdown([props.element])],
                            { type: 'text/plain' },
                          ),
                        }),
                      );
                    }
                    if (actions.copy === 'csv') {
                      clipboardItems.push(
                        new ClipboardItem({
                          'text/plain': new Blob(
                            [
                              props.element?.otherProps?.columns
                                .map((col: Record<string, any>) => col.title)
                                .join(',') +
                                '\n' +
                                props.element?.otherProps?.dataSource
                                  .map((row: Record<string, any>) =>
                                    Object.values(row).join(','),
                                  )
                                  .join('\n'),
                            ],
                            { type: 'text/plain' },
                          ),
                        }),
                      );
                    }

                    try {
                      navigator?.clipboard.write(clipboardItems);
                    } catch (error) {}
                  }}
                >
                  <CopyOutlined />
                </ActionIconBox>
              ) : null}
            </div>
          }
        >
          <div
            className={classNames(baseCls, hashId)}
            ref={tableRef}
            style={{
              flex: 1,
              minWidth: 0,
              boxShadow: `
                      ${scrollState.vertical.hasScroll && !scrollState.vertical.isAtStart ? 'inset 0 8px 8px -8px rgba(0,0,0,0.1)' : ''}
                      ${scrollState.vertical.hasScroll && !scrollState.vertical.isAtEnd ? 'inset 0 -8px 8px -8px rgba(0,0,0,0.1)' : ''}
                      ${scrollState.horizontal.hasScroll && !scrollState.horizontal.isAtStart ? 'inset 8px 0 8px -8px rgba(0,0,0,0.1)' : ''}
                      ${scrollState.horizontal.hasScroll && !scrollState.horizontal.isAtEnd ? 'inset -8px 0 8px -8px rgba(0,0,0,0.1)' : ''}
                    `,
            }}
          >
            {dom}
          </div>
        </Popover>
        <Modal
          title={editorProps?.tableConfig?.previewTitle || '预览表格'}
          open={previewOpen}
          closable
          footer={null}
          afterClose={() => {
            setPreviewOpen(false);
          }}
          width="80vw"
          onCancel={() => {
            setPreviewOpen(false);
          }}
        >
          <div
            className={classNames(
              baseCls,
              hashId,
              getPrefixCls('md-editor-content'),
            )}
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'auto',
              width: 'calc(80vw - 64px)',
            }}
            ref={modelTargetRef}
          >
            <ConfigProvider
              getPopupContainer={() => modelTargetRef.current || document.body}
              getTargetContainer={() => modelTargetRef.current || document.body}
            >
              {dom}
            </ConfigProvider>
          </div>
        </Modal>
      </>
    );
  }, [children, scrollState, previewOpen]);
};
