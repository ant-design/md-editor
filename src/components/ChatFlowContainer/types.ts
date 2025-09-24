import type { CSSProperties, ReactNode } from 'react';

/**
 * ChatFlowContainer 组件的属性接口
 */
export interface ChatFlowContainerProps {
  /** 标题文本 */
  title?: string;
  /** 是否显示左侧折叠按钮 */
  showLeftCollapse?: boolean;
  /** 是否显示右侧折叠按钮 */
  showRightCollapse?: boolean;
  /** 是否显示分享按钮 */
  showShare?: boolean;
  /** 左侧折叠按钮点击事件 */
  onLeftCollapse?: () => void;
  /** 右侧折叠按钮点击事件 */
  onRightCollapse?: () => void;
  /** 分享按钮点击事件 */
  onShare?: () => void;
  /** 内容区域的自定义内容 */
  children?: ReactNode;
  /** 底部区域的自定义内容 */
  footer?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
}
