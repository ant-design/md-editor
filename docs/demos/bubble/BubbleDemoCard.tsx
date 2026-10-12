import React from 'react';

export interface BubbleDemoCardProps {
  /**
   * 卡片标题
   */
  title?: string;

  /**
   * 卡片描述
   */
  description?: string;

  /**
   * 卡片内容
   */
  children: React.ReactNode;

  /**
   * 自定义样式
   */
  style?: React.CSSProperties;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 是否显示代码示例
   */
  showCodeExample?: boolean;

  /**
   * 代码示例内容
   */
  codeExample?: string;
}

/**
 * 为 Bubble 相关 demo 提供响应式内容容器、说明和可选代码示例。
 *
 * @param props - 组件属性
 * @returns 渲染的卡片容器组件
 */
export const BubbleDemoCard: React.FC<BubbleDemoCardProps> = ({
  title,
  description,
  children,
  style,
  className,
  showCodeExample = false,
  codeExample,
}) => {
  const cardStyle: React.CSSProperties = {
    width: 'min(830px,100%)',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    ...style,
  };

  return (
    <div className={className} style={cardStyle}>
      {/* 标题和描述区域 */}
      {(title || description) && (
        <div
          style={{
            padding: '0 24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            boxSizing: 'border-box',
          }}
        >
          {title && (
            <span
              style={{
                fontSize: 13,
                color: 'rgba(0,0,0,0.45)',
              }}
            >
              {title}
            </span>
          )}
          {description && (
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
              {description}
            </div>
          )}
        </div>
      )}

      {children}

      {/* 代码示例区域 */}
      {showCodeExample && codeExample && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: '#f5f5f5',
            borderRadius: 8,
            fontSize: 12,
          }}
        >
          <strong>💻 代码示例：</strong>
          <pre style={{ margin: '8px 0 0 0', overflow: 'auto' }}>
            {codeExample}
          </pre>
        </div>
      )}
    </div>
  );
};

export default BubbleDemoCard;
