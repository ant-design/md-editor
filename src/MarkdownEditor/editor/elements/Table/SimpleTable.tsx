import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { RenderElementProps } from 'slate-react';
import { TableNode } from '../../types/Table';
import { useTableStyle } from './style';
import { ReadonlyTable } from './Table';
import { TablePropsContext } from './TableContext';

/**
 * 简单表格组件 - 仅支持只读显示
 * 用于替代复杂的 Handsontable 实现，提供基础的表格功能
 */
export const SimpleTable = (props: RenderElementProps) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const baseCls = getPrefixCls('md-editor-content-table');
  const { wrapSSR, hashId } = useTableStyle(baseCls, {});

  return wrapSSR(
    <TablePropsContext.Provider
      value={{
        tablePath: props.element?.path,
        tableNode: props.element as TableNode,
      }}
    >
      <div
        {...props.attributes}
        data-be={'table'}
        draggable={false}
        className={classNames(`${baseCls}-container`, hashId)}
      >
        <ReadonlyTable {...props} hashId={hashId}>
          {props.children}
        </ReadonlyTable>
      </div>
    </TablePropsContext.Provider>,
  );
};
