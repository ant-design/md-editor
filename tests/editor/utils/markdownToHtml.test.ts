import { beforeEach, describe, expect, it } from 'vitest';
import {
  markdownToHtml,
  markdownToHtmlSync,
} from '../../../src/MarkdownEditor/editor/utils/markdownToHtml';

describe('Markdown to HTML Utils', () => {
  beforeEach(() => {
    // 清理任何可能的副作用
  });

  describe('markdownToHtml', () => {
    it('应该将Markdown转换为HTML', async () => {
      const markdown = '# Hello World\n\nThis is a **test**.';
      const result = await markdownToHtml(markdown);

      expect(result).toContain('<h1>Hello World</h1>');
      expect(result).toContain('<strong>test</strong>');
    });

    it('应该处理空字符串', async () => {
      const result = await markdownToHtml('');

      expect(result).toBe('');
    });

    it('应该处理包含数学公式的Markdown', async () => {
      const markdown = '$$E = mc^2$$';
      const result = await markdownToHtml(markdown);

      expect(result).toContain('E = mc^2');
      expect(result).toContain('class="katex"');
    });

    it('应该处理包含GFM特性的Markdown', async () => {
      const markdown = '~~strikethrough~~\n\n- [ ] task';
      const result = await markdownToHtml(markdown);

      expect(result).toContain('<del>strikethrough</del>');
      expect(result).toContain('<input type="checkbox" disabled>');
    });

    it('应该处理包含YAML frontmatter的Markdown', async () => {
      const markdown = `---
title: Test
---

# Content`;
      const result = await markdownToHtml(markdown);

      expect(result).toContain('<h1>Content</h1>');
    });

    it('应该处理包含HTML的Markdown', async () => {
      const markdown = '<div>HTML content</div>\n\n# Markdown content';
      const result = await markdownToHtml(markdown);

      expect(result).toContain('<div>HTML content</div>');
      expect(result).toContain('<h1>Markdown content</h1>');
    });

    it('应该处理无效的Markdown并返回空字符串', async () => {
      // 测试一个会导致错误的输入 - 使用更明显的无效输入
      const invalidMarkdown = null as any;
      const result = await markdownToHtml(invalidMarkdown);

      expect(result).toBe('');
    });
  });

  describe('markdownToHtmlSync', () => {
    it('应该同步将Markdown转换为HTML', () => {
      const markdown = '# Hello World\n\nThis is a **test**.';
      const result = markdownToHtmlSync(markdown);

      expect(result).toContain('<h1>Hello World</h1>');
      expect(result).toContain('<strong>test</strong>');
    });

    it('应该处理空字符串', () => {
      const result = markdownToHtmlSync('');

      expect(result).toBe('');
    });

    it('应该处理包含数学公式的Markdown', () => {
      const markdown = '$$E = mc^2$$';
      const result = markdownToHtmlSync(markdown);

      expect(result).toContain('E = mc^2');
      expect(result).toContain('class="katex"');
    });

    it('应该处理包含GFM特性的Markdown', () => {
      const markdown = '~~strikethrough~~\n\n- [ ] task';
      const result = markdownToHtmlSync(markdown);

      expect(result).toContain('<del>strikethrough</del>');
      expect(result).toContain('<input type="checkbox" disabled>');
    });

    it('应该处理包含YAML frontmatter的Markdown', () => {
      const markdown = `---
title: Test
---

# Content`;
      const result = markdownToHtmlSync(markdown);

      expect(result).toContain('<h1>Content</h1>');
    });

    it('应该处理包含HTML的Markdown', () => {
      const markdown = '<div>HTML content</div>\n\n# Markdown content';
      const result = markdownToHtmlSync(markdown);

      expect(result).toContain('<div>HTML content</div>');
      expect(result).toContain('<h1>Markdown content</h1>');
    });

    it('应该处理无效的Markdown并返回空字符串', () => {
      // 测试一个会导致错误的输入 - 使用更明显的无效输入
      const invalidMarkdown = null as any;
      const result = markdownToHtmlSync(invalidMarkdown);

      expect(result).toBe('');
    });

    it('应该返回字符串类型', () => {
      const markdown = '# Test';
      const result = markdownToHtmlSync(markdown);

      expect(typeof result).toBe('string');
    });
  });

  describe('Plugin Configuration', () => {
    it('应该禁用单美元符号数学公式', async () => {
      const markdown = '$E = mc^2$'; // 单美元符号
      const result = await markdownToHtml(markdown);

      // 单美元符号应该被当作普通文本处理
      expect(result).toContain('$E = mc^2$');
      expect(result).not.toContain('class="math"');
    });

    it('应该启用危险HTML', async () => {
      const markdown = '<script>alert("test")</script>\n\n# Content';
      const result = await markdownToHtml(markdown);

      expect(result).toContain('<script>alert("test")</script>');
      expect(result).toContain('<h1>Content</h1>');
    });

    it('应该配置YAML frontmatter', async () => {
      const markdown = `---
title: Test
author: John Doe
---

# Content`;
      const result = await markdownToHtml(markdown);

      expect(result).toContain('<h1>Content</h1>');
    });
  });

  describe('fixStrongWithSpecialChars 功能测试', () => {
    it('应该正确处理包含美元符号的加粗文本', async () => {
      const markdown = 'Revenue is **$9.698M** this quarter.';
      const result = await markdownToHtml(markdown);

      expect(result).toContain('<strong>$9.698M</strong>');
    });

    it('应该处理多个包含特殊字符的加粗文本', async () => {
      const markdown =
        'Revenue **$9.698M** and profit **$2.5M** with growth **$123.45K**.';
      const result = await markdownToHtml(markdown);

      expect(result).toContain('<strong>$9.698M</strong>');
      expect(result).toContain('<strong>$2.5M</strong>');
      expect(result).toContain('<strong>$123.45K</strong>');
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
        expect(result).toContain('<strong>');
        expect(result).toContain('</strong>');
      }
    });

    it('应该处理混合文本中的特殊字符加粗', async () => {
      const markdown =
        'The quarterly report shows **$9.698M** revenue, **$2.5M** profit, and **$123.45K** growth.';
      const result = await markdownToHtml(markdown);

      expect(result).toContain('<strong>$9.698M</strong>');
      expect(result).toContain('<strong>$2.5M</strong>');
      expect(result).toContain('<strong>$123.45K</strong>');
    });

    it('应该处理边界情况', async () => {
      const edgeCases = ['**$**', '**$ **', '**$0**', '**$-100**'];

      for (const edgeCase of edgeCases) {
        const result = await markdownToHtml(edgeCase);
        expect(result).toContain('<strong>');
        expect(result).toContain('</strong>');
      }
    });

    it('应该不影响普通加粗文本', async () => {
      const markdown =
        'This is **normal bold text** without special characters.';
      const result = await markdownToHtml(markdown);

      expect(result).toContain('<strong>normal bold text</strong>');
    });

    it('应该处理同步版本的 fixStrongWithSpecialChars', () => {
      const markdown = 'Revenue is **$9.698M** this quarter.';
      const result = markdownToHtmlSync(markdown);

      expect(result).toContain('<strong>$9.698M</strong>');
    });

    it('应该处理包含小数点和百分比的加粗文本', async () => {
      const markdown =
        '非GAAP每股收益增长18%，达到**$1.40**，高于分析师平均预期的**$1.30**';
      const result = await markdownToHtml(markdown);

      expect(result).toContain('<strong>$1.40</strong>');
      expect(result).toContain('<strong>$1.30</strong>');
      expect(result).toContain('非GAAP每股收益增长18%');
    });
  });
});
