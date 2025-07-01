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
});
