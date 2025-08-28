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
  regionOptions?: RegionOption[];
  selectedRegion?: string;
  onRegionChange?: (region: string) => void;
  className?: string;
}

const ChartFilter: React.FC<ChartFilterProps> = ({
  filterOptions,
  selectedFilter,
  onFilterChange,
  regionOptions = [
    { key: 'global', label: '全球' },
    { key: 'china', label: '中国' },
    { key: 'us', label: '美国' },
    { key: 'eu', label: '欧洲' },
    { key: 'asia', label: '亚洲' },
    { key: 'africa', label: '非洲' },
    { key: 'oceania', label: '大洋洲' }
  ],
  selectedRegion = 'global',
  onRegionChange,
  className = '',
}) => {
  const handleRegionChange = (region: string) => {
    if (onRegionChange) {
      onRegionChange(region);
    }
  };

  return (
    <div className={`filter-container ${className}`}>
      {/* 地区筛选器 */}
      <div className="region-filter">
        <Dropdown
          menu={{
            items: regionOptions,
            onClick: ({ key }) => handleRegionChange(key),
          }}
          trigger={['click']}
        >
          <Button
            type="default"
            size="small"
            className="region-dropdown-btn"
          >
            <span>{regionOptions.find(r => r.key === selectedRegion)?.label || '全球'}</span>
            <DownOutlined className="dropdown-icon" />
          </Button>
        </Dropdown>
      </div>

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
