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
      expect(result).toBe('# Heading 1\n\n## Heading 2');
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
        '# First Heading\n\n## Second Heading\n\n### Third Heading',
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
          '2. Ordered item 2',
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
          '- Unordered again',
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
      expect(result).toBe('- List 1\n\nParagraph between lists\n\n- List 2');
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

    it('should handle paragraph with legacy align property', () => {
      const node = {
        type: 'paragraph',
        align: 'left',
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

describe('parse table', () => {
  it('should handle table', () => {
    const nodeList = [
      {
        type: 'card',
        children: [
          {
            type: 'card-before',
            children: [
              {
                text: '',
              },
            ],
          },
          {
            type: 'table',
            otherProps: {
              colWidths: [200, 200, 200],
            },
            children: [
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '1111',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '111',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '111',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '111',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '1',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '1',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '111',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '111',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '111',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'card-after',
            children: [
              {
                text: '',
              },
            ],
          },
        ],
      },
    ];
    const result = parserSlateNodeToMarkdown(nodeList);
    expect(result).toBe(
      '<!--{"colWidths":[200,200,200]}-->\n| 1111 | 111 | 111 |\n| :--- | :--- | :--- |\n| 111 | 1 | 1 |\n| 111 | 111 | 111 |',
    );
  });
});

describe('parse image', () => {
  it('should handle image', () => {
    const nodeList = [
      {
        type: 'card',
        children: [
          {
            type: 'card-before',
            children: [
              {
                text: '',
              },
            ],
          },
          {
            type: 'image',
            url: 'http://example.com/image.jpg',
            alt: 'Sample image',
            width: 800,
            height: 600,
          },
          {
            type: 'card-after',
            children: [
              {
                text: '',
              },
            ],
          },
        ],
      },
    ];
    const result = parserSlateNodeToMarkdown(nodeList);
    expect(result).toBe(
      '![Sample image](http://example.com/image.jpg?width=800&height=600)',
    );
  });

  it('should handle two image', () => {
    const nodeList = [
      {
        type: 'card',
        children: [
          {
            type: 'card-before',
            children: [
              {
                text: '',
              },
            ],
          },
          {
            type: 'image',
            url: 'http://example.com/image.jpg',
            alt: 'Sample image',
            width: 800,
            height: 600,
          },
          {
            type: 'card-after',
            children: [
              {
                text: '',
              },
            ],
          },
        ],
      },
      {
        type: 'card',
        children: [
          {
            type: 'card-before',
            children: [
              {
                text: '',
              },
            ],
          },
          {
            type: 'image',
            url: 'http://example.com/image.jpg',
            alt: 'Sample image',
            width: 800,
            height: 600,
          },
          {
            type: 'card-after',
            children: [
              {
                text: '',
              },
            ],
          },
        ],
      },
    ];
    const result = parserSlateNodeToMarkdown(nodeList);
    expect(result).toBe(
      '![Sample image](http://example.com/image.jpg?width=800&height=600)\n\n![Sample image](http://example.com/image.jpg?width=800&height=600)',
    );
  });
});

describe('parse big data', () => {
  it('should handle big data', () => {
    const result = parserSlateNodeToMarkdown([
      {
        type: 'paragraph',
        children: [
          {
            text: '',
          },
        ],
      },
      {
        type: 'head',
        level: 2,
        children: [
          {
            text: '1. ON Semiconductor公司分析',
          },
        ],
      },
      {
        type: 'head',
        level: 3,
        children: [
          {
            text: '1.1 公司基本信息，生意模式，创始人背景和公司发展',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '公司概况',
          },
          {
            text: '：',
          },
        ],
      },
      {
        type: 'list',
        order: false,
        start: null,
        children: [
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '公司全称：ON Semiconductor Corporation (以onsemi为商标名称)',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '成立时间：1999年，最初是Motorola半导体产品部门的分拆',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '总部位置：美国亚利桑那州斯科茨代尔',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '首席执行官：Hassane El-Khoury (2020年底上任，之前是Cypress Semiconductor的CEO)',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '业务模式',
          },
          {
            text: '：\nonsemi是一家专注于智能电源和传感技术的半导体供应商，为汽车、工业、云计算、医疗和物联网市场提供解决方案。公司业务分为三个主要部门：',
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
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '电源解决方案集团 (PSG) - 54%收入',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '高级解决方案集团 (ASG) - 30%收入',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '智能传感集团 (ISG) - 16%收入',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '发展历程',
          },
          {
            text: '：',
          },
        ],
      },
      {
        type: 'list',
        order: false,
        start: null,
        children: [
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '1999年：从Motorola分拆成立',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '2000年：完成首次公开募股(IPO)',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '2011年：收购SANYO半导体',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '2016年：收购Fairchild半导体',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '2020年：Hassane El-Khoury接任CEO，开始战略转型',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '2021年：品牌重塑为"onsemi"，收购GT Advanced Technologies加强SiC业务',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '2023-2024年：继续拓展SiC业务，聚焦汽车和工业市场',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '战略转型',
          },
          {
            text: '：\n自Hassane El-Khoury上任以来，公司进行了重大战略调整：',
          },
        ],
      },
      {
        type: 'list',
        order: false,
        start: null,
        children: [
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '聚焦高增长、高价值市场，特别是汽车电气化、ADAS、能源基础设施和工厂自动化',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '剥离非核心业务，专注于盈利增长和可持续财务表现',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '加大对硅碳化物(SiC)技术的投资',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '优化制造设施，实施Fabrite战略',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '与战略客户签订长期供应协议(LTSAs)',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'head',
        level: 3,
        children: [
          {
            text: '1.2 过去5年的财务表现',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            italic: true,
            text: '(Fiscal Years End on 12/31 on Calendar Year)',
          },
        ],
      },
      {
        type: 'hr',
        children: [
          {
            text: '',
          },
        ],
      },
      {
        type: 'head',
        level: 4,
        children: [
          {
            bold: true,
            text: 'Balance Sheet (bn USD)',
          },
        ],
      },
      {
        type: 'card',
        children: [
          {
            type: 'card-before',
            children: [
              {
                text: '',
              },
            ],
          },
          {
            type: 'table',
            children: [
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 0,
                    children: [
                      {
                        text: 'Item',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: true,
                    rows: 0,
                    cols: 1,
                    children: [
                      {
                        text: '2020',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: true,
                    rows: 0,
                    cols: 2,
                    children: [
                      {
                        text: '2021',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: true,
                    rows: 0,
                    cols: 3,
                    children: [
                      {
                        text: '2022',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: true,
                    rows: 0,
                    cols: 4,
                    children: [
                      {
                        text: '2023',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: true,
                    rows: 0,
                    cols: 5,
                    children: [
                      {
                        text: '2024',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                align: 'right',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 0,
                    children: [
                      {
                        bold: true,
                        text: 'Total Assets',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 1,
                    cols: 1,
                    children: [
                      {
                        text: '9.63',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 1,
                    cols: 2,
                    children: [
                      {
                        text: '11.98',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 1,
                    cols: 3,
                    children: [
                      {
                        text: '13.22',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 1,
                    cols: 4,
                    children: [
                      {
                        text: '13.92',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 1,
                    cols: 5,
                    children: [
                      {
                        text: '14.09',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                align: 'right',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 0,
                    children: [
                      {
                        bold: true,
                        text: 'Total Liabilities',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 2,
                    cols: 1,
                    children: [
                      {
                        text: '5.02',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 2,
                    cols: 2,
                    children: [
                      {
                        text: '5.77',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 2,
                    cols: 3,
                    children: [
                      {
                        text: '5.41',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 2,
                    cols: 4,
                    children: [
                      {
                        text: '5.32',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 2,
                    cols: 5,
                    children: [
                      {
                        text: '5.28',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                align: 'right',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 0,
                    children: [
                      {
                        bold: true,
                        text: 'Shareholder Equity',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 3,
                    cols: 1,
                    children: [
                      {
                        text: '4.60',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 3,
                    cols: 2,
                    children: [
                      {
                        text: '6.21',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 3,
                    cols: 3,
                    children: [
                      {
                        text: '7.80',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 3,
                    cols: 4,
                    children: [
                      {
                        text: '8.60',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 3,
                    cols: 5,
                    children: [
                      {
                        text: '8.81',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                align: 'right',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 0,
                    children: [
                      {
                        text: 'Cash & Cash Equivalents',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 4,
                    cols: 1,
                    children: [
                      {
                        text: '1.35',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 4,
                    cols: 2,
                    children: [
                      {
                        text: '2.92',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 4,
                    cols: 3,
                    children: [
                      {
                        text: '2.48',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 4,
                    cols: 4,
                    children: [
                      {
                        text: '2.47',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 4,
                    cols: 5,
                    children: [
                      {
                        text: '2.69',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                align: 'right',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 5,
                    cols: 0,
                    children: [
                      {
                        text: 'Trade & Other Receivables',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 5,
                    cols: 1,
                    children: [
                      {
                        text: '0.81',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 5,
                    cols: 2,
                    children: [
                      {
                        text: '0.84',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 5,
                    cols: 3,
                    children: [
                      {
                        text: '0.94',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 5,
                    cols: 4,
                    children: [
                      {
                        text: '1.07',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 5,
                    cols: 5,
                    children: [
                      {
                        text: '1.16',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 6,
                    cols: 0,
                    children: [
                      {
                        text: 'Inventories',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 6,
                    cols: 1,
                    children: [
                      {
                        text: '1.38',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 6,
                    cols: 2,
                    children: [
                      {
                        text: '1.62',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 6,
                    cols: 3,
                    children: [
                      {
                        text: '2.11',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 6,
                    cols: 4,
                    children: [
                      {
                        text: '2.24',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 6,
                    cols: 5,
                    children: [
                      {
                        text: '2.24',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 7,
                    cols: 0,
                    children: [
                      {
                        text: 'PPE',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 7,
                    cols: 1,
                    children: [
                      {
                        text: '2.52',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 7,
                    cols: 2,
                    children: [
                      {
                        text: '3.45',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 7,
                    cols: 3,
                    children: [
                      {
                        text: '4.40',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 7,
                    cols: 4,
                    children: [
                      {
                        text: '4.38',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 7,
                    cols: 5,
                    children: [
                      {
                        text: '4.36',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 8,
                    cols: 0,
                    children: [
                      {
                        text: 'Intangible Assets',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 8,
                    cols: 1,
                    children: [
                      {
                        text: '0.50',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 8,
                    cols: 2,
                    children: [
                      {
                        text: '0.36',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 8,
                    cols: 3,
                    children: [
                      {
                        text: '0.30',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 8,
                    cols: 4,
                    children: [
                      {
                        text: '0.27',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 8,
                    cols: 5,
                    children: [
                      {
                        text: '0.26',
                      },
                    ],
                  },
                ],
              },
            ],
            otherProps: {
              columns: [
                {
                  title: 'Item',
                  dataIndex: 'Item',
                  key: 'Item',
                },
                {
                  title: '2020',
                  dataIndex: '2020',
                  key: '2020',
                },
                {
                  title: '2021',
                  dataIndex: '2021',
                  key: '2021',
                },
                {
                  title: '2022',
                  dataIndex: '2022',
                  key: '2022',
                },
                {
                  title: '2023',
                  dataIndex: '2023',
                  key: '2023',
                },
                {
                  title: '2024',
                  dataIndex: '2024',
                  key: '2024',
                },
              ],
              dataSource: [
                {
                  '2020': '9.63',
                  '2021': '11.98',
                  '2022': '13.22',
                  '2023': '13.92',
                  '2024': '14.09',
                  Item: '**Total Assets**',
                },
                {
                  '2020': '5.02',
                  '2021': '5.77',
                  '2022': '5.41',
                  '2023': '5.32',
                  '2024': '5.28',
                  Item: '**Total Liabilities**',
                },
                {
                  '2020': '4.60',
                  '2021': '6.21',
                  '2022': '7.80',
                  '2023': '8.60',
                  '2024': '8.81',
                  Item: '**Shareholder Equity**',
                },
                {
                  '2020': '1.35',
                  '2021': '2.92',
                  '2022': '2.48',
                  '2023': '2.47',
                  '2024': '2.69',
                  Item: 'Cash & Cash Equivalents',
                },
                {
                  '2020': '0.81',
                  '2021': '0.84',
                  '2022': '0.94',
                  '2023': '1.07',
                  '2024': '1.16',
                  Item: 'Trade & Other Receivables',
                },
                {
                  '2020': '1.38',
                  '2021': '1.62',
                  '2022': '2.11',
                  '2023': '2.24',
                  '2024': '2.24',
                  Item: 'Inventories',
                },
                {
                  '2020': '2.52',
                  '2021': '3.45',
                  '2022': '4.40',
                  '2023': '4.38',
                  '2024': '4.36',
                  Item: 'PPE',
                },
                {
                  '2020': '0.50',
                  '2021': '0.36',
                  '2022': '0.30',
                  '2023': '0.27',
                  '2024': '0.26',
                  Item: 'Intangible Assets',
                },
              ],
            },
          },
          {
            type: 'card-after',
            children: [
              {
                text: '',
              },
            ],
          },
        ],
      },
      {
        type: 'hr',
        children: [
          {
            text: '',
          },
        ],
      },
      {
        type: 'head',
        level: 4,
        children: [
          {
            bold: true,
            text: 'Income Statement (bn USD)',
          },
        ],
      },
      {
        type: 'card',
        children: [
          {
            type: 'card-before',
            children: [
              {
                text: '',
              },
            ],
          },
          {
            type: 'table',
            children: [
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 0,
                    children: [
                      {
                        text: 'Item',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 1,
                    children: [
                      {
                        text: '2020',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 2,
                    children: [
                      {
                        text: '2021',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 3,
                    children: [
                      {
                        text: '2022',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 4,
                    children: [
                      {
                        text: '2023',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 5,
                    children: [
                      {
                        text: '2024',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 0,
                    children: [
                      {
                        text: 'Revenue',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 1,
                    children: [
                      {
                        text: '5.26',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 2,
                    children: [
                      {
                        text: '6.74',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 3,
                    children: [
                      {
                        text: '8.33',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 4,
                    children: [
                      {
                        text: '8.25',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 5,
                    children: [
                      {
                        text: '7.08',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 0,
                    children: [
                      {
                        text: 'Growth',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 1,
                    children: [
                      {
                        text: '-4.8%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 2,
                    children: [
                      {
                        text: '28.3%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 3,
                    children: [
                      {
                        text: '23.5%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 4,
                    children: [
                      {
                        text: '-0.9%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 5,
                    children: [
                      {
                        text: '-14.2%',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 0,
                    children: [
                      {
                        text: 'Gross Profit',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 1,
                    children: [
                      {
                        text: '1.72',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 2,
                    children: [
                      {
                        text: '2.71',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 3,
                    children: [
                      {
                        text: '4.08',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 4,
                    children: [
                      {
                        text: '3.88',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 5,
                    children: [
                      {
                        text: '3.22',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 0,
                    children: [
                      {
                        text: 'Gross Margin',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 1,
                    children: [
                      {
                        text: '32.7%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 2,
                    children: [
                      {
                        text: '40.3%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 3,
                    children: [
                      {
                        text: '49.0%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 4,
                    children: [
                      {
                        text: '47.1%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 5,
                    children: [
                      {
                        text: '45.4%',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 5,
                    cols: 0,
                    children: [
                      {
                        text: 'OpEx',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 5,
                    cols: 1,
                    children: [
                      {
                        text: '1.37',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 5,
                    cols: 2,
                    children: [
                      {
                        text: '1.35',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 5,
                    cols: 3,
                    children: [
                      {
                        text: '1.31',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 5,
                    cols: 4,
                    children: [
                      {
                        text: '1.27',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 5,
                    cols: 5,
                    children: [
                      {
                        text: '1.31',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 6,
                    cols: 0,
                    children: [
                      {
                        text: 'R&D',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 6,
                    cols: 1,
                    children: [
                      {
                        text: '0.64',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 6,
                    cols: 2,
                    children: [
                      {
                        text: '0.66',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 6,
                    cols: 3,
                    children: [
                      {
                        text: '0.60',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 6,
                    cols: 4,
                    children: [
                      {
                        text: '0.58',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 6,
                    cols: 5,
                    children: [
                      {
                        text: '0.61',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 7,
                    cols: 0,
                    children: [
                      {
                        text: 'SG&A',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 7,
                    cols: 1,
                    children: [
                      {
                        text: '0.60',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 7,
                    cols: 2,
                    children: [
                      {
                        text: '0.60',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 7,
                    cols: 3,
                    children: [
                      {
                        text: '0.63',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 7,
                    cols: 4,
                    children: [
                      {
                        text: '0.64',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 7,
                    cols: 5,
                    children: [
                      {
                        text: '0.65',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 8,
                    cols: 0,
                    children: [
                      {
                        text: 'Operating Income',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 8,
                    cols: 1,
                    children: [
                      {
                        text: '0.35',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 8,
                    cols: 2,
                    children: [
                      {
                        text: '1.36',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 8,
                    cols: 3,
                    children: [
                      {
                        text: '2.76',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 8,
                    cols: 4,
                    children: [
                      {
                        text: '2.61',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 8,
                    cols: 5,
                    children: [
                      {
                        text: '1.90',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 9,
                    cols: 0,
                    children: [
                      {
                        text: 'Operating Margin',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 9,
                    cols: 1,
                    children: [
                      {
                        text: '6.6%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 9,
                    cols: 2,
                    children: [
                      {
                        text: '20.2%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 9,
                    cols: 3,
                    children: [
                      {
                        text: '33.2%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 9,
                    cols: 4,
                    children: [
                      {
                        text: '31.7%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 9,
                    cols: 5,
                    children: [
                      {
                        text: '26.9%',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 10,
                    cols: 0,
                    children: [
                      {
                        text: 'Net Income',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 10,
                    cols: 1,
                    children: [
                      {
                        text: '0.24',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 10,
                    cols: 2,
                    children: [
                      {
                        text: '1.01',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 10,
                    cols: 3,
                    children: [
                      {
                        text: '1.90',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 10,
                    cols: 4,
                    children: [
                      {
                        text: '2.18',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 10,
                    cols: 5,
                    children: [
                      {
                        text: '1.57',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 11,
                    cols: 0,
                    children: [
                      {
                        text: 'Net Margin',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 11,
                    cols: 1,
                    children: [
                      {
                        text: '4.5%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 11,
                    cols: 2,
                    children: [
                      {
                        text: '15.0%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 11,
                    cols: 3,
                    children: [
                      {
                        text: '22.8%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 11,
                    cols: 4,
                    children: [
                      {
                        text: '26.5%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 11,
                    cols: 5,
                    children: [
                      {
                        text: '22.2%',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 12,
                    cols: 0,
                    children: [
                      {
                        text: 'EPS (USD)',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 12,
                    cols: 1,
                    children: [
                      {
                        text: '0.58',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 12,
                    cols: 2,
                    children: [
                      {
                        text: '2.27',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 12,
                    cols: 3,
                    children: [
                      {
                        text: '4.24',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 12,
                    cols: 4,
                    children: [
                      {
                        text: '4.89',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 12,
                    cols: 5,
                    children: [
                      {
                        text: '3.63',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 13,
                    cols: 0,
                    children: [
                      {
                        text: 'Growth',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 13,
                    cols: 1,
                    children: [
                      {
                        text: '-',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 13,
                    cols: 2,
                    children: [
                      {
                        text: '291.4%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 13,
                    cols: 3,
                    children: [
                      {
                        text: '86.8%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 13,
                    cols: 4,
                    children: [
                      {
                        text: '15.3%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 13,
                    cols: 5,
                    children: [
                      {
                        text: '-25.8%',
                      },
                    ],
                  },
                ],
              },
            ],
            otherProps: {
              columns: [
                {
                  title: 'Item',
                  dataIndex: 'Item',
                  key: 'Item',
                },
                {
                  title: '2020',
                  dataIndex: '2020',
                  key: '2020',
                },
                {
                  title: '2021',
                  dataIndex: '2021',
                  key: '2021',
                },
                {
                  title: '2022',
                  dataIndex: '2022',
                  key: '2022',
                },
                {
                  title: '2023',
                  dataIndex: '2023',
                  key: '2023',
                },
                {
                  title: '2024',
                  dataIndex: '2024',
                  key: '2024',
                },
              ],
              dataSource: [
                {
                  '2020': '5.26',
                  '2021': '6.74',
                  '2022': '8.33',
                  '2023': '8.25',
                  '2024': '7.08',
                  Item: 'Revenue',
                },
                {
                  '2020': '-4.8%',
                  '2021': '28.3%',
                  '2022': '23.5%',
                  '2023': '-0.9%',
                  '2024': '-14.2%',
                  Item: 'Growth',
                },
                {
                  '2020': '1.72',
                  '2021': '2.71',
                  '2022': '4.08',
                  '2023': '3.88',
                  '2024': '3.22',
                  Item: 'Gross Profit',
                },
                {
                  '2020': '32.7%',
                  '2021': '40.3%',
                  '2022': '49.0%',
                  '2023': '47.1%',
                  '2024': '45.4%',
                  Item: 'Gross Margin',
                },
                {
                  '2020': '1.37',
                  '2021': '1.35',
                  '2022': '1.31',
                  '2023': '1.27',
                  '2024': '1.31',
                  Item: 'OpEx',
                },
                {
                  '2020': '0.64',
                  '2021': '0.66',
                  '2022': '0.60',
                  '2023': '0.58',
                  '2024': '0.61',
                  Item: 'R\\&D',
                },
                {
                  '2020': '0.60',
                  '2021': '0.60',
                  '2022': '0.63',
                  '2023': '0.64',
                  '2024': '0.65',
                  Item: 'SG\\&A',
                },
                {
                  '2020': '0.35',
                  '2021': '1.36',
                  '2022': '2.76',
                  '2023': '2.61',
                  '2024': '1.90',
                  Item: 'Operating Income',
                },
                {
                  '2020': '6.6%',
                  '2021': '20.2%',
                  '2022': '33.2%',
                  '2023': '31.7%',
                  '2024': '26.9%',
                  Item: 'Operating Margin',
                },
                {
                  '2020': '0.24',
                  '2021': '1.01',
                  '2022': '1.90',
                  '2023': '2.18',
                  '2024': '1.57',
                  Item: 'Net Income',
                },
                {
                  '2020': '4.5%',
                  '2021': '15.0%',
                  '2022': '22.8%',
                  '2023': '26.5%',
                  '2024': '22.2%',
                  Item: 'Net Margin',
                },
                {
                  '2020': '0.58',
                  '2021': '2.27',
                  '2022': '4.24',
                  '2023': '4.89',
                  '2024': '3.63',
                  Item: 'EPS (USD)',
                },
                {
                  '2020': '-',
                  '2021': '291.4%',
                  '2022': '86.8%',
                  '2023': '15.3%',
                  '2024': '-25.8%',
                  Item: 'Growth',
                },
              ],
            },
          },
          {
            type: 'card-after',
            children: [
              {
                text: '',
              },
            ],
          },
        ],
      },
      {
        type: 'hr',
        children: [
          {
            text: '',
          },
        ],
      },
      {
        type: 'head',
        level: 4,
        children: [
          {
            bold: true,
            text: 'Profitability Metrics',
          },
        ],
      },
      {
        type: 'card',
        children: [
          {
            type: 'card-before',
            children: [
              {
                text: '',
              },
            ],
          },
          {
            type: 'table',
            children: [
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 0,
                    children: [
                      {
                        text: 'Metric',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 1,
                    children: [
                      {
                        text: '2020',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 2,
                    children: [
                      {
                        text: '2021',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 3,
                    children: [
                      {
                        text: '2022',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 4,
                    children: [
                      {
                        text: '2023',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 5,
                    children: [
                      {
                        text: '2024',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 0,
                    children: [
                      {
                        text: 'Gross Margin',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 1,
                    children: [
                      {
                        text: '32.7%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 2,
                    children: [
                      {
                        text: '40.3%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 3,
                    children: [
                      {
                        text: '49.0%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 4,
                    children: [
                      {
                        text: '47.1%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 5,
                    children: [
                      {
                        text: '45.4%',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 0,
                    children: [
                      {
                        text: 'Operating Margin',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 1,
                    children: [
                      {
                        text: '6.6%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 2,
                    children: [
                      {
                        text: '20.2%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 3,
                    children: [
                      {
                        text: '33.2%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 4,
                    children: [
                      {
                        text: '31.7%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 5,
                    children: [
                      {
                        text: '26.9%',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 0,
                    children: [
                      {
                        text: 'Net Profit Margin',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 1,
                    children: [
                      {
                        text: '4.5%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 2,
                    children: [
                      {
                        text: '15.0%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 3,
                    children: [
                      {
                        text: '22.8%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 4,
                    children: [
                      {
                        text: '26.5%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 5,
                    children: [
                      {
                        text: '22.2%',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 0,
                    children: [
                      {
                        text: 'ROE',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 1,
                    children: [
                      {
                        text: '5.1%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 2,
                    children: [
                      {
                        text: '16.3%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 3,
                    children: [
                      {
                        text: '24.4%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 4,
                    children: [
                      {
                        text: '25.4%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 5,
                    children: [
                      {
                        text: '17.8%',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 5,
                    cols: 0,
                    children: [
                      {
                        text: 'ROA',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 5,
                    cols: 1,
                    children: [
                      {
                        text: '2.5%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 5,
                    cols: 2,
                    children: [
                      {
                        text: '8.4%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 5,
                    cols: 3,
                    children: [
                      {
                        text: '14.4%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 5,
                    cols: 4,
                    children: [
                      {
                        text: '15.7%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 5,
                    cols: 5,
                    children: [
                      {
                        text: '11.2%',
                      },
                    ],
                  },
                ],
              },
            ],
            otherProps: {
              columns: [
                {
                  title: 'Metric',
                  dataIndex: 'Metric',
                  key: 'Metric',
                },
                {
                  title: '2020',
                  dataIndex: '2020',
                  key: '2020',
                },
                {
                  title: '2021',
                  dataIndex: '2021',
                  key: '2021',
                },
                {
                  title: '2022',
                  dataIndex: '2022',
                  key: '2022',
                },
                {
                  title: '2023',
                  dataIndex: '2023',
                  key: '2023',
                },
                {
                  title: '2024',
                  dataIndex: '2024',
                  key: '2024',
                },
              ],
              dataSource: [
                {
                  '2020': '32.7%',
                  '2021': '40.3%',
                  '2022': '49.0%',
                  '2023': '47.1%',
                  '2024': '45.4%',
                  Metric: 'Gross Margin',
                },
                {
                  '2020': '6.6%',
                  '2021': '20.2%',
                  '2022': '33.2%',
                  '2023': '31.7%',
                  '2024': '26.9%',
                  Metric: 'Operating Margin',
                },
                {
                  '2020': '4.5%',
                  '2021': '15.0%',
                  '2022': '22.8%',
                  '2023': '26.5%',
                  '2024': '22.2%',
                  Metric: 'Net Profit Margin',
                },
                {
                  '2020': '5.1%',
                  '2021': '16.3%',
                  '2022': '24.4%',
                  '2023': '25.4%',
                  '2024': '17.8%',
                  Metric: 'ROE',
                },
                {
                  '2020': '2.5%',
                  '2021': '8.4%',
                  '2022': '14.4%',
                  '2023': '15.7%',
                  '2024': '11.2%',
                  Metric: 'ROA',
                },
              ],
            },
          },
          {
            type: 'card-after',
            children: [
              {
                text: '',
              },
            ],
          },
        ],
      },
      {
        type: 'hr',
        children: [
          {
            text: '',
          },
        ],
      },
      {
        type: 'head',
        level: 4,
        children: [
          {
            bold: true,
            text: 'Cash Flow Statement (bn USD)',
          },
        ],
      },
      {
        type: 'card',
        children: [
          {
            type: 'card-before',
            children: [
              {
                text: '',
              },
            ],
          },
          {
            type: 'table',
            children: [
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 0,
                    children: [
                      {
                        text: 'Item',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 1,
                    children: [
                      {
                        text: '2020',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: true,
                    rows: 0,
                    cols: 2,
                    children: [
                      {
                        text: '2021',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: true,
                    rows: 0,
                    cols: 3,
                    children: [
                      {
                        text: '2022',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: true,
                    rows: 0,
                    cols: 4,
                    children: [
                      {
                        text: '2023',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: true,
                    rows: 0,
                    cols: 5,
                    children: [
                      {
                        text: '2024',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 0,
                    children: [
                      {
                        bold: true,
                        text: 'Operating Cash Flow',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 1,
                    children: [
                      {
                        text: '-',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 1,
                    cols: 2,
                    children: [
                      {
                        text: '1.52',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 1,
                    cols: 3,
                    children: [
                      {
                        text: '-',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 1,
                    cols: 4,
                    children: [
                      {
                        text: '1.98',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 1,
                    cols: 5,
                    children: [
                      {
                        text: '1.91',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                align: 'right',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 0,
                    children: [
                      {
                        bold: true,
                        text: 'Capital Expenditure',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 1,
                    children: [
                      {
                        text: '-',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 2,
                    cols: 2,
                    children: [
                      {
                        text: '0.45',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 2,
                    cols: 3,
                    children: [
                      {
                        text: '-',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 2,
                    cols: 4,
                    children: [
                      {
                        text: '1.54',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 2,
                    cols: 5,
                    children: [
                      {
                        text: '0.69',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 0,
                    children: [
                      {
                        bold: true,
                        text: 'Free Cash Flow',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 1,
                    children: [
                      {
                        text: '-',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 3,
                    cols: 2,
                    children: [
                      {
                        text: '1.07',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 3,
                    cols: 3,
                    children: [
                      {
                        text: '-',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 3,
                    cols: 4,
                    children: [
                      {
                        text: '0.44',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 3,
                    cols: 5,
                    children: [
                      {
                        text: '1.21',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table-row',
                align: 'right',
                children: [
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 0,
                    children: [
                      {
                        text: 'FCF Margin',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 1,
                    children: [
                      {
                        text: '-',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 4,
                    cols: 2,
                    children: [
                      {
                        text: '15.9%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    title: false,
                    rows: 4,
                    cols: 3,
                    children: [
                      {
                        text: '-',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 4,
                    cols: 4,
                    children: [
                      {
                        text: '5.3%',
                      },
                    ],
                  },
                  {
                    type: 'table-cell',
                    align: 'right',
                    title: false,
                    rows: 4,
                    cols: 5,
                    children: [
                      {
                        text: '17.1%',
                      },
                    ],
                  },
                ],
              },
            ],
            otherProps: {
              columns: [
                {
                  title: 'Item',
                  dataIndex: 'Item',
                  key: 'Item',
                },
                {
                  title: '2020',
                  dataIndex: '2020',
                  key: '2020',
                },
                {
                  title: '2021',
                  dataIndex: '2021',
                  key: '2021',
                },
                {
                  title: '2022',
                  dataIndex: '2022',
                  key: '2022',
                },
                {
                  title: '2023',
                  dataIndex: '2023',
                  key: '2023',
                },
                {
                  title: '2024',
                  dataIndex: '2024',
                  key: '2024',
                },
              ],
              dataSource: [
                {
                  '2020': '-',
                  '2021': '1.52',
                  '2022': '-',
                  '2023': '1.98',
                  '2024': '1.91',
                  Item: '**Operating Cash Flow**',
                },
                {
                  '2020': '-',
                  '2021': '0.45',
                  '2022': '-',
                  '2023': '1.54',
                  '2024': '0.69',
                  Item: '**Capital Expenditure**',
                },
                {
                  '2020': '-',
                  '2021': '1.07',
                  '2022': '-',
                  '2023': '0.44',
                  '2024': '1.21',
                  Item: '**Free Cash Flow**',
                },
                {
                  '2020': '-',
                  '2021': '15.9%',
                  '2022': '-',
                  '2023': '5.3%',
                  '2024': '17.1%',
                  Item: 'FCF Margin',
                },
              ],
            },
          },
          {
            type: 'card-after',
            children: [
              {
                text: '',
              },
            ],
          },
        ],
      },
      {
        type: 'head',
        level: 3,
        children: [
          {
            text: '1.3 最近重大事件与新闻',
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
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '收购与扩张',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '2025年1月完成对Qorvo的碳化硅JFET技术组合的收购，交易金额为1.15亿美元',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '2025年3月提议以每股35.10美元收购Allegro MicroSystems，总企业价值69亿美元，但于2025年4月撤回提案',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '2023年完成对GlobalFoundries位于纽约East Fishkill的300mm晶圆制造厂的收购',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '产品创新',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '2025年3月发布Hyperlux™ ID系列先进深度传感器，用于工业自动化和机器人应用',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '扩大碳化硅(SiC)产能，在新罕布什尔州Hudson、捷克共和国和韩国增加投资',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '战略合作',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '2024年12月与DENSO加强合作关系，支持自动驾驶和高级驾驶辅助系统技术',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '与大众集团、特斯拉、捷豹路虎和现代汽车集团等汽车制造商建立合作关系',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '可持续发展',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '2025年2月获得科学碳目标倡议(SBTi)对其减排目标的验证',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '承诺到2034年将绝对范围1和2的温室气体排放量减少58.8%',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '计划到2040年实现净零排放',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'head',
        level: 3,
        children: [
          {
            text: '1.4 好生意：定量指标、定性指标 (波特五力)',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '定量指标评估',
          },
          {
            text: '：',
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
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '收入增长',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '2021年增长28.3%，2022年增长23.5%，显示出强劲增长',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '2023年和2024年有所下滑(-0.9%和-14.2%)，反映出半导体行业的周期性',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '盈利能力',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '毛利率从2020年的32.7%提升至2022年的49.0%，尽管之后有所下降，但仍保持在较高水平(2024年为45.4%)',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '营业利润率从2020年的6.6%大幅提升至2022年的33.2%，显示出运营效率的显著改善',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '自由现金流',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '2024年自由现金流达到12.1亿美元，较2023年的4.4亿美元大幅增长',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '自由现金流利润率为17.1%，表明公司有强大的现金生成能力',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '定性指标评估（波特五力分析）',
          },
          {
            text: '：',
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
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '现有竞争者的竞争程度',
                  },
                  {
                    text: ' (中高)：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '电源管理和传感器市场竞争激烈，主要竞争对手包括英飞凌(Infineon)、意法半导体(STMicroelectronics)、德州仪器(Texas Instruments)、Wolfspeed等',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '在某些细分市场，如SiC功率器件领域，onsemi具有一定的差异化优势',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：3/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '新进入者的威胁',
                  },
                  {
                    text: ' (低):',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '半导体行业具有高技术壁垒和资本要求',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '制造工艺和设计经验需要长期积累',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '公司通过垂直整合(如SiC业务从基板到模块)建立了更高的进入壁垒',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：4.5/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '替代品的威胁',
                  },
                  {
                    text: ' (低到中):',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'SiC技术目前在电动汽车和高压应用中优于传统硅基解决方案',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '未来可能面临如氮化镓(GaN)等新兴技术的替代风险，但短期内威胁有限',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：4/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '供应商的议价能力',
                  },
                  {
                    text: ' (中):',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '原材料和晶圆代工的供应有时受限，可能增加成本',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '公司通过收购GTAT增强了SiC材料的自给能力，减少了对外部供应商的依赖',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：3.5/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '购买者的议价能力',
                  },
                  {
                    text: ' (中高):',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '汽车制造商和大型工业客户具有较强的议价能力',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '公司通过与客户签订长期供应协议(LTSAs)来稳定关系',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '产品差异化和专注于高价值市场有助于提高议价能力',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：3/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '总体评估',
          },
          {
            text: '：',
          },
        ],
      },
      {
        type: 'list',
        order: false,
        start: null,
        children: [
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: 'onsemi在电源管理和传感技术领域有强大的市场地位',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '公司战略性聚焦于高增长市场（汽车电气化、工业自动化）',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '在SiC技术领域有垂直整合优势',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '毛利率和盈利能力优秀，但面临行业周期性挑战',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '波特五力综合评分：3.6/5，表明业务质量良好',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'head',
        level: 3,
        children: [
          {
            text: '1.5 好管理',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '管理层评估',
          },
          {
            text: '：',
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
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '战略愿景与执行力',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'CEO Hassane El-Khoury自2020年底上任以来推动了明确的战略转型',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '成功实施了聚焦高价值市场和剥离非核心业务的战略',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '通过收购GTAT增强了SiC业务的垂直整合能力',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：4.5/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '资本配置',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '2024年回购约9.1百万股普通股，总金额约6.5亿美元，表明对股东回报的重视',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '在SiC领域进行战略性投资，包括捷克共和国的垂直整合制造设施',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '具有纪律性的收购策略，例如在未达成合理条件时撤回对Allegro MicroSystems的收购提议',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：4/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '企业文化与ESG承诺',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '积极推进可持续发展目标，获得SBTi对减排目标的验证',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '承诺到2040年实现净零排放',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '加入联合国全球契约(UN Global Compact)，展示对企业社会责任的承诺',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '连续多年被Ethisphere Institute评为"世界最道德公司"',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：4/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '透明度与沟通',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '定期举行投资者会议，清晰传达公司战略和业绩',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '提供详细的财务和非财务指标',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：4/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '总体管理评分',
          },
          {
            text: '：4.1/5，表明管理质量优秀。',
          },
        ],
      },
      {
        type: 'head',
        level: 3,
        children: [
          {
            text: '1.6 好价格',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '估值指标',
          },
          {
            text: '：',
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
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '市盈率(P/E)',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '当前P/E：37.32倍',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '相对于历史均值和行业平均水平，这一估值相对较高',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：2.5/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '增长调整市盈率(PEG)',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '公司在2021-2022年经历了高速增长，但近期增长有所放缓',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '考虑到未来几年的增长预期，当前估值较为合理',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：3/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '企业价值倍数',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'EV/EBITDA：约11倍',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '对于一家质量较好的半导体公司，这一倍数相对合理',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：3.5/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '自由现金流收益率',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '基于2024年自由现金流，收益率约为5.3%',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '略高于美国10年期国债收益率',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：3.5/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    bold: true,
                    text: '价格相对历史区间',
                  },
                  {
                    text: '：',
                  },
                ],
              },
              {
                type: 'list',
                order: false,
                start: null,
                children: [
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '当前价格54.21美元，处于52周价格区间(31.04-80.08美元)的中间位置',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '较52周高点折价约32%',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'list-item',
                    checked: null,
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: '评分：3.5/5',
                          },
                        ],
                      },
                    ],
                  },
                ],
                task: false,
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '估值总结',
          },
          {
            text: '：',
          },
        ],
      },
      {
        type: 'list',
        order: false,
        start: null,
        children: [
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '总体估值略偏高，但考虑到公司的质量和长期增长前景，仍在可接受范围内',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '当前价格可能已经反映了短期半导体行业周期性下滑的影响',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '长期投资者可能会发现当前价格具有一定吸引力，特别是考虑到公司在SiC和汽车电气化等领域的长期增长潜力',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '总体价格评分',
          },
          {
            text: '：3.2/5，表明价格适中。',
          },
        ],
      },
      {
        type: 'head',
        level: 3,
        children: [
          {
            text: '1.7 批判性思考与反驳',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '对"好生意"的质疑',
          },
          {
            text: '：',
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
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '半导体行业的周期性是否会持续影响公司业绩？2023-2024年的收入下滑是暂时现象还是长期趋势？',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: 'SiC技术的竞争正在加剧，英飞凌、意法半导体和Wolfspeed等公司也在加大投资，onsemi能否保持竞争优势？',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '对汽车行业的依赖是否会成为风险，特别是在电动车市场增长放缓的情况下？',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '对"好管理"的质疑',
          },
          {
            text: '：',
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
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '过去的大型收购（如SANYO和Fairchild）的整合效果如何？这是否表明管理层可能在未来的并购中面临挑战？',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '尽管股票回购活跃，但公司没有支付股息，这是否反映了资本回报策略的不足？',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '对"好价格"的质疑',
          },
          {
            text: '：',
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
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '37倍的市盈率在半导体行业中属于高估，特别是考虑到近期增长放缓',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '如果行业下滑持续时间长于预期，当前估值可能难以支撑',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '反思与回应',
          },
          {
            text: '：',
          },
        ],
      },
      {
        type: 'list',
        order: false,
        start: null,
        children: [
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '半导体行业的周期性确实存在，但onsemi通过转向高价值市场和签订长期供应协议来减轻这种影响',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: 'SiC竞争加剧是事实，但onsemi的垂直整合策略和在中国市场的强势地位提供了差异化优势',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '尽管汽车市场占比高，但公司也在工业和AI数据中心等其他领域扩大业务',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '管理层已展示出在El-Khoury领导下的执行力，战略转型成效明显',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '当前估值虽然不低，但考虑到公司质量和长期增长潜力，仍有合理性',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '调整后评分',
          },
          {
            text: '：',
          },
        ],
      },
      {
        type: 'list',
        order: false,
        start: null,
        children: [
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '好生意：从3.6/5调整为3.4/5',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '好管理：维持4.1/5',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '好价格：从3.2/5调整为3.0/5',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'head',
        level: 3,
        children: [
          {
            text: '1.8 综合评估',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '综合分数',
          },
          {
            text: '：(3.4',
          },
          {
            italic: true,
            text: '0.4 + 4.1',
          },
          {
            text: '0.3 + 3.0*0.3) = 3.48/5',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: 'ON Semiconductor的投资价值评估',
          },
          {
            text: '：',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'ON Semiconductor (onsemi) 是一家质量较好的半导体公司，在电源管理和智能传感技术领域具有竞争优势。公司成功实施了从广泛的半导体产品向高价值、高毛利率业务的战略转型，特别是聚焦于汽车电气化和工业自动化等高增长领域。',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '优势',
          },
          {
            text: '：',
          },
        ],
      },
      {
        type: 'list',
        order: false,
        start: null,
        children: [
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '在汽车和工业市场的强劲地位，占总收入约80%',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '硅碳化物(SiC)业务的垂直整合，从基板到模块的全产业链能力',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '高毛利率(45%+)和强劲的自由现金流生成能力',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '管理层执行力强，战略清晰，资本配置纪律性好',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '与主要客户的长期供应协议提供业务稳定性',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '风险',
          },
          {
            text: '：',
          },
        ],
      },
      {
        type: 'list',
        order: false,
        start: null,
        children: [
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '半导体行业的周期性，2023-2024年收入已经出现下滑',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: 'SiC市场竞争加剧，面临英飞凌、意法半导体等强劲对手',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '对汽车市场的高度依赖(54%)可能带来波动',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '相对较高的估值(P/E 37.32)需要持续的高增长来支撑',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '全球贸易环境和供应链风险',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '前景展望',
          },
          {
            text: '：\n中长期来看，onsemi在汽车电气化、工业自动化和AI数据中心等领域的布局与全球大趋势相符。SiC技术在电动汽车和可再生能源等应用中的需求预计将持续增长。公司的垂直整合战略和与关键客户的深度合作为长期增长奠定了基础。',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '关注要点',
          },
          {
            text: '：',
          },
        ],
      },
      {
        type: 'list',
        order: false,
        start: null,
        children: [
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '监测SiC业务的增长和盈利情况',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '关注汽车市场特别是电动车市场的发展趋势',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '留意半导体行业周期的变化信号',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            checked: null,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '评估管理层执行长期战略的持续成效',
                  },
                ],
              },
            ],
          },
        ],
        task: false,
      },
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: '综合结论',
          },
          {
            text: '：\nON Semiconductor是一家具有良好质量的半导体公司，战略方向清晰，管理执行力强。尽管当前估值不低，但考虑到其在高增长市场的布局和技术优势，中长期投资价值值得关注。投资者应关注行业周期性风险，并以合理价格建立仓位。',
          },
        ],
      },
    ]);
    expect(result).toMatchSnapshot();
  });
});
