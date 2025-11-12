import React, { useContext } from 'react';
import { I18nContext } from '../../I18n';
import { HistoryEmptyIcon } from './HistoryEmptyIcon';

/**
 * HistoryEmpty 组件 - 历史记录空状态展示
 *
 * 当历史记录列表为空时显示的占位组件，提供友好的空状态提示
 *
 * @component
 *
 * @example
 * ```tsx
 * // 使用默认配置
 * <HistoryEmpty />
 * ```
 *
 * @returns {React.ReactElement} 渲染的空状态组件
 */
export const HistoryEmpty: React.FC = () => {
  const { locale } = useContext(I18nContext);

  const defaultTitle =
    locale?.['chat.history.empty.chat.title'] || '找不到相关结果';

  const defaultDescription =
    locale?.['chat.history.empty.chat.description'] || '换个关键词试试吧';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 24px',
        textAlign: 'center',
        marginTop: 12,
      }}
    >
      <HistoryEmptyIcon />
      <div
        style={{
          font: 'var(--font-text-h6-base)',
          color: 'var(--color-gray-text-secondary)',
          letterSpacing: 'var(--letter-spacing-h6-base, normal)',
          marginBottom: 2,
        }}
      >
        {defaultTitle}
      </div>
      <div
        style={{
          font: 'var(--font-text-body-base)',
          letterSpacing: 'var(--letter-spacing-body-base, normal)',
          color: 'var(--color-gray-text-light)',
        }}
      >
        {defaultDescription}
      </div>
    </div>
  );
};
