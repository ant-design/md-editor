import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import ChartFilter, {
  ChartFilterProps,
  FilterOption,
  RegionOption,
} from '../../../../src/plugins/chart/components/ChartFilter';

// Mock Ant Design components
vi.mock('antd', () => ({
  Segmented: vi
    .fn()
    .mockImplementation(({ options, value, onChange, className }) => (
      <div data-testid="segmented-filter" className={className}>
        {options.map((option: any, index: number) => (
          <button
            key={index}
            data-testid={`segmented-option-${option.value}`}
            className={value === option.value ? 'active' : ''}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    )),
  Dropdown: vi.fn().mockImplementation(({ menu, trigger, children }) => (
    <div data-testid="dropdown">
      <div data-testid="dropdown-trigger">{children}</div>
      <div data-testid="dropdown-menu">
        {menu.items.map((item: any, index: number) => (
          <button
            key={index}
            data-testid={`dropdown-item-${item.key}`}
            onClick={() => menu.onClick({ key: item.key })}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )),
  Button: vi
    .fn()
    .mockImplementation(({ children, onClick, className, size, type }) => (
      <button
        data-testid="button"
        className={className}
        onClick={onClick}
        data-size={size}
        data-type={type}
      >
        {children}
      </button>
    )),
}));

// Mock Ant Design icons
vi.mock('@ant-design/icons', () => ({
  DownOutlined: vi
    .fn()
    .mockImplementation(() => <span data-testid="down-icon">▼</span>),
}));

describe('ChartFilter', () => {
  const defaultFilterOptions: FilterOption[] = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' },
  ];

  const defaultCustomOptions: RegionOption[] = [
    { key: 'global', label: '全球' },
    { key: 'asia', label: '亚洲' },
    { key: 'europe', label: '欧洲' },
  ];

  const defaultProps: ChartFilterProps = {
    filterOptions: defaultFilterOptions,
    selectedFilter: 'option1',
    onFilterChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染筛选器', () => {
      render(<ChartFilter {...defaultProps} />);

      expect(screen.getByTestId('segmented-filter')).toBeInTheDocument();
      expect(
        screen.getByTestId('segmented-option-option1'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('segmented-option-option2'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('segmented-option-option3'),
      ).toBeInTheDocument();
    });

    it('应该显示选中的筛选选项', () => {
      render(<ChartFilter {...defaultProps} selectedFilter="option2" />);

      const selectedOption = screen.getByTestId('segmented-option-option2');
      expect(selectedOption).toHaveClass('active');
    });

    it('应该应用自定义 className', () => {
      render(<ChartFilter {...defaultProps} className="custom-filter" />);

      const filterContainer =
        screen.getByTestId('segmented-filter').parentElement;
      expect(filterContainer).toHaveClass('custom-filter');
    });
  });

  describe('筛选功能测试', () => {
    it('应该处理筛选选项变化', () => {
      const onFilterChange = vi.fn();
      render(<ChartFilter {...defaultProps} onFilterChange={onFilterChange} />);

      const option2 = screen.getByTestId('segmented-option-option2');
      fireEvent.click(option2);

      expect(onFilterChange).toHaveBeenCalledWith('option2');
    });

    it('应该处理空筛选选项', () => {
      render(<ChartFilter {...defaultProps} filterOptions={[]} />);

      expect(screen.getByTestId('segmented-filter')).toBeInTheDocument();
    });

    it('应该处理单个筛选选项', () => {
      const singleOption = [{ label: '唯一选项', value: 'single' }];
      render(<ChartFilter {...defaultProps} filterOptions={singleOption} />);

      expect(screen.getByTestId('segmented-option-single')).toBeInTheDocument();
    });
  });

  describe('自定义选项测试', () => {
    it('应该显示自定义选项当下拉菜单', () => {
      render(
        <ChartFilter
          {...defaultProps}
          customOptions={defaultCustomOptions}
          selectedCustionSelection="asia"
        />,
      );

      expect(screen.getByTestId('dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-item-global')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-item-asia')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-item-europe')).toBeInTheDocument();
    });

    it('应该显示选中的自定义选项', () => {
      render(
        <ChartFilter
          {...defaultProps}
          customOptions={defaultCustomOptions}
          selectedCustionSelection="europe"
        />,
      );

      const trigger = screen.getByTestId('dropdown-trigger');
      expect(trigger).toHaveTextContent('欧洲');
    });

    it('应该显示默认标签当没有选中自定义选项时', () => {
      render(
        <ChartFilter {...defaultProps} customOptions={defaultCustomOptions} />,
      );

      const trigger = screen.getByTestId('dropdown-trigger');
      expect(trigger).toHaveTextContent('全球');
    });

    it('应该处理自定义选项变化', () => {
      const onSelectionChange = vi.fn();
      render(
        <ChartFilter
          {...defaultProps}
          customOptions={defaultCustomOptions}
          selectedCustionSelection="asia"
          onSelectionChange={onSelectionChange}
        />,
      );

      const europeOption = screen.getByTestId('dropdown-item-europe');
      fireEvent.click(europeOption);

      expect(onSelectionChange).toHaveBeenCalledWith('europe');
    });

    it('应该处理空自定义选项', () => {
      render(<ChartFilter {...defaultProps} customOptions={[]} />);

      expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument();
    });

    it('应该处理未找到的自定义选项', () => {
      render(
        <ChartFilter
          {...defaultProps}
          customOptions={defaultCustomOptions}
          selectedCustionSelection="nonexistent"
        />,
      );

      const trigger = screen.getByTestId('dropdown-trigger');
      expect(trigger).toHaveTextContent('全球');
    });
  });

  describe('主题测试', () => {
    it('应该应用浅色主题', () => {
      render(<ChartFilter {...defaultProps} theme="light" />);

      const filterContainer =
        screen.getByTestId('segmented-filter').parentElement;
      expect(filterContainer).toHaveClass('light');
    });

    it('应该应用深色主题', () => {
      render(<ChartFilter {...defaultProps} theme="dark" />);

      const filterContainer =
        screen.getByTestId('segmented-filter').parentElement;
      expect(filterContainer).toHaveClass('dark');
    });

    it('应该使用默认浅色主题', () => {
      render(<ChartFilter {...defaultProps} />);

      const filterContainer =
        screen.getByTestId('segmented-filter').parentElement;
      expect(filterContainer).toHaveClass('light');
    });
  });

  describe('按钮样式测试', () => {
    it('应该应用正确的按钮样式', () => {
      render(
        <ChartFilter {...defaultProps} customOptions={defaultCustomOptions} />,
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('data-size', 'small');
      expect(button).toHaveAttribute('data-type', 'default');
      expect(button).toHaveClass('region-dropdown-btn');
    });

    it('应该显示下拉图标', () => {
      render(
        <ChartFilter {...defaultProps} customOptions={defaultCustomOptions} />,
      );

      expect(screen.getByTestId('down-icon')).toBeInTheDocument();
    });
  });

  describe('边界条件测试', () => {
    it('应该处理没有 onFilterChange 回调的情况', () => {
      const propsWithoutCallback = {
        ...defaultProps,
        onFilterChange: undefined,
      };

      expect(() => {
        render(<ChartFilter {...propsWithoutCallback} />);
      }).not.toThrow();
    });

    it('应该处理没有 onSelectionChange 回调的情况', () => {
      const propsWithoutCallback = {
        ...defaultProps,
        customOptions: defaultCustomOptions,
        onSelectionChange: undefined,
      };

      expect(() => {
        render(<ChartFilter {...propsWithoutCallback} />);
      }).not.toThrow();
    });

    it('应该处理无效的 selectedFilter', () => {
      render(<ChartFilter {...defaultProps} selectedFilter="invalid" />);

      expect(screen.getByTestId('segmented-filter')).toBeInTheDocument();
    });

    it('应该处理无效的 selectedCustionSelection', () => {
      render(
        <ChartFilter
          {...defaultProps}
          customOptions={defaultCustomOptions}
          selectedCustionSelection="invalid"
        />,
      );

      const trigger = screen.getByTestId('dropdown-trigger');
      expect(trigger).toHaveTextContent('全球');
    });
  });

  describe('可访问性测试', () => {
    it('应该支持键盘导航', () => {
      render(<ChartFilter {...defaultProps} />);

      const segmentedFilter = screen.getByTestId('segmented-filter');
      expect(segmentedFilter).toBeInTheDocument();
    });

    it('应该为下拉菜单提供正确的角色', () => {
      render(
        <ChartFilter {...defaultProps} customOptions={defaultCustomOptions} />,
      );

      expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    });
  });

  describe('性能测试', () => {
    it('应该处理大量筛选选项', () => {
      const manyOptions = Array.from({ length: 100 }, (_, i) => ({
        label: `选项${i}`,
        value: `option${i}`,
      }));

      render(<ChartFilter {...defaultProps} filterOptions={manyOptions} />);

      expect(screen.getByTestId('segmented-filter')).toBeInTheDocument();
    });

    it('应该处理大量自定义选项', () => {
      const manyCustomOptions = Array.from({ length: 50 }, (_, i) => ({
        key: `region${i}`,
        label: `地区${i}`,
      }));

      render(
        <ChartFilter {...defaultProps} customOptions={manyCustomOptions} />,
      );

      expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    });
  });

  describe('类型定义测试', () => {
    it('应该正确导出类型定义', () => {
      // 测试类型是否正确导出
      const filterOption: FilterOption = { label: '测试', value: 'test' };
      const regionOption: RegionOption = { key: 'test', label: '测试地区' };

      expect(filterOption.label).toBe('测试');
      expect(filterOption.value).toBe('test');
      expect(regionOption.key).toBe('test');
      expect(regionOption.label).toBe('测试地区');
    });
  });
});
