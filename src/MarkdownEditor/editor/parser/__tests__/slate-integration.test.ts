import { describe, expect, it } from 'vitest';
import { parserMarkdownToSlateNode } from '../parserMarkdownToSlateNode';

describe('Slate Integration Tests', () => {
  it('should parse **$9.698M** to Slate nodes without errors', () => {
    const markdown = '**$9.698M**';

    const result = parserMarkdownToSlateNode(markdown);

    expect(result).toBeDefined();
    expect(result.schema).toBeDefined();
    expect(Array.isArray(result.schema)).toBe(true);
    expect(result.schema.length).toBeGreaterThan(0);

    // 检查第一个节点（应该是paragraph）
    const paragraph = result.schema[0];
    expect(paragraph.type).toBe('paragraph');
    expect(paragraph.children).toBeDefined();
    expect(Array.isArray(paragraph.children)).toBe(true);
    expect(paragraph.children.length).toBeGreaterThan(0);

    // 检查加粗文本
    const boldText = paragraph.children.find((child: any) => child.bold);
    expect(boldText).toBeDefined();
    expect(boldText.text).toBe('$9.698M');
    expect(boldText.bold).toBe(true);
  });

  it('should handle inlineMath within bold text correctly', () => {
    // 这种情况可能会导致问题：在加粗文本中包含数学公式
    const complexMarkdown = 'Text with **bold $$x = 1$$ inside** here';
    const complexResult = parserMarkdownToSlateNode(complexMarkdown);
    console.log('Complex result:', JSON.stringify(complexResult, null, 2));

    expect(complexResult).toBeDefined();
    expect(complexResult.schema[0].children).toBeDefined();
  });

  it('should parse mixed text with **$9.698M** to Slate nodes without errors', () => {
    const markdown = 'Revenue is **$9.698M** this quarter.';

    const result = parserMarkdownToSlateNode(markdown);

    expect(result).toBeDefined();
    expect(result.schema).toBeDefined();
    expect(Array.isArray(result.schema)).toBe(true);
    expect(result.schema.length).toBeGreaterThan(0);

    // 检查第一个节点（应该是paragraph）
    const paragraph = result.schema[0];
    expect(paragraph.type).toBe('paragraph');
    expect(paragraph.children).toBeDefined();
    expect(Array.isArray(paragraph.children)).toBe(true);
    expect(paragraph.children.length).toBeGreaterThan(0);

    // 检查加粗文本
    const boldText = paragraph.children.find((child: any) => child.bold);
    expect(boldText).toBeDefined();
    expect(boldText.text).toBe('$9.698M');
    expect(boldText.bold).toBe(true);

    // 检查普通文本
    const normalTexts = paragraph.children.filter((child: any) => !child.bold);
    expect(normalTexts.length).toBeGreaterThan(0);
  });

  it('should handle multiple bold text with dollar amounts in one line', () => {
    const markdown = 'Revenue **$9.698M** and profit **$2.5M**.';

    const result = parserMarkdownToSlateNode(markdown);

    expect(result).toBeDefined();
    expect(result.schema).toBeDefined();
    expect(Array.isArray(result.schema)).toBe(true);
    expect(result.schema.length).toBeGreaterThan(0);

    // 检查第一个节点（应该是paragraph）
    const paragraph = result.schema[0];
    expect(paragraph.type).toBe('paragraph');
    expect(paragraph.children).toBeDefined();
    expect(Array.isArray(paragraph.children)).toBe(true);
    expect(paragraph.children.length).toBeGreaterThan(0);

    // 检查加粗文本
    const boldTexts = paragraph.children.filter((child: any) => child.bold);

    expect(boldTexts.length).toBe(2);
    expect(boldTexts[0]?.text).toBe('$9.698M');
    expect(boldTexts[1]?.text).toBe('$2.5M');
  });

  it('should ensure all nodes have proper children arrays', () => {
    const markdown = '**$9.698M**';

    const result = parserMarkdownToSlateNode(markdown);

    function checkNodeStructure(node: any) {
      // 如果节点有children属性，它必须是数组
      if (node.children) {
        expect(Array.isArray(node.children)).toBe(true);
        // 递归检查子节点
        node.children.forEach((child: any) => {
          checkNodeStructure(child);
        });
      }
      // 如果节点没有children，它必须有text属性（叶子节点）
      if (!node.children) {
        expect(node.text).toBeDefined();
      }
    }

    result.schema.forEach(checkNodeStructure);
  });
});
