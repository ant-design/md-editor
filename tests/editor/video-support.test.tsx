import { describe, expect, it } from 'vitest';
import { parserMarkdownToSlateNode } from '../../src/MarkdownEditor/editor/parser/parserMarkdownToSlateNode';

describe('Video Support', () => {
  it('should parse video HTML tag with self-closing syntax', () => {
    const markdown = '<video src="test.mp4" controls />';

    console.log('Input markdown:', markdown);
    console.log('Input length:', markdown.length);
    console.log('Input bytes:', Buffer.from(markdown).toString('hex'));

    const result = parserMarkdownToSlateNode(markdown);

    console.log('Parsed result:', JSON.stringify(result.schema, null, 2));

    expect(result.schema).toHaveLength(1);
    expect(result.schema[0].type).toBe('card');
    expect(result.schema[0].children[1].type).toBe('media');
    expect(result.schema[0].children[1].mediaType).toBe('video');
    expect(result.schema[0].children[1].url).toBe('test.mp4');
    expect(result.schema[0].children[1].controls).toBe(true);
  });

  it('should parse video HTML tag correctly', () => {
    const markdown =
      '<video src="test.mp4" controls autoplay loop muted poster="poster.jpg" width="640" height="360"></video>';

    console.log('Input markdown:', markdown);
    console.log('Input length:', markdown.length);
    console.log('Input bytes:', Buffer.from(markdown).toString('hex'));

    const result = parserMarkdownToSlateNode(markdown);

    console.log('Parsed result:', JSON.stringify(result.schema, null, 2));

    expect(result.schema).toHaveLength(1);
    expect(result.schema[0].type).toBe('card');
    expect(result.schema[0].children[1].type).toBe('media');
    expect(result.schema[0].children[1].mediaType).toBe('video');
    expect(result.schema[0].children[1].url).toBe('test.mp4');
    expect(result.schema[0].children[1].controls).toBe(true);
    expect(result.schema[0].children[1].autoplay).toBe(true);
    expect(result.schema[0].children[1].loop).toBe(true);
    expect(result.schema[0].children[1].muted).toBe(true);
    expect(result.schema[0].children[1].poster).toBe('poster.jpg');
    expect(result.schema[0].children[1].width).toBe(640);
    expect(result.schema[0].children[1].height).toBe(360);
  });

  it('should parse video HTML tag without optional attributes', () => {
    const markdown = '<video src="test.mp4"></video>';

    console.log('Input markdown:', markdown);
    console.log('Input length:', markdown.length);
    console.log('Input bytes:', Buffer.from(markdown).toString('hex'));

    const result = parserMarkdownToSlateNode(markdown);

    console.log('Parsed result:', JSON.stringify(result.schema, null, 2));

    expect(result.schema).toHaveLength(1);
    expect(result.schema[0].type).toBe('card');
    expect(result.schema[0].children[1].type).toBe('media');
    expect(result.schema[0].children[1].mediaType).toBe('video');
    expect(result.schema[0].children[1].url).toBe('test.mp4');
    expect(result.schema[0].children[1].controls).toBe(false);
    expect(result.schema[0].children[1].autoplay).toBe(false);
    expect(result.schema[0].children[1].loop).toBe(false);
    expect(result.schema[0].children[1].muted).toBe(false);
  });

  it('should parse iframe HTML tag correctly', () => {
    const markdown =
      '<iframe src="https://www.youtube.com/embed/test" width="640" height="360"></iframe>';

    const result = parserMarkdownToSlateNode(markdown);

    expect(result.schema).toHaveLength(1);
    expect(result.schema[0].type).toBe('card');
    expect(result.schema[0].children[1].type).toBe('media');
    expect(result.schema[0].children[1].mediaType).toBe('iframe');
    expect(result.schema[0].children[1].url).toBe(
      'https://www.youtube.com/embed/test',
    );
    expect(result.schema[0].children[1].width).toBe(640);
    expect(result.schema[0].children[1].height).toBe(360);
  });
});
