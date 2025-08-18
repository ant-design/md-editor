import { SearchOutlined } from '@ant-design/icons';
import { Input, Spin } from 'antd';
import React, { useState } from 'react';

interface SearchComponentProps {
  searchKeyword: string;
  onSearch: (value: string) => void;
  enabled?: boolean;
}

/**
 * 搜索组件 - 用于搜索历史记录
 */
export const SearchComponent: React.FC<SearchComponentProps> = ({
  searchKeyword,
  onSearch,
  enabled = false,
}) => {
  const [loading, setLoading] = useState(false);

  if (!enabled) return null;

  const handleSearchWithLoading = async (value: string) => {
    try {
      setLoading(true);
      await onSearch(value);
    } catch (error) {
      // 处理错误
    } finally {
      setLoading(false);
    }
  };

  return (
    <Input
      placeholder="搜索历史记录..."
      suffix={loading ? <Spin size="small" /> : <SearchOutlined />}
      value={searchKeyword}
      onChange={(e) => handleSearchWithLoading(e.target.value)}
      allowClear
      variant="filled"
      disabled={loading}
    />
  );
};
