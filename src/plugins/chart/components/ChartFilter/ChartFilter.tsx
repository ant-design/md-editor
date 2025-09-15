import { DownOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Dropdown, Segmented } from 'antd';
import classNames from 'classnames';
import { default as React, useContext } from 'react';
import { useStyle } from './style';

export interface FilterOption {
  label: string;
  value: string;
}

export interface RegionOption {
  key: string;
  label: string;
}

export interface ChartFilterProps {
  filterOptions?: FilterOption[];
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
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
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('chart-filter');
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
    <div
      className={classNames(
        prefixCls,
        `${prefixCls}-${theme}`,
        hashId,
        className,
      )}
    >
      {/* 地区筛选器，统一逻辑，只有可选时才显示 */}
      {customOptions && customOptions.length > 1 && (
        <div className={classNames(`${prefixCls}-region-filter`, hashId)}>
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
            <Button
              type="default"
              size="small"
              className={classNames(`${prefixCls}-region-dropdown-btn`, hashId)}
            >
              <span>
                {customOptions.find((r) => r.key === selectedCustomSelection)
                  ?.label || '全球'}
              </span>
              <DownOutlined
                className={classNames(`${prefixCls}-dropdown-icon`, hashId)}
              />
            </Button>
          </Dropdown>
        </div>
      )}

      {filterOptions && filterOptions.length > 1 && <Segmented
        options={filterOptions || []}
        value={selectedFilter}
        size="small"
        className={classNames(
          `${prefixCls}-segmented-filter`,
          'custom-segmented',
          hashId,
        )}
        onChange={(value) => onFilterChange?.(value as string)}
      />}
    </div>,
  );
};

export default ChartFilter;
