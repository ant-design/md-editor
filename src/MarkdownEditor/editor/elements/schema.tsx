import React, { useMemo } from 'react';
import { RenderElementProps } from '../slate-react';

export const Schema: React.FC<RenderElementProps> = (props) => {
  const { element: node } = props;
  return useMemo(
    () => (
      <div
        {...node.attributes}
        style={{
          display: 'flex',
        }}
      >
        <div
          style={{
            padding: 8,
            width: '100%',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            borderRadius: 8,
            flex: 1,
            border: '1px solid rgb(209 213 219 / 0.8)',
            alignItems: 'center',
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseMove={(e) => {
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          data-be={node?.type}
        >
          {JSON.stringify(node?.value, null, 2)}
        </div>
        <span
          style={{
            display: 'none',
          }}
        >
          {props.children}
        </span>
      </div>
    ),
    [node],
  );
};
