import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import {
  convertRemoteImages,
  getRemoteMediaType,
} from '../../../src/MarkdownEditor/editor/utils/media';

// Mock dependencies
jest.mock('../../../src/MarkdownEditor/editor/utils/dom', () => ({
  getMediaType: jest.fn(),
}));

jest.mock('../../../src/MarkdownEditor/editor/slate-react', () => ({
  ReactEditor: {
    findPath: jest.fn(),
  },
}));

describe('getRemoteMediaType', () => {
  const {
    getMediaType,
  } = require('../../../src/MarkdownEditor/editor/utils/dom');

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return "other" for empty URL', async () => {
    const result = await getRemoteMediaType('');
    expect(result).toBe('other');
  });

  it('should return "other" for null URL', async () => {
    const result = await getRemoteMediaType(null as any);
    expect(result).toBe('other');
  });

  it('should return "other" for undefined URL', async () => {
    const result = await getRemoteMediaType(undefined as any);
    expect(result).toBe('other');
  });

  it('should return "other" for non-string URL', async () => {
    const result = await getRemoteMediaType(123 as any);
    expect(result).toBe('other');
  });

  it('should extract image type from data URL', async () => {
    const result = await getRemoteMediaType(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    );
    expect(result).toBe('png');
  });

  it('should return "other" for invalid data URL', async () => {
    const result = await getRemoteMediaType('data:text/plain;base64,SGVsbG8=');
    expect(result).toBe('other');
  });

  it('should return "other" for malformed data URL', async () => {
    const result = await getRemoteMediaType('data:image/;base64,');
    expect(result).toBe('other');
  });

  it('should return media type from getMediaType when available', async () => {
    getMediaType.mockReturnValue('image');

    const result = await getRemoteMediaType('https://example.com/image.jpg');

    expect(getMediaType).toHaveBeenCalledWith('https://example.com/image.jpg');
    expect(result).toBe('image');
  });

  it('should fetch content type when getMediaType returns "other"', async () => {
    getMediaType.mockReturnValue('other');

    const mockResponse = {
      ok: true,
      headers: {
        get: jest.fn().mockReturnValue('image/png'),
      },
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getRemoteMediaType('https://example.com/image.jpg');

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/image.jpg', {
      method: 'HEAD',
      signal: expect.any(AbortSignal),
    });
    expect(result).toBe('image');
  });

  it('should return null when fetch fails', async () => {
    getMediaType.mockReturnValue('other');

    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const result = await getRemoteMediaType('https://example.com/image.jpg');

    expect(result).toBeNull();
  });

  it('should return null when response is not ok', async () => {
    getMediaType.mockReturnValue('other');

    const mockResponse = {
      ok: false,
      headers: {
        get: jest.fn().mockReturnValue('image/png'),
      },
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getRemoteMediaType('https://example.com/image.jpg');

    expect(result).toBeNull();
  });

  it('should handle empty content type header', async () => {
    getMediaType.mockReturnValue('other');

    const mockResponse = {
      ok: true,
      headers: {
        get: jest.fn().mockReturnValue(''),
      },
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getRemoteMediaType('https://example.com/image.jpg');

    expect(result).toBe('');
  });

  it('should handle content type without slash', async () => {
    getMediaType.mockReturnValue('other');

    const mockResponse = {
      ok: true,
      headers: {
        get: jest.fn().mockReturnValue('image'),
      },
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getRemoteMediaType('https://example.com/image.jpg');

    expect(result).toBe('image');
  });

  it('should abort fetch after timeout', async () => {
    getMediaType.mockReturnValue('other');

    const mockAbortController = {
      signal: {},
      abort: jest.fn(),
    };

    jest
      .spyOn(global, 'AbortController')
      .mockImplementation(() => mockAbortController as any);
    jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
      fn();
      return 1 as any;
    });

    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    getRemoteMediaType('https://example.com/image.jpg');

    expect(mockAbortController.abort).toHaveBeenCalled();
  });
});

