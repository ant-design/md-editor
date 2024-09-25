import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useMemo } from 'react';
import { RenderElementProps } from 'slate-react/dist/components/editable';
import { useEditorStore } from '../../store';
import { DragHandle } from '../../tools/DragHandle';
import { useStyle } from './style';

export function ColumnCell(props: RenderElementProps) {
  const store = useEditorStore();
  const contextFn = useCallback((e: React.MouseEvent, head?: boolean) => {
    store.openTableMenus(e, head);
  }, []);
  const context = useContext(ConfigProvider.ConfigContext);
  const baseCls = context.getPrefixCls('md-editor-column-group-cell');
  return React.useMemo(() => {
    return (
      <td
        {...props.attributes}
        data-be={'column-group-cell'}
        className={baseCls}
        onContextMenu={(e) => {
          contextFn(e);
        }}
      >
        {props.children}
      </td>
    );
  }, [props.element, props.element.children]);
}

export const ColumnGroup = observer((props: RenderElementProps) => {
  const store = useEditorStore();
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
          overflow: 'auto',
        }}
      >
        <DragHandle />
        <table className={classNames(hashId, baseCls)}>{props.children}</table>
      </div>,
    );
  }, [props.element.children]);
});
