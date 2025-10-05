import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useCallback, useContext } from 'react';
import { Editor, Transforms } from 'slate';
import { useSlate } from 'slate-react';
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
  key,
  columnIndex,
  tablePath,
}) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const baseClassName = context?.getPrefixCls(
    'md-editor-table-cell-index-spacer',
  );
  const { wrapSSR, hashId } = useStyle(baseClassName);
  const editor = useSlate();

  /**
   * 处理点击事件，选中整列
   */
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

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

        // 选中整列：从第一行的指定列到最后一行的指定列
        const firstRowPath = [...tablePath, 0, columnIndex];
        const lastRowPath = [...tablePath, rowCount - 1, columnIndex];

        // 检查路径是否有效
        if (
          Editor.hasPath(editor, firstRowPath) &&
          Editor.hasPath(editor, lastRowPath)
        ) {
          Transforms.select(editor, {
            anchor: Editor.start(editor, firstRowPath),
            focus: Editor.end(editor, lastRowPath),
          });
        }
      } catch (error) {
        console.warn('Failed to select table column:', error);
      }
    },
    [editor, columnIndex, tablePath],
  );

  return wrapSSR(
    <td
      key={key}
      className={classNames(baseClassName, hashId, className)}
      contentEditable={false}
      style={{
        cursor: columnIndex !== undefined ? 'pointer' : 'default',
        ...style,
      }}
      onClick={handleClick}
      title={columnIndex !== undefined ? '点击选中整列' : undefined}
    />,
  );
};
