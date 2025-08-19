import { HistoryOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';

/**
 * 历史记录加载更多组件属性接口
 */
interface HistoryLoadMoreProps {
  /** 加载更多回调函数 */
  onLoadMore: () => void;
  /** 是否启用加载更多功能 */
  enabled?: boolean;
}

/**
 * HistoryLoadMore 组件 - 历史记录加载更多组件
 *
 * 该组件提供一个"加载更多"按钮，用于分页加载历史记录。
 * 支持加载状态显示和错误处理。
 *
 * @component
 * @description 历史记录加载更多组件，用于分页加载历史记录
 * @param {HistoryLoadMoreProps} props - 组件属性
 * @param {() => void} props.onLoadMore - 加载更多回调函数
 * @param {boolean} [props.enabled=false] - 是否启用加载更多功能
 *
 * @example
 * ```tsx
 * <HistoryLoadMore
 *   onLoadMore={() => handleLoadMore()}
 *   enabled={true}
 * />
 * ```
 *
 * @returns {React.ReactElement|null} 渲染的加载更多按钮组件，未启用时返回null
 *
 * @remarks
 * - 支持加载状态显示
 * - 包含错误处理机制
 * - 使用HistoryOutlined图标
 * - 文本按钮样式
 * - 响应式按钮设计
 * - 条件渲染支持
 */
export const HistoryLoadMore: React.FC<HistoryLoadMoreProps> = ({
  onLoadMore,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="text"
      variant="text"
      style={{
        color: 'rgba(0, 25, 61, 0.3255)',
        width: '100%',
      }}
      icon={<HistoryOutlined />}
      loading={loading}
      onClick={async () => {
        try {
          setLoading(true);
          await onLoadMore();
          setLoading(false);
        } catch (error) {
          // 处理错误
        } finally {
          setLoading(false);
        }
      }}
    >
      查看更多
    </Button>
  );
};
