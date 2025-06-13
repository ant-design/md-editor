import { describe, expect, it } from 'vitest';
import { MarkdownFormatter } from '../index';

describe('MarkdownFormatter', () => {
  describe('normalizeParagraphs', () => {
    it('should convert multiple newlines to double newlines', () => {
      const input = 'First paragraph\n\n\n\nSecond paragraph';
      const expected = 'First paragraph\n\nSecond paragraph';
      expect(MarkdownFormatter.normalizeParagraphs(input)).toBe(expected);
    });

    it('should convert single newline to double newlines', () => {
      const input = 'First paragraph\nSecond paragraph';
      const expected = 'First paragraph\n\nSecond paragraph';
      expect(MarkdownFormatter.normalizeParagraphs(input)).toBe(expected);
    });

    it('should handle different line endings', () => {
      const input = 'First paragraph\r\nSecond paragraph\rThird paragraph';
      const expected = 'First paragraph\n\nSecond paragraph\n\nThird paragraph';
      expect(MarkdownFormatter.normalizeParagraphs(input)).toBe(expected);
    });

    it('should trim extra whitespace', () => {
      const input = '\n\nFirst paragraph\n\n\n  \n\nSecond paragraph\n\n';
      const expected = 'First paragraph\n\nSecond paragraph';
      expect(MarkdownFormatter.normalizeParagraphs(input)).toBe(expected);
    });
  });

  describe('addPanguSpacing', () => {
    it('should add spaces between Chinese and English', () => {
      const cases = [
        {
          input: '中文English混合',
          expected: '中文 English 混合',
        },
        {
          input: 'English中文English',
          expected: 'English 中文 English',
        },
      ];

      cases.forEach(({ input, expected }) => {
        expect(MarkdownFormatter.addPanguSpacing(input)).toBe(expected);
      });
    });

    it('should add spaces between Chinese and numbers', () => {
      const cases = [
        {
          input: '价格是123元',
          expected: '价格是 123 元',
        },
        {
          input: '1个2个3个',
          expected: '1 个 2 个 3 个',
        },
      ];

      cases.forEach(({ input, expected }) => {
        expect(MarkdownFormatter.addPanguSpacing(input)).toBe(expected);
      });
    });

    it('should preserve Markdown link syntax', () => {
      const cases = [
        {
          input: '[测试Link说明](https://example.com)',
          expected: '[测试Link说明](https://example.com)',
        },
        {
          input: '这是一个[测试Link说明](https://example.com)示例',
          expected: '这是一个 [测试Link说明](https://example.com) 示例',
        },
      ];

      cases.forEach(({ input, expected }) => {
        expect(MarkdownFormatter.addPanguSpacing(input)).toBe(expected);
      });
    });

    it('should preserve inline code', () => {
      const cases = [
        {
          input: '使用`const x=123`作为示例',
          expected: '使用 `const x=123` 作为示例',
        },
        {
          input: '代码`console.log(你好)`输出',
          expected: '代码 `console.log(你好)` 输出',
        },
      ];

      cases.forEach(({ input, expected }) => {
        expect(MarkdownFormatter.addPanguSpacing(input)).toBe(expected);
      });
    });
  });

  describe('format', () => {
    it('should apply all formatting rules correctly', () => {
      const input = `Title heading
中文English混合
使用\`const x=123\`作为示例
[测试Link说明](https://example.com)`;
      const expected = `Title heading

中文 English 混合

使用 \`const x=123\` 作为示例

[测试Link说明](https://example.com)`;
      expect(MarkdownFormatter.format(input)).toBe(expected);
    });

    it('should handle complex mixed content', () => {
      const input = `# 标题Title123
代码示例code：
\`const x=123\`
价格是100元
[链接Link说明](url)`;
      const expected = `# 标题 Title123

代码示例 code：

\`const x=123\`

价格是 100 元

[链接Link说明](url)`;
      expect(MarkdownFormatter.format(input)).toBe(expected);
    });

    it('should use set table content', () => {
      const input = `| 111 | 111 | 1111 |\n| :--- | :--- | :--- |\n| 111 | 111 | 111 |\n| 111 | 111 | 111 |`;
      const expected = `| 111 | 111 | 1111 |\n| :--- | :--- | :--- |\n| 111 | 111 | 111 |\n| 111 | 111 | 111 |`;
      expect(MarkdownFormatter.format(input)).toBe(expected);
    });

    it('should preserve JSON code blocks', () => {
      const input = `这是一个测试 JSON 的例子：

\`\`\`json
{
  "name": "test",
  "description": "这是一个测试",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "~4.9.0"
  }
}
\`\`\`

这是代码块后的内容。`;

      const expected = `这是一个测试 JSON 的例子：

\`\`\`json
{
  "name": "test",
  "description": "这是一个测试",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "~4.9.0"
  }
}
\`\`\`

这是代码块后的内容。`;

      expect(MarkdownFormatter.format(input)).toBe(expected);
    });

    it('should handle multiple JSON code blocks', () => {
      const input = `第一个 JSON 块：

\`\`\`json
{
  "key": "value"
}
\`\`\`

第二个 JSON 块：

\`\`\`json
{
  "array": [1, 2, 3],
  "nested": {
    "field": "test"
  }
}
\`\`\`

这是最后的内容。`;

      const expected = `第一个 JSON 块：

\`\`\`json
{
  "key": "value"
}
\`\`\`

第二个 JSON 块：

\`\`\`json
{
  "array": [1, 2, 3],
  "nested": {
    "field": "test"
  }
}
\`\`\`

这是最后的内容。`;

      expect(MarkdownFormatter.format(input)).toBe(expected);
    });
  });
});
