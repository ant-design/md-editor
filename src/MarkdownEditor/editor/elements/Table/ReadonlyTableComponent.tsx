import { CopyOutlined, FullscreenOutlined } from '@ant-design/icons';
import { ConfigProvider, Modal, Popover } from 'antd';
import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TableNode } from '.';
import { I18nContext } from '../../../../i18n';
import { parserSlateNodeToMarkdown } from '../../../index';
import { ActionIconBox } from '../../components';
import { useEditorStore } from '../../store';

interface ReadonlyTableComponentProps {
  hashId: string;
  children: React.ReactNode;
  element: TableNode;
  baseCls: string;
}

/**
 * 专门针对 readonly 模式优化的表格组件
 * 移除了不必要的滚动监听和复杂的宽度计算
 */
export const ReadonlyTableComponent: React.FC<ReadonlyTableComponentProps> =
  React.memo(({ hashId, children, element, baseCls }) => {
    const { editorProps } = useEditorStore();
    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    const {
      actions = {
        download: 'csv',
        fullScreen: 'modal',
        copy: 'md',
      },
    } = editorProps?.tableConfig || {};

    const tableTargetRef = useRef<HTMLTableElement>(null);
    const modelTargetRef = useRef<HTMLDivElement>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const i18n = useContext(I18nContext);

    // 简化的列宽计算 - 只为 readonly 模式设计
    const colWidths = useMemo(() => {
      const otherProps = element?.otherProps as any;
      if (otherProps?.colWidths) {
        return otherProps.colWidths;
      }

      const columnCount = element?.children?.[0]?.children?.length || 0;
      if (columnCount === 0) return [];

      // 使用固定宽度避免复杂计算
      const defaultWidth = 120;
      return Array(columnCount).fill(defaultWidth);
    }, [element?.otherProps, element?.children?.[0]?.children?.length]);

    // 缓存复制处理函数
    const handleCopy = useCallback(() => {
      if (location.protocol !== 'https:') {
        document.execCommand(
          'copy',
          false,
          parserSlateNodeToMarkdown([element]),
        );
        return;
      }

      const clipboardItems: ClipboardItems = [];
      navigator?.clipboard.write([
        new ClipboardItem({
          'application/x-slate-md-fragment': new Blob(
            [JSON.stringify(element)],
            { type: 'application/x-slate-md-fragment' },
          ),
        }),
      ]);

      if (actions.copy === 'html') {
        clipboardItems.push(
          new ClipboardItem({
            'text/plain': new Blob([tableTargetRef.current?.innerHTML || ''], {
              type: 'text/plain',
            }),
          }),
        );
      }

      if (actions.copy === 'md') {
        clipboardItems.push(
          new ClipboardItem({
            'text/plain': new Blob([parserSlateNodeToMarkdown([element])], {
              type: 'text/plain',
            }),
          }),
        );
      }

      if (actions.copy === 'csv') {
        const otherProps = element?.otherProps as any;
        if (otherProps?.columns && otherProps?.dataSource) {
          clipboardItems.push(
            new ClipboardItem({
              'text/plain': new Blob(
                [
                  otherProps.columns
                    .map((col: Record<string, any>) => col.title)
                    .join(',') +
                    '\n' +
                    otherProps.dataSource
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
      }

      try {
        navigator?.clipboard.write(clipboardItems);
      } catch (error) {
        console.warn('Failed to copy to clipboard:', error);
      }
    }, [element, actions.copy]);

    // 缓存全屏处理函数
    const handleFullScreen = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setPreviewOpen(true);
    }, []);

    // 缓存模态框关闭函数
    const handleModalClose = useCallback(() => {
      setPreviewOpen(false);
    }, []);

    // 缓存表格DOM
    const tableDom = useMemo(
      () => (
        <table
          ref={tableTargetRef}
          style={{
            userSelect: 'none',
          }}
          className={classNames(`${baseCls}-editor-table`, hashId)}
        >
          <colgroup>
            {colWidths.map((colWidth: number, index: number) => (
              <col
                key={index}
                style={{
                  width: colWidth,
                  minWidth: colWidth,
                  maxWidth: colWidth,
                }}
              />
            ))}
          </colgroup>
          <tbody data-slate-node="element">{children}</tbody>
        </table>
      ),
      [colWidths, children, hashId, baseCls],
    );

    // 缓存操作按钮内容
    const popoverContent = useMemo(
      () => (
        <div style={{ display: 'flex', gap: 8 }}>
          {actions.fullScreen && (
            <ActionIconBox
              title={i18n?.locale?.fullScreen || '全屏'}
              onClick={handleFullScreen}
            >
              <FullscreenOutlined />
            </ActionIconBox>
          )}
          {actions.copy && (
            <ActionIconBox
              title={i18n?.locale?.copy || '复制'}
              onClick={handleCopy}
            >
              <CopyOutlined />
            </ActionIconBox>
          )}
        </div>
      ),
      [
        actions.fullScreen,
        actions.copy,
        i18n?.locale,
        handleFullScreen,
        handleCopy,
      ],
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
          content={popoverContent}
        >
          <div
            className={classNames(baseCls, hashId)}
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            {tableDom}
          </div>
        </Popover>

        {previewOpen && (
          <Modal
            title={editorProps?.tableConfig?.previewTitle || '预览表格'}
            open={previewOpen}
            closable
            footer={null}
            afterClose={handleModalClose}
            width="80vw"
            onCancel={handleModalClose}
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
                {tableDom}
              </ConfigProvider>
            </div>
          </Modal>
        )}
      </>
    );
  });

ReadonlyTableComponent.displayName = 'ReadonlyTableComponent';
