import { fireEvent, render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import Quote from '../index';

// 在ConfigProvider中包装组件来提供完整的样式上下文
const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ConfigProvider prefixCls="ant">{ui}</ConfigProvider>);
};

describe('Quote 组件', () => {
  it('应该正确渲染基本内容', () => {
    const { getByText } = renderWithProvider(
      <Quote fileName="test.ts" content="测试内容" />,
    );

    expect(getByText('test.ts')).toBeInTheDocument();
    expect(getByText('测试内容')).toBeInTheDocument();
  });

  it('应该正确显示文件名和行号范围', () => {
    const { getByText } = renderWithProvider(
      <Quote fileName="example.ts" lineRange="10-20" content="示例内容" />,
    );

    expect(getByText('example.ts (10-20)')).toBeInTheDocument();
  });

  it('应该在closable为true时显示关闭按钮', () => {
    const handleClose = vi.fn();
    const { container } = renderWithProvider(
      <Quote
        fileName="test.ts"
        content="测试内容"
        closable={true}
        onClose={handleClose}
      />,
    );

    const closeButton = container.querySelector('.quote-close-button');
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton!);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('应该在hover时显示详情弹框', () => {
    const { container } = renderWithProvider(
      <Quote fileName="test.ts" content="测试内容" detail="详细信息" />,
    );

    // 弹框应该存在但默认隐藏
    const popup = container.querySelector('.quote-popup');
    expect(popup).toBeInTheDocument();

    // hover容器后通过CSS控制显示，这里验证弹框内容存在
    expect(popup).toHaveTextContent('详细信息');
  });

  it('应该在点击文件名时触发onFileClick', () => {
    const handleFileClick = vi.fn();
    const { getByText } = renderWithProvider(
      <Quote
        fileName="test.ts"
        lineRange="1-5"
        content="测试内容"
        onFileClick={handleFileClick}
      />,
    );

    const fileName = getByText('test.ts (1-5)');
    fireEvent.click(fileName);

    expect(handleFileClick).toHaveBeenCalledWith('test.ts', '1-5');
  });

  it('应该在点击弹框标题时触发onFileClick', () => {
    const handleFileClick = vi.fn();
    const { container } = renderWithProvider(
      <Quote
        fileName="example.ts"
        content="测试内容"
        detail="详细信息"
        onFileClick={handleFileClick}
      />,
    );

    const popupHeader = container.querySelector('.quote-popup-header');
    expect(popupHeader).toBeInTheDocument();

    fireEvent.click(popupHeader!);
    expect(handleFileClick).toHaveBeenCalledWith('example.ts', undefined);
  });

  it('应该支持自定义样式', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = renderWithProvider(
      <Quote fileName="test.ts" content="测试内容" style={customStyle} />,
    );

    const quoteContainer = container.querySelector('.quote-container');
    expect(quoteContainer).toHaveStyle('background-color: red');
  });

  it('应该支持不传文件名', () => {
    const { getByText } = renderWithProvider(
      <Quote content="无文件来源的内容" />,
    );

    expect(getByText('无文件来源的内容')).toBeInTheDocument();
  });

  it('应该正确处理没有onFileClick时的点击', () => {
    const { getByText } = renderWithProvider(
      <Quote fileName="test.ts" content="测试内容" />,
    );

    const fileName = getByText('test.ts');
    // 应该不会抛出错误
    expect(() => {
      fireEvent.click(fileName);
    }).not.toThrow();
  });
});
