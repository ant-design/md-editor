import { TooltipProps } from 'antd';
import { MutableRefObject, ReactNode } from 'react';
import { MarkdownEditorProps } from '../../index';
import { BubbleProps, ChatMessage, WithFalse } from '../type';
import { DocInfoListProps } from './DocInfo';

/**
 * 聊天项的自定义配置接口
 * @interface CustomConfig
 */
export interface CustomConfig {
  /**
   * 提示框配置
   * @description 用于配置聊天项中的提示框属性
   * @optional
   */
  TooltipProps?: TooltipProps;

  /**
   * 弹出框配置
   * @description 用于配置聊天项中的弹出框属性
   */
  PopoverProps?: {
    /**
     * 弹出框标题的样式
     * @description 用于自定义弹出框标题的样式
     * @optional
     */
    titleStyle?: React.CSSProperties;

    /**
     * 弹出框内容的样式
     * @description 用于自定义弹出框内容的样式
     * @optional
     */
    contentStyle?: React.CSSProperties;
  };
}

/**
 * MessageComponent 的属性接口
 */
export interface MessageComponentProps extends BubbleProps {
  /**
   * 消息内容
   * @description 可以是字符串或 React 节点
   */
  content: string | ReactNode;

  /**
   * 聊天列表的引用
   */
  chatListRef: any;

  /**
   * 是否为只读模式
   * @description 当设置为 true 时，所有操作按钮将被禁用
   * @default false
   */
  readonly?: boolean;

  /**
   * Markdown 渲染配置
   */
  markdownRenderConfig?: MarkdownEditorProps;

  /**
   * 自定义配置
   */
  customConfig?: CustomConfig;

  /**
   * 依赖项数组
   */
  deps?: any[];

  /**
   * 聊天实例的引用
   */
  chatRef: MutableRefObject<any | undefined>;

  /** 点击不喜欢按钮时的回调, 异步时通过抛出异常保持按钮的状态不变 */
  onDisLike?: (
    bubble: ChatMessage<Record<string, any>>,
  ) => Promise<void> | void;
  /** 点击喜欢按钮时的回调, 异步时通过抛出异常保持按钮的状态不变 */
  onLike?: (bubble: ChatMessage<Record<string, any>>) => Promise<void> | void;
  /** 回复消息的回调 */
  onReply?: (message: string) => void;

  slidesModeProps?: {
    /** 是否启用幻灯片模式 */
    enable?: boolean;
    /** 幻灯片切换后的回调 */
    afterOpenChange?: (message: ChatMessage<Record<string, any>>) => void;
  };

  /**
   * 文档列表配置
   * @example
   * <BubbleChat docListProps={{ enable: true, onOriginUrlClick:()=> window.open() }} />
   */
  docListProps?: DocInfoListProps & {
    enable?: boolean;
  };
  /**
   * 额外内容的渲染函数
   */
  extraRender?: WithFalse<
    (props: BubbleProps, defaultDom: ReactNode) => ReactNode
  >;

  /**
   * 聊天项额外操作区域的样式
   */
  chatListItemExtraStyle?: React.CSSProperties;
}
