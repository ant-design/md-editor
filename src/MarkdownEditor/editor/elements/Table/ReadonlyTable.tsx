import { FullscreenOutlined } from '@ant-design/icons';
import { ConfigProvider, Modal, Popover } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useContext, useMemo, useRef } from 'react';
import { ActionIconBox } from '../../components';
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
  ({ hashId, children }: { children: React.ReactNode; hashId: string }) => {
    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

    const baseCls = getPrefixCls('md-editor-content-table');

    const tableTargetRef = useRef<HTMLTableElement>(null);

    const [tableRef, scrollState] = useScrollShadow();

    return useMemo(() => {
      return (
        <Popover
          trigger={['click', 'hover']}
          arrow={false}
          styles={{
            body: {
              padding: 8,
            },
          }}
          content={
            <div>
              <ActionIconBox
                title="全屏"
                onClick={(e) => {
                  e.stopPropagation();

                  Modal.info({
                    icon: null,
                    title: '全屏预览表格',
                    closable: true,
                    footer: null,
                    content: (
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
                        ref={(dom) => {
                          if (dom) {
                            dom.appendChild(
                              tableTargetRef.current?.cloneNode(true) as Node,
                            );
                          }
                        }}
                      />
                    ),
                    width: '80vw',
                  });
                }}
              >
                <FullscreenOutlined />
              </ActionIconBox>
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
            <table
              ref={tableTargetRef}
              className={classNames(`${baseCls}-editor-table`, hashId)}
            >
              <tbody data-slate-node="element">{children}</tbody>
            </table>
          </div>
        </Popover>
      );
    }, [children, scrollState]);
  },
);
