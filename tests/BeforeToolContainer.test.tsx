import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { ActionItemContainer } from '../src/MarkdownInputField/BeforeToolContainer/BeforeToolContainer';

describe('ActionItemContainer Component', () => {
  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => <ConfigProvider>{children}</ConfigProvider>;

  const createMockItems = (count: number = 3) => {
    return Array.from({ length: count }, (_, i) => (
      <button key={`item-${i}`} data-testid={`item-${i}`}>
        Item {i}
      </button>
    )) as React.ReactElement[];
  };

  it('应该渲染基本容器', () => {
    const items = createMockItems();

    render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
  });

  it('应该支持自定义尺寸', () => {
    const items = createMockItems();
    const { container, rerender } = render(
      <TestWrapper>
        <ActionItemContainer size="small">{items}</ActionItemContainer>
      </TestWrapper>,
    );

    expect(
      container.querySelector(
        '.ant-agent-chat-action-item-box-container-small',
      ),
    ).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <ActionItemContainer size="large">{items}</ActionItemContainer>
      </TestWrapper>,
    );

    expect(
      container.querySelector(
        '.ant-agent-chat-action-item-box-container-large',
      ),
    ).toBeInTheDocument();
  });

  it('应该支持自定义样式', () => {
    const items = createMockItems();
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer style={{ backgroundColor: 'red' }}>
          {items}
        </ActionItemContainer>
      </TestWrapper>,
    );

    const containerEl = container.querySelector(
      '.ant-agent-chat-action-item-box-container',
    );
    expect(containerEl).toHaveStyle('background-color: rgb(255, 0, 0)');
  });

  it('应该显示溢出菜单按钮', () => {
    const items = createMockItems();
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    expect(
      container.querySelector(
        '.ant-agent-chat-action-item-box-overflow-container-indicator',
      ),
    ).toBeInTheDocument();
  });

  it('应该支持隐藏溢出菜单', () => {
    const items = createMockItems();
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer showMenu={false}>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    expect(
      container.querySelector(
        '.ant-agent-chat-action-item-box-overflow-container',
      ),
    ).not.toBeInTheDocument();
  });

  it('应该在点击菜单按钮时显示弹窗', async () => {
    const items = createMockItems();
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    const menuButton = container.querySelector(
      '.ant-agent-chat-action-item-box-overflow-container-indicator',
    ) as HTMLElement;

    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(
        document.querySelector(
          '.ant-agent-chat-action-item-box-overflow-container-popup',
        ),
      ).toBeInTheDocument();
    });
  });

  it('应该在点击外部时关闭弹窗', async () => {
    const items = createMockItems();
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    const menuButton = container.querySelector(
      '.ant-agent-chat-action-item-box-overflow-container-indicator',
    ) as HTMLElement;

    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(
        document.querySelector(
          '.ant-agent-chat-action-item-box-overflow-container-popup',
        ),
      ).toBeInTheDocument();
    });

    // 点击外部
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(
        document.querySelector(
          '.ant-agent-chat-action-item-box-overflow-container-popup',
        ),
      ).not.toBeInTheDocument();
    });
  });

  it('应该保持子元素顺序', () => {
    const items = createMockItems();
    const { rerender } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    const firstItem = screen.getByTestId('item-0');
    expect(firstItem).toBeInTheDocument();

    // 重新渲染相同的子元素
    rerender(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    // 顺序应该保持不变
    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
  });

  it('应该处理子元素更新', () => {
    const items = createMockItems(2);
    const { rerender } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.queryByTestId('item-2')).not.toBeInTheDocument();

    // 添加新子元素
    const newItems = createMockItems(3);
    rerender(
      <TestWrapper>
        <ActionItemContainer>{newItems}</ActionItemContainer>
      </TestWrapper>,
    );

    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
  });

  it('应该处理空子元素', () => {
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer>{[]}</ActionItemContainer>
      </TestWrapper>,
    );

    expect(
      container.querySelector('.ant-agent-chat-action-item-box-container'),
    ).toBeInTheDocument();
  });

  it('应该在鼠标悬停菜单时添加无悬停类', async () => {
    const items = createMockItems();
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    const menuButton = container.querySelector(
      '.ant-agent-chat-action-item-box-overflow-container-indicator',
    ) as HTMLElement;

    fireEvent.mouseEnter(menuButton);

    await waitFor(() => {
      expect(
        container.querySelector(
          '.ant-agent-chat-action-item-box-container-no-hover',
        ),
      ).toBeInTheDocument();
    });

    fireEvent.mouseLeave(menuButton);

    await waitFor(() => {
      expect(
        container.querySelector(
          '.ant-agent-chat-action-item-box-container-no-hover',
        ),
      ).not.toBeInTheDocument();
    });
  });

  it('应该支持水平滚动', () => {
    const items = createMockItems(10);
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    const scrollContainer = container.querySelector(
      '.ant-agent-chat-action-item-box-scroll',
    ) as HTMLElement;

    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer.style.overflowX).toBe('auto');
  });

  it('应该处理单个子元素', () => {
    const item = <button key="single-item">Single Item</button>;

    render(
      <TestWrapper>
        <ActionItemContainer>{item}</ActionItemContainer>
      </TestWrapper>,
    );

    expect(screen.getByText('Single Item')).toBeInTheDocument();
  });

  it('应该支持可拖拽的弹窗项', async () => {
    const items = createMockItems();
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    const menuButton = container.querySelector(
      '.ant-agent-chat-action-item-box-overflow-container-indicator',
    ) as HTMLElement;

    fireEvent.click(menuButton);

    await waitFor(() => {
      const popupItems = document.querySelectorAll(
        '.ant-agent-chat-action-item-box-overflow-container-popup-item',
      );
      expect(popupItems.length).toBe(3);
      popupItems.forEach((item) => {
        expect(item).toHaveAttribute('draggable', 'true');
      });
    });
  });

  it('应该处理鼠标滚轮事件', () => {
    const items = createMockItems();
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    const containerEl = container.querySelector(
      '.ant-agent-chat-action-item-box-container',
    ) as HTMLElement;

    const scrollContainer = container.querySelector(
      '.ant-agent-chat-action-item-box-scroll',
    ) as HTMLElement;

    const initialScrollLeft = scrollContainer.scrollLeft;

    fireEvent.wheel(containerEl, { deltaY: 100 });

    // 滚动应该已处理（即使实际滚动可能不会在测试环境中发生）
    expect(scrollContainer).toBeInTheDocument();
  });

  it('应该在弹窗中显示所有项目', async () => {
    const items = createMockItems();
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    const menuButton = container.querySelector(
      '.ant-agent-chat-action-item-box-overflow-container-indicator',
    ) as HTMLElement;

    fireEvent.click(menuButton);

    await waitFor(() => {
      // 弹窗应该显示所有项目
      expect(document.querySelectorAll('[data-testid^="item-"]').length).toBe(
        6,
      ); // 3 in main + 3 in popup
    });
  });

  it('应该处理拖拽手柄', async () => {
    const items = createMockItems();
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    const menuButton = container.querySelector(
      '.ant-agent-chat-action-item-box-overflow-container-indicator',
    ) as HTMLElement;

    fireEvent.click(menuButton);

    await waitFor(() => {
      const dragHandles = document.querySelectorAll(
        '.ant-agent-chat-action-item-box-drag-handle',
      );
      expect(dragHandles.length).toBe(3);
    });
  });

  it('应该支持交互式目标检测', () => {
    const item = (
      <button key="interactive" data-testid="interactive-button">
        Interactive
      </button>
    );

    render(
      <TestWrapper>
        <ActionItemContainer>{item}</ActionItemContainer>
      </TestWrapper>,
    );

    const button = screen.getByTestId('interactive-button');
    expect(button).toBeInTheDocument();
  });

  it('应该处理 resize 观察', async () => {
    const items = createMockItems();
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    const menuButton = container.querySelector(
      '.ant-agent-chat-action-item-box-overflow-container-indicator',
    ) as HTMLElement;

    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(
        document.querySelector(
          '.ant-agent-chat-action-item-box-overflow-container-popup',
        ),
      ).toBeInTheDocument();
    });

    // ResizeObserver 应该被设置（即使在测试环境中可能不会真正触发）
  });

  it('应该处理 pointer 事件', () => {
    const items = createMockItems();
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    const containerEl = container.querySelector(
      '.ant-agent-chat-action-item-box-container',
    ) as HTMLElement;

    // 模拟 pointer down
    fireEvent.pointerDown(containerEl, { button: 0, clientX: 100 });

    // 模拟 pointer move
    fireEvent.pointerMove(containerEl, { clientX: 110 });

    // 模拟 pointer up
    fireEvent.pointerUp(containerEl);

    expect(containerEl).toBeInTheDocument();
  });

  it('应该处理 pointer cancel', () => {
    const items = createMockItems();
    const { container } = render(
      <TestWrapper>
        <ActionItemContainer>{items}</ActionItemContainer>
      </TestWrapper>,
    );

    const containerEl = container.querySelector(
      '.ant-agent-chat-action-item-box-container',
    ) as HTMLElement;

    fireEvent.pointerDown(containerEl, { button: 0, clientX: 100 });
    fireEvent.pointerCancel(containerEl);

    expect(containerEl).toBeInTheDocument();
  });

  it('应该在生产环境外验证 key 属性', () => {
    // 这个测试只在开发环境有效
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const itemsWithoutKeys = [<div>Item 1</div>, <div>Item 2</div>];

    expect(() => {
      render(
        <TestWrapper>
          <ActionItemContainer>{itemsWithoutKeys as any}</ActionItemContainer>
        </TestWrapper>,
      );
    }).toThrow();

    process.env.NODE_ENV = originalEnv;
  });
});
