import type { CSSProperties, ReactNode } from 'react';
import type { LayoutHeaderConfig } from '../components/LayoutHeader';

/**
 * ChatLayout 组件的属性接口
 */
export interface ChatLayoutProps {
  /** 头部配置 */
  header?: LayoutHeaderConfig;
  /** 内容区域的自定义内容 */
  children?: ReactNode;
  /** 底部区域的自定义内容 */
  footer?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
}

export interface ChatLayoutRef {
  scrollContainer: HTMLDivElement | null;
}
