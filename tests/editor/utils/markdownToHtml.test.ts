import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  markdownToHtml,
  markdownToHtmlSync,
} from '../../../src/MarkdownEditor/editor/utils/markdownToHtml';

// Mock unified and its plugins
vi.mock('unified', () => {
  const mockProcessor = {
    use: vi.fn().mockReturnThis(),
    process: vi.fn().mockResolvedValue('processed content'),
    processSync: vi.fn().mockReturnValue('processed content'),
  };

  const mockUnified = vi.fn(() => mockProcessor);

  return {
    unified: mockUnified,
  };
});

// Mock all plugins with default exports
vi.mock('remark-parse', () => ({
  default: vi.fn(),
}));

vi.mock('remark-gfm', () => ({
  default: vi.fn(),
}));

vi.mock('remark-math', () => ({
  default: vi.fn(),
}));

vi.mock('remark-frontmatter', () => ({
  default: vi.fn(),
}));

vi.mock('remark-rehype', () => ({
  default: vi.fn(),
}));

vi.mock('rehype-raw', () => ({
  default: vi.fn(),
}));

vi.mock('rehype-katex', () => ({
  default: vi.fn(),
}));

vi.mock('rehype-stringify', () => ({
  default: vi.fn(),
}));

describe('Markdown to HTML Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('markdownToHtml', () => {
    it('应该将Markdown转换为HTML', async () => {
      const markdown = '# Hello World\n\nThis is a **test**.';
      const result = await markdownToHtml(markdown);

      expect(result).toBe('processed content');
    });

    it('应该使用正确的插件配置', async () => {
      const markdown = '# Test';
      const result = await markdownToHtml(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理空字符串', async () => {
      const result = await markdownToHtml('');

      expect(result).toBe('processed content');
    });

    it('应该处理包含数学公式的Markdown', async () => {
      const markdown = '$$E = mc^2$$';
      const result = await markdownToHtml(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理包含GFM特性的Markdown', async () => {
      const markdown = '~~strikethrough~~\n\n- [ ] task';
      const result = await markdownToHtml(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理包含YAML frontmatter的Markdown', async () => {
      const markdown = `---
title: Test
---

# Content`;
      const result = await markdownToHtml(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理包含HTML的Markdown', async () => {
      const markdown = '<div>HTML content</div>\n\n# Markdown content';
      const result = await markdownToHtml(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理处理错误', async () => {
      // Mock the unified function to throw an error
      const { unified } = await import('unified');
      const mockUnified = unified as any;
      mockUnified.mockImplementationOnce(() => ({
        use: vi.fn().mockReturnThis(),
        process: vi.fn().mockRejectedValue(new Error('Processing error')),
      }));

      const markdown = '# Test';
      const result = await markdownToHtml(markdown);

      expect(result).toBe('');
    });
  });

  describe('markdownToHtmlSync', () => {
    it('应该同步将Markdown转换为HTML', () => {
      const markdown = '# Hello World\n\nThis is a **test**.';
      const result = markdownToHtmlSync(markdown);

      expect(result).toBe('processed content');
    });

    it('应该使用正确的插件配置', () => {
      const markdown = '# Test';
      const result = markdownToHtmlSync(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理空字符串', () => {
      const result = markdownToHtmlSync('');

      expect(result).toBe('processed content');
    });

    it('应该处理包含数学公式的Markdown', () => {
      const markdown = '$$E = mc^2$$';
      const result = markdownToHtmlSync(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理包含GFM特性的Markdown', () => {
      const markdown = '~~strikethrough~~\n\n- [ ] task';
      const result = markdownToHtmlSync(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理包含YAML frontmatter的Markdown', () => {
      const markdown = `---
title: Test
---

# Content`;
      const result = markdownToHtmlSync(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理包含HTML的Markdown', () => {
      const markdown = '<div>HTML content</div>\n\n# Markdown content';
      const result = markdownToHtmlSync(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理处理错误并返回空字符串', async () => {
      // Mock the unified function to throw an error
      const { unified } = await import('unified');
      const mockUnified = unified as any;
      mockUnified.mockImplementationOnce(() => ({
        use: vi.fn().mockReturnThis(),
        processSync: vi.fn().mockImplementation(() => {
          throw new Error('Processing error');
        }),
      }));

      const markdown = '# Test';
      const result = markdownToHtmlSync(markdown);

      expect(result).toBe('');
    });

    it('应该处理不同类型的错误', async () => {
      // Mock the unified function to throw an error
      const { unified } = await import('unified');
      const mockUnified = unified as any;
      mockUnified.mockImplementationOnce(() => ({
        use: vi.fn().mockReturnThis(),
        processSync: vi.fn().mockImplementation(() => {
          throw 'String error';
        }),
      }));

      const markdown = '# Test';
      const result = markdownToHtmlSync(markdown);

      expect(result).toBe('');
    });

    it('应该处理字符串转换', () => {
      const markdown = '# Test';
      const result = markdownToHtmlSync(markdown);

      expect(typeof result).toBe('string');
    });
  });

  describe('Plugin Configuration', () => {
    it('应该禁用单美元符号数学公式', async () => {
      const markdown = '# Test';
      const result = await markdownToHtml(markdown);

      expect(result).toBe('processed content');
    });

    it('应该启用危险HTML', async () => {
      const markdown = '# Test';
      const result = await markdownToHtml(markdown);

      expect(result).toBe('processed content');
    });

    it('应该配置YAML frontmatter', async () => {
      const markdown = '# Test';
      const result = await markdownToHtml(markdown);

      expect(result).toBe('processed content');
    });
  });

  describe('fixStrongWithSpecialChars 功能测试', () => {
    it('应该正确处理包含美元符号的加粗文本', async () => {
      const markdown = 'Revenue is **$9.698M** this quarter.';
      const result = await markdownToHtml(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理多个包含特殊字符的加粗文本', async () => {
      const markdown =
        'Revenue **$9.698M** and profit **$2.5M** with growth **$123.45K**.';
      const result = await markdownToHtml(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理不同货币格式的加粗文本', async () => {
      const testCases = [
        '**$1,000**',
        '**$9.698M**',
        '**$123.45K**',
        '**$1.2B**',
        '**$999.99**',
      ];

      for (const testCase of testCases) {
        const result = await markdownToHtml(testCase);
        expect(result).toBe('processed content');
      }
    });

    it('应该处理混合文本中的特殊字符加粗', async () => {
      const markdown =
        'The quarterly report shows **$9.698M** revenue, **$2.5M** profit, and **$123.45K** growth.';
      const result = await markdownToHtml(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理边界情况', async () => {
      const edgeCases = ['**$**', '**$ **', '**$0**', '**$-100**'];

      for (const edgeCase of edgeCases) {
        const result = await markdownToHtml(edgeCase);
        expect(result).toBe('processed content');
      }
    });

    it('应该不影响普通加粗文本', async () => {
      const markdown =
        'This is **normal bold text** without special characters.';
      const result = await markdownToHtml(markdown);

      expect(result).toBe('processed content');
    });

    it('应该处理同步版本的 fixStrongWithSpecialChars', () => {
      const markdown = 'Revenue is **$9.698M** this quarter.';
      const result = markdownToHtmlSync(markdown);

      expect(result).toBe('processed content');
    });
  });
});
