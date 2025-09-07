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
 * BubbleDemoCard - 为 Bubble 相关 demo 提供统一的卡片容器
 *
 * 该组件提供了一个带有指定样式的卡片容器，包含：
 * - 圆角设计 (20px)
 * - 浅色背景 (#FDFEFE)
 * - 双层阴影效果
 * - 固定宽度 (830px)
 * - Flex 布局
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
  // 卡片容器基础样式
  const cardStyle: React.CSSProperties = {
    /* 圆角-弹窗-base */
    borderRadius: '20px',
    /* gray/gray-背景-页面-浅 */
    background: '#FDFEFE',
    /* 投影-控件-base */
    boxShadow:
      '0px 0px 1px 0px rgba(0, 19, 41, 0.2), 0px 1.5px 4px -1px rgba(0, 19, 41, 0.04)',
    width: '830px',
    /* 自动布局 */
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '0px',
    zIndex: 0,
    margin: '24px auto',
    ...style,
  };

  return (
    <div style={cardStyle}>
      {/* 标题和描述区域 */}
      {(title || description) && (
        <div
          style={{
            padding: 16,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            boxSizing: 'border-box',
            borderWidth: '0px 0px 1px 0px',
            borderStyle: 'solid',
            borderColor: 'rgba(0, 16, 32, 0.0627)',
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

      {/* 卡片容器 */}
      <div className={className}>{children}</div>

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
