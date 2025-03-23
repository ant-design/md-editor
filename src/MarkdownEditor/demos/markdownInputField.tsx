import { MarkdownInputField } from '@ant-design/md-editor';
import React from 'react';

export default () => {
  const [list, setList] = React.useState<Set<string>>(() => new Set());
  const send = async (value: string) => {
    setList((prev) => {
      const next = new Set(prev);
      console.log(value);
      next.add(value);
      return next;
    });
  };
  return (
    <div
      style={{
        padding: '20px',
        margin: 'auto',
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <ul>
        {[...list].map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <MarkdownInputField onSend={send} placeholder="请输入内容" />
      <MarkdownInputField onSend={send} disabled placeholder="请输入内容" />
    </div>
  );
};
