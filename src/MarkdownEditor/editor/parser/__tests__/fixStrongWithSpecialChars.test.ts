import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';
import { fixStrongWithSpecialChars } from '../remarkParse';

describe('fixStrongWithSpecialChars', () => {
  const createParser = () => {
    return unified().use(remarkParse).use(fixStrongWithSpecialChars);
  };

  it('should convert **$9.698M** to strong node', () => {
    const parser = createParser();
    const markdown = '**$9.698M**';

    const ast = parser.parse(markdown);
    const result = parser.runSync(ast) as any;

    console.log('输入:', markdown);
    console.log('AST 结果:', JSON.stringify(result, null, 2));

    // 验证结构
    expect(result.type).toBe('root');
    expect(result.children).toHaveLength(1);

    const paragraph = result.children[0] as any;
    expect(paragraph.type).toBe('paragraph');
    expect(paragraph.children).toHaveLength(1);

    const strong = paragraph.children[0];
    expect(strong.type).toBe('strong');
    expect(strong.children).toHaveLength(1);
    expect(strong.children[0].type).toBe('text');
    expect(strong.children[0].value).toBe('$9.698M');
  });

  it('should handle mixed text with **$9.698M**', () => {
    const parser = createParser();
    const markdown = 'The revenue is **$9.698M** this quarter.';

    const ast = parser.parse(markdown);
    const result = parser.runSync(ast) as any;

    console.log('输入:', markdown);
    console.log('AST 结果:', JSON.stringify(result, null, 2));

    const paragraph = result.children[0] as any;
    expect(paragraph.type).toBe('paragraph');
    expect(paragraph.children).toHaveLength(3);

    // 第一个文本节点: "The revenue is "
    expect(paragraph.children[0].type).toBe('text');
    expect(paragraph.children[0].value).toBe('The revenue is ');

    // 第二个节点: 加粗的 "$9.698M"
    expect(paragraph.children[1].type).toBe('strong');
    expect(paragraph.children[1].children[0].value).toBe('$9.698M');

    // 第三个文本节点: " this quarter."
    expect(paragraph.children[2].type).toBe('text');
    expect(paragraph.children[2].value).toBe(' this quarter.');
  });

  it('should handle multiple **$amount** in one line', () => {
    const parser = createParser();
    const markdown = 'Revenue **$9.698M** and profit **$2.5M**.';

    const ast = parser.parse(markdown);
    const result = parser.runSync(ast) as any;

    console.log('输入:', markdown);
    console.log('AST 结果:', JSON.stringify(result, null, 2));

    const paragraph = result.children[0] as any;
    expect(paragraph.type).toBe('paragraph');
    expect(paragraph.children).toHaveLength(5);

    // "Revenue "
    expect(paragraph.children[0].type).toBe('text');
    expect(paragraph.children[0].value).toBe('Revenue ');

    // "**$9.698M**"
    expect(paragraph.children[1].type).toBe('strong');
    expect(paragraph.children[1].children[0].value).toBe('$9.698M');

    // " and profit "
    expect(paragraph.children[2].type).toBe('text');
    expect(paragraph.children[2].value).toBe(' and profit ');

    // "**$2.5M**"
    expect(paragraph.children[3].type).toBe('strong');
    expect(paragraph.children[3].children[0].value).toBe('$2.5M');

    // "."
    expect(paragraph.children[4].type).toBe('text');
    expect(paragraph.children[4].value).toBe('.');
  });

  it('should handle different currency formats', () => {
    const testCases = [
      { input: '**$1,000**', expected: '$1,000' },
      { input: '**$9.698M**', expected: '$9.698M' },
      { input: '**$123.45K**', expected: '$123.45K' },
      { input: '**$1.2B**', expected: '$1.2B' },
      { input: '**$999.99**', expected: '$999.99' },
    ];

    testCases.forEach(({ input, expected }) => {
      const parser = createParser();
      const ast = parser.parse(input);
      const result = parser.runSync(ast) as any;

      console.log(`测试 ${input}:`);
      console.log('AST 结果:', JSON.stringify(result, null, 2));

      const paragraph = result.children[0] as any;
      const strong = paragraph.children[0];

      expect(strong.type).toBe('strong');
      expect(strong.children[0].value).toBe(expected);
    });
  });

  it('should not affect normal bold text without special characters', () => {
    const parser = createParser();
    const markdown = '**normal bold text**';

    const ast = parser.parse(markdown);
    const result = parser.runSync(ast) as any;

    console.log('输入:', markdown);
    console.log('AST 结果:', JSON.stringify(result, null, 2));

    const paragraph = result.children[0] as any;
    const strong = paragraph.children[0];

    expect(strong.type).toBe('strong');
    expect(strong.children[0].value).toBe('normal bold text');
  });

  it('should handle edge cases', () => {
    const testCases = [
      { input: '**$**', desc: '只有美元符号' },
      { input: '**$ **', desc: '美元符号加空格' },
      { input: '**$0**', desc: '零金额' },
      { input: '**$-100**', desc: '负数金额' },
    ];

    testCases.forEach(({ input, desc }) => {
      const parser = createParser();
      const ast = parser.parse(input);
      const result = parser.runSync(ast) as any;

      console.log(`测试 ${desc} (${input}):`);
      console.log('AST 结果:', JSON.stringify(result, null, 2));

      const paragraph = result.children[0] as any;
      const strong = paragraph.children[0];

      expect(strong.type).toBe('strong');
      // 验证内容被正确提取
      expect(strong.children[0].type).toBe('text');
    });
  });
});
