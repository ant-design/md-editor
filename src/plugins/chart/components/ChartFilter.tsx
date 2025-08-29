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

  return (
    <div className={`filter-container ${theme} ${className}`}>
      {/* 地区筛选器 */}
      {customOptions && customOptions.length > 0 && <div className="region-filter">
        <Dropdown
          menu={{
            items: customOptions,
            onClick: ({ key }) => handleRegionChange(key),
          }}
          trigger={['click']}
        >
          <Button
            type="default"
            size="small"
            className="region-dropdown-btn"
          >
            <span>{customOptions.find(r => r.key === selectedCustionSelection)?.label || '全球'}</span>
            <DownOutlined className="dropdown-icon" />
          </Button>
        </Dropdown>
      </div>}

      <Segmented
        options={filterOptions}
        value={selectedFilter}
        size="small"
        className="segmented-filter custom-segmented"
        onChange={(value) => onFilterChange(value as string)}
      />
    </div>
  );
};

export default ChartFilter; 
