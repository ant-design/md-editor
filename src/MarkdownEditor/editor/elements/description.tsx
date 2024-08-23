import { observer } from 'mobx-react-lite';
import React from 'react';
import { RenderElementProps } from 'slate-react/dist/components/editable';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';

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
  const subGroupLength =
    Math.max(Math.floor((store.container?.clientWidth || 0) / 400), 1) * 2;

  return React.useMemo(() => {
    return (
      <div
        className={'drag-el'}
        {...props.attributes}
        data-be={'table'}
        onDragStart={store.dragStart}
        style={{
          maxWidth: '100%',
          overflow: 'auto',
        }}
      >
        <DragHandle />
        <table className="m-editor-description">
          <tbody>
            {group(props.children, subGroupLength).map((item, index) => {
              return <tr key={index}>{item}</tr>;
            })}
          </tbody>
        </table>
      </div>
    );
  }, [props.element.children]);
});
