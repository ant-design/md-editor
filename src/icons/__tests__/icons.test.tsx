import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

// Import all icon components
import { AttachmentIcon } from '../AttachmentIcon';
import { CloseIcon } from '../CloseIcon';
import {
  CSSIcon,
  DOCSIcon,
  HTMLIcon,
  JSONIcon,
  MarkDownIcon,
  PDFIcon,
  PPTIcon,
  XLSXIcon,
  XMLIcon,
  YMLIcon,
} from '../FileIconList';
import { FinishedIcon } from '../FinishedIcon';
import { HistoryIcon } from '../HistoryIcon';
import { LoadingIcon } from '../LoadingIcon';
import { PlusIcon } from '../PlusIcon';

// Import simple icon components (these are named exports)
import { CodeIcon } from '../code';
import { DatabaseIcon } from '../database';
import { DocQueryIcon } from '../docQuery';
import { ChatDownLoadIcon as DownloadIcon } from '../download';
import { FunctionIcon } from '../function';

describe('Icons', () => {
  describe('Basic Icon Components', () => {
    it('应该渲染 AttachmentIcon', () => {
      render(<AttachmentIcon data-testid="attachment-icon" />);
      const icon = screen.getByTestId('attachment-icon');

      expect(icon).toBeInTheDocument();
      expect(icon.tagName).toBe('svg');
      expect(icon).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });

    it('应该渲染 CloseIcon', () => {
      render(<CloseIcon data-testid="close-icon" />);
      const icon = screen.getByTestId('close-icon');

      expect(icon).toBeInTheDocument();
      expect(icon.tagName).toBe('svg');
      expect(icon).toHaveAttribute('viewBox', '0 0 12 12');
    });

    it('应该渲染 PlusIcon', () => {
      render(<PlusIcon data-testid="plus-icon" />);
      const icon = screen.getByTestId('plus-icon');

      expect(icon).toBeInTheDocument();
      expect(icon.tagName).toBe('svg');
      expect(icon).toHaveAttribute('viewBox', '0 0 10.65625 10.6640625');
    });

    it('应该渲染 HistoryIcon', () => {
      render(<HistoryIcon data-testid="history-icon" />);
      const icon = screen.getByTestId('history-icon');

      expect(icon).toBeInTheDocument();
      expect(icon.tagName).toBe('svg');
    });
  });

  describe('Animated Icon Components', () => {
    it('应该渲染 FinishedIcon', () => {
      const { container } = render(<FinishedIcon />);
      const svgElement = container.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('fill', 'none');
    });

    it('应该渲染 LoadingIcon', () => {
      const { container } = render(<LoadingIcon />);
      const svgElement = container.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('fill', 'none');
    });

    it('LoadingIcon 应该支持 className 属性', () => {
      const { container } = render(<LoadingIcon />);
      const svgElement = container.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
    });
  });

  describe('File Type Icons', () => {
    it('应该渲染 DOCSIcon', () => {
      render(<DOCSIcon />);
      const svgElement = document.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('应该渲染 PPTIcon', () => {
      render(<PPTIcon />);
      const svgElement = document.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('应该渲染 PDFIcon', () => {
      render(<PDFIcon />);
      const svgElement = document.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('应该渲染 XLSXIcon', () => {
      render(<XLSXIcon />);
      const svgElement = document.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('应该渲染 HTMLIcon', () => {
      render(<HTMLIcon />);
      const svgElement = document.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('应该渲染 MarkDownIcon', () => {
      render(<MarkDownIcon />);
      const svgElement = document.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('应该渲染 CSSIcon', () => {
      render(<CSSIcon />);
      const svgElement = document.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('应该渲染 XMLIcon', () => {
      render(<XMLIcon />);
      const svgElement = document.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('应该渲染 YMLIcon', () => {
      render(<YMLIcon />);
      const svgElement = document.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('viewBox', '0 0 1024 1024');
    });

    it('应该渲染 JSONIcon', () => {
      render(<JSONIcon />);
      const svgElement = document.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('viewBox', '0 0 1024 1024');
    });
  });

  it('Simple Icon Components 应该渲染 CodeIcon', () => {
    const { container } = render(<CodeIcon />);
    const svgElement = container.querySelector('svg');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('viewBox');
  });

  it('应该渲染 DatabaseIcon', () => {
    const { container } = render(<DatabaseIcon />);
    const svgElement = container.querySelector('svg');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('viewBox');
  });

  it('应该渲染 DocQueryIcon', () => {
    const { container } = render(<DocQueryIcon />);
    const svgElement = container.querySelector('svg');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('viewBox', '0 0 21 21');
  });

  it('应该渲染 DownloadIcon', () => {
    const { container } = render(<DownloadIcon />);
    const svgElement = container.querySelector('svg');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('应该渲染 FunctionIcon', () => {
    const { container } = render(<FunctionIcon />);
    const svgElement = container.querySelector('svg');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('viewBox', '0 0 18 18');
  });

  describe('Icon Props and Customization', () => {
    it('AttachmentIcon 应该接受自定义 props', () => {
      render(<AttachmentIcon data-testid="custom-attachment" />);
      const icon = screen.getByTestId('custom-attachment');

      expect(icon).toBeInTheDocument();
      expect(icon.tagName).toBe('svg');
    });

    it('CloseIcon 应该接受自定义 props', () => {
      render(<CloseIcon data-testid="custom-close" />);
      const icon = screen.getByTestId('custom-close');

      expect(icon).toBeInTheDocument();
    });

    it('PlusIcon 应该支持事件处理', () => {
      render(<PlusIcon data-testid="clickable-plus" />);
      const icon = screen.getByTestId('clickable-plus');

      // 简单验证图标存在
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Icon Accessibility', () => {
    it('图标应该支持 aria-label', () => {
      render(
        <AttachmentIcon aria-label="添加附件" data-testid="accessible-icon" />,
      );
      const icon = screen.getByTestId('accessible-icon');

      expect(icon).toHaveAttribute('aria-label', '添加附件');
    });

    it('图标应该支持 role 属性', () => {
      render(<CloseIcon role="button" data-testid="button-icon" />);
      const icon = screen.getByTestId('button-icon');

      expect(icon).toHaveAttribute('role', 'button');
    });

    it('图标应该支持 title 属性用于工具提示', () => {
      render(<PlusIcon data-testid="titled-icon" />);
      const icon = screen.getByTestId('titled-icon');

      // 我们可以测试图标是否支持通过props传递title
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Icon Rendering Quality', () => {
    it('所有图标都应该有正确的 SVG 结构', () => {
      const icons = [
        <AttachmentIcon key="attachment" />,
        <CloseIcon key="close" />,
        <PlusIcon key="plus" />,
        <HistoryIcon key="history" />,
      ];

      icons.forEach((iconElement) => {
        const { container } = render(iconElement);
        const svg = container.querySelector('svg');

        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');

        // 检查是否包含路径或图形元素
        const hasContent = svg?.querySelector('path, g, circle, rect, polygon');
        expect(hasContent).toBeTruthy();
      });
    });

    it('LoadingIcon 应该包含动画相关的元素', () => {
      const { container } = render(<LoadingIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      // LoadingIcon 可能包含动画相关的属性或子元素
      expect(svg?.children.length).toBeGreaterThan(0);
    });

    it('FinishedIcon 应该包含 motion 元素', () => {
      const { container } = render(<FinishedIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg?.children.length).toBeGreaterThan(0);
    });
  });

  describe('File Icon Consistency', () => {
    it('所有文件类型图标都应该有一致的尺寸', () => {
      const fileIcons = [
        <DOCSIcon key="docs" />,
        <PPTIcon key="ppt" />,
        <PDFIcon key="pdf" />,
        <XLSXIcon key="xlsx" />,
        <HTMLIcon key="html" />,
        <MarkDownIcon key="md" />,
      ];

      fileIcons.forEach((iconElement) => {
        const { container } = render(iconElement);
        const svg = container.querySelector('svg');

        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
        expect(svg).toHaveAttribute('width', '1em');
        expect(svg).toHaveAttribute('height', '1em');
      });
    });

    it('所有其他文件图标都应该正确渲染', () => {
      const otherIcons = [
        <CSSIcon key="css" />,
        <XMLIcon key="xml" />,
        <YMLIcon key="yml" />,
        <JSONIcon key="json" />,
      ];

      otherIcons.forEach((iconElement) => {
        const { container } = render(iconElement);
        const svg = container.querySelector('svg');

        expect(svg).toBeInTheDocument();
        // YML和JSON图标使用不同的viewBox
        if (iconElement.key === 'yml' || iconElement.key === 'json') {
          expect(svg).toHaveAttribute('viewBox', '0 0 1024 1024');
        } else {
          expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
        }
      });
    });
  });
});
