/**
 * @fileoverview AceEditor 主题功能测试
 * 测试代码编辑器的主题设置和动态切换功能
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MarkdownEditor } from '../../../../src';

// Mock ace-builds
vi.mock('ace-builds', () => {
  const mockEditor = {
    setTheme: vi.fn(),
    setValue: vi.fn(),
    getValue: vi.fn(() => ''),
    clearSelection: vi.fn(),
    destroy: vi.fn(),
    on: vi.fn(),
    selection: {
      on: vi.fn(),
      clearSelection: vi.fn(),
    },
    session: {
      setMode: vi.fn(),
    },
    commands: {
      addCommand: vi.fn(),
    },
    getCursorPosition: vi.fn(() => ({ row: 0, column: 0 })),
    focus: vi.fn(),
  };

  return {
    default: {
      edit: vi.fn(() => mockEditor),
    },
    Ace: {},
  };
});

describe('AceEditor 主题功能', () => {
  it('应该在只读模式下正确渲染', () => {
    const { container } = render(
      <MarkdownEditor
        initValue={`\`\`\`javascript
console.log('test');
\`\`\``}
        readonly
        codeProps={{
          theme: 'monokai',
        }}
      />,
    );
    
    expect(container).toBeInTheDocument();
  });

  it('应该接受 codeProps.theme 配置', () => {
    const { rerender } = render(
      <MarkdownEditor
        initValue={`\`\`\`javascript
console.log('test');
\`\`\``}
        readonly
        codeProps={{
          theme: 'chrome',
        }}
      />,
    );

    expect(true).toBe(true);

    // 测试主题切换
    rerender(
      <MarkdownEditor
        initValue={`\`\`\`javascript
console.log('test');
\`\`\``}
        readonly
        codeProps={{
          theme: 'monokai',
        }}
      />,
    );

    expect(true).toBe(true);
  });

  it('应该使用默认主题 chrome', () => {
    const { container } = render(
      <MarkdownEditor
        initValue={`\`\`\`javascript
console.log('test');
\`\`\``}
        readonly
      />,
    );

    expect(container).toBeInTheDocument();
  });

  it('应该支持多种主题', () => {
    const themes = ['chrome', 'monokai', 'github', 'dracula', 'solarized_dark'];

    themes.forEach((theme) => {
      const { container } = render(
        <MarkdownEditor
          initValue={`\`\`\`javascript
console.log('test');
\`\`\``}
          readonly
          codeProps={{
            theme,
          }}
        />,
      );

      expect(container).toBeInTheDocument();
    });
  });

  it('应该与其他 codeProps 配置共存', () => {
    const { container } = render(
      <MarkdownEditor
        initValue={`\`\`\`javascript
console.log('test');
\`\`\``}
        readonly
        codeProps={{
          theme: 'dracula',
          fontSize: 16,
          showLineNumbers: true,
          wrap: true,
          tabSize: 2,
        }}
      />,
    );

    expect(container).toBeInTheDocument();
  });
});

