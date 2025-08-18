import { HistoryOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';

interface LoadMoreComponentProps {
  onLoadMore: () => void;
  enabled?: boolean;
}

/**
 * 加载更多组件 - 用于加载更多历史记录
 */
export const LoadMoreComponent: React.FC<LoadMoreComponentProps> = ({
  onLoadMore,
  enabled = false,
}) => {
  const [loading, setLoading] = useState(false);

  if (!enabled) return null;

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
