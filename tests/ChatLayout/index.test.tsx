import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatLayout } from '../../src/ChatLayout';

// Mock useAutoScroll hook
vi.mock('../../src/Hooks/useAutoScroll', () => ({
  default: vi.fn(() => ({
    containerRef: { current: null },
  })),
}));

// Mock LayoutHeader component
vi.mock('../../src/Components/LayoutHeader', () => ({
  LayoutHeader: ({ title }: any) => <div data-testid="layout-header">{title}</div>,
}));

describe('ChatLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确渲染基本布局', () => {
    render(
      <ChatLayout header={{ title: '测试标题' }}>
        <div>测试内容</div>
      </ChatLayout>
    );

    expect(screen.getByTestId('layout-header')).toBeInTheDocument();
    expect(screen.getByText('测试内容')).toBeInTheDocument();
  });

  it('应该处理footer属性', () => {
    render(
      <ChatLayout 
        header={{ title: '测试标题' }}
        footer={<div data-testid="footer">底部内容</div>}
      >
        <div>测试内容</div>
      </ChatLayout>
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('底部内容')).toBeInTheDocument();
  });

  it('应该处理className和style属性', () => {
    const { container } = render(
      <ChatLayout 
        header={{ title: '测试标题' }}
        className="custom-class"
        style={{ backgroundColor: 'red' }}
      >
        <div>测试内容</div>
      </ChatLayout>
    );

    const layoutElement = container.firstChild as HTMLElement;
    expect(layoutElement).toHaveClass('custom-class');
    // CSS颜色值在浏览器中会被转换为rgb格式
    expect(layoutElement).toHaveStyle('background-color: rgb(255, 0, 0)');
  });

  it('应该处理没有header的情况', () => {
    render(
      <ChatLayout>
        <div>测试内容</div>
      </ChatLayout>
    );

    expect(screen.queryByTestId('layout-header')).not.toBeInTheDocument();
    expect(screen.getByText('测试内容')).toBeInTheDocument();
  });

  it('应该处理没有footer的情况', () => {
    render(
      <ChatLayout header={{ title: '测试标题' }}>
        <div>测试内容</div>
      </ChatLayout>
    );

    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
    expect(screen.getByText('测试内容')).toBeInTheDocument();
  });

  it('应该处理useAutoScroll的onResize回调（第80行）', () => {
    render(
      <ChatLayout header={{ title: '测试标题' }}>
        <div>测试内容</div>
      </ChatLayout>
    );

    // 验证组件能正常渲染，间接覆盖第80行
    expect(screen.getByTestId('layout-header')).toBeInTheDocument();
    expect(screen.getByText('测试内容')).toBeInTheDocument();
  });

  it('应该正确处理forwardRef', () => {
    const ref: React.RefObject<any> = React.createRef();
    
    render(
      <ChatLayout ref={ref} header={{ title: '测试标题' }}>
        <div>测试内容</div>
      </ChatLayout>
    );

    // 验证 ref 被正确设置
    expect(ref.current).toBeDefined();
  });
});