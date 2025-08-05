import { createEditor, Editor, Element, Range } from 'slate';
import { describe, expect, it, vi } from 'vitest';
import {
  CheckMdParams,
  insertAfter,
  MdElements,
} from '../../src/MarkdownEditor/editor/plugins/elements';

// Mock EditorUtils
vi.mock('../../src/MarkdownEditor/editor/utils/editorUtils', () => ({
  EditorUtils: {
    isDirtLeaf: vi.fn(),
    moveAfterSpace: vi.fn(),
    wrapperCardNode: vi.fn((node) => node),
    cutText: vi.fn(() => [{ text: 'test' }]),
    p: { type: 'paragraph', children: [{ text: '' }] },
    createMediaNode: vi.fn(() => ({
      type: 'image',
      url: 'test.jpg',
      children: [{ text: '' }],
    })),
    isTop: vi.fn(() => true),
    end: vi.fn(() => ({ path: [0, 0], offset: 0 })),
    start: vi.fn(() => ({ path: [0, 0], offset: 0 })),
  },
}));

describe('elements.ts', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = createEditor();
    editor.children = [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ];
  });

  describe('insertAfter', () => {
    it('should insert node after specified path', () => {
      const path = [0];
      const node = { type: 'paragraph', children: [{ text: 'new content' }] };

      insertAfter(editor, path, node);

      expect(editor.children).toHaveLength(2);
      expect(editor.children[1]).toEqual(node);
    });

    it('should insert default paragraph node when no node provided', () => {
      const path = [0];

      insertAfter(editor, path);

      expect(editor.children).toHaveLength(2);
      expect(editor.children[1]).toEqual({
        type: 'paragraph',
        children: [{ text: '' }],
      });
    });
  });

  describe('MdElements', () => {
    describe('table', () => {
      it('should convert table markdown to table element', () => {
        const match = ['|col1|col2|', 'col1|col2'];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '|col1|col2|',
        };

        MdElements.table.run(ctx);

        expect(editor.children[0]).toMatchObject({
          type: 'table',
          children: [
            {
              type: 'table-row',
              children: [
                {
                  type: 'table-cell',
                  title: true,
                  children: [{ text: 'col1' }],
                },
                {
                  type: 'table-cell',
                  title: true,
                  children: [{ text: 'col2' }],
                },
              ],
            },
            {
              type: 'table-row',
              children: [
                { type: 'table-cell', children: [{ text: '' }] },
                { type: 'table-cell', children: [{ text: '' }] },
              ],
            },
            x,
          ],
        });
      });
    });

    describe('code', () => {
      it('should convert code block markdown to code element', () => {
        const match = ['```javascript', 'javascript'];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '```javascript',
        };

        MdElements.code.run(ctx);

        expect(editor.children[0]).toMatchObject({
          type: 'code',
          language: 'javascript',
          value: '',
        });
      });

      it('should handle code block without language', () => {
        const match = ['```', undefined];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '```',
        };

        MdElements.code.run(ctx);

        expect(editor.children[0]).toMatchObject({
          type: 'code',
          language: undefined,
          value: '',
        });
      });
    });

    describe('head', () => {
      it('should convert heading markdown to head element', () => {
        const match = ['# Heading', '#', 'Heading'];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '# Heading',
        };

        MdElements.head.run(ctx);

        expect(editor.children[0]).toMatchObject({
          type: 'head',
          level: 1,
          children: [{ text: '' }],
        });
      });

      it('should handle different heading levels', () => {
        const match = ['### Heading', '###', 'Heading'];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '### Heading',
        };

        MdElements.head.run(ctx);

        expect(editor.children[0]).toMatchObject({
          type: 'head',
          level: 3,
        });
      });
    });

    describe('link', () => {
      it('should convert link markdown to link element', () => {
        const match = ['[text](url)', 'text', 'url'];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '[text](url)',
        };

        MdElements.link.run(ctx);

        // Should insert link text and empty text
        expect(editor.children[0].children).toHaveLength(2);
        expect(editor.children[0].children[0]).toMatchObject({
          text: 'text',
          url: 'url',
        });
      });
    });

    describe('img', () => {
      it('should convert image markdown to image element', () => {
        const match = ['![alt](url)', 'alt', 'url'];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '![alt](url)',
        };

        MdElements.img.run(ctx);

        // Should insert media node
        expect(editor.children[0].children).toHaveLength(1);
        expect(editor.children[0].children[0]).toMatchObject({
          type: 'image',
          url: 'url',
        });
      });
    });

    describe('task', () => {
      it('should convert task markdown to task list element', () => {
        const match = ['[ ] Task', ' '];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '[ ] Task',
        };

        MdElements.task.run(ctx);

        expect(editor.children[0]).toMatchObject({
          type: 'list',
          task: true,
          children: [
            {
              type: 'list-item',
              checked: false,
            },
          ],
        });
      });

      it('should handle checked task', () => {
        const match = ['[x] Task', 'x'];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '[x] Task',
        };

        MdElements.task.run(ctx);

        expect(editor.children[0]).toMatchObject({
          type: 'list',
          task: true,
          children: [
            {
              type: 'list-item',
              checked: true,
            },
          ],
        });
      });
    });

    describe('list', () => {
      it('should convert unordered list markdown to list element', () => {
        const match = ['- Item', '-'];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '- Item',
        };

        MdElements.list.run(ctx);

        expect(editor.children[0]).toMatchObject({
          type: 'list',
          order: false,
          children: [
            {
              type: 'list-item',
            },
          ],
        });
      });

      it('should convert ordered list markdown to list element', () => {
        const match = ['1. Item', '1.'];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '1. Item',
        };

        MdElements.list.run(ctx);

        expect(editor.children[0]).toMatchObject({
          type: 'list',
          order: true,
          start: 1,
          children: [
            {
              type: 'list-item',
            },
          ],
        });
      });
    });

    describe('hr', () => {
      it('should convert horizontal rule markdown to hr element', () => {
        const match = ['***'];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '***',
        };

        MdElements.hr.run(ctx);

        expect(editor.children[0]).toMatchObject({
          type: 'hr',
          children: [{ text: '' }],
        });
      });
    });

    describe('frontmatter', () => {
      it('should convert frontmatter markdown to code element', () => {
        const match = ['---'];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '---',
        };

        MdElements.frontmatter.run(ctx);

        expect(editor.children[0]).toMatchObject({
          type: 'code',
          language: 'yaml',
          frontmatter: true,
          children: [{ text: '' }],
        });
      });
    });

    describe('blockquote', () => {
      it('should convert blockquote markdown to blockquote element', () => {
        const match = ['> Quote', 'Quote'];
        const path = [0];
        const sel: Range = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        const ctx: CheckMdParams = {
          sel,
          editor,
          path,
          match: match as RegExpMatchArray,
          el: editor.children[0] as Element,
          startText: '> Quote',
        };

        MdElements.blockquote.run(ctx);

        expect(editor.children[0]).toMatchObject({
          type: 'blockquote',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'test' }],
            },
          ],
        });
      });
    });

    describe('text formatting', () => {
      describe('bold', () => {
        it('should convert bold markdown to bold text', () => {
          const match = ['**bold**', 'bold'];
          const path = [0];
          const sel: Range = {
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 0 },
          };

          const ctx: CheckMdParams = {
            sel,
            editor,
            path,
            match: match as RegExpMatchArray,
            el: editor.children[0] as Element,
            startText: '**bold**',
          };

          MdElements.bold.run(ctx);

          expect(editor.children[0].children[0]).toMatchObject({
            text: 'bold',
            bold: true,
          });
        });
      });

      describe('italic', () => {
        it('should convert italic markdown to italic text', () => {
          const match = ['*italic*', 'italic'];
          const path = [0];
          const sel: Range = {
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 0 },
          };

          const ctx: CheckMdParams = {
            sel,
            editor,
            path,
            match: match as RegExpMatchArray,
            el: editor.children[0] as Element,
            startText: '*italic*',
          };

          MdElements.italic.run(ctx);

          expect(editor.children[0].children[0]).toMatchObject({
            text: 'italic',
            italic: true,
          });
        });
      });

      describe('inlineCode', () => {
        it('should convert inline code markdown to code text', () => {
          const match = ['`code`', 'code'];
          const path = [0];
          const sel: Range = {
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 0 },
          };

          const ctx: CheckMdParams = {
            sel,
            editor,
            path,
            match: match as RegExpMatchArray,
            el: editor.children[0] as Element,
            startText: '`code`',
          };

          MdElements.inlineCode.run(ctx);

          expect(editor.children[0].children[0]).toMatchObject({
            text: 'code',
            code: true,
          });
        });
      });

      describe('boldAndItalic', () => {
        it('should convert bold and italic markdown to bold italic text', () => {
          const match = ['***bolditalic***', 'bolditalic'];
          const path = [0];
          const sel: Range = {
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 0 },
          };

          const ctx: CheckMdParams = {
            sel,
            editor,
            path,
            match: match as RegExpMatchArray,
            el: editor.children[0] as Element,
            startText: '***bolditalic***',
          };

          MdElements.boldAndItalic.run(ctx);

          expect(editor.children[0].children[0]).toMatchObject({
            text: 'bolditalic',
            bold: true,
            italic: true,
          });
        });
      });

      describe('strikethrough', () => {
        it('should convert strikethrough markdown to strikethrough text', () => {
          const match = ['~~strike~~', 'strike'];
          const path = [0];
          const sel: Range = {
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 0 },
          };

          const ctx: CheckMdParams = {
            sel,
            editor,
            path,
            match: match as RegExpMatchArray,
            el: editor.children[0] as Element,
            startText: '~~strike~~',
          };

          MdElements.strikethrough.run(ctx);

          expect(editor.children[0].children[0]).toMatchObject({
            text: 'strike',
            strikethrough: true,
          });
        });
      });
    });
  });

  describe('BlockMathNodes and TextMatchNodes', () => {
    it('should filter block nodes correctly', () => {
      const blockNodes = Object.entries(MdElements)
        .filter((c) => !c[1].matchKey)
        .map((c) => Object.assign(c[1], { type: c[0] }));

      expect(blockNodes).toContainEqual(
        expect.objectContaining({
          type: 'table',
          reg: expect.any(RegExp),
        }),
      );

      expect(blockNodes).toContainEqual(
        expect.objectContaining({
          type: 'code',
          reg: expect.any(RegExp),
        }),
      );
    });

    it('should filter text match nodes correctly', () => {
      const textMatchNodes = Object.entries(MdElements)
        .filter((c) => !!c[1].matchKey)
        .map((c) => Object.assign(c[1], { type: c[0] }));

      expect(textMatchNodes).toContainEqual(
        expect.objectContaining({
          type: 'head',
          matchKey: ' ',
          reg: expect.any(RegExp),
        }),
      );

      expect(textMatchNodes).toContainEqual(
        expect.objectContaining({
          type: 'link',
          matchKey: ')',
          reg: expect.any(RegExp),
        }),
      );
    });
  });
});
