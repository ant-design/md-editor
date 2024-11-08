import { observer } from 'mobx-react-lite';
import React from 'react';
import { RenderElementProps } from 'slate-react/dist/components/editable';

export const WarpCard = observer((props: RenderElementProps) => {
  return React.useMemo(() => {
    return (
      <div
        {...props.attributes}
        data-be={'card'}
        style={{
          display: 'flex',
          gap: 1,
        }}
      >
        {props.children}
      </div>
    );
  }, [props.element.children]);
});
