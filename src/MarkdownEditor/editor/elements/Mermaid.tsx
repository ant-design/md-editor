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
        boxShadow: 'var(--shadow-control-base)',
      }}
    >
      <code>{children}</code>
    </pre>
  );
};