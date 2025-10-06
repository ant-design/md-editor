import { DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext, useRef } from 'react';
import { Editor, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { useClickAway } from '../../../../../hooks/useClickAway';
import { useRefFunction } from '../../../../../hooks/useRefFunction';
import { NativeTableEditor } from '../../../../utils/native-table';
import { TablePropsContext } from '../TableContext';
import { useStyle } from './style';

/**
 * TableCellIndexSpacer 组件的属性接口
 */
export interface TableCellIndexSpacerProps {
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 单元格的唯一标识 */
  key?: React.Key;
  /** 列索引，用于选中整列 */
  columnIndex?: number;
  /** 表格路径，用于定位表格元素 */
  tablePath?: number[];
  /** 行索引，用于单元格删除 */
  rowIndex?: number;
}

/**
 * TableCellIndexSpacer 组件 - 表格索引间隔单元格组件
 *
 * 该组件用于渲染表格行索引中的间隔单元格，用于占位和布局。
 * 使用 context 来生成 className，支持样式自定义。
 *
 * @component
 * @description 表格索引间隔单元格组件，用于占位和布局
 * @param {TableCellIndexSpacerProps} props - 组件属性
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {string} [props.className] - 自定义类名
 * @param {React.Key} [props.key] - 单元格的唯一标识
 * @param {number} [props.columnIndex] - 列索引，用于选中整列
 * @param {number[]} [props.tablePath] - 表格路径，用于定位表格元素
 *
 * @example
 * ```tsx
 * <TableCellIndexSpacer
 *   style={{ backgroundColor: '#f5f5f5' }}
 *   className="custom-spacer-cell"
 *   key={0}
 *   columnIndex={1}
 *   tablePath={[0, 2]}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的表格索引间隔单元格组件
 *
 * @remarks
 * - 使用 ConfigProvider context 生成 className
 * - 支持自定义样式覆盖
 * - 不可编辑状态
 * - 用于占位和布局
 * - 支持点击选中整列功能
 */
export const TableCellIndexSpacer: React.FC<TableCellIndexSpacerProps> = ({
  style,
  className,
  columnIndex,
  tablePath,
  rowIndex,
}) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const baseClassName = context?.getPrefixCls(
    'md-editor-table-cell-index-spacer',
  );
  const { wrapSSR, hashId } = useStyle(baseClassName);
  const editor = useSlate();
  const tableContext = useContext(TablePropsContext);

  const { deleteIconPosition, setDeleteIconPosition } = tableContext;

  /**
   * 处理点击事件，选中整列或显示删除图标
   */
  const handleClick = useRefFunction((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 如果提供了行索引和列索引，显示删除图标
    setDeleteIconPosition?.({
      rowIndex: rowIndex,
      columnIndex: columnIndex,
    });

    if (columnIndex === undefined || !tablePath) {
      return;
    }

    try {
      // 获取表格元素
      const tableElement = Editor.node(editor, tablePath)[0] as any;
      if (!tableElement || tableElement.type !== 'table') {
        return;
      }

      // 获取表格的行数
      const rowCount = tableElement.children?.length || 0;
      if (rowCount === 0) {
        return;
      }

      // 根据 columnIndex 的值决定选中逻辑
      if (columnIndex === -1) {
        // 选中所有单元格
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
          const rowElement = tableElement.children[rowIndex];
          if (rowElement && rowElement.children) {
            for (
              let colIndex = 0;
              colIndex < rowElement.children.length;
              colIndex++
            ) {
              const cellPath = [...tablePath, rowIndex, colIndex];
              if (Editor.hasPath(editor, cellPath)) {
                const [cellNode] = Editor.node(editor, cellPath);
                if (cellNode && (cellNode as any).type === 'table-cell') {
                  Transforms.setNodes(
                    editor,
                    { select: true },
                    { at: cellPath },
                  );
                }
              }
            }
          }
        }
        return;
      }
      // 清除所有列的选中状态
      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const rowElement = tableElement.children[rowIndex];
        if (rowElement && rowElement.children) {
          for (
            let colIndex = 0;
            colIndex < rowElement.children.length;
            colIndex++
          ) {
            const cellPath = [...tablePath, rowIndex, colIndex];
            if (Editor.hasPath(editor, cellPath)) {
              const [cellNode] = Editor.node(editor, cellPath);
              if (cellNode && (cellNode as any).type === 'table-cell') {
                Transforms.setNodes(
                  editor,
                  { select: false },
                  { at: cellPath },
                );
              }
            }
          }
        }
      }
      // 选中指定列的所有单元格
      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const cellPath = [...tablePath, rowIndex, columnIndex];
        if (Editor.hasPath(editor, cellPath)) {
          const [cellNode] = Editor.node(editor, cellPath);
          if (cellNode && (cellNode as any).type === 'table-cell') {
            Transforms.setNodes(editor, { select: true }, { at: cellPath });
          }
        }
      }
    } catch (error) {
      console.warn('Failed to select table column:', error);
    }
  });

  /**
   * 处理删除图标点击事件
   */
  const handleDeleteClick = useRefFunction((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!tablePath || rowIndex === undefined || columnIndex === undefined) {
        return;
      }

      // 获取表格元素
      const tableElement = Editor.node(editor, tablePath)[0] as any;
      if (!tableElement || tableElement.type !== 'table') {
        return;
      }

      const rowCount = tableElement.children.length;
      const firstRow = tableElement.children[0] as any;
      const colCount = firstRow.children.length;

      // 检查是否只有一行一列
      if (rowCount <= 1 && colCount <= 1) {
        // 如果只有一行一列，删除整个表格
        NativeTableEditor.removeTable(editor, tablePath);
        return;
      }

      // 检查是否只有一行
      if (rowCount <= 1) {
        // 如果只有一行，删除整个表格
        NativeTableEditor.removeTable(editor, tablePath);
        return;
      }

      // 检查是否只有一列
      if (colCount <= 1) {
        // 如果只有一列，删除整个表格
        NativeTableEditor.removeTable(editor, tablePath);
        return;
      }

      // 删除指定单元格
      const cellPath = [...tablePath, rowIndex, columnIndex];
      if (Editor.hasPath(editor, cellPath)) {
        Transforms.removeNodes(editor, { at: cellPath });
      }
      setDeleteIconPosition?.(null);
    } catch (error) {
      console.warn('Failed to delete table cell:', error);
    }
  });

  // 添加全局点击监听器
  React.useEffect(() => {
    const handleDocumentClick = () => {
      if (!deleteIconPosition) return;
      if (!tablePath) return;
      setDeleteIconPosition?.(null);
      // 获取表格元素
      const tableElement = Editor.node(editor, tablePath)[0] as any;
      if (!tableElement || tableElement.type !== 'table') {
        return;
      }

      // 获取表格的行数
      const rowCount = tableElement.children?.length || 0;
      if (rowCount === 0) {
        return;
      }

      // 清除所有列的选中状态
      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const rowElement = tableElement.children[rowIndex];
        if (rowElement && rowElement.children) {
          for (
            let colIndex = 0;
            colIndex < rowElement.children.length;
            colIndex++
          ) {
            const cellPath = [...tablePath, rowIndex, colIndex];
            if (Editor.hasPath(editor, cellPath)) {
              const [cellNode] = Editor.node(editor, cellPath);
              if (cellNode && (cellNode as any).type === 'table-cell') {
                Transforms.setNodes(
                  editor,
                  { select: false },
                  { at: cellPath },
                );
              }
            }
          }
        }
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const ref = useRef<HTMLTableDataCellElement>(null);

  // 检查是否应该显示删除图标
  const shouldShowDeleteIcon =
    deleteIconPosition &&
    deleteIconPosition.rowIndex === rowIndex &&
    deleteIconPosition.columnIndex === columnIndex;

  useClickAway(() => {
    if (shouldShowDeleteIcon) {
      setDeleteIconPosition?.(null);
    }
  }, ref);

  return wrapSSR(
    <td
      ref={ref}
      className={classNames(baseClassName, hashId, className, 'config-td')}
      contentEditable={false}
      style={{
        cursor:
          columnIndex !== undefined ||
          (rowIndex !== undefined && columnIndex !== undefined)
            ? 'pointer'
            : 'default',
        padding: 0,
        position: 'relative',
        backgroundColor: shouldShowDeleteIcon
          ? 'var(--color-primary-control-fill-primary-active)'
          : undefined,
        ...style,
      }}
      onClick={handleClick}
      title={
        rowIndex !== undefined && columnIndex !== undefined
          ? '点击显示删除图标'
          : columnIndex !== undefined
            ? columnIndex === -1
              ? '点击选中整个表格'
              : '点击选中整列，右键删除列'
            : undefined
      }
    >
      <div
        className={classNames(
          `${baseClassName}-delete-icon`,
          shouldShowDeleteIcon && `${baseClassName}-delete-icon-visible`,
          hashId,
        )}
        onClick={handleDeleteClick}
        title="删除单元格"
      >
        <DeleteOutlined />
      </div>
    </td>,
  );
};
