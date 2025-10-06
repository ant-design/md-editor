import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useCallback, useContext } from 'react';
import { Editor, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { useStyle } from './style';

/**
 * TableCellIndex 组件的属性接口
 */
export interface TableCellIndexProps {
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 目标行元素 */
  targetRow: any;
  /** 行索引，用于选中整行 */
  rowIndex?: number;
  /** 表格路径，用于定位表格元素 */
  tablePath?: number[];
}

/**
 * TableCellIndex 组件 - 表格行索引单元格组件
 *
 * 该组件用于渲染表格行的索引单元格，显示行号或索引信息。
 * 使用 context 来生成 className，支持样式自定义。
 *
 * @component
 * @description 表格行索引单元格组件，用于显示行索引
 * @param {TableCellIndexProps} props - 组件属性
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {string} [props.className] - 自定义类名
 * @param {any} props.targetRow - 目标行元素
 * @param {number} [props.rowIndex] - 行索引，用于选中整行
 * @param {number[]} [props.tablePath] - 表格路径，用于定位表格元素
 *
 * @example
 * ```tsx
 * <TableCellIndex
 *   style={{ backgroundColor: '#f5f5f5' }}
 *   className="custom-index-cell"
 *   targetRow={rowElement}
 *   rowIndex={0}
 *   tablePath={[0]}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的表格索引单元格组件
 *
 * @remarks
 * - 使用 ConfigProvider context 生成 className
 * - 支持自定义样式覆盖
 * - 不可编辑状态
 * - 固定宽度和垂直对齐
 * - 支持点击选中整行功能
 */
export const TableCellIndex: React.FC<TableCellIndexProps> = ({
  style,
  className,
  rowIndex,
  tablePath,
}) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const baseClassName = context?.getPrefixCls('md-editor-table-cell-index');
  const { wrapSSR, hashId } = useStyle(baseClassName);
  const editor = useSlate();

  /**
   * 处理点击事件，选中整行
   */
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (rowIndex === undefined || !tablePath) {
        return;
      }

      try {
        // 获取表格元素
        const tableElement = Editor.node(editor, tablePath)[0] as any;
        if (!tableElement || tableElement.type !== 'table') {
          return;
        }

        // 获取表格的行数和列数
        const rowCount = tableElement.children?.length || 0;
        if (rowCount === 0) {
          return;
        }

        // 清除所有行的选中状态
        for (let rowIdx = 0; rowIdx < rowCount; rowIdx++) {
          const rowElement = tableElement.children[rowIdx];
          if (rowElement && rowElement.children) {
            for (
              let colIdx = 0;
              colIdx < rowElement.children.length;
              colIdx++
            ) {
              const cellPath = [...tablePath, rowIdx, colIdx];
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

        // 选中指定行的所有单元格
        const rowElement = tableElement.children[rowIndex];
        if (rowElement && rowElement.children) {
          for (let colIdx = 0; colIdx < rowElement.children.length; colIdx++) {
            const cellPath = [...tablePath, rowIndex, colIdx];
            if (Editor.hasPath(editor, cellPath)) {
              const [cellNode] = Editor.node(editor, cellPath);
              if (cellNode && (cellNode as any).type === 'table-cell') {
                Transforms.setNodes(editor, { select: true }, { at: cellPath });
              }
            }
          }
        }
      } catch (error) {
        console.warn('Failed to select table row:', error);
      }
    },
    [editor, rowIndex, tablePath],
  );

  return wrapSSR(
    <td
      className={classNames(baseClassName, hashId, className, 'config-td')}
      contentEditable={false}
      style={{
        padding: 0,
        cursor: rowIndex !== undefined ? 'pointer' : 'default',
        ...style,
      }}
      onClick={handleClick}
      title={rowIndex !== undefined ? '点击选中整行' : undefined}
    />,
  );
};
