import { render, screen } from '@testing-library/react';
import React from 'react';
import { Bubble } from '../../src/Bubble';
import { MessageBubbleData } from '../../src/Bubble/type';

describe('Bubble afterContentRender and beforeContentRender', () => {
  const mockMessageData: MessageBubbleData = {
    id: 'test-message-1',
    content: '这是一个测试消息',
    role: 'assistant',
    createAt: Date.now(),
    updateAt: Date.now(),
    isFinished: true,
  };

  it('应该渲染 beforeContentRender 的内容', () => {
    const beforeContentRender = (props: any) => (
      <div data-testid="before-content">前置内容</div>
    );

    render(
      <Bubble
        originData={mockMessageData}
        bubbleRenderConfig={{
          beforeContentRender,
        }}
      />,
    );

    expect(screen.getByTestId('before-content')).toBeInTheDocument();
    expect(screen.getByText('前置内容')).toBeInTheDocument();
  });

  it('应该渲染 afterContentRender 的内容', () => {
    const afterContentRender = (props: any) => (
      <div data-testid="after-content">后置内容</div>
    );

    render(
      <Bubble
        originData={mockMessageData}
        bubbleRenderConfig={{
          afterContentRender,
        }}
      />,
    );

    expect(screen.getByTestId('after-content')).toBeInTheDocument();
    expect(screen.getByText('后置内容')).toBeInTheDocument();
  });

  it('应该同时渲染 beforeContentRender 和 afterContentRender 的内容', () => {
    const beforeContentRender = (props: any) => (
      <div data-testid="before-content">前置内容</div>
    );

    const afterContentRender = (props: any) => (
      <div data-testid="after-content">后置内容</div>
    );

    render(
      <Bubble
        originData={mockMessageData}
        bubbleRenderConfig={{
          beforeContentRender,
          afterContentRender,
        }}
      />,
    );

    expect(screen.getByTestId('before-content')).toBeInTheDocument();
    expect(screen.getByTestId('after-content')).toBeInTheDocument();
    expect(screen.getByText('前置内容')).toBeInTheDocument();
    expect(screen.getByText('后置内容')).toBeInTheDocument();
  });

  it('当 beforeContentRender 为 false 时，不应该渲染前置内容', () => {
    const afterContentRender = (props: any) => (
      <div data-testid="after-content">后置内容</div>
    );

    render(
      <Bubble
        originData={mockMessageData}
        bubbleRenderConfig={{
          beforeContentRender: false,
          afterContentRender,
        }}
      />,
    );

    expect(screen.queryByTestId('before-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('after-content')).toBeInTheDocument();
  });

  it('当 afterContentRender 为 false 时，不应该渲染后置内容', () => {
    const beforeContentRender = (props: any) => (
      <div data-testid="before-content">前置内容</div>
    );

    render(
      <Bubble
        originData={mockMessageData}
        bubbleRenderConfig={{
          beforeContentRender,
          afterContentRender: false,
        }}
      />,
    );

    expect(screen.getByTestId('before-content')).toBeInTheDocument();
    expect(screen.queryByTestId('after-content')).not.toBeInTheDocument();
  });

  it('render 函数应该能访问到正确的 props', () => {
    const beforeContentRender = (props: any) => {
      expect(props.originData).toEqual(mockMessageData);
      expect(props.originData.id).toBe('test-message-1');
      return <div data-testid="before-content">前置内容</div>;
    };

    const afterContentRender = (props: any) => {
      expect(props.originData).toEqual(mockMessageData);
      expect(props.originData.role).toBe('assistant');
      return <div data-testid="after-content">后置内容</div>;
    };

    render(
      <Bubble
        originData={mockMessageData}
        bubbleRenderConfig={{
          beforeContentRender,
          afterContentRender,
        }}
      />,
    );

    expect(screen.getByTestId('before-content')).toBeInTheDocument();
    expect(screen.getByTestId('after-content')).toBeInTheDocument();
  });
});
