import { describe, expect, it } from 'vitest';
import type { CodeNode } from '../../../el';
import type { MarkdownEditorPlugin } from '../../../plugin';
import { getCodeBlockPlainText } from '../../utils/codeBlockPlainText';
import { parserMarkdownToSlateNode } from '../parserMarkdownToSlateNode';
import { parserSlateNodeToMarkdown } from '../parserSlateNodeToMarkdown';

describe('plugin code blocks with nested fences', () => {
  it('preserves nested source exported by a custom toMarkdown rule', () => {
    const source = '```javascript\nconsole.log("custom");\n```';
    const plugin: MarkdownEditorPlugin = {
      toMarkdown: [
        {
          match: (node) => node.type === 'paragraph',
          convert: () => ({ type: 'code', lang: 'markdown', value: source }),
        },
      ],
    };
    const markdown = parserSlateNodeToMarkdown(
      [{ type: 'paragraph', children: [{ text: 'custom node' }] }],
      '',
      [],
      [plugin],
    );
    const { schema } = parserMarkdownToSlateNode(markdown);
    expect(schema).toHaveLength(1);
    expect(schema[0].type).toBe('code');
    expect(getCodeBlockPlainText(schema[0] as CodeNode)).toBe(source);
  });
  it.each(['````', '~~~'])(
    'keeps %s blocks intact across cache boundaries',
    (fence) => {
      const source = [
        '# Markdown preview',
        '',
        '```javascript',
        `// ${'nested source '.repeat(12)}`,
        '',
        'console.log("source stays inside the preview");',
        '```',
        '',
        `Text after the nested fence: ${'preview content '.repeat(12)}`,
      ]
        .join('\n')
        .trimEnd();
      const before = 'before '.repeat(20).trim();
      const after = 'after '.repeat(24).trim();
      const markdown = `${before}\n\n${fence}markdown\n${source}\n${fence}\n\n${after}`;
      for (let repeat = 0; repeat < 2; repeat++) {
        const { schema } = parserMarkdownToSlateNode(markdown);
        expect(schema.map((node) => node.type)).toEqual([
          'paragraph',
          'code',
          'paragraph',
        ]);
        const block = schema[1] as CodeNode;
        expect(block.language).toBe('markdown');
        expect(getCodeBlockPlainText(block).trim()).toBe(source);
        const exported = parserSlateNodeToMarkdown(schema);
        const restored = parserMarkdownToSlateNode(exported).schema;
        expect(restored.map((node) => node.type)).toEqual([
          'paragraph',
          'code',
          'paragraph',
        ]);
        expect(getCodeBlockPlainText(restored[1] as CodeNode).trim()).toBe(
          source,
        );
      }
    },
  );
});
