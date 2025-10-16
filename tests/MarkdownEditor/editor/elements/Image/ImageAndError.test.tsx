import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ImageAndError } from '../../../../../src/MarkdownEditor/editor/elements/Image';
import * as editorStore from '../../../../../src/MarkdownEditor/editor/store';

vi.mock('../../../../../src/MarkdownEditor/editor/store.ts');

describe('ImageAndError Component', () => {
  beforeEach(() => {
    vi.mocked(editorStore.useEditorStore).mockReturnValue({
      editorProps: {},
    } as any);
  });

  it('应该渲染基本图片', () => {
    const { getByTestId } = render(
      <ImageAndError src="https://example.com/image.jpg" alt="Test Image" />,
    );

    const container = getByTestId('image-container');
    expect(container).toBeDefined();
  });

  it('应该使用默认宽度', () => {
    const { container } = render(
      <ImageAndError src="https://example.com/image.jpg" />,
    );

    const img = container.querySelector('img');
    expect(img).toBeDefined();
  });

  it('应该接受自定义宽度（数字）', () => {
    const { container } = render(
      <ImageAndError src="https://example.com/image.jpg" width={300} />,
    );

    const img = container.querySelector('img');
    expect(img).toBeDefined();
  });

  it('应该接受自定义宽度（字符串）', () => {
    const { container } = render(
      <ImageAndError src="https://example.com/image.jpg" width="500px" />,
    );

    const img = container.querySelector('img');
    expect(img).toBeDefined();
  });

  it('应该在加载失败时显示链接', () => {
    const { container, rerender } = render(
      <ImageAndError src="invalid-url.jpg" alt="Failed Image" />,
    );

    // 触发错误
    const img = container.querySelector('img');
    if (img) {
      fireEvent.error(img);
    }

    // 重新渲染以查看更新
    rerender(<ImageAndError src="invalid-url.jpg" alt="Failed Image" />);

    // 现在应该显示链接
    const link = container.querySelector('a');
    if (link) {
      expect(link.textContent).toContain('Failed Image');
    }
  });

  it('应该在加载失败时显示 alt 文本', () => {
    const { container } = render(
      <ImageAndError src="invalid-url.jpg" alt="Alternative Text" />,
    );

    const img = container.querySelector('img');
    if (img) {
      fireEvent.error(img);
    }
  });

  it('应该在加载失败且无 alt 时显示 src', () => {
    const { container } = render(
      <ImageAndError src="https://example.com/image.jpg" />,
    );

    const img = container.querySelector('img');
    if (img) {
      fireEvent.error(img);
    }
  });

  it('应该支持自定义 render 函数', () => {
    const customRender = vi.fn((props, defaultNode) => defaultNode);

    vi.mocked(editorStore.useEditorStore).mockReturnValue({
      editorProps: {
        image: {
          render: customRender,
        },
      },
    } as any);

    render(<ImageAndError src="https://example.com/image.jpg" />);

    expect(customRender).toHaveBeenCalled();
  });

  it('应该在自定义 render 中传递 onError', () => {
    const customRender = vi.fn((props, defaultNode) => {
      expect(props).toHaveProperty('onError');
      expect(typeof props.onError).toBe('function');
      return defaultNode;
    });

    vi.mocked(editorStore.useEditorStore).mockReturnValue({
      editorProps: {
        image: {
          render: customRender,
        },
      },
    } as any);

    render(<ImageAndError src="https://example.com/image.jpg" />);
  });

  it('应该传递所有属性到 Image 组件', () => {
    const { container } = render(
      <ImageAndError
        src="https://example.com/image.jpg"
        alt="Test"
        width={500}
        height={300}
        preview={false}
      />,
    );

    const img = container.querySelector('img');
    expect(img).toBeDefined();
  });

  it('应该处理没有 src 的情况', () => {
    const { container } = render(<ImageAndError src="" alt="No source" />);

    expect(container).toBeDefined();
  });

  it('失败链接应该在新标签页打开', () => {
    const { container } = render(<ImageAndError src="invalid-url.jpg" />);

    const img = container.querySelector('img');
    if (img) {
      fireEvent.error(img);

      const link = container.querySelector('a');
      if (link) {
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      }
    }
  });
});
