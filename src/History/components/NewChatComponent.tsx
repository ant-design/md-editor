import { Button } from 'antd';
import React, { useState } from 'react';
import { NewChatIcon } from '../icons';

interface NewChatComponentProps {
  onNewChat: () => void;
  enabled?: boolean;
}

/**
 * 新对话组件 - 用于创建新的对话
 */
export const NewChatComponent: React.FC<NewChatComponentProps> = ({
  onNewChat,
  enabled = false,
}) => {
  const [loading, setLoading] = useState(false);

  if (!enabled) return null;

  return (
    <Button
      color="primary"
      variant="filled"
      icon={<NewChatIcon />}
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
      style={{
        justifyContent: 'flex-start',
      }}
    >
      新对话
    </Button>
  );
};
