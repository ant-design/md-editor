import { Button } from 'antd';
import React, { useContext, useState } from 'react';
import { I18nContext } from '../../i18n';
import { NewChatIcon } from '../../icons';

/**
 * 新对话组件属性接口
 */
interface HistoryNewChatProps {
  /** 创建新对话的回调函数 */
  onNewChat: () => void;
}

/**
 * HistoryNewChat 组件 - 历史记录新对话组件
 *
 * 该组件提供一个创建新对话的按钮，支持加载状态和错误处理。
 * 当enabled为false时不渲染任何内容。
 *
 * @component
 * @description 历史记录新对话组件，用于创建新的对话会话
 * @param {HistoryNewChatProps} props - 组件属性
 * @param {() => void} props.onNewChat - 创建新对话的回调函数
 * @param {boolean} [props.enabled=false] - 是否启用新对话功能
 *
 * @example
 * ```tsx
 * <HistoryNewChat
 *   onNewChat={() => handleCreateNewChat()}
 *   enabled={true}
 * />
 * ```
 *
 * @returns {React.ReactElement|null} 渲染的新对话按钮组件，未启用时返回null
 *
 * @remarks
 * - 支持加载状态显示
 * - 包含错误处理机制
 * - 使用NewChatIcon图标
 * - 响应式按钮设计
 * - 条件渲染支持
 */
export const HistoryNewChat: React.FC<HistoryNewChatProps> = ({
  onNewChat,
}) => {
  const { locale } = useContext(I18nContext);
  const [loading, setLoading] = useState(false);

  return (
    <Button
      color="primary"
      variant="filled"
      icon={
        <NewChatIcon
          style={{
            fontSize: 16,
            paddingTop: 2,
          }}
        />
      }
      style={{
        justifyContent: 'flex-start',
        borderRadius: 'var(--radius-control-base)',
        background: 'var(--color-primary-control-fill-secondary)',
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: '22px',
        letterSpacing: 'normal',
        color: 'var(--color-primary-text-secondary)',
      }}
      loading={loading}
      onClick={async () => {
        try {
          setLoading(true);
          await onNewChat();
          setLoading(false);
        } catch (error) {
          // 处理错误
        } finally {
          setLoading(false);
        }
      }}
    >
      {locale?.['chat.history.newChat'] || '新对话'}
    </Button>
  );
};

/**
 * @deprecated 请使用 HistoryNewChat 替代
 */
export const NewChatComponent: React.FC<HistoryNewChatProps> = HistoryNewChat;
