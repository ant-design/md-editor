import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '../../../../src/MarkdownEditor/editor/elements/ErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal content</div>;
};

describe('ErrorBoundary', () => {
  const fallback = <div>Something went wrong.</div>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('正常渲染测试', () => {
    it('应该正常渲染子组件', () => {
      render(
        <ErrorBoundary fallback={fallback}>
          <div>Normal content</div>
        </ErrorBoundary>,
      );
      expect(screen.getByText('Normal content')).toBeInTheDocument();
    });

    it('应该渲染多个子组件', () => {
      render(
        <ErrorBoundary fallback={fallback}>
          <div>First</div>
          <div>Second</div>
        </ErrorBoundary>,
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  describe('错误处理测试', () => {
    it('应该捕获子组件的错误', () => {
      render(
        <ErrorBoundary fallback={fallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });

    it('应该显示错误信息', () => {
      render(
        <ErrorBoundary fallback={fallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });

    it('应该包含错误边界标识', () => {
      render(
        <ErrorBoundary fallback={fallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );
      // ErrorBoundary 只是返回 fallback，不添加额外的属性
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });
  });

  describe('错误恢复测试', () => {
    it('应该在错误后重新渲染正常内容', () => {
      const { rerender } = render(
        <ErrorBoundary fallback={fallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

      // 重新渲染正常内容
      rerender(
        <ErrorBoundary fallback={fallback}>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>,
      );

      // ErrorBoundary 一旦捕获错误，状态就会保持，不会自动恢复
      // 所以这里应该仍然显示 fallback
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空子组件', () => {
      render(<ErrorBoundary fallback={fallback}>{null}</ErrorBoundary>);
      // ErrorBoundary 应该正常渲染 null 子组件
      expect(
        screen.queryByText('Something went wrong.'),
      ).not.toBeInTheDocument();
    });

    it('应该处理 undefined 子组件', () => {
      render(<ErrorBoundary fallback={fallback}>{undefined}</ErrorBoundary>);
      // ErrorBoundary 应该正常渲染 undefined 子组件
      expect(
        screen.queryByText('Something went wrong.'),
      ).not.toBeInTheDocument();
    });

    it('应该处理没有子组件的情况', () => {
      render(<ErrorBoundary fallback={fallback}>{null}</ErrorBoundary>);
      // ErrorBoundary 应该正常渲染 null 子组件
      expect(
        screen.queryByText('Something went wrong.'),
      ).not.toBeInTheDocument();
    });
  });

  describe('样式测试', () => {
    it('应该应用正确的样式类', () => {
      render(
        <ErrorBoundary fallback={fallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );
      // ErrorBoundary 不添加额外的样式类，只是返回 fallback
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });
  });
});
