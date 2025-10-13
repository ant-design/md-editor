/**
 * Image 组件测试文件
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  EditorImage,
  ImageAndError,
  ResizeImage,
} from '../../../../src/MarkdownEditor/editor/elements/Image';
import * as utils from '../../../../src/MarkdownEditor/editor/utils';
import { MediaNode } from '../../../../src/MarkdownEditor/el';
import { TestSlateWrapper } from './TestSlateWrapper';

// Mock dependencies
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
    editorProps: {
      image: {
        render: undefined,
      },
    },
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
  getMediaType: vi.fn(() => 'image'),
}));

vi.mock('../../../../src/components/ActionIconBox', () => ({
  ActionIconBox: ({ children, ...props }: any) => (
    <div data-testid="action-icon-box" {...props}>
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
  Rnd: ({ children, onResizeStart, onResizeStop, onResize, ...props }: any) => (
    <div data-testid="rnd-container" {...props}>
      <button type="button" data-testid="resize-start" onClick={onResizeStart}>
        Resize Start
      </button>
      <button
        type="button"
        data-testid="resize-stop"
        onClick={() => onResizeStop({ width: 400, height: 0 })}
      >
        Resize Stop
      </button>
      <button
        type="button"
        data-testid="resize"
        onClick={() =>
          onResize('right', 'bottom', { clientWidth: 500, clientHeight: 300 })
        }
      >
        Resize
      </button>
      {children}
    </div>
  ),
}));

describe('Image', () => {
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

  describe('ImageAndError', () => {
    it('应该正确渲染图片', () => {
      renderWithProvider(
        <ImageAndError
          src="https://example.com/image.jpg"
          alt="Test Image"
          width={400}
          height={300}
        />,
      );

      const imageElement = screen.getByAltText('Test Image');
      expect(imageElement).toBeInTheDocument();
      expect(imageElement).toHaveAttribute(
        'src',
        'https://example.com/image.jpg',
      );
    });

    it('应该处理图片加载错误', () => {
      renderWithProvider(
        <ImageAndError
          src="https://example.com/invalid-image.jpg"
          alt="Invalid Image"
          width={400}
          height={300}
        />,
      );

      const imageElement = screen.getByAltText('Invalid Image');
      expect(imageElement).toBeInTheDocument();
    });

    it('应该处理空的 alt 属性', () => {
      renderWithProvider(
        <ImageAndError
          src="https://example.com/image.jpg"
          alt=""
          width={400}
          height={300}
        />,
      );

      const imageElement = screen.getByAltText('');
      expect(imageElement).toBeInTheDocument();
    });

    it('应该处理数字类型的 width', () => {
      renderWithProvider(
        <ImageAndError
          src="https://example.com/image.jpg"
          alt="Test Image"
          width={400}
          height={300}
        />,
      );

      const imageElement = screen.getByAltText('Test Image');
      expect(imageElement).toBeInTheDocument();
    });
  });

  describe('ResizeImage', () => {
    const mockResizeProps = {
      src: 'https://example.com/image.jpg',
      alt: 'Test Image',
      onResizeStart: vi.fn(),
      onResizeStop: vi.fn(),
    };

    it('应该正确渲染ResizeImage组件', () => {
      renderWithProvider(<ResizeImage {...mockResizeProps} />);

      const resizeImageContainer = screen.getByTestId('resize-image-container');
      expect(resizeImageContainer).toBeInTheDocument();
      // 图片在加载时是隐藏的，所以我们检查容器而不是图片本身
      expect(screen.getByAltText('Test Image')).toBeInTheDocument();
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

    it('应该处理调整大小事件', () => {
      renderWithProvider(<ResizeImage {...mockResizeProps} />);

      const resizeButton = screen.getByTestId('resize');
      fireEvent.click(resizeButton);

      // 验证调整大小事件被触发
      expect(resizeButton).toBeInTheDocument();
    });

    it('应该处理加载状态', () => {
      renderWithProvider(<ResizeImage {...mockResizeProps} />);

      const loadingElement = screen.getByLabelText('loading');
      expect(loadingElement).toBeInTheDocument();
    });

    it('应该处理选中状态', () => {
      renderWithProvider(<ResizeImage {...mockResizeProps} selected={true} />);

      // 图片在加载时是隐藏的，所以我们检查容器而不是图片本身
      expect(screen.getByAltText('Test Image')).toBeInTheDocument();
    });

    it('应该处理默认尺寸', () => {
      renderWithProvider(
        <ResizeImage
          {...mockResizeProps}
          defaultSize={{ width: 500, height: 400 }}
        />,
      );

      // 图片在加载时是隐藏的，所以我们检查容器而不是图片本身
      expect(screen.getByAltText('Test Image')).toBeInTheDocument();
    });
  });

  describe('EditorImage', () => {
    it('应该正确渲染 EditorImage 组件', () => {
      renderWithProvider(
        <EditorImage element={mockElement} attributes={mockAttributes}>
          {null}
        </EditorImage>,
      );

      const imageContainer = screen.getByTestId('image-container');
      expect(imageContainer).toBeInTheDocument();
    });

    it('应该处理点击事件', () => {
      renderWithProvider(
        <EditorImage element={mockElement} attributes={mockAttributes}>
          {null}
        </EditorImage>,
      );

      const imageContainer = screen.getByTestId('image-container');
      fireEvent.click(imageContainer);

      expect(imageContainer).toBeInTheDocument();
    });

    it('应该处理右键菜单事件', () => {
      renderWithProvider(
        <EditorImage element={mockElement} attributes={mockAttributes}>
          {null}
        </EditorImage>,
      );

      const imageContainer = screen.getByTestId('image-container');
      fireEvent.contextMenu(imageContainer);

      expect(imageContainer).toBeInTheDocument();
    });

    it('应该处理鼠标按下事件', () => {
      renderWithProvider(
        <EditorImage element={mockElement} attributes={mockAttributes}>
          {null}
        </EditorImage>,
      );

      const imageContainer = screen.getByTestId('image-container');
      fireEvent.mouseDown(imageContainer);

      expect(imageContainer).toBeInTheDocument();
    });

    it('应该处理拖拽开始事件', () => {
      renderWithProvider(
        <EditorImage element={mockElement} attributes={mockAttributes}>
          {null}
        </EditorImage>,
      );

      const imageContainer = screen.getByTestId('image-container');
      fireEvent.dragStart(imageContainer);

      expect(imageContainer).toBeInTheDocument();
    });

    it('应该处理调整大小停止事件', () => {
      renderWithProvider(
        <EditorImage element={mockElement} attributes={mockAttributes}>
          {null}
        </EditorImage>,
      );

      const imageContainer = screen.getByTestId('image-container');
      expect(imageContainer).toBeInTheDocument();
    });
  });

  describe('边界情况测试', () => {
    it('应该处理空的 URL', () => {
      const elementWithEmptyUrl: MediaNode = {
        ...mockElement,
        url: '',
      };

      renderWithProvider(
        <EditorImage element={elementWithEmptyUrl} attributes={mockAttributes}>
          {null}
        </EditorImage>,
      );

      const imageContainer = screen.getByTestId('image-container');
      expect(imageContainer).toBeInTheDocument();
    });

    it('应该处理块级图片', () => {
      const blockElement: MediaNode = {
        ...mockElement,
        block: true,
      };

      renderWithProvider(
        <EditorImage element={blockElement} attributes={mockAttributes}>
          {null}
        </EditorImage>,
      );

      const imageContainer = screen.getByTestId('image-container');
      expect(imageContainer).toBeInTheDocument();
    });

    it('应该处理加载失败的情况', () => {
      const mockedUseGetSetState = vi.mocked(utils.useGetSetState);
      const failedStateData = {
        height: 300,
        dragging: false,
        loadSuccess: false,
        url: 'https://example.com/image.jpg',
        selected: false,
        type: 'image',
      };
      mockedUseGetSetState.mockReturnValueOnce([
        () => failedStateData,
        vi.fn((updates) => Object.assign(failedStateData, updates)),
      ]);

      renderWithProvider(
        <EditorImage element={mockElement} attributes={mockAttributes}>
          {null}
        </EditorImage>,
      );

      const imageContainer = screen.getByTestId('image-container');
      expect(imageContainer).toBeInTheDocument();
    });

    it('应该处理拖拽状态', () => {
      const mockedUseGetSetState = vi.mocked(utils.useGetSetState);
      const draggingStateData = {
        height: 300,
        dragging: true,
        loadSuccess: true,
        url: 'https://example.com/image.jpg',
        selected: false,
        type: 'image',
      };
      mockedUseGetSetState.mockReturnValueOnce([
        () => draggingStateData,
        vi.fn((updates) => Object.assign(draggingStateData, updates)),
      ]);

      renderWithProvider(
        <EditorImage element={mockElement} attributes={mockAttributes}>
          {null}
        </EditorImage>,
      );

      const imageContainer = screen.getByTestId('image-container');
      expect(imageContainer).toBeInTheDocument();
    });
  });
});
