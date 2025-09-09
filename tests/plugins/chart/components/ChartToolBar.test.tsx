import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import ChartToolBar, {
  ChartToolBarProps,
} from '../../../../src/plugins/chart/components/ChartToolBar';

// Mock Ant Design icons
vi.mock('@ant-design/icons', () => ({
  DownloadOutlined: vi.fn().mockImplementation(({ className, onClick }) => (
    <button data-testid="download-icon" className={className} onClick={onClick}>
      下载
    </button>
  )),
}));

// Mock TimeIcon
vi.mock('../../../../src/plugins/chart/components/icons/TimeIcon', () => ({
  default: vi.fn().mockImplementation(({ className }) => (
    <div data-testid="time-icon" className={className}>
      时间图标
    </div>
  )),
}));

describe('ChartToolBar', () => {
  const defaultProps: ChartToolBarProps = {
    title: '测试图表',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染工具栏', () => {
      render(<ChartToolBar {...defaultProps} />);

      expect(screen.getByText('测试图表')).toBeInTheDocument();
      expect(screen.getByTestId('time-icon')).toBeInTheDocument();
      expect(screen.getByTestId('download-icon')).toBeInTheDocument();
    });

    it('应该显示默认数据时间', () => {
      render(<ChartToolBar {...defaultProps} />);

      expect(
        screen.getByText('数据时间: 2025-06-30 00:00:00'),
      ).toBeInTheDocument();
    });

    it('应该显示自定义数据时间', () => {
      const customTime = '2024-12-25 15:30:00';
      render(<ChartToolBar {...defaultProps} dataTime={customTime} />);

      expect(screen.getByText(`数据时间: ${customTime}`)).toBeInTheDocument();
    });

    it('应该应用自定义 className', () => {
      render(<ChartToolBar {...defaultProps} className="custom-toolbar" />);

      const toolbar = screen.getByText('测试图表').closest('.chart-header');
      expect(toolbar).toHaveClass('custom-toolbar');
    });
  });

  describe('主题测试', () => {
    it('应该应用浅色主题', () => {
      render(<ChartToolBar {...defaultProps} theme="light" />);

      const toolbar = screen.getByText('测试图表').closest('.chart-header');
      expect(toolbar).toHaveClass('light');
    });

    it('应该应用深色主题', () => {
      render(<ChartToolBar {...defaultProps} theme="dark" />);

      const toolbar = screen.getByText('测试图表').closest('.chart-header');
      expect(toolbar).toHaveClass('dark');
    });

    it('应该使用默认浅色主题', () => {
      render(<ChartToolBar {...defaultProps} />);

      const toolbar = screen.getByText('测试图表').closest('.chart-header');
      expect(toolbar).toHaveClass('light');
    });
  });

  describe('下载功能测试', () => {
    it('应该处理下载按钮点击', () => {
      const onDownload = vi.fn();
      render(<ChartToolBar {...defaultProps} onDownload={onDownload} />);

      const downloadButton = screen.getByTestId('download-icon');
      fireEvent.click(downloadButton);

      expect(onDownload).toHaveBeenCalledTimes(1);
    });

    it('应该在没有 onDownload 回调时不执行任何操作', () => {
      render(<ChartToolBar {...defaultProps} />);

      const downloadButton = screen.getByTestId('download-icon');

      expect(() => {
        fireEvent.click(downloadButton);
      }).not.toThrow();
    });

    it('应该处理 onDownload 回调抛出错误的情况', () => {
      const onDownload = vi.fn().mockImplementation(() => {
        throw new Error('Download failed');
      });

      render(<ChartToolBar {...defaultProps} onDownload={onDownload} />);

      const downloadButton = screen.getByTestId('download-icon');

      expect(() => {
        fireEvent.click(downloadButton);
      }).toThrow('Download failed');
    });
  });

  describe('图标样式测试', () => {
    it('应该为时间图标应用正确的 className', () => {
      render(<ChartToolBar {...defaultProps} />);

      const timeIcon = screen.getByTestId('time-icon');
      expect(timeIcon).toHaveClass('time-icon');
    });

    it('应该为下载图标应用正确的 className', () => {
      render(<ChartToolBar {...defaultProps} />);

      const downloadIcon = screen.getByTestId('download-icon');
      expect(downloadIcon).toHaveClass('download-btn');
    });
  });

  describe('布局结构测试', () => {
    it('应该正确渲染头部结构', () => {
      render(<ChartToolBar {...defaultProps} />);

      const header = screen.getByText('测试图表').closest('.chart-header');
      expect(header).toBeInTheDocument();

      const titleSection = screen
        .getByText('测试图表')
        .closest('.header-title');
      expect(titleSection).toBeInTheDocument();

      const actionsSection = screen
        .getByTestId('time-icon')
        .closest('.header-actions');
      expect(actionsSection).toBeInTheDocument();
    });

    it('应该正确排列标题和操作区域', () => {
      render(<ChartToolBar {...defaultProps} />);

      const header = screen.getByText('测试图表').closest('.chart-header');
      const titleSection = screen
        .getByText('测试图表')
        .closest('.header-title');
      const actionsSection = screen
        .getByTestId('time-icon')
        .closest('.header-actions');

      expect(header).toContainElement(titleSection);
      expect(header).toContainElement(actionsSection);
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空标题', () => {
      render(<ChartToolBar {...defaultProps} title="" />);

      const titleSection = screen
        .getByTestId('time-icon')
        .closest('.header-title');
      expect(titleSection).toBeInTheDocument();
    });

    it('应该处理空数据时间', () => {
      render(<ChartToolBar {...defaultProps} dataTime="" />);

      expect(screen.getByText('数据时间: ')).toBeInTheDocument();
    });

    it('应该处理 undefined 数据时间', () => {
      render(<ChartToolBar {...defaultProps} dataTime={undefined} />);

      expect(
        screen.getByText('数据时间: 2025-06-30 00:00:00'),
      ).toBeInTheDocument();
    });

    it('应该处理 null 数据时间', () => {
      render(<ChartToolBar {...defaultProps} dataTime={null as any} />);

      expect(
        screen.getByText('数据时间: 2025-06-30 00:00:00'),
      ).toBeInTheDocument();
    });
  });

  describe('可访问性测试', () => {
    it('应该为下载按钮提供正确的可访问性', () => {
      render(<ChartToolBar {...defaultProps} />);

      const downloadButton = screen.getByTestId('download-icon');
      expect(downloadButton).toBeInTheDocument();
    });

    it('应该为时间图标提供正确的可访问性', () => {
      render(<ChartToolBar {...defaultProps} />);

      const timeIcon = screen.getByTestId('time-icon');
      expect(timeIcon).toBeInTheDocument();
    });
  });

  describe('性能测试', () => {
    it('应该处理长标题', () => {
      const longTitle =
        '这是一个非常长的图表标题，用来测试组件是否能正确处理长文本内容而不影响布局和性能';
      render(<ChartToolBar {...defaultProps} title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('应该处理特殊字符标题', () => {
      const specialTitle = '图表标题 <script>alert("test")</script> & 特殊字符';
      render(<ChartToolBar {...defaultProps} title={specialTitle} />);

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it('应该处理多次重新渲染', () => {
      const { rerender } = render(<ChartToolBar {...defaultProps} />);

      for (let i = 0; i < 10; i++) {
        rerender(<ChartToolBar {...defaultProps} title={`标题 ${i}`} />);
      }

      expect(screen.getByText('标题 9')).toBeInTheDocument();
    });
  });

  describe('类型定义测试', () => {
    it('应该正确导出类型定义', () => {
      // 测试类型是否正确导出
      const props: ChartToolBarProps = {
        title: '测试',
        dataTime: '2024-01-01',
        className: 'test-class',
        theme: 'dark',
        onDownload: vi.fn(),
      };

      expect(props.title).toBe('测试');
      expect(props.dataTime).toBe('2024-01-01');
      expect(props.className).toBe('test-class');
      expect(props.theme).toBe('dark');
      expect(typeof props.onDownload).toBe('function');
    });
  });

  describe('集成测试', () => {
    it('应该与父组件正确集成', () => {
      const ParentComponent = () => (
        <div>
          <ChartToolBar {...defaultProps} />
          <div>图表内容</div>
        </div>
      );

      render(<ParentComponent />);

      expect(screen.getByText('测试图表')).toBeInTheDocument();
      expect(screen.getByText('图表内容')).toBeInTheDocument();
    });

    it('应该处理多个工具栏实例', () => {
      render(
        <div>
          <ChartToolBar {...defaultProps} title="图表1" />
          <ChartToolBar {...defaultProps} title="图表2" />
        </div>,
      );

      expect(screen.getByText('图表1')).toBeInTheDocument();
      expect(screen.getByText('图表2')).toBeInTheDocument();
    });
  });
});