describe('convertRemoteImages', () => {
  const {
    ReactEditor,
  } = require('../../../src/MarkdownEditor/editor/slate-react');
  const { Transforms } = require('slate');

  beforeEach(() => {
    jest.clearAllMocks();
    ReactEditor.findPath.mockReturnValue([0, 0]);
    Transforms.setNodes = jest.fn();
  });

  it('should convert HTTP images with valid extensions', async () => {
    const editor = withReact(createEditor());
    const store = {
      editor: {
        children: [
          {
            type: 'media',
            url: 'https://example.com/image.jpg',
          },
        ],
      },
    };

    await convertRemoteImages(editor, store as any);

    expect(Transforms.setNodes).toHaveBeenCalledWith(
      store.editor,
      { url: 'https://example.com/image.jpg' },
      { at: [0, 0] },
    );
  });

  it('should convert data URL images', async () => {
    const editor = withReact(createEditor());
    const store = {
      editor: {
        children: [
          {
            type: 'media',
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          },
        ],
      },
    };

    await convertRemoteImages(editor, store as any);

    expect(Transforms.setNodes).toHaveBeenCalledWith(
      store.editor,
      {
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      },
      { at: [0, 0] },
    );
  });

  it('should handle nested media nodes', async () => {
    const editor = withReact(createEditor());
    const store = {
      editor: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'media',
                url: 'https://example.com/image.png',
              },
            ],
          },
        ],
      },
    };

    await convertRemoteImages(editor, store as any);

    expect(Transforms.setNodes).toHaveBeenCalledWith(
      store.editor,
      { url: 'https://example.com/image.png' },
      { at: [0, 0] },
    );
  });

  it('should handle multiple media nodes', async () => {
    const editor = withReact(createEditor());
    const store = {
      editor: {
        children: [
          {
            type: 'media',
            url: 'https://example.com/image1.jpg',
          },
          {
            type: 'media',
            url: 'https://example.com/image2.png',
          },
        ],
      },
    };

    await convertRemoteImages(editor, store as any);

    expect(Transforms.setNodes).toHaveBeenCalledTimes(2);
  });

  it('should skip non-media nodes', async () => {
    const editor = withReact(createEditor());
    const store = {
      editor: {
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'Hello' }],
          },
        ],
      },
    };

    await convertRemoteImages(editor, store as any);

    expect(Transforms.setNodes).not.toHaveBeenCalled();
  });

  it('should skip media nodes without URL', async () => {
    const editor = withReact(createEditor());
    const store = {
      editor: {
        children: [
          {
            type: 'media',
            url: undefined,
          },
        ],
      },
    };

    await convertRemoteImages(editor, store as any);

    expect(Transforms.setNodes).not.toHaveBeenCalled();
  });

  it('should skip media nodes with non-HTTP URLs', async () => {
    const editor = withReact(createEditor());
    const store = {
      editor: {
        children: [
          {
            type: 'media',
            url: 'ftp://example.com/image.jpg',
          },
        ],
      },
    };

    await convertRemoteImages(editor, store as any);

    expect(Transforms.setNodes).not.toHaveBeenCalled();
  });

  it('should skip media nodes with invalid data URLs', async () => {
    const editor = withReact(createEditor());
    const store = {
      editor: {
        children: [
          {
            type: 'media',
            url: 'data:text/plain;base64,SGVsbG8=',
          },
        ],
      },
    };

    await convertRemoteImages(editor, store as any);

    expect(Transforms.setNodes).not.toHaveBeenCalled();
  });

  it('should handle errors during setNodes', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const editor = withReact(createEditor());
    const store = {
      editor: {
        children: [
          {
            type: 'media',
            url: 'https://example.com/image.jpg',
          },
        ],
      },
    };

    Transforms.setNodes.mockImplementation(() => {
      throw new Error('Test error');
    });

    await convertRemoteImages(editor, store as any);

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should handle empty schema', async () => {
    const editor = withReact(createEditor());
    const store = {
      editor: {
        children: [],
      },
    };

    await convertRemoteImages(editor, store as any);

    expect(Transforms.setNodes).not.toHaveBeenCalled();
  });

  it('should handle null schema', async () => {
    const editor = withReact(createEditor());
    const store = {
      editor: {
        children: null,
      },
    };

    await convertRemoteImages(editor, store as any);

    expect(Transforms.setNodes).not.toHaveBeenCalled();
  });

  it('should handle undefined schema', async () => {
    const editor = withReact(createEditor());
    const store = {
      editor: {
        children: undefined,
      },
    };

    await convertRemoteImages(editor, store as any);

    expect(Transforms.setNodes).not.toHaveBeenCalled();
  });

  it('should handle complex nested structure', async () => {
    const editor = withReact(createEditor());
    const store = {
      editor: {
        children: [
          {
            type: 'paragraph',
            children: [
              { text: 'Before' },
              {
                type: 'media',
                url: 'https://example.com/image.jpg',
              },
              { text: 'After' },
            ],
          },
          {
            type: 'media',
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          },
        ],
      },
    };

    await convertRemoteImages(editor, store as any);

    expect(Transforms.setNodes).toHaveBeenCalledTimes(2);
  });
});
