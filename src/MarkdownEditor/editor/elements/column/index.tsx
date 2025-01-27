import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import { RenderElementProps } from '../../slate-react';
import { useEditorStore } from '../../store';
import { DragHandle } from '../../tools/DragHandle';
import { useStyle } from './style';

export function ColumnCell(props: RenderElementProps) {
  const context = useContext(ConfigProvider.ConfigContext);
  const baseCls = context.getPrefixCls('md-editor-column-group-cell');
  return React.useMemo(() => {
    return (
      <div
        {...props.attributes}
        data-be={'column-group-cell'}
        className={baseCls}
      >
        {props.children}
      </div>
    );
  }, [props.element, props.element.children]);
}

export const ColumnGroup = (props: RenderElementProps) => {
  const { store } = useEditorStore();
  const context = useContext(ConfigProvider.ConfigContext);
  const baseCls = context.getPrefixCls('md-editor-column-group');
  const { wrapSSR, hashId } = useStyle(baseCls);
  return useMemo(() => {
    return wrapSSR(
      <div
        className={'ant-md-editor-drag-el'}
        {...props.attributes}
        data-be={'column-group'}
        onDragStart={store.dragStart}
        style={{
          maxWidth: '100%',
        }}
      >
        <DragHandle />
        <div className={classNames(hashId, baseCls)}>{props.children}</div>
      </div>,
    );
  }, [props.element.children]);
};
