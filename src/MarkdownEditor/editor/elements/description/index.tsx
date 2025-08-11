import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { RenderElementProps } from '../../slate-react';
import { useEditorStore } from '../../store';
import { DragHandle } from '../../tools/DragHandle';
import { useStyle } from './style';

function group(array: string | any[], subGroupLength: number) {
  if (!array || array.length === 0) {
    return [];
  }

  let index = 0;
  let newArray = [];

  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)));
  }

  return newArray;
}

export const Description = (props: RenderElementProps) => {
  const { store, markdownContainerRef } = useEditorStore();

  const context = useContext(ConfigProvider.ConfigContext);
  const baseCls = context.getPrefixCls('md-editor-description');
  const { wrapSSR, hashId } = useStyle(baseCls);
  return React.useMemo(() => {
    const subGroupLength =
      Math.max(
        Math.floor((markdownContainerRef.current?.clientWidth || 0) / 400),
        1,
      ) * 2;
    return wrapSSR(
      <div
        {...props.attributes}
        data-be={'table'}
        data-testid="description-container"
        onDragStart={(e) => store.dragStart(e, markdownContainerRef.current!)}
        className={classNames(baseCls, 'ant-md-editor-drag-el', hashId)}
      >
        <DragHandle />
        <table
          className={classNames(`${baseCls}-table`, hashId)}
          data-testid="description-table"
        >
          <tbody>
            {group(props.children, subGroupLength).map((item, index) => {
              return (
                <tr
                  key={index}
                  className={classNames(`${baseCls}-row`, hashId)}
                  data-testid="description-row"
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
};
