import React from 'react';
import { Logo } from './logo';

export const ChatContainer = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-modal-base)',
        background: 'var(--color-gray-bg-page-light)',
        boxShadow: 'var(--shadow-control-base)',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: 12,
          borderBottom: '1px solid rgba(0, 16, 32, 0.0627)',
        }}
      >
        <Logo style={{ color: '#E4E6EA' }} />
        <div
          style={{
            width: '124px',
            height: '16px',
            background:
              'linear-gradient(90deg, rgba(0, 16, 64, 0.06) 0%, rgba(0, 16, 64, 0.04) 100%)',
            borderRadius: '200px',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};
