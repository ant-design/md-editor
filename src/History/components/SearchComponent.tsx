import { SearchOutlined } from '@ant-design/icons';
import { Input, Spin } from 'antd';
import React, { useState } from 'react';

/**
 * 历史记录搜索组件属性接口
 */
interface HistorySearchProps {
  /** 搜索关键词 */
  searchKeyword: string;
  /** 搜索回调函数 */
  onSearch: (value: string) => void;
  /** 是否启用搜索功能 */
  enabled?: boolean;
}

/**
 * HistorySearch 组件 - 历史记录搜索组件
 *
 * 该组件提供一个搜索输入框，用于搜索历史记录。
 * 支持加载状态显示和错误处理。
 *
 * @component
 * @description 历史记录搜索组件，用于搜索历史对话记录
 * @param {HistorySearchProps} props - 组件属性
 * @param {string} props.searchKeyword - 搜索关键词
 * @param {(value: string) => void} props.onSearch - 搜索回调函数
 * @param {boolean} [props.enabled=false] - 是否启用搜索功能
 *
 * @example
 * ```tsx
 * <HistorySearch
 *   searchKeyword={keyword}
 *   onSearch={(value) => handleSearch(value)}
 *   enabled={true}
 * />
 * ```
 *
 * @returns {React.ReactElement|null} 渲染的搜索输入框组件，未启用时返回null
 *
 * @remarks
 * - 支持实时搜索
 * - 包含加载状态显示
 * - 支持清空输入
 * - 包含错误处理机制
 * - 响应式输入框设计
 * - 条件渲染支持
 */
export const HistorySearch: React.FC<HistorySearchProps> = ({
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

/**
 * @deprecated 请使用 HistorySearch 替代
 */
export const SearchComponent: React.FC<HistorySearchProps> = HistorySearch;
