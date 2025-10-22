import React from 'react';
import { RenderElementProps } from 'slate-react';

export const Mermaid = ({ attributes, children }: RenderElementProps) => {
  return (
    <pre
      {...attributes}
      style={{
        height: '240px',
        minWidth: '398px',
        maxWidth: '800px',
        minHeight: '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch',
        zIndex: 5,
        color: 'rgb(27, 27, 27)',
        padding: '1em',
        margin: '1em 0',
        fontSize: '0.8em',
        lineHeight: '1.5',
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        fontFamily: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
        wordWrap: 'break-word',
        borderRadius: '12px',
        background: '#FFFFFF',
        boxShadow:
          '0px 0px 1px 0px rgba(0, 19, 41, 0.2),0px 1.5px 4px -1px rgba(0, 19, 41, 0.04)',
      }}
    >
      <code>{children}</code>
    </pre>
  );
};