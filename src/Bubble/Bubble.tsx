import { memo, MutableRefObject } from 'react';

import React, { useMemo } from 'react';
import { AIBubble } from './AIBubble';
import { UserBubble } from './UserBubble';
import type { BubbleProps } from './type';

export const runRender = (
  render: any,
  props: BubbleProps,
  defaultDom:
    | string
    | number
    | boolean
    | Iterable<React.ReactNode>
    | React.JSX.Element
    | null
    | undefined,
  ...rest: undefined[]
) => {
  if (render) {
    return render(props, defaultDom, ...rest);
  }
  return defaultDom;
};

/**
 * Bubble 组件 - 聊天气泡组件（智能分发器）
 *
 * 该组件是聊天气泡的智能分发器，根据消息角色自动选择合适的子组件进行渲染。
 * - 用户消息（role: 'user'）使用 UserBubble 组件，采用右侧布局
 * - AI消息（其他角色）使用 AIBubble 组件，采用左侧布局，支持完整交互功能
 *
 * @component
 * @description 聊天气泡智能分发组件，根据消息角色自动选择渲染方式
 * @param {BubbleProps & {deps?: any[], bubbleRef?: MutableRefObject<any>}} props - 组件属性
 * @param {string} [props.placement] - 气泡位置，会被自动覆盖
 * @param {BubbleAvatarProps} [props.avatar] - 头像配置
 * @param {string | number | Date} [props.time] - 消息时间
 * @param {React.ReactNode} [props.children] - 消息内容
 * @param {string} [props.className] - 自定义CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {BubbleRenderConfig} [props.bubbleRenderConfig] - 气泡渲染配置
 * @param {BubbleClassNames} [props.classNames] - 自定义类名配置
 * @param {BubbleStyles} [props.styles] - 自定义样式配置
 * @param {Function} [props.onAvatarClick] - 头像点击回调
 * @param {any[]} [props.deps] - 依赖数组
 * @param {MutableRefObject} [props.bubbleRef] - 气泡引用
 * @param {MessageBubbleData} [props.originData] - 消息数据，包含角色信息
 *
 * @example
 * ```tsx
 * // 用户消息会自动使用 UserBubble
 * <Bubble
 *   originData={{ role: 'user', content: '你好' }}
 *   avatar={{ avatar: "user.jpg", title: "用户" }}
 * />
 *
 * // AI消息会自动使用 AIBubble
 * <Bubble
 *   originData={{ role: 'assistant', content: '你好！有什么可以帮助你的吗？' }}
 *   avatar={{ avatar: "ai.jpg", title: "AI助手" }}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的聊天气泡组件
 */
export const Bubble: React.FC<
  BubbleProps & {
    deps?: any[];
    bubbleRef?: MutableRefObject<any | undefined>;
  }
> = memo((props) => {
  // 根据角色自动选择组件
  const isUserMessage = useMemo(() => {
    if (props.placement === undefined) {
      return props.originData?.role === 'user';
    }
    return props.placement === 'right';
  }, [props.placement, props.originData?.role]);

  // 自动设置正确的 placement，确保类型安全
  const bubbleProps = {
    ...props,
    placement:
      props.placement ||
      ((isUserMessage ? 'right' : 'left') as 'left' | 'right'),
  };

  // 根据角色分发到对应的子组件
  if (isUserMessage) {
    return <UserBubble {...bubbleProps} />;
  }

  return <AIBubble {...bubbleProps} />;
});
