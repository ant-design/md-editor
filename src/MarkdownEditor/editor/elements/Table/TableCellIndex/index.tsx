import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { useStyle } from './style';

/**
 * TableCellIndex 组件的属性接口
 */
export interface TableCellIndexProps {
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;

  targetRow: any;
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
 *
 * @example
 * ```tsx
 * <TableCellIndex
 *   style={{ backgroundColor: '#f5f5f5' }}
 *   className="custom-index-cell"
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
 */
export const TableCellIndex: React.FC<TableCellIndexProps> = ({
  style,
  className,
}) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const baseClassName = context?.getPrefixCls('md-editor-table-cell-index');
  const { wrapSSR, hashId } = useStyle(baseClassName);

  return wrapSSR(
    <td
      className={classNames(baseClassName, hashId, className)}
      contentEditable={false}
      style={style}
    />,
  );
};
