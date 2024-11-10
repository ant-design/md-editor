import { describe, expect, it } from 'vitest';
import { parserMarkdown } from '../../../src/MarkdownEditor/editor/parser/parserMarkdown';
import { schemaToMarkdown } from '../../../src/MarkdownEditor/editor/utils/schemaToMarkdown';

describe('schemaToMarkdown', () => {
  const cases = [
    {
      name: 'Basic heading and paragraph with bold and italic',
      input: `
# Heading 1
This is a paragraph with **bold** and *italic* text.

- List item 1
- List item 2`,
    },
    {
      name: 'Blockquote and nested list',
      input: `
> This is a blockquote.
> 
> - Nested list item
> - Another nested item`,
    },
    {
      name: 'Code block with syntax highlighting',
      input: `
\`\`\`javascript
function hello() {
  console.log('Hello, world!');
}
\`\`\``,
    },
    {
      name: 'Table structure',
      input: `
| Column 1 | Column 2 |
| -------- | -------- |
| Data 1   | Data 2   |`,
    },
  ];

  cases.forEach(({ name, input }) => {
    it(`should correctly convert schema nodes for: ${name}`, () => {
      const { schema } = parserMarkdown(input);
      const markdownOutput = schemaToMarkdown(schema);
      expect(markdownOutput).toMatchSnapshot();
    });
  });

  it('should handle an empty schema', () => {
    const markdownOutput = schemaToMarkdown([]);
    expect(markdownOutput).toMatchSnapshot();
  });
});
