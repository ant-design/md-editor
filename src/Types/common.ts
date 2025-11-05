import React from 'react';

/**
 * 基础样式属性
 * @description 用于需要自定义样式和类名的组件
 */
export interface BaseStyleProps {
  /**
   * 自定义 CSS 类名
   */
  className?: string;

  /**
   * 自定义 CSS 样式
   */
  style?: React.CSSProperties;
}

/**
 * 工具类型：表示值可以是 T 或 false
 * @description 用于条件渲染函数，false 表示不渲染
 */
export type WithFalse<T> = T | false;

/**
 * 角色类型
 * @description 消息发送者的角色类型
 */
export type RoleType = 'user' | 'system' | 'assistant' | 'agent' | 'bot';

/**
 * 反馈类型
 * @description 用户对消息的评价反馈类型
 */
export type FeedbackType = 'thumbsUp' | 'thumbsDown' | 'none';
