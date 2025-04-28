import { observer } from 'mobx-react';
import React from 'react';
import { RenderElementProps } from '../../slate-react';

export const WarpCard = observer((props: RenderElementProps) => {
  return React.useMemo(() => {
    return (
      <div
        {...props.attributes}
        data-be={'card'}
        style={{
          ...props.element.style,
          display: props.element.block === false ? 'inline-flex' : 'flex',
          gap: 4,
          maxWidth: '100%',
        }}
      >
        {props.children}
      </div>
    );
  }, [props.element.children, props.element.block]);
});
