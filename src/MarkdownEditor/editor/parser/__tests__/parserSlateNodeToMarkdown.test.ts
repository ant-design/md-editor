import { describe, expect, it } from 'vitest';
import { parserSlateNodeToMarkdown } from '../parserSlateNodeToMarkdown';

describe('parserSlateNodeToMarkdown', () => {
  describe('handleCard', () => {
    it('should handle card node correctly', () => {
      const node = {
        type: 'card',
        children: [{ type: 'paragraph', children: [{ text: 'Card content' }] }],
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('Card content');
    });
  });

  describe('handleParagraph', () => {
    it('should handle paragraph node with formatting', () => {
      const node = {
        type: 'paragraph',
        children: [
          { text: 'Normal text ' },
          { text: 'bold text', bold: true },
          { text: ' and ' },
          { text: 'italic', italic: true },
        ],
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('Normal text **bold text** and *italic*');
    });
  });

  describe('handleHead', () => {
    it('should handle heading with different levels', () => {
      const nodes = [
        {
          type: 'head',
          level: 1,
          children: [{ text: 'Heading 1' }],
        },
        {
          type: 'head',
          level: 2,
          children: [{ text: 'Heading 2' }],
        },
      ];
      const result = parserSlateNodeToMarkdown(nodes);
      expect(result).toBe('# Heading 1\n## Heading 2');
    });

    it('should handle consecutive headings without extra newlines', () => {
      const nodes = [
        {
          type: 'head',
          level: 1,
          children: [{ text: 'First Heading' }],
        },
        {
          type: 'head',
          level: 2,
          children: [{ text: 'Second Heading' }],
        },
        {
          type: 'head',
          level: 3,
          children: [{ text: 'Third Heading' }],
        },
      ];
      const result = parserSlateNodeToMarkdown(nodes);
      expect(result).toBe(
        '# First Heading\n## Second Heading\n### Third Heading',
      );
    });
  });

  describe('handleCode', () => {
    it('should handle different code block types', () => {
      const nodes = [
        {
          type: 'code',
          language: 'javascript',
          value: 'console.log("hello");',
        },
        {
          type: 'code',
          language: 'html',
          render: true,
          value: '<div>Hello</div>',
        },
        {
          type: 'code',
          frontmatter: true,
          value: 'title: Hello',
        },
      ];
      const result = parserSlateNodeToMarkdown(nodes);
      expect(result).toBe(
        '```javascript\nconsole.log("hello");\n```\n\n' +
          '<div>Hello</div>\n\n' +
          '---\ntitle: Hello\n---',
      );
    });
  });

  describe('handleAttach', () => {
    it('should handle attachment with download link', () => {
      const node = {
        type: 'attach',
        url: 'http://example.com/file.pdf',
        name: 'Sample PDF',
        size: '1.2MB',
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe(
        '<a href="http://example.com/file.pdf" download data-size="1.2MB">Sample PDF</a>',
      );
    });
  });

  describe('handleBlockquote', () => {
    it('should handle empty blockquote', () => {
      const node = {
        type: 'blockquote',
        children: [],
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('');
    });

    it('should handle nested blockquotes', () => {
      const node = {
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'First level' }],
          },
          {
            type: 'blockquote',
            children: [
              {
                type: 'paragraph',
                children: [{ text: 'Second level' }],
              },
              {
                type: 'blockquote',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ text: 'Third level' }],
                  },
                ],
              },
            ],
          },
        ],
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('> First level\n> Second level\n> > Third level');
    });

    it('should handle blockquote with empty lines', () => {
      const node = {
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'First paragraph' }],
          },
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
          {
            type: 'paragraph',
            children: [{ text: 'Second paragraph' }],
          },
        ],
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('> First paragraph\n>\n> Second paragraph');
    });
  });

  describe('handleImage', () => {
    it('should handle image with various attributes', () => {
      const node = {
        type: 'image',
        url: 'http://example.com/image.jpg',
        alt: 'Sample image',
        width: 800,
        height: 600,
        block: true,
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toMatch(
        /!\[Sample image\]\(http:\/\/example\.com\/image\.jpg\?width=800&height=600&block=true\)/,
      );
    });
  });

  describe('handleMedia', () => {
    it('should handle different media types', () => {
      const nodes = [
        {
          type: 'media',
          url: 'video.mp4',
          mediaType: 'video',
          height: 400,
        },
        {
          type: 'media',
          url: 'image.jpg',
          mediaType: 'image',
          align: 'center',
        },
      ];
      const result = parserSlateNodeToMarkdown(nodes);
      expect(result).toBe(
        '<video src="video.mp4" alt="" height="400"/>\n\n' +
          '<img src="image.jpg" alt="" data-align="center"/>',
      );
    });
  });

  describe('handleList', () => {
    it('should handle ordered and unordered lists', () => {
      const nodes = [
        {
          type: 'list',
          children: [
            {
              type: 'list-item',
              children: [{ text: 'First item' }],
            },
            {
              type: 'list-item',
              children: [{ text: 'Second item' }],
            },
          ],
        },
        {
          type: 'list',
          order: true,
          start: 1,
          children: [
            {
              type: 'list-item',
              children: [{ text: 'Ordered item 1' }],
            },
            {
              type: 'list-item',
              children: [{ text: 'Ordered item 2' }],
            },
          ],
        },
      ];
      const result = parserSlateNodeToMarkdown(nodes);
      expect(result).toBe(
        '- First item\n' +
          '- Second item\n\n' +
          '1. Ordered item 1\n' +
          '2. Ordered item 2\n\n',
      );
    });
  });

  describe('handleTable', () => {
    it('should handle table with dynamic column widths', () => {
      const node = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                align: 'left',
                children: [{ text: 'Short' }],
              },
              {
                type: 'table-cell',
                align: 'center',
                children: [{ text: 'Medium Column' }],
              },
              {
                type: 'table-cell',
                align: 'right',
                children: [{ text: 'Very Long Column Header' }],
              },
            ],
          },
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                children: [{ text: 'Data' }],
              },
              {
                type: 'table-cell',
                children: [{ text: 'More Data' }],
              },
              {
                type: 'table-cell',
                children: [{ text: 'Even More Data Here' }],
              },
            ],
          },
        ],
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe(
        '| Short | Medium Column | Very Long Column Header |\n' +
          '| :---- | :-----------: | ----------------------: |\n' +
          '| Data  |   More Data   |     Even More Data Here |',
      );
    });

    it('should ensure minimum separator length', () => {
      const node = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                align: 'left',
                children: [{ text: 'A' }],
              },
              {
                type: 'table-cell',
                align: 'center',
                children: [{ text: 'B' }],
              },
            ],
          },
          {
            type: 'table-row',
            children: [
              {
                type: 'table-cell',
                children: [{ text: '1' }],
              },
              {
                type: 'table-cell',
                children: [{ text: '2' }],
              },
            ],
          },
        ],
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('| A   |  B  |\n| :--- | :---: |\n| 1   |  2  |');
    });
  });

  describe('handleDescription', () => {
    it('should handle empty description list', () => {
      const node = {
        type: 'description',
        children: [],
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('');
    });

    it('should handle description list with content', () => {
      const node = {
        type: 'description',
        children: [
          {
            title: true,
            children: [{ text: 'Term 1' }],
          },
          {
            children: [{ text: 'Description 1' }],
          },
          {
            title: true,
            children: [{ text: 'Term 2' }],
          },
          {
            children: [{ text: 'Description 2' }],
          },
        ],
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe(
        '| Term 1        | Term 2        |\n' +
          '| :------------ | :------------ |\n' +
          '| Description 1 | Description 2 |',
      );
    });
  });

  describe('handleSchema', () => {
    it('should handle schema node', () => {
      const node = {
        type: 'schema',
        otherProps: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
        },
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toMatch(/```schema\n{\n\s+"type": "object"/);
    });
  });

  describe('handleLinkCard', () => {
    it('should handle link card', () => {
      const node = {
        type: 'link-card',
        name: 'Example Link',
        url: 'http://example.com',
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('[Example Link](http://example.com "Example Link")');
    });
  });

  describe('handleFootnoteDefinition', () => {
    it('should handle footnote definition', () => {
      const node = {
        type: 'footnoteDefinition',
        identifier: '1',
        value: 'Footnote content',
        url: 'http://example.com',
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('[^1]: [Footnote content](http://example.com)');
    });
  });

  describe('mixed text formatting', () => {
    it('should handle combined bold and italic', () => {
      const node = {
        type: 'paragraph',
        children: [
          { text: 'Normal ' },
          { text: 'bold and italic', bold: true, italic: true },
          { text: ' text' },
        ],
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('Normal ***bold and italic*** text');
    });

    it('should handle multiple mixed formats', () => {
      const node = {
        type: 'paragraph',
        children: [
          { text: 'Start ' },
          { text: 'bold', bold: true },
          { text: ' then ' },
          { text: 'bold italic', bold: true, italic: true },
          { text: ' then ' },
          { text: 'strikethrough', strikethrough: true },
          { text: ' then ' },
          { text: 'code', code: true },
          { text: ' end' },
        ],
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe(
        'Start **bold** then ***bold italic*** then ~~strikethrough~~ then `code` end',
      );
    });

    it('should preserve whitespace in formatted text', () => {
      const node = {
        type: 'paragraph',
        children: [
          { text: 'Before   ' },
          { text: 'bold with spaces', bold: true },
          { text: '   after' },
        ],
      };
      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('Before   **bold with spaces**   after');
    });
  });

  describe('list handling', () => {
    it('should handle mixed ordered and unordered lists', () => {
      const nodes = [
        {
          type: 'list',
          children: [
            {
              type: 'list-item',
              children: [{ text: 'Unordered 1' }],
            },
            {
              type: 'list-item',
              children: [{ text: 'Unordered 2' }],
            },
          ],
        },
        {
          type: 'list',
          order: true,
          start: 1,
          children: [
            {
              type: 'list-item',
              children: [{ text: 'Ordered 1' }],
            },
            {
              type: 'list-item',
              children: [{ text: 'Ordered 2' }],
            },
          ],
        },
        {
          type: 'list',
          children: [
            {
              type: 'list-item',
              children: [{ text: 'Unordered again' }],
            },
          ],
        },
      ];
      const result = parserSlateNodeToMarkdown(nodes);
      expect(result).toBe(
        '- Unordered 1\n' +
          '- Unordered 2\n\n' +
          '1. Ordered 1\n' +
          '2. Ordered 2\n\n' +
          '- Unordered again\n\n',
      );
    });

    it('should handle lists with paragraphs between them', () => {
      const nodes = [
        {
          type: 'list',
          children: [
            {
              type: 'list-item',
              children: [{ text: 'List 1' }],
            },
          ],
        },
        {
          type: 'paragraph',
          children: [{ text: 'Paragraph between lists' }],
        },
        {
          type: 'list',
          children: [
            {
              type: 'list-item',
              children: [{ text: 'List 2' }],
            },
          ],
        },
      ];
      const result = parserSlateNodeToMarkdown(nodes);
      expect(result).toBe(
        '- List 1\n\nParagraph between lists\n\n- List 2\n\n',
      );
    });
  });
});

describe('parserSlateNodeToMarkdown alignment tests', () => {
  describe('Paragraph alignment', () => {
    it('should handle paragraph with center alignment', () => {
      const node = {
        type: 'paragraph',
        align: 'center',
        children: [{ text: 'This is a centered paragraph' }],
      };

      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe(
        '<!--{"align":"center"}-->\nThis is a centered paragraph',
      );
    });

    it('should handle paragraph with right alignment', () => {
      const node = {
        type: 'paragraph',
        align: 'right',
        children: [{ text: 'This is a right-aligned paragraph' }],
      };

      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe(
        '<!--{"align":"right"}-->\nThis is a right-aligned paragraph',
      );
    });

    it('should handle paragraph with legacy aligen property', () => {
      const node = {
        type: 'paragraph',
        aligen: 'left',
        children: [{ text: 'This is a left-aligned paragraph' }],
      };

      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe(
        '<!--{"align":"left"}-->\nThis is a left-aligned paragraph',
      );
    });

    it('should handle paragraph without alignment', () => {
      const node = {
        type: 'paragraph',
        children: [{ text: 'This is a normal paragraph' }],
      };

      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('This is a normal paragraph');
    });
  });

  describe('Heading alignment', () => {
    it('should handle heading with center alignment', () => {
      const node = {
        type: 'head',
        level: 2,
        align: 'center',
        children: [{ text: 'Centered Heading' }],
      };

      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('<!--{"align":"center"}-->\n## Centered Heading');
    });

    it('should handle heading with right alignment', () => {
      const node = {
        type: 'head',
        level: 1,
        align: 'right',
        children: [{ text: 'Right Aligned Heading' }],
      };

      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('<!--{"align":"right"}-->\n# Right Aligned Heading');
    });

    it('should handle heading with left alignment', () => {
      const node = {
        type: 'head',
        level: 3,
        align: 'left',
        children: [{ text: 'Left Aligned Heading' }],
      };

      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('<!--{"align":"left"}-->\n### Left Aligned Heading');
    });

    it('should handle heading without alignment', () => {
      const node = {
        type: 'head',
        level: 2,
        children: [{ text: 'Normal Heading' }],
      };

      const result = parserSlateNodeToMarkdown([node]);
      expect(result).toBe('## Normal Heading');
    });
  });

  describe('Mixed content alignment', () => {
    it('should handle multiple aligned elements', () => {
      const nodes = [
        {
          type: 'head',
          level: 1,
          align: 'center',
          children: [{ text: 'Centered Title' }],
        },
        {
          type: 'paragraph',
          align: 'right',
          children: [{ text: 'Right aligned paragraph' }],
        },
        {
          type: 'paragraph',
          children: [{ text: 'Normal paragraph' }],
        },
        {
          type: 'head',
          level: 2,
          align: 'left',
          children: [{ text: 'Left aligned subtitle' }],
        },
      ];

      const result = parserSlateNodeToMarkdown(nodes);
      const expected = [
        '<!--{"align":"center"}-->',
        '# Centered Title',
        '',
        '<!--{"align":"right"}-->',
        'Right aligned paragraph',
        '',
        'Normal paragraph',
        '',
        '<!--{"align":"left"}-->',
        '## Left aligned subtitle',
      ].join('\n');

      expect(result).toBe(expected);
    });
  });
});
