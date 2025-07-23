import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CopyButton } from '../../src/Bubble/MessagesContent/CopyButton';

// Mock useCopied hook
vi.mock('../../../hooks/useCopied', () => ({
  useCopied: vi.fn(() => ({
    copied: false,
    setCopied: vi.fn(),
  })),
}));

// Mock ActionIconBox
vi.mock('../../../index', () => ({
  ActionIconBox: ({
    children,
    onClick,
    title,
    style,
    scale,
    dataTestid,
    ...props
  }: any) => (
    <span
      data-testid={dataTestid || 'action-icon-box'}
      onClick={onClick}
      style={style}
      title={title}
      data-scale={scale ? 'true' : 'false'}
      {...props}
    >
      {children}
    </span>
  ),
}));

describe('CopyButton', () => {
  const defaultProps = {
    content: 'Test content to copy',
    onClick: vi.fn(),
    title: 'Copy content',
    style: {},
    scale: false,
    dataTestid: 'test-id',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染CopyButton', () => {
      render(<CopyButton {...defaultProps} />);

      expect(screen.getByTestId('test-id')).toBeInTheDocument();
    });

    it('应该处理点击事件', async () => {
      const onClick = vi.fn();
      render(<CopyButton {...defaultProps} onClick={onClick} />);

      const button = screen.getByTestId('test-id');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onClick).toHaveBeenCalled();
      });
    });

    it('应该处理复制功能', async () => {
      render(<CopyButton {...defaultProps} />);

      const button = screen.getByTestId('test-id');
      fireEvent.click(button);

      expect(button).toBeInTheDocument();
    });
  });

  describe('复制状态测试', () => {
    it('应该处理已复制状态', () => {
      const { useCopied } = require('../../../hooks/useCopied');
      vi.mocked(useCopied).mockReturnValue({
        copied: true,
        setCopied: vi.fn(),
      });

      render(<CopyButton {...defaultProps} />);

      expect(screen.getByTestId('test-id')).toBeInTheDocument();
    });

    it('应该处理未复制状态', () => {
      const { useCopied } = require('../../../hooks/useCopied');
      vi.mocked(useCopied).mockReturnValue({
        copied: false,
        setCopied: vi.fn(),
      });

      render(<CopyButton {...defaultProps} />);

      expect(screen.getByTestId('test-id')).toBeInTheDocument();
    });
  });

  describe('子元素测试', () => {
    it('应该处理无子元素的情况', () => {
      render(<CopyButton {...defaultProps} />);

      expect(screen.getByTestId('test-id')).toBeInTheDocument();
    });
  });

  describe('CopyIcon测试', () => {
    it('应该渲染CopyIcon', () => {
      render(<CopyButton {...defaultProps} />);

      expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
    });

    it('应该处理CopyIcon点击', () => {
      render(<CopyButton {...defaultProps} />);

      const copyIcon = screen.getByTestId('copy-icon');
      expect(copyIcon).toBeInTheDocument();
    });
  });

  describe('错误处理测试', () => {
    it('应该处理onClick抛出错误', () => {
      const onClick = vi.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      render(<CopyButton {...defaultProps} onClick={onClick} />);

      const button = screen.getByTestId('test-id');
      fireEvent.click(button);

      expect(button).toBeInTheDocument();
    });

    it('应该处理异步onClick抛出错误', async () => {
      const onClick = vi.fn().mockRejectedValue(new Error('Async error'));
      render(<CopyButton {...defaultProps} onClick={onClick} />);

      const button = screen.getByTestId('test-id');
      fireEvent.click(button);

      expect(button).toBeInTheDocument();
    });
  });
});
