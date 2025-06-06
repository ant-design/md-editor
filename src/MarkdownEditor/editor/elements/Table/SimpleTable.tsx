import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { TableNode } from '../../../el';
import { RenderElementProps } from '../../slate-react';
import { ReadonlyTable } from './ReadonlyTable';
import { useTableStyle } from './style';
import { TablePropsContext } from './TableContext';

/**
 * 简单表格组件 - 仅支持只读显示
 * 用于替代复杂的 Handsontable 实现，提供基础的表格功能
 */
export const SimpleTable = (props: RenderElementProps<TableNode>) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const baseCls = getPrefixCls('md-editor-content-table');
  const { wrapSSR, hashId } = useTableStyle(baseCls, {});

  return wrapSSR(
    <TablePropsContext.Provider value={{}}>
      <div
        {...props.attributes}
        data-be={'table'}
        draggable={false}
        className={classNames(`${baseCls}-container`, hashId)}
        tabIndex={0}
      >
        <div
          style={{
            maxWidth: '100%',
            width: '100%',
          }}
        >
          <ReadonlyTable {...props} hashId={hashId}>
            {props.children}
          </ReadonlyTable>
        </div>
      </div>
    </TablePropsContext.Provider>,
  );
};
