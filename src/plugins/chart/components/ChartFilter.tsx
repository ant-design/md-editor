import React from 'react';
import { Segmented, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './ChartFilter.less';

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
  selectedCustionSelection?: string;
  onSelectionChange?: (region: string) => void;
  className?: string;
  theme?: 'light' | 'dark';
}

const ChartFilter: React.FC<ChartFilterProps> = ({
  filterOptions,
  selectedFilter,
  onFilterChange,
  customOptions,
  selectedCustionSelection,
  onSelectionChange,
  className = '',
  theme = 'light',
}) => {
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

  return (
    <div className={`filter-container ${theme} ${className}`}>
      {/* 地区筛选器 */}
      {hasSecondary && <div className="region-filter">
        <Dropdown
          menu={{
            items: customOptions?.map((o) => ({ key: o.key, label: o.label })),
            onClick: ({ key }) => handleRegionChange(key),
          }}
          trigger={['click']}
          getPopupContainer={() => document.body}
        >
          <Button
            type="default"
            size="small"
            className="region-dropdown-btn"
          >
            <span>{customOptions?.find(r => r.key === selectedCustionSelection)?.label || customOptions?.[0]?.label || ''}</span>
            <DownOutlined className="dropdown-icon" />
          </Button>
        </Dropdown>
      </div>}

      {hasMain && (
        <Segmented
          options={filterOptions}
          value={selectedFilter}
          size="small"
          className="segmented-filter custom-segmented"
          onChange={(value) => onFilterChange(value as string)}
        />
      )}
    </div>
  );
};

export default ChartFilter; 
