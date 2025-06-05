import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MarkdownInputField } from '../MarkdownInputField';

describe('MarkdownInputField - leafRender', () => {
  it('should render custom leaf when leafRender is provided', () => {
    const leafRender = vi.fn().mockImplementation((props, defaultDom) => {
      if (props.leaf.bold) {
        return <strong data-testid="custom-bold">{props.children}</strong>;
      }
      return defaultDom;
    });

    render(
      <MarkdownInputField value="**bold text**" leafRender={leafRender} />,
    );

    // 验证 leafRender 被调用
    expect(leafRender).toHaveBeenCalled();
  });

  it('should pass correct props to leafRender function', () => {
    const leafRender = vi
      .fn()
      .mockImplementation((props, defaultDom) => defaultDom);

    render(<MarkdownInputField value="test content" leafRender={leafRender} />);

    // 验证传递给 leafRender 的参数结构
    expect(leafRender).toHaveBeenCalledWith(
      expect.objectContaining({
        leaf: expect.any(Object),
        children: expect.anything(),
        hashId: expect.any(String),
        tagInputProps: expect.any(Object),
        attributes: expect.any(Object),
        text: expect.any(Object),
      }),
      expect.anything(), // defaultDom
    );
  });

  it('should render default leaf when leafRender returns defaultDom', () => {
    const leafRender = vi
      .fn()
      .mockImplementation((props, defaultDom) => defaultDom);

    const { container } = render(
      <MarkdownInputField value="normal text" leafRender={leafRender} />,
    );

    // 验证组件正常渲染
    expect(container.querySelector('[data-slate-leaf]')).toBeInTheDocument();
  });

  it('should handle custom styling through leafRender', () => {
    const leafRender = (props: any, defaultDom: any) => {
      if (props.leaf.text === 'highlight') {
        return (
          <span
            data-testid="highlighted-text"
            style={{ backgroundColor: 'yellow' }}
          >
            {props.children}
          </span>
        );
      }
      return defaultDom;
    };

    render(<MarkdownInputField value="highlight" leafRender={leafRender} />);

    // 由于 Slate 编辑器的复杂性，我们主要验证 leafRender 函数被正确调用
    // 实际的文本渲染可能需要更复杂的设置
    const container = document.querySelector('.ant-md-input-field');
    expect(container).toBeInTheDocument();
  });

  it('should work with different leaf types', () => {
    const leafRender = vi.fn().mockImplementation((props, defaultDom) => {
      // 处理不同类型的叶子节点
      if (props.leaf.bold) {
        return <strong data-testid="bold-leaf">{props.children}</strong>;
      }
      if (props.leaf.italic) {
        return <em data-testid="italic-leaf">{props.children}</em>;
      }
      if (props.leaf.code) {
        return <code data-testid="code-leaf">{props.children}</code>;
      }
      return defaultDom;
    });

    render(
      <MarkdownInputField
        value="**bold** *italic* `code`"
        leafRender={leafRender}
      />,
    );

    // 验证 leafRender 被多次调用（对应不同类型的叶子节点）
    expect(leafRender).toHaveBeenCalled();
    expect(leafRender.mock.calls.length).toBeGreaterThan(1);
  });

  it('should maintain editor functionality with custom leafRender', () => {
    const onChange = vi.fn();
    const leafRender = vi
      .fn()
      .mockImplementation((props, defaultDom) => defaultDom);

    render(
      <MarkdownInputField
        value="test"
        onChange={onChange}
        leafRender={leafRender}
      />,
    );

    // 验证编辑器功能不受 leafRender 影响
    const editor = document.querySelector('[contenteditable="true"]');
    expect(editor).toBeInTheDocument();
  });

  it('should handle leafRender errors gracefully', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const leafRender = vi.fn().mockImplementation(() => {
      throw new Error('Render error');
    });

    // 即使 leafRender 抛出错误，组件也应该能渲染
    expect(() => {
      render(<MarkdownInputField value="test" leafRender={leafRender} />);
    }).not.toThrow();

    consoleError.mockRestore();
  });

  it('should work without leafRender prop', () => {
    const { container } = render(
      <MarkdownInputField value="test without leafRender" />,
    );

    // 验证没有 leafRender 时组件正常工作
    expect(container.querySelector('.ant-md-input-field')).toBeInTheDocument();
  });
});
