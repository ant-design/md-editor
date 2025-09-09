import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Segmented } from 'antd';
import React from 'react';
import { useStyle } from './ChartFilter.style';

export interface FilterOption {
  label: string;
  value: string;
}

export interface RegionOption {
  key: string;
  label: string;
}

export interface ChartFilterProps {
  filterOptions: FilterOption[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  customOptions?: RegionOption[];
  selectedCustomSelection?: string;
  onSelectionChange?: (region: string) => void;
  className?: string;
  theme?: 'light' | 'dark';
}

const ChartFilter: React.FC<ChartFilterProps> = ({
  filterOptions,
  selectedFilter,
  onFilterChange,
  customOptions,
  selectedCustomSelection,
  onSelectionChange,
  className = '',
  theme = 'light',
}) => {
  const prefixCls = 'filter-container';
  const { wrapSSR, hashId } = useStyle(prefixCls);

  const handleRegionChange = (region: string) => {
    if (onSelectionChange) {
      onSelectionChange(region);
    }
  };

  const hasMain = Array.isArray(filterOptions) && filterOptions.length > 1;
  const hasSecondary = Array.isArray(customOptions) && customOptions.length > 1;

  if (!hasMain && !hasSecondary) {
    return null;
  }

  return wrapSSR(
    <div className={`${prefixCls} ${hashId} ${theme} ${className}`}>
      {/* 地区筛选器 */}
      {customOptions && customOptions.length > 1 && (
        <div className="region-filter">
          <Dropdown
            menu={{
              items: customOptions.map((item) => {
                return {
                  key: item.key,
                  label: item.label,
                  disabled: item.key === selectedCustomSelection,
                };
              }),
              onClick: ({ key }) => handleRegionChange(key),
            }}
            trigger={['click']}
            getPopupContainer={() => document.body}
          >
            <Button type="default" size="small" className="region-dropdown-btn">
              <span>
                {customOptions.find((r) => r.key === selectedCustomSelection)
                  ?.label || '全球'}
              </span>
              <DownOutlined className="dropdown-icon" />
            </Button>
          </Dropdown>
        </div>
      )}

      {hasMain && (
        <Segmented
          options={filterOptions}
          value={selectedFilter}
          size="small"
          className="segmented-filter custom-segmented"
          onChange={(value) => onFilterChange(value as string)}
        />
      )}
    </div>,
  );
};

export default ChartFilter;
