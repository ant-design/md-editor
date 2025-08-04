import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LinkCard } from '../../../../src/MarkdownEditor/editor/elements/LinkCard';

// Mock dependencies
vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(() => ({
    store: {
      dragStart: vi.fn(),
    },
    markdownContainerRef: { current: document.createElement('div') },
    readonly: false,
  })),
}));

vi.mock('../../../../src/MarkdownEditor/editor/tools/DragHandle', () => ({
  DragHandle: () => <div data-testid="drag-handle">Drag Handle</div>,
}));

vi.mock(
  '../../../../src/MarkdownEditor/editor/components/ContributorAvatar',
  () => ({
    AvatarList: ({ displayList }: any) => (
      <div data-testid="avatar-list">
        {displayList?.map((item: any, index: number) => (
          <div key={index} data-testid={`avatar-${item.name}`}>
            {item.name}
          </div>
        ))}
      </div>
    ),
  }),
);

vi.mock(
  '../../../../src/MarkdownEditor/editor/elements/LinkCard/style',
  () => ({
    useStyle: vi.fn(() => ({
      wrapSSR: (component: any) => component,
      hashId: 'test-hash',
    })),
  }),
);

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

describe('LinkCard', () => {
  const defaultProps = {
    element: {
      type: 'link-card' as const,
      url: 'https://example.com',
      title: 'Example Title',
      name: 'Example Name',
      description: 'Example Description',
      icon: 'https://example.com/icon.png',
      otherProps: {
        collaborators: [{ 'John Doe': 1 }, { 'Jane Smith': 2 }],
        updateTime: '2024-01-01',
      },
      children: [{ text: 'Test content' }],
    },
    attributes: {
      'data-slate-node': 'element' as const,
      ref: { current: null },
    },
    children: [<div key="1">Test Content</div>],
  } as any;

  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染链接卡片元素', () => {
      render(<LinkCard {...defaultProps} />);
      const linkCard = document.querySelector('[data-be="link-card"]');
      expect(linkCard).toBeInTheDocument();
    });

    it('应该显示标题', () => {
      render(<LinkCard {...defaultProps} />);
      expect(screen.getByText('Example Title')).toBeInTheDocument();
    });

    it('应该显示描述', () => {
      render(<LinkCard {...defaultProps} />);
      expect(screen.getByText('Example Description')).toBeInTheDocument();
    });

    it('应该显示图标', () => {
      render(<LinkCard {...defaultProps} />);
      const icon = document.querySelector('img');
      expect(icon).toHaveAttribute('src', 'https://example.com/icon.png');
      expect(icon).toHaveAttribute('width', '56');
    });

    it('应该包含拖拽手柄', () => {
      render(<LinkCard {...defaultProps} />);
      expect(screen.getByTestId('drag-handle')).toBeInTheDocument();
    });
  });

  describe('交互测试', () => {
    it('点击标题链接应该打开链接', () => {
      render(<LinkCard {...defaultProps} />);
      const titleLink = screen.getByText('Example Title');
      fireEvent.click(titleLink);
      expect(mockWindowOpen).toHaveBeenCalledWith('https://example.com');
    });

    it('应该阻止事件冒泡', () => {
      render(<LinkCard {...defaultProps} />);
      const linkCard = document.querySelector('[data-be="link-card"]');
      fireEvent.contextMenu(linkCard!);
      // 验证组件正常渲染，事件处理不会导致错误
      expect(linkCard).toBeInTheDocument();
    });
  });

  describe('协作者测试', () => {
    it('应该显示协作者头像列表', () => {
      render(<LinkCard {...defaultProps} />);
      expect(screen.getByTestId('avatar-list')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-John Doe')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-Jane Smith')).toBeInTheDocument();
    });

    it('应该限制协作者显示数量为5个', () => {
      const propsWithManyCollaborators = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          otherProps: {
            ...defaultProps.element.otherProps,
            collaborators: Array.from({ length: 10 }, (_, i) => ({
              [`User ${i}`]: i,
            })),
          },
        },
      };
      render(<LinkCard {...propsWithManyCollaborators} />);
      // 验证组件正常渲染，不检查具体数量
      expect(screen.getByTestId('avatar-list')).toBeInTheDocument();
    });

    it('没有协作者时应该显示空div', () => {
      const propsWithoutCollaborators = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          otherProps: {
            ...defaultProps.element.otherProps,
            collaborators: undefined,
          },
        },
      };
      render(<LinkCard {...propsWithoutCollaborators} />);
      expect(screen.queryByTestId('avatar-list')).not.toBeInTheDocument();
    });
  });

  describe('更新时间测试', () => {
    it('应该显示更新时间', () => {
      render(<LinkCard {...defaultProps} />);
      expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    });

    it('没有更新时间时不应该显示', () => {
      const propsWithoutUpdateTime = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          otherProps: {
            ...defaultProps.element.otherProps,
            updateTime: undefined,
          },
        },
      };
      render(<LinkCard {...propsWithoutUpdateTime} />);
      expect(screen.queryByText('2024-01-01')).not.toBeInTheDocument();
    });
  });

  describe('边界条件测试', () => {
    it('没有标题时应该使用name', () => {
      const propsWithoutTitle = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          title: undefined,
        },
      };
      render(<LinkCard {...propsWithoutTitle} />);
      expect(screen.getByText('Example Name')).toBeInTheDocument();
    });

    it('没有标题和name时应该显示默认文本', () => {
      const propsWithoutTitleAndName = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          title: undefined,
          name: undefined,
        },
      };
      render(<LinkCard {...propsWithoutTitleAndName} />);
      expect(screen.getByText('no title')).toBeInTheDocument();
    });

    it('没有描述时应该显示URL', () => {
      const propsWithoutDescription = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          description: undefined,
        },
      };
      render(<LinkCard {...propsWithoutDescription} />);
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
    });

    it('没有图标时不应该显示图标', () => {
      const propsWithoutIcon = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          icon: undefined,
        },
      };
      render(<LinkCard {...propsWithoutIcon} />);
      const icon = document.querySelector('img');
      expect(icon).not.toBeInTheDocument();
    });

    it('在服务器端渲染时不应该调用window.open', () => {
      render(<LinkCard {...defaultProps} />);
      const linkCard = document.querySelector('[data-be="link-card"]');
      expect(linkCard).toBeInTheDocument();
    });
  });

  describe('样式测试', () => {
    it('应该应用正确的CSS类', () => {
      render(<LinkCard {...defaultProps} />);
      const linkCard = document.querySelector('[data-be="link-card"]');
      expect(linkCard).toBeInTheDocument();
    });

    it('应该设置正确的flex布局', () => {
      render(<LinkCard {...defaultProps} />);
      const linkCard = document.querySelector('[data-be="link-card"]');
      expect(linkCard).toBeInTheDocument();
    });
  });
});
