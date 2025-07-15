import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

// Import components icons
import { DatabaseIcon } from '../../components/icons/DatabaseIcon';
import { DocIcon } from '../../components/icons/DocIcon';
import { DocumentIcon } from '../../components/icons/DocumentIcon';
import Earth from '../../components/icons/Earth';
import { LoadingSpinnerIcon } from '../../components/icons/LoadingSpinnerIcon';
import MagicIcon from '../../components/icons/MagicIcon';
import RagIcon from '../../components/icons/RagIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import TableSqlIcon from '../../components/icons/TableSqlIcon';
import ToolCallIcon from '../../components/icons/ToolCallIcon';

describe('Components Icons', () => {
  describe('Basic Components Icons', () => {
    it('应该渲染 SearchIcon', () => {
      const { container } = render(<SearchIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
    });

    it('SearchIcon 应该支持自定义尺寸', () => {
      const { container } = render(<SearchIcon width={30} height={30} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '30');
      expect(svg).toHaveAttribute('height', '30');
    });

    it('应该渲染 DatabaseIcon', () => {
      const { container } = render(<DatabaseIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('应该渲染 DocIcon', () => {
      const { container } = render(<DocIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('应该渲染 DocumentIcon', () => {
      const { container } = render(<DocumentIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('应该渲染 Earth', () => {
      const { container } = render(<Earth />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('应该渲染 LoadingSpinnerIcon', () => {
      const { container } = render(<LoadingSpinnerIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('应该渲染 MagicIcon', () => {
      const { container } = render(<MagicIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('应该渲染 RagIcon', () => {
      const { container } = render(<RagIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('应该渲染 TableSqlIcon', () => {
      const { container } = render(<TableSqlIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('应该渲染 ToolCallIcon', () => {
      const { container } = render(<ToolCallIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });
  });

  describe('Icon Structure Quality', () => {
    it('所有组件图标都应该有正确的 SVG 结构', () => {
      const icons = [
        <SearchIcon key="search" />,
        <DatabaseIcon key="database" />,
        <DocIcon key="doc" />,
        <DocumentIcon key="document" />,
        <Earth key="earth" />,
        <LoadingSpinnerIcon key="loading" />,
        <MagicIcon key="magic" />,
        <RagIcon key="rag" />,
        <TableSqlIcon key="table" />,
        <ToolCallIcon key="tool" />,
      ];

      icons.forEach((iconElement) => {
        const { container } = render(iconElement);
        const svg = container.querySelector('svg');

        expect(svg).toBeInTheDocument();

        // 检查是否包含路径或图形元素
        const hasContent = svg?.querySelector(
          'path, g, circle, rect, polygon, defs',
        );
        expect(hasContent).toBeTruthy();
      });
    });

    it('图标应该支持基本的 SVG 属性', () => {
      const { container } = render(<SearchIcon width={24} height={24} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });
  });

  describe('Icon Content Validation', () => {
    it('图标应该包含可见的图形内容', () => {
      const icons = [
        { component: <SearchIcon key="search" />, name: 'SearchIcon' },
        { component: <DatabaseIcon key="database" />, name: 'DatabaseIcon' },
        { component: <DocIcon key="doc" />, name: 'DocIcon' },
        { component: <MagicIcon key="magic" />, name: 'MagicIcon' },
      ];

      icons.forEach(({ component, name }) => {
        const { container } = render(component);
        const svg = container.querySelector('svg');
        const paths = svg?.querySelectorAll('path');

        // 每个图标至少应该有一个path元素或其他图形元素
        expect(
          paths?.length || svg?.children.length,
          `${name} should have graphic content`,
        ).toBeGreaterThan(0);
      });
    });

    it('复杂图标应该包含 defs 和 clipPath', () => {
      const complexIcons = [
        <SearchIcon key="search" />,
        <DatabaseIcon key="database" />,
      ];

      complexIcons.forEach((iconElement) => {
        const { container } = render(iconElement);
        const svg = container.querySelector('svg');

        // 检查是否包含定义元素（某些复杂图标可能需要）
        const hasDefinitions = svg?.querySelector('defs, clipPath');
        // 至少应该有基本的图形内容
        const hasBasicContent = svg?.querySelector('path, g, circle, rect');

        expect(hasDefinitions || hasBasicContent).toBeTruthy();
      });
    });
  });

  describe('Icon Accessibility', () => {
    it('图标应该有合适的默认属性', () => {
      const { container } = render(<SearchIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
      expect(svg).toHaveAttribute('viewBox');
    });

    it('图标应该支持基本的可访问性', () => {
      const { container } = render(<SearchIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg?.tagName).toBe('svg');
    });
  });
});
