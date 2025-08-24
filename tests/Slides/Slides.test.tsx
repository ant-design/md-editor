import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Slides } from '../../src/Slides';

// Mock Reveal.js
const mockReveal = {
  initialize: vi.fn().mockResolvedValue(undefined),
  destroy: vi.fn(),
};

vi.mock('reveal.js', () => ({
  default: vi.fn().mockImplementation(() => mockReveal),
}));

// Mock BaseMarkdownEditor
vi.mock('../../src/MarkdownEditor', () => ({
  BaseMarkdownEditor: ({
    initValue,
    readonly,
    toc,
    reportMode,
    style,
    editorStyle,
    contentStyle,
  }: any) => (
    <div
      data-testid="base-markdown-editor"
      data-init-value={initValue}
      data-readonly={readonly}
      data-toc={toc}
      data-report-mode={reportMode}
      style={style}
      data-editor-style={JSON.stringify(editorStyle)}
      data-content-style={JSON.stringify(contentStyle)}
    >
      {initValue}
    </div>
  ),
}));

// Mock CSS imports
vi.mock('reveal.js/dist/reveal.css', () => ({}));
vi.mock('../../src/Slides/white.css', () => ({}));

describe('Slides', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn();
    console.warn = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应该渲染幻灯片容器', () => {
    render(<Slides initValue="# 测试标题" />);

    const revealContainer = screen.getByRole('generic');
    expect(revealContainer).toHaveClass('reveal');
    expect(revealContainer).toHaveStyle({ height: '100vh' });
  });

  it('应该渲染slides容器', () => {
    render(<Slides initValue="# 测试标题" />);

    const slidesContainer = document.querySelector('.slides');
    expect(slidesContainer).toBeInTheDocument();
  });

  it('应该正确分割包含二级标题的Markdown内容', () => {
    const markdownContent = `# 主标题
## 第一页
这是第一页的内容

## 第二页
这是第二页的内容`;

    render(<Slides initValue={markdownContent} />);

    const sections = document.querySelectorAll('section');
    expect(sections).toHaveLength(3); // 主标题 + 两个二级标题页面

    const editors = screen.getAllByTestId('base-markdown-editor');
    expect(editors).toHaveLength(3);
    expect(editors[0]).toHaveAttribute('data-init-value', '# 主标题');
    expect(editors[1]).toHaveAttribute(
      'data-init-value',
      '## 第一页\n这是第一页的内容\n',
    );
    expect(editors[2]).toHaveAttribute(
      'data-init-value',
      '## 第二页\n这是第二页的内容',
    );
  });

  it('应该正确分割不包含二级标题的长内容', () => {
    const longContent =
      '这是第一段内容。\n\n这是第二段内容。\n\n这是第三段内容。'.repeat(20); // 超过100字符

    render(<Slides initValue={longContent} />);

    const sections = document.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(1);
  });

  it('应该保持短内容不分段', () => {
    const shortContent = '这是短内容';

    render(<Slides initValue={shortContent} />);

    const sections = document.querySelectorAll('section');
    expect(sections).toHaveLength(1);

    const editor = screen.getByTestId('base-markdown-editor');
    expect(editor).toHaveAttribute('data-init-value', shortContent);
  });

  it('应该为每个BaseMarkdownEditor设置正确的props', () => {
    render(<Slides initValue="# 测试" />);

    const editor = screen.getByTestId('base-markdown-editor');
    expect(editor).toHaveAttribute('data-readonly', 'true');
    expect(editor).toHaveAttribute('data-toc', 'false');
    expect(editor).toHaveAttribute('data-report-mode', 'true');
  });

  it('应该为BaseMarkdownEditor设置正确的样式', () => {
    render(<Slides initValue="# 测试" />);

    const editor = screen.getByTestId('base-markdown-editor');
    const style = editor.getAttribute('style');
    const editorStyle = editor.getAttribute('data-editor-style');
    const contentStyle = editor.getAttribute('data-content-style');

    expect(style).toContain('height: 100%');
    expect(style).toContain('padding: 0px');
    expect(style).toContain('margin: 0px');
    expect(style).toContain('width: 100%');

    expect(editorStyle).toContain('maxHeight: 80vh');
    expect(editorStyle).toContain('overflow: auto');

    expect(contentStyle).toContain('width: 100%');
    expect(contentStyle).toContain('padding: 0px');
    expect(contentStyle).toContain('margin: 0px');
    expect(contentStyle).toContain('height: 100%');
    expect(contentStyle).toContain('overflow: hidden');
  });

  it('应该初始化Reveal.js', async () => {
    render(<Slides initValue="# 测试" />);

    await waitFor(() => {
      expect(mockReveal.initialize).toHaveBeenCalledWith({});
    });

    expect(console.log).toHaveBeenCalledWith('Reveal.js initialized.');
  });

  it('应该处理Reveal.js初始化失败的情况', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockReveal.destroy.mockImplementation(() => {
      throw new Error('Destroy failed');
    });

    const { unmount } = render(<Slides initValue="# 测试" />);

    unmount();

    expect(consoleSpy).toHaveBeenCalledWith('Reveal.js destroy call failed.');
  });

  it('应该正确处理复杂的Markdown内容分割', () => {
    const complexContent = `# 演示文稿

## 介绍
欢迎来到演示文稿

## 主要内容
- 第一点
- 第二点
- 第三点

## 总结
感谢观看`;

    render(<Slides initValue={complexContent} />);

    const sections = document.querySelectorAll('section');
    expect(sections).toHaveLength(4); // 主标题 + 三个二级标题页面

    const editors = screen.getAllByTestId('base-markdown-editor');
    expect(editors).toHaveLength(4);
  });

  it('应该为每个section设置正确的key', () => {
    render(<Slides initValue="# 第一页\n\n## 第二页\n内容" />);

    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      expect(section).toHaveAttribute('key', index.toString());
    });
  });
});

// 测试splitMarkdown函数（通过组件行为间接测试）
describe('splitMarkdown function', () => {
  it('应该按二级标题分割内容', () => {
    const content = '# 标题\n## 第一页\n内容1\n## 第二页\n内容2';
    render(<Slides initValue={content} />);

    const editors = screen.getAllByTestId('base-markdown-editor');
    expect(editors).toHaveLength(3);
    expect(editors[0]).toHaveAttribute('data-init-value', '# 标题');
    expect(editors[1]).toHaveAttribute('data-init-value', '## 第一页\n内容1\n');
    expect(editors[2]).toHaveAttribute('data-init-value', '## 第二页\n内容2');
  });

  it('应该处理没有二级标题的长内容', () => {
    const longContent = '第一段内容。\n\n第二段内容。\n\n第三段内容。'.repeat(
      15,
    );
    render(<Slides initValue={longContent} />);

    const sections = document.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(1);
  });

  it('应该保持短内容完整', () => {
    const shortContent = '短内容';
    render(<Slides initValue={shortContent} />);

    const editor = screen.getByTestId('base-markdown-editor');
    expect(editor).toHaveAttribute('data-init-value', shortContent);
  });
});
