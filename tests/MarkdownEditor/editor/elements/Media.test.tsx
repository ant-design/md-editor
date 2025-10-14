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
import * as utils from '../../../../src/MarkdownEditor/editor/utils';
import { MediaNode } from '../../../../src/MarkdownEditor/el';
import { TestSlateWrapper } from './TestSlateWrapper';

// Mock 依赖
vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(() => ({
    markdownEditorRef: {
      current: {
        setNodes: vi.fn(),
        removeNodes: vi.fn(),
        insertNodes: vi.fn(),
        // 添加其他必要的编辑器方法
      },
    },
    readonly: false,
  })),
}));

vi.mock('../../../../src/MarkdownEditor/hooks/editor', () => ({
  useSelStatus: vi.fn(() => [false, [0, 0]]),
}));

vi.mock('../../../../src/MarkdownEditor/editor/utils', () => ({
  useGetSetState: vi.fn(() => {
    const stateData = {
      height: 300,
      dragging: false,
      loadSuccess: true,
      url: 'https://example.com/image.jpg',
      selected: false,
      type: 'image',
    };
    return [
      () => stateData,
      vi.fn((updates) => Object.assign(stateData, updates)),
    ];
  }),
}));

vi.mock('../../../../src/MarkdownEditor/editor/utils/dom', () => ({
  getMediaType: vi.fn((url) => {
    if (url?.includes('video')) return 'video';
    if (url?.includes('audio')) return 'audio';
    if (url?.includes('attachment')) return 'attachment';
    return 'image';
  }),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/Image', () => ({
  ImageAndError: ({ src, alt, ...props }: any) => (
    <img data-testid="image-and-error" src={src} alt={alt} {...props} />
  ),
}));

vi.mock('../../../../src/components/ActionIconBox', () => ({
  ActionIconBox: ({ children, ...props }: any) => (
    <div data-testid="action-icon-box" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('../../../../src/components/ContributorAvatar', () => ({
  AvatarList: ({ children, ...props }: any) => (
    <div data-testid="avatar-list" {...props}>
      {children}
    </div>
  ),
}));

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

describe('Media', () => {
  const mockElement: MediaNode = {
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
    return render(
      <ConfigProvider>
        <TestSlateWrapper>{component}</TestSlateWrapper>
      </ConfigProvider>,
    );
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

      const mediaContainer = screen.getByTestId('media-container');
      expect(mediaContainer).toBeInTheDocument();
    });

    it('应该渲染图片元素', () => {
      renderWithProvider(
        <Media element={mockElement} attributes={mockAttributes}>
          {null}
        </Media>,
      );

      const resizeImage = screen.getByTestId('resize-image');
      expect(resizeImage).toBeInTheDocument();
      expect(resizeImage).toHaveAttribute(
        'src',
        'https://example.com/image.jpg',
      );
      expect(resizeImage).toHaveAttribute('alt', 'image');
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
      renderWithProvider(<ResizeImage {...mockResizeProps} />);

      const resizeImageContainer = screen.getByTestId('resize-image-container');
      const resizeImage = screen.getByTestId('resize-image');
      expect(resizeImageContainer).toBeInTheDocument();
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
        width: 400,
        height: 0,
      });
    });
  });

  describe('视频类型测试', () => {
    it('应该渲染视频元素', () => {
      const videoElement: MediaNode = {
        ...mockElement,
        url: 'https://example.com/video.mp4',
        controls: true,
        autoplay: false,
        loop: false,
        muted: false,
        poster: 'https://example.com/poster.jpg',
      };

      // 为这个测试设置特定的 mock 状态
      const mockedUseGetSetState = vi.mocked(utils.useGetSetState);
      const videoStateData = {
        height: 300,
        dragging: false,
        loadSuccess: true,
        url: 'https://example.com/video.mp4',
        selected: false,
        type: 'video',
      };
      mockedUseGetSetState.mockReturnValueOnce([
        () => videoStateData,
        vi.fn((updates) => Object.assign(videoStateData, updates)),
      ]);

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
      const audioElement: MediaNode = {
        ...mockElement,
        url: 'https://example.com/audio.mp3',
      };

      // 为这个测试设置特定的 mock 状态
      const mockedUseGetSetState = vi.mocked(utils.useGetSetState);
      const audioStateData = {
        height: 300,
        dragging: false,
        loadSuccess: true,
        url: 'https://example.com/audio.mp3',
        selected: false,
        type: 'audio',
      };
      mockedUseGetSetState.mockReturnValueOnce([
        () => audioStateData,
        vi.fn((updates) => Object.assign(audioStateData, updates)),
      ]);

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
      const elementWithEmptyUrl: MediaNode = {
        ...mockElement,
        url: '',
      };

      // 为这个测试设置特定的 mock 状态
      const mockedUseGetSetState = vi.mocked(utils.useGetSetState);
      const emptyUrlStateData = {
        height: 300,
        dragging: false,
        loadSuccess: true,
        url: '',
        selected: false,
        type: 'image',
      };
      mockedUseGetSetState.mockReturnValueOnce([
        () => emptyUrlStateData,
        vi.fn((updates) => Object.assign(emptyUrlStateData, updates)),
      ]);

      renderWithProvider(
        <Media element={elementWithEmptyUrl} attributes={mockAttributes}>
          {null}
        </Media>,
      );

      const resizeImage = screen.getByTestId('resize-image');
      expect(resizeImage).toHaveAttribute('src', '');
    });

    it('应该处理空的alt属性', () => {
      const elementWithEmptyAlt: MediaNode = {
        ...mockElement,
        alt: '',
      };

      renderWithProvider(
        <Media element={elementWithEmptyAlt} attributes={mockAttributes}>
          {null}
        </Media>,
      );

      const resizeImage = screen.getByTestId('resize-image');
      expect(resizeImage).toHaveAttribute('alt', 'image');
    });
  });
});
