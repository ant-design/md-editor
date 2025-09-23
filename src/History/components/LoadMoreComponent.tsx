import {
  EllipsisOutlined,
  HistoryOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import React, { useContext, useState } from 'react';
import { I18nContext } from '../../i18n';
/**
 * 历史记录加载更多组件属性接口
 */
interface HistoryLoadMoreProps {
  /** 加载更多回调函数 */
  onLoadMore: () => void;
  /** 是否启用加载更多功能 */
  enabled?: boolean;
  /** 历史记录类型 */
  type?: 'chat' | 'task';
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
 *   type="task"
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
  type,
}) => {
  const { locale } = useContext(I18nContext);
  const [loading, setLoading] = useState(false);

  const onClickFn = async () => {
    try {
      setLoading(true);
      await onLoadMore();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {type === 'task' ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginRight: 8,
            fontSize: 'var(--font-text-body-base)',
            letterSpacing: 'var(--letter-spacing-body-base, normal)',
            color: 'var(--color-gray-text-default)',
            padding: '0 12px',
            cursor: 'pointer',
          }}
          onClick={onClickFn}
        >
          <div
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '8px',
              gap: '10px',
              borderRadius: '200px',
              background: 'var(--color-gray-bg-card-light)',
              marginRight: 8,
            }}
          >
            {loading ? <LoadingOutlined /> : <EllipsisOutlined />}
          </div>
          {locale?.['task.history.loadMore'] || '查看更多历史'}
        </div>
      ) : (
        <Button
          type="text"
          variant="text"
          style={{
            fontSize: 'var(--font-text-body-base)',
            letterSpacing: 'var(--letter-spacing-body-base, normal)',
            color: 'var(--color-gray-text-light)',
            width: '100%',
            borderRadius: 'var(--radius-control-base)',
          }}
          icon={<HistoryOutlined />}
          loading={loading}
          onClick={onClickFn}
        >
          {locale?.['chat.history.loadMore'] || '查看更多'}
        </Button>
      )}
    </>
  );
};
