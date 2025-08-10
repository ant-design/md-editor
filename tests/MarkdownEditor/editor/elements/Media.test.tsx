/**
 * Media 组件测试文件
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Media,
  ResizeImage,
} from '../../../../src/MarkdownEditor/editor/elements/Media';

// Mock 依赖
vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(() => ({
    markdownEditorRef: {
      current: {
        // Mock Transforms.setNodes
      },
    },
    readonly: false,
  })),
}));

vi.mock('../../../../src/MarkdownEditor/hooks/editor', () => ({
  useSelStatus: vi.fn(() => [false, [0, 0]]),
}));

vi.mock('../../../../src/MarkdownEditor/editor/utils', () => ({
  useGetSetState: vi.fn(() => [
    {
      height: 300,
      dragging: false,
      loadSuccess: true,
      url: 'https://example.com/image.jpg',
      selected: false,
      type: 'image',
    },
    vi.fn(),
  ]),
}));

vi.mock('../../../../src/MarkdownEditor/editor/utils/dom', () => ({
  getMediaType: vi.fn(() => 'image'),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/Image', () => ({
  ImageAndError: ({ src, alt, ...props }: any) => (
    <img data-testid="image-and-error" src={src} alt={alt} {...props} />
  ),
}));

vi.mock(
  '../../../../src/MarkdownEditor/editor/components/ActionIconBox',
  () => ({
    ActionIconBox: ({ children, ...props }: any) => (
      <div data-testid="action-icon-box" {...props}>
        {children}
      </div>
    ),
  }),
);

vi.mock(
  '../../../../src/MarkdownEditor/editor/components/ContributorAvatar',
  () => ({
    AvatarList: ({ children, ...props }: any) => (
      <div data-testid="avatar-list" {...props}>
        {children}
      </div>
    ),
  }),
);

vi.mock('@ant-design/pro-components', () => ({
  useDebounceFn: vi.fn((fn) => ({
    run: fn,
    cancel: vi.fn(),
  })),
}));

// Mock react-rnd
vi.mock('react-rnd', () => ({
  Rnd: ({ children, onResizeStart, onResizeStop, ...props }: any) => (
    <div data-testid="rnd-container" {...props}>
      <button type="button" data-testid="resize-start" onClick={onResizeStart}>
        Resize Start
      </button>
      <button
        type="button"
        data-testid="resize-stop"
        onClick={() => onResizeStop({ width: 500, height: 300 })}
      >
        Resize Stop
      </button>
      {children}
    </div>
  ),
}));

// Mock slate Transforms
vi.mock('slate', () => ({
  Transforms: {
    setNodes: vi.fn(),
    removeNodes: vi.fn(),
  },
}));

describe('Media', () => {
  const mockElement = {
    type: 'media',
    url: 'https://example.com/image.jpg',
    alt: 'Test Image',
    width: 400,
    height: 300,
    children: [{ text: '' }],
  };

  const mockAttributes = {
    'data-slate-node': 'element' as const,
    ref: vi.fn(),
  };

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<ConfigProvider>{component}</ConfigProvider>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染Media组件', () => {
      renderWithProvider(
        <Media element={mockElement} attributes={mockAttributes}>
          {null}
        </Media>,
      );

      const rndContainer = screen.getByTestId('rnd-container');
      expect(rndContainer).toBeInTheDocument();
    });

    it('应该渲染图片元素', () => {
      renderWithProvider(
        <Media element={mockElement} attributes={mockAttributes}>
          {null}
        </Media>,
      );

      const imageElement = screen.getByTestId('image-element');
      expect(imageElement).toBeInTheDocument();
      expect(imageElement).toHaveAttribute(
        'src',
        'https://example.com/image.jpg',
      );
      expect(imageElement).toHaveAttribute('alt', 'Test Image');
    });
  });

  describe('ResizeImage组件测试', () => {
    const mockResizeProps = {
      src: 'https://example.com/image.jpg',
      alt: 'Test Image',
      onResizeStart: vi.fn(),
      onResizeStop: vi.fn(),
    };

    it('应该正确渲染ResizeImage组件', () => {
      renderWithProvider(<MockResizeImage {...mockResizeProps} />);

      const rndContainer = screen.getByTestId('rnd-container');
      const resizeImage = screen.getByTestId('resize-image');
      expect(rndContainer).toBeInTheDocument();
      expect(resizeImage).toBeInTheDocument();
    });

    it('应该处理调整大小开始事件', () => {
      renderWithProvider(<ResizeImage {...mockResizeProps} />);

      const resizeStartButton = screen.getByTestId('resize-start');
      fireEvent.click(resizeStartButton);

      expect(mockResizeProps.onResizeStart).toHaveBeenCalled();
    });

    it('应该处理调整大小停止事件', () => {
      renderWithProvider(<ResizeImage {...mockResizeProps} />);

      const resizeStopButton = screen.getByTestId('resize-stop');
      fireEvent.click(resizeStopButton);

      expect(mockResizeProps.onResizeStop).toHaveBeenCalledWith({
        width: 500,
        height: 300,
      });
    });
  });

  describe('视频类型测试', () => {
    it('应该渲染视频元素', () => {
      const videoElement = {
        ...mockElement,
        url: 'https://example.com/video.mp4',
        controls: true,
        autoplay: false,
        loop: false,
        muted: false,
        poster: 'https://example.com/poster.jpg',
      };

      renderWithProvider(
        <Media element={videoElement} attributes={mockAttributes}>
          {null}
        </Media>,
      );

      const videoElement_ = screen.getByTestId('video-element');
      expect(videoElement_).toBeInTheDocument();
      expect(videoElement_).toHaveAttribute('controls');
      expect(videoElement_).toHaveAttribute(
        'src',
        'https://example.com/video.mp4',
      );
    });
  });

  describe('音频类型测试', () => {
    it('应该渲染音频元素', () => {
      const audioElement = {
        ...mockElement,
        url: 'https://example.com/audio.mp3',
      };

      renderWithProvider(
        <Media element={audioElement} attributes={mockAttributes}>
          {null}
        </Media>,
      );

      const audioElement_ = screen.getByTestId('audio-element');
      expect(audioElement_).toBeInTheDocument();
      expect(audioElement_).toHaveAttribute('controls');
      expect(audioElement_).toHaveAttribute(
        'src',
        'https://example.com/audio.mp3',
      );
    });
  });

  describe('边界情况测试', () => {
    it('应该处理空的URL', () => {
      const elementWithEmptyUrl = {
        ...mockElement,
        url: '',
      };

      renderWithProvider(
        <Media element={elementWithEmptyUrl} attributes={mockAttributes}>
          {null}
        </Media>,
      );

      const imageElement = screen.getByTestId('image-element');
      expect(imageElement).toHaveAttribute('src', '');
    });

    it('应该处理空的alt属性', () => {
      const elementWithEmptyAlt = {
        ...mockElement,
        alt: '',
      };

      renderWithProvider(
        <Media element={elementWithEmptyAlt} attributes={mockAttributes}>
          {null}
        </Media>,
      );

      const imageElement = screen.getByTestId('image-element');
      expect(imageElement).toHaveAttribute('alt', '');
    });
  });
});
