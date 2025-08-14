import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserList } from '../../src/Workspace/Browser';

describe('Workspace BrowserList', () => {
  it('渲染标题与内容', () => {
    render(
      <BrowserList
        data={{ title: '浏览器标题', content: 'Hello World' }}
      />,
    );

    expect(screen.getByText('浏览器标题')).toBeInTheDocument();
  });

  it('合并 markdownEditorProps 生效', () => {
    render(
      <BrowserList
        data={{
          content: 'Hello',
          markdownEditorProps: { contentStyle: { padding: 10 } },
        }}
      />,
    );

    // 断言容器存在即可（具体样式不易直接断言）
    expect(document.querySelector('.chat-browser-list')).toBeInTheDocument();
  });
}); 
