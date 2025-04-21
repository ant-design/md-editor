import {
  CopyOutlined,
  DownloadOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { ConfigProvider, Modal, Popover } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { I18nContext } from '../../../../i18n';
import { parserSlateNodeToMarkdown, TableNode } from '../../../index';
import { ActionIconBox } from '../../components';
import { RenderElementProps } from '../../slate-react';
import { useEditorStore } from '../../store';
import useScrollShadow from './useScrollShadow';
export * from './TableCell';

/**
 * 表格组件，使用 `observer` 包装以响应状态变化。
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
export const ReadonlyTable = observer(
  ({
    hashId,
    children,
    ...props
  }: {
    children: React.ReactNode;
    hashId: string;
  } & RenderElementProps<TableNode>) => {
    const { editorProps } = useEditorStore();
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
    return useMemo(() => {
      const dom = (
        <table
          ref={tableTargetRef}
          className={classNames(`${baseCls}-editor-table`, hashId)}
        >
          <tbody data-slate-node="element">{children}</tbody>
        </table>
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
                        console.log(
                          props.element?.otherProps?.columns
                            .map((col: Record<string, any>) => col.title)
                            .join(',') +
                            '\n' +
                            props.element?.otherProps?.dataSource
                              .map((row: Record<string, any>) =>
                                Object.values(row).join(','),
                              )
                              .join('\n'),
                        );
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
                        });
                      }
                      try {
                        navigator?.clipboard.write(clipboardItems);
                      } catch (error) {}
                    }}
                  >
                    <CopyOutlined />
                  </ActionIconBox>
                ) : null}

                {actions.download ? (
                  <ActionIconBox
                    title="下载"
                    onClick={() => {
                      let csv =
                        props.element?.otherProps?.columns
                          .map((col: Record<string, any>) => col.title)
                          .join(',') + '\n';
                      csv += props.element?.otherProps?.dataSource
                        .map((row: Record<string, any>) =>
                          Object.values(row).join(','),
                        )
                        .join('\n');
                      const blob = new Blob([csv], {
                        type: 'text/csv;charset=utf-8;',
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'table.csv';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <DownloadOutlined />
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
            onClose={() => {
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
                getPopupContainer={() =>
                  modelTargetRef.current || document.body
                }
                getTargetContainer={() =>
                  modelTargetRef.current || document.body
                }
              >
                {dom}
              </ConfigProvider>
            </div>
          </Modal>
        </>
      );
    }, [children, scrollState, previewOpen]);
  },
);
