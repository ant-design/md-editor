import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { RenderElementProps } from 'slate-react/dist/components/editable';
import { useEditorStore } from '../../store';
import { DragHandle } from '../../tools/DragHandle';
import { useStyle } from './style';

function group(array: string | any[], subGroupLength: number) {
  let index = 0;
  let newArray = [];

  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)));
  }

  return newArray;
}

export const Description = observer((props: RenderElementProps) => {
  const store = useEditorStore();

  const context = useContext(ConfigProvider.ConfigContext);
  const baseCls = context.getPrefixCls('md-editor-description');
  const { wrapSSR, hashId } = useStyle(baseCls);
  return React.useMemo(() => {
    const subGroupLength =
      Math.max(Math.floor((store.container?.clientWidth || 0) / 400), 1) * 2;

    return wrapSSR(
      <div
        {...props.attributes}
        data-be={'table'}
        onDragStart={store.dragStart}
        className={classNames(baseCls, 'ant-md-editor-drag-el', hashId)}
      >
        <DragHandle />
        <table className={classNames(`${baseCls}-table`, hashId)}>
          <tbody>
            {group(props.children, subGroupLength).map((item, index) => {
              return (
                <tr
                  key={index}
                  className={classNames(`${baseCls}-row`, hashId)}
                >
                  {item}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>,
    );
  }, [props.element.children]);
});
