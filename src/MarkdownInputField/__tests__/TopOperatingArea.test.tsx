import { ConfigProvider } from 'antd';
import { fireEvent, render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import TopOperatingArea from '../TopOperatingArea';

// Mock BackTo 组件
vi.mock('../../BackTo', () => ({
  BackTo: {
    Top: ({ target, shouldVisible, style }: any) => (
      <button
        data-testid="back-to-top"
        data-target={target ? 'custom' : 'window'}
        data-should-visible={shouldVisible}
        style={style}
        type="button"
      >
        Back to Top
      </button>
    ),
    Bottom: ({ target, shouldVisible, style }: any) => (
      <button
        data-testid="back-to-bottom"
        data-target={target ? 'custom' : 'window'}
        data-should-visible={shouldVisible}
        style={style}
        type="button"
      >
        Back to Bottom
      </button>
    ),
  },
}));

describe('TopOperatingArea - 基本渲染', () => {
  it('应该正确渲染组件基本结构', () => {
    render(<TopOperatingArea />);
    
    // 验证主容器存在
    expect(document.querySelector('.ant-top-operating-area')).toBeInTheDocument();
    
    // 验证三栏布局存在
    expect(document.querySelector('.ant-top-operating-area-left')).toBeInTheDocument();
    expect(document.querySelector('.ant-top-operating-area-center')).toBeInTheDocument();
    expect(document.querySelector('.ant-top-operating-area-right')).toBeInTheDocument();
  });

  it('应该使用自定义前缀类名', () => {
    const customPrefixCls = 'custom-prefix';
    
    render(
      <ConfigProvider prefixCls={customPrefixCls}>
        <TopOperatingArea />
      </ConfigProvider>
    );
    
    expect(document.querySelector('.custom-prefix-top-operating-area')).toBeInTheDocument();
  });

  it('应该正确应用样式类名和hashId', () => {
    render(<TopOperatingArea />);
    
    const container = document.querySelector('.ant-top-operating-area');
    expect(container).toHaveClass('ant-top-operating-area');
    
    // 验证hashId存在 (通过检查是否有额外的类名)
    expect(container?.classList.length).toBeGreaterThan(1);
  });
});

describe('TopOperatingArea - BackTo按钮功能', () => {
  it('默认应该显示回到顶部和底部按钮', () => {
    render(<TopOperatingArea />);
    
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
    expect(screen.getByTestId('back-to-bottom')).toBeInTheDocument();
    
    // 验证按钮容器有visible类名
    const backButtonsContainer = document.querySelector('.ant-top-operating-area-back-buttons-visible');
    expect(backButtonsContainer).toBeInTheDocument();
  });

  it('当isShowBackTo为false时应该隐藏按钮', () => {
    render(<TopOperatingArea isShowBackTo={false} />);
    
    expect(screen.queryByTestId('back-to-top')).not.toBeInTheDocument();
    expect(screen.queryByTestId('back-to-bottom')).not.toBeInTheDocument();
    
    // 验证按钮容器有hidden类名
    const backButtonsContainer = document.querySelector('.ant-top-operating-area-back-buttons-hidden');
    expect(backButtonsContainer).toBeInTheDocument();
  });

  it('BackTo按钮应该有正确的默认配置', () => {
    render(<TopOperatingArea />);
    
    const topButton = screen.getByTestId('back-to-top');
    const bottomButton = screen.getByTestId('back-to-bottom');
    
    // 验证shouldVisible配置
    expect(topButton).toHaveAttribute('data-should-visible', '5');
    expect(bottomButton).toHaveAttribute('data-should-visible', '5');
    
    // 验证默认target为window
    expect(topButton).toHaveAttribute('data-target', 'window');
    expect(bottomButton).toHaveAttribute('data-target', 'window');
  });
});

describe('TopOperatingArea - targetRef功能', () => {
  it('应该将targetRef传递给BackTo组件', () => {
    const targetRef = createRef<HTMLDivElement>();
    
    render(<TopOperatingArea targetRef={targetRef} />);
    
    const topButton = screen.getByTestId('back-to-top');
    const bottomButton = screen.getByTestId('back-to-bottom');
    
    // 验证target被设置为自定义target
    expect(topButton).toHaveAttribute('data-target', 'custom');
    expect(bottomButton).toHaveAttribute('data-target', 'custom');
  });

  it('没有targetRef时应该使用默认的window target', () => {
    render(<TopOperatingArea />);
    
    const topButton = screen.getByTestId('back-to-top');
    const bottomButton = screen.getByTestId('back-to-bottom');
    
    expect(topButton).toHaveAttribute('data-target', 'window');
    expect(bottomButton).toHaveAttribute('data-target', 'window');
  });
});

describe('TopOperatingArea - 自定义操作按钮', () => {
  it('没有operationBtnRender时不应该渲染按钮容器', () => {
    render(<TopOperatingArea />);
    
    expect(document.querySelector('.ant-top-operating-area-buttons')).not.toBeInTheDocument();
  });

  it('应该正确渲染自定义操作按钮', () => {
    const operationBtnRender = () => (
      <button data-testid="custom-operation-btn" type="button">
        自定义操作
      </button>
    );
    
    render(<TopOperatingArea operationBtnRender={operationBtnRender} />);
    
    // 验证按钮容器存在
    expect(document.querySelector('.ant-top-operating-area-buttons')).toBeInTheDocument();
    
    // 验证自定义按钮存在
    expect(screen.getByTestId('custom-operation-btn')).toBeInTheDocument();
    expect(screen.getByText('自定义操作')).toBeInTheDocument();
  });

  it('应该支持渲染多个自定义按钮', () => {
    const operationBtnRender = () => (
      <>
        <button data-testid="btn-1" type="button">按钮1</button>
        <button data-testid="btn-2" type="button">按钮2</button>
        <button data-testid="btn-3" type="button">按钮3</button>
      </>
    );
    
    render(<TopOperatingArea operationBtnRender={operationBtnRender} />);
    
    expect(screen.getByTestId('btn-1')).toBeInTheDocument();
    expect(screen.getByTestId('btn-2')).toBeInTheDocument();
    expect(screen.getByTestId('btn-3')).toBeInTheDocument();
  });

  it('自定义按钮应该支持点击事件', () => {
    const handleClick = vi.fn();
    const operationBtnRender = () => (
      <button 
        data-testid="clickable-btn" 
        onClick={handleClick}
        type="button"
      >
        可点击按钮
      </button>
    );
    
    render(<TopOperatingArea operationBtnRender={operationBtnRender} />);
    
    const button = screen.getByTestId('clickable-btn');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalled();
  });

  it('按钮容器应该有正确的样式类名', () => {
    const operationBtnRender = () => (
      <button data-testid="styled-btn" type="button">样式按钮</button>
    );
    
    render(<TopOperatingArea operationBtnRender={operationBtnRender} />);
    
    const buttonsContainer = document.querySelector('.ant-top-operating-area-buttons');
    expect(buttonsContainer).toHaveClass('ant-top-operating-area-buttons');
    
    // 验证hashId也被应用
    expect(buttonsContainer?.classList.length).toBeGreaterThan(1);
  });
});

describe('TopOperatingArea - 组合功能测试', () => {
  it('应该同时支持自定义按钮和BackTo按钮', () => {
    const operationBtnRender = () => (
      <button data-testid="combo-btn" type="button">组合按钮</button>
    );
    
    render(
      <TopOperatingArea 
        operationBtnRender={operationBtnRender}
        isShowBackTo={true}
      />
    );
    
    // 验证自定义按钮存在
    expect(screen.getByTestId('combo-btn')).toBeInTheDocument();
    
    // 验证BackTo按钮存在
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
    expect(screen.getByTestId('back-to-bottom')).toBeInTheDocument();
  });

  it('应该支持完整的props组合', () => {
    const targetRef = createRef<HTMLDivElement>();
    const operationBtnRender = () => (
      <button data-testid="full-combo-btn" type="button">全功能按钮</button>
    );
    
    render(
      <TopOperatingArea 
        isShowBackTo={true}
        targetRef={targetRef}
        operationBtnRender={operationBtnRender}
      />
    );
    
    // 验证所有功能都正常工作
    expect(screen.getByTestId('full-combo-btn')).toBeInTheDocument();
    expect(screen.getByTestId('back-to-top')).toHaveAttribute('data-target', 'custom');
    expect(screen.getByTestId('back-to-bottom')).toHaveAttribute('data-target', 'custom');
    expect(document.querySelector('.ant-top-operating-area-back-buttons-visible')).toBeInTheDocument();
  });

  it('props变化时应该正确更新组件', () => {
    const operationBtnRender1 = () => (
      <button data-testid="btn-1" type="button">按钮1</button>
    );
    const operationBtnRender2 = () => (
      <button data-testid="btn-2" type="button">按钮2</button>
    );
    
    const { rerender } = render(
      <TopOperatingArea 
        isShowBackTo={true}
        operationBtnRender={operationBtnRender1}
      />
    );
    
    // 初始状态
    expect(screen.getByTestId('btn-1')).toBeInTheDocument();
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
    
    // 更新props
    rerender(
      <TopOperatingArea 
        isShowBackTo={false}
        operationBtnRender={operationBtnRender2}
      />
    );
    
    // 验证更新后的状态
    expect(screen.queryByTestId('btn-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('btn-2')).toBeInTheDocument();
    expect(screen.queryByTestId('back-to-top')).not.toBeInTheDocument();
    expect(document.querySelector('.ant-top-operating-area-back-buttons-hidden')).toBeInTheDocument();
  });
});

describe('TopOperatingArea - 布局和样式', () => {
  it('应该有正确的网格布局结构', () => {
    render(<TopOperatingArea />);
    
    const container = document.querySelector('.ant-top-operating-area');
    const leftArea = document.querySelector('.ant-top-operating-area-left');
    const centerArea = document.querySelector('.ant-top-operating-area-center');
    const rightArea = document.querySelector('.ant-top-operating-area-right');
    
    expect(container).toBeInTheDocument();
    expect(leftArea).toBeInTheDocument();
    expect(centerArea).toBeInTheDocument();
    expect(rightArea).toBeInTheDocument();
  });

  it('BackTo按钮应该有正确的样式属性', () => {
    render(<TopOperatingArea />);
    
    const topButton = screen.getByTestId('back-to-top');
    const bottomButton = screen.getByTestId('back-to-bottom');
    
    // 验证内联样式
    expect(topButton).toHaveStyle({
      position: 'relative',
      insetInlineEnd: '0',
      bottom: '0',
    });
    
    expect(bottomButton).toHaveStyle({
      position: 'relative',
      insetInlineEnd: '0',
      bottom: '0',
    });
  });
});
