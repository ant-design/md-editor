import { theme } from 'antd';
import React from 'react';
import { MessageBubbleData } from '../type';

export const EXCEPTION = ({
  extra,
  content,
  ...props
}: {
  extra: React.ReactNode;
  content: string;
  originData?: Record<string, any> & MessageBubbleData<Record<string, any>>;
}) => {
  const { token } = theme.useToken();
  return (
    <>
      <div
        style={{
          color: token.colorError,
          lineHeight: '24px',
          padding: '12px 20px',
          wordBreak: 'break-all',
          textWrap: 'wrap',
        }}
      >
        {content}
      </div>
      {extra}
    </>
  );
};
