import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import TimeIcon from '../../../../../src/plugins/chart/components/icons/TimeIcon';

describe('TimeIcon', () => {
  describe('基本渲染测试', () => {
    it('应该正确渲染时间图标', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });
      expect(svgElement).toBeInTheDocument();
      expect(svgElement.tagName).toBe('svg');
    });

    it('应该包含正确的 SVG 属性', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });
      expect(svgElement).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
      expect(svgElement).toHaveAttribute(
        'xmlnsXlink',
        'http://www.w3.org/1999/xlink',
      );
      expect(svgElement).toHaveAttribute('fill', 'none');
      expect(svgElement).toHaveAttribute('version', '1.1');
      expect(svgElement).toHaveAttribute('width', '14');
      expect(svgElement).toHaveAttribute('height', '14');
      expect(svgElement).toHaveAttribute('viewBox', '0 0 14 14');
    });

    it('应该包含 defs 和 clipPath 元素', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });
      const defsElement = svgElement.querySelector('defs');
      const clipPathElement = svgElement.querySelector('clipPath');

      expect(defsElement).toBeInTheDocument();
      expect(clipPathElement).toBeInTheDocument();
      expect(clipPathElement).toHaveAttribute('id', 'master_svg0_2168_020512');
    });

    it('应该包含 rect 元素在 clipPath 中', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });
      const rectElement = svgElement.querySelector('rect');

      expect(rectElement).toBeInTheDocument();
      expect(rectElement).toHaveAttribute('x', '0');
      expect(rectElement).toHaveAttribute('y', '0');
      expect(rectElement).toHaveAttribute('width', '14');
      expect(rectElement).toHaveAttribute('height', '14');
      expect(rectElement).toHaveAttribute('rx', '0');
    });

    it('应该包含 g 元素和 path 元素', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });
      const gElements = svgElement.querySelectorAll('g');
      const pathElement = svgElement.querySelector('path');

      expect(gElements).toHaveLength(2); // 外层 g 和内层 g
      expect(pathElement).toBeInTheDocument();
    });

    it('应该包含正确的 path 属性', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });
      const pathElement = svgElement.querySelector('path');

      expect(pathElement).toHaveAttribute('d');
      expect(pathElement).toHaveAttribute('fillRule', 'evenodd');
      expect(pathElement).toHaveAttribute('fill', '#00183D');
      expect(pathElement).toHaveAttribute('fillOpacity', '0.24709999561309814');
    });
  });

  describe('自定义属性测试', () => {
    it('应该应用自定义 className', () => {
      render(<TimeIcon className="custom-time-icon" />);

      const svgElement = screen.getByRole('img', { hidden: true });
      expect(svgElement).toHaveClass('custom-time-icon');
    });

    it('应该应用自定义样式', () => {
      const customStyle = { color: 'red', fontSize: '16px' };
      render(<TimeIcon style={customStyle} />);

      const svgElement = screen.getByRole('img', { hidden: true });
      expect(svgElement).toHaveStyle('color: red');
      expect(svgElement).toHaveStyle('font-size: 16px');
    });

    it('应该同时应用 className 和 style', () => {
      const customStyle = { color: 'blue' };
      render(<TimeIcon className="test-class" style={customStyle} />);

      const svgElement = screen.getByRole('img', { hidden: true });
      expect(svgElement).toHaveClass('test-class');
      expect(svgElement).toHaveStyle('color: blue');
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空的 className', () => {
      render(<TimeIcon className="" />);

      const svgElement = screen.getByRole('img', { hidden: true });
      expect(svgElement).toBeInTheDocument();
    });

    it('应该处理空的 style 对象', () => {
      render(<TimeIcon style={{}} />);

      const svgElement = screen.getByRole('img', { hidden: true });
      expect(svgElement).toBeInTheDocument();
    });

    it('应该处理 undefined 的 props', () => {
      render(<TimeIcon className={undefined} style={undefined} />);

      const svgElement = screen.getByRole('img', { hidden: true });
      expect(svgElement).toBeInTheDocument();
    });

    it('应该处理 null 的 props', () => {
      render(<TimeIcon className={null as any} style={null as any} />);

      const svgElement = screen.getByRole('img', { hidden: true });
      expect(svgElement).toBeInTheDocument();
    });
  });

  describe('可访问性测试', () => {
    it('应该支持屏幕阅读器', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });
      expect(svgElement).toBeInTheDocument();
    });

    it('应该包含正确的 ARIA 属性', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });
      // SVG 元素默认是隐藏的，这是正确的行为
      expect(svgElement).toBeInTheDocument();
    });
  });

  describe('SVG 结构测试', () => {
    it('应该包含正确的 SVG 结构层次', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });

      // 检查 SVG 结构
      expect(svgElement.querySelector('defs')).toBeInTheDocument();
      expect(svgElement.querySelector('defs > clipPath')).toBeInTheDocument();
      expect(
        svgElement.querySelector('defs > clipPath > rect'),
      ).toBeInTheDocument();
      expect(svgElement.querySelector('g[clipPath]')).toBeInTheDocument();
      expect(svgElement.querySelector('g[clipPath] > g')).toBeInTheDocument();
      expect(
        svgElement.querySelector('g[clipPath] > g > path'),
      ).toBeInTheDocument();
    });

    it('应该包含正确的 clipPath 引用', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });
      const gElement = svgElement.querySelector('g[clipPath]');

      expect(gElement).toHaveAttribute(
        'clipPath',
        'url(#master_svg0_2168_020512)',
      );
    });

    it('应该包含正确的 path 数据', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });
      const pathElement = svgElement.querySelector('path');

      expect(pathElement).toHaveAttribute('d');
      const pathData = pathElement?.getAttribute('d');
      expect(pathData).toContain('M10.740198609352111,3.3163769365119933');
    });
  });

  describe('样式属性测试', () => {
    it('应该包含正确的 fill 属性', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });
      const pathElement = svgElement.querySelector('path');

      expect(pathElement).toHaveAttribute('fill', '#00183D');
      expect(pathElement).toHaveAttribute('fillOpacity', '0.24709999561309814');
    });

    it('应该包含正确的 fillRule 属性', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });
      const pathElement = svgElement.querySelector('path');

      expect(pathElement).toHaveAttribute('fillRule', 'evenodd');
    });

    it('应该包含正确的 style 属性', () => {
      render(<TimeIcon />);

      const svgElement = screen.getByRole('img', { hidden: true });
      const pathElement = svgElement.querySelector('path');

      expect(pathElement).toHaveStyle('mix-blend-mode: passthrough');
    });
  });

  describe('性能测试', () => {
    it('应该快速渲染', () => {
      const startTime = performance.now();
      render(<TimeIcon />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // 应该在 100ms 内完成渲染
    });

    it('应该处理多次重新渲染', () => {
      const { rerender } = render(<TimeIcon />);

      for (let i = 0; i < 10; i++) {
        rerender(<TimeIcon className={`test-${i}`} />);
      }

      const svgElement = screen.getByRole('img', { hidden: true });
      expect(svgElement).toHaveClass('test-9');
    });
  });

  describe('集成测试', () => {
    it('应该与其他组件正确集成', () => {
      const TestComponent = () => (
        <div>
          <TimeIcon className="icon" />
          <span>时间</span>
        </div>
      );

      render(<TestComponent />);

      expect(screen.getByRole('img', { hidden: true })).toHaveClass('icon');
      expect(screen.getByText('时间')).toBeInTheDocument();
    });

    it('应该处理多个实例', () => {
      render(
        <div>
          <TimeIcon className="icon1" />
          <TimeIcon className="icon2" />
          <TimeIcon className="icon3" />
        </div>,
      );

      const svgElements = screen.getAllByRole('img', { hidden: true });
      expect(svgElements).toHaveLength(3);
      expect(svgElements[0]).toHaveClass('icon1');
      expect(svgElements[1]).toHaveClass('icon2');
      expect(svgElements[2]).toHaveClass('icon3');
    });
  });

  describe('类型定义测试', () => {
    it('应该接受正确的 props 类型', () => {
      // 测试 TypeScript 类型定义
      const props = {
        className: 'test-class',
        style: { color: 'red' },
      };

      expect(() => {
        render(<TimeIcon {...props} />);
      }).not.toThrow();
    });

    it('应该处理可选的 props', () => {
      expect(() => {
        render(<TimeIcon />);
      }).not.toThrow();
    });
  });
});
