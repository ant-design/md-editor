import React from 'react';
import { RenderElementProps } from 'slate-react';

export const Schema: React.FC<RenderElementProps> = (props) => {
  const { element: node } = props;

  return (
    <div
      contentEditable={false}
      style={{
        padding: 24,
        borderRadius: 8,
        border: '1px solid rgb(209 213 219 / 0.8)',
      }}
    >
      <code>{JSON.stringify(node.value, null, 2)}</code>
    </div>
  );
  return null;
};
