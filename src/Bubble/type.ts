import { TooltipProps } from 'antd';
import type { MotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { MarkdownEditorProps } from '../MarkdownEditor';
import { AttachmentFile } from '../MarkdownInputField/FileMapView';
import { WhiteBoxProcessInterface } from '../ThoughtChainList';
import { BubbleExtraProps } from './MessagesContent/BubbleExtra';
import { DocInfoListProps } from './MessagesContent/DocInfo';

/**
 * 基础样式属性
 */
export interface BubbleStyleProps {
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
 * 气泡项样式属性
 */
export interface BubbleItemStyleProps extends BubbleStyleProps {
  styles?: {
    /**
     * 内容的自定义样式
     */
    bubbleListItemContentStyle?: React.CSSProperties;

    /**
     * 标题的自定义样式
     */
    bubbleListItemTitleStyle?: React.CSSProperties;

    /**
     * 头像的自定义样式
     */
    bubbleListItemAvatarStyle?: React.CSSProperties;

    /**
     * 额外内容的自定义样式
     */
    bubbleListItemExtraStyle?: React.CSSProperties;
  };

  classNames?: {
    /**
     * 内容的自定义类名
     */
    bubbleListItemContentClassName?: string;

    /**
     * 标题的自定义类名
     */
    bubbleListItemTitleClassName?: string;

    /**
     * 头像的自定义类名
     */
    bubbleListItemAvatarClassName?: string;
  };
}

/**
 * 气泡元数据
 */
export interface BubbleMetaData {
  /**
   * 角色头像
   */
  avatar?: string;

  /**
   * 背景色
   */
  backgroundColor?: string;

  /**
   * 名称
   */
  title?: string;

  /**
   * 其他元数据
   */
  [key: string]: any;
}

/**
 * 消息数据
 */
export interface MessageBubbleData<
  T extends Record<string, any> = Record<string, any>,
> {
  /**
   * @title 内容
   * @description 消息的显示内容，可以是React元素
   * @example <div>Hello, world!</div>
   */
  content: React.ReactNode;

  /**
   * @title 原始内容
   * @description 消息的原始文本内容，通常用于存储未经处理的文本
   * @example "Hello, world!"
   */
  originContent?: string;

  /**
   * @title 错误信息
   * @description 消息处理过程中可能出现的错误
   * @example { code: "ERROR_CODE", message: "发生了错误" }
   */
  error?: any;

  /**
   * @title 模型标识
   * @description 生成此消息的AI模型标识符
   * @example "gpt-4"
   */
  model?: string;

  /**
   * @title 名称
   * @description 消息发送者的名称
   * @example "用户小明"
   */
  name?: string;

  /**
   * @title 父消息ID
   * @description 当前消息回复的消息ID，用于构建消息树结构
   * @example "msg_123456"
   */
  parentId?: string;

  /**
   * @title 角色
   * @description 消息发送者的角色，如用户、助手等
   * @example "user" 或 "assistant"
   */
  role: 'user' | 'system' | 'assistant' | 'agent' | 'bot';

  /**
   * @title 创建时间
   * @description 消息创建的时间戳（毫秒）
   * @example 1625097600000
   */
  createAt: number;

  /**
   * @title 消息结束时间
   * @description 消息生成或接收完成的时间戳（毫秒）
   * @example 1625097605000
   */
  endTime?: number;

  /**
   * @title 唯一标识
   * @description 消息的唯一标识符
   * @example "msg_abcdef123456"
   */
  id: string;

  /**
   * @title 修改时间
   * @description 消息最后修改的时间戳（毫秒）
   * @example 1625097610000
   */
  updateAt: number;

  /**
   * @title 附加数据
   * @description 消息的额外信息，可以包含多种自定义数据
   */
  extra?: T & {
    /**
     * @title 白盒处理过程
     * @description 模型处理过程的可解释性数据
     */
    white_box_process?: WhiteBoxProcessInterface[] | WhiteBoxProcessInterface;

    /**
     * @title 聊天跟踪ID
     * @description 用于追踪整个对话流程的ID
     * @example "trace_xyz789"
     */
    chat_trace_id?: string;

    /**
     * @title 会话ID
     * @description 当前会话的唯一标识符
     * @example "session_123abc"
     */
    sessionId?: string;

    /**
     * @title 消息UUID
     * @description 消息的全局唯一标识符
     * @example "uuid_456def"
     */
    uuid?: string;

    /**
     * @title 客户端ID
     * @description 问答对的客户端标识符
     * @example "client_789ghi"
     */
    clientId?: string;

    /**
     * @title 标签列表
     * @description 消息的分类标签
     * @example ["NORMAL", "ABOUT_YOU"]
     */
    tags?: ('REJECT_TO_ANSWER' | 'ABOUT_YOU' | 'NORMAL')[];
  };

  /**
   * @title 模型元数据
   * @description 有关生成此消息的模型的额外信息
   * @example { model: "gpt-4", temperature: 0.7, tokens: { total: 150, prompt: 50, completion: 100 } }
   */
  meta?: BubbleMetaData;

  /**
   * @title 是否完成
   * @description 标识消息是否已完全生成或接收完成
   * @example true
   */
  isFinished?: boolean;

  /**
   * @title 是否被终止
   * @description 标识消息生成是否被中途终止
   * @example false
   */
  isAborted?: boolean;

  /**
   * @title 用户反馈
   * @description 用户对消息的评价反馈
   * - thumbsUp: 点赞，表示满意
   * - thumbsDown: 点踩，表示不满意
   * - none: 无反馈
   * @example "thumbsUp"
   */
  feedback?: 'thumbsUp' | 'thumbsDown' | 'none';

  /**
   * @title 是否重试
   * @description 标识当前消息是否是之前消息的重试
   * @example false
   */
  isRetry?: boolean;

  /**
   * @title 文件映射
   * @description 消息相关的附件文件映射
   * @example new Map([["file1", { name: "示例.pdf", size: 1024, type: "application/pdf" }]])
   */
  fileMap?: Map<string, AttachmentFile>;
}

/**
 * 自定义配置
 */
export interface CustomConfig {
  /**
   * 提示框配置
   */
  TooltipProps?: TooltipProps;

  /**
   * 弹出框配置
   */
  PopoverProps?: {
    titleStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
  };
}

export type WithFalse<T> = T | false;

/**
 * 气泡渲染配置
 */
export interface BubbleRenderConfig<T = Record<string, any>> {
  titleRender?: WithFalse<
    (props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode
  >;
  contentRender?: WithFalse<
    (props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode
  >;
  contentAfterRender?: WithFalse<
    (props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode
  >;
  contentBeforeRender?: WithFalse<
    (props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode
  >;
  avatarRender?: WithFalse<
    (props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode
  >;
  customConfig?: CustomConfig;
  render?: WithFalse<
    (
      props: BubbleProps<T>,
      domsMap: {
        avatar: ReactNode;
        title: ReactNode;
        messageContent: ReactNode;
        itemDom: ReactNode;
      },
      defaultDom: ReactNode,
    ) => ReactNode
  >;
  extraRender?: WithFalse<
    (props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode
  >;
  bubbleRightExtraRender?: BubbleExtraProps['render'];
}

/**
 * 气泡组件属性
 */
export interface BubbleProps<T = Record<string, any>>
  extends BubbleItemStyleProps {
  /**
   * 动画配置
   */
  animation?: MotionProps;

  /**
   * 消息时间
   */
  time?: number;

  /**
   * 头像元数据
   */
  avatar?: BubbleMetaData;

  /**
   * 是否启用纯净模式
   */
  pure?: boolean;

  /**
   * 渲染配置
   */
  bubbleRenderConfig?: BubbleRenderConfig<T>;

  /**
   * 是否加载中
   */
  loading?: boolean;

  /**
   * 头像点击事件
   */
  onAvatarClick?: () => void;

  /**
   * 双击事件
   */
  onDoubleClick?: () => void;

  /**
   * 放置位置
   */
  placement?: 'left' | 'right';

  /**
   * 原始数据
   */
  originData?: T & MessageBubbleData;

  /**
   * 是否为最后一条消息
   */
  isLast?: boolean;

  /**
   * 消息ID
   */
  id?: string;

  /**
   * 列表引用
   */
  bubbleListRef?: any;

  /**
   * 是否只读
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
   * 不喜欢回调
   */
  onDisLike?: (
    bubble: MessageBubbleData<Record<string, any>>,
  ) => Promise<void> | void;

  /**
   * 喜欢回调
   */
  onLike?: (
    bubble: MessageBubbleData<Record<string, any>>,
  ) => Promise<void> | void;

  /**
   * 回复回调
   */
  onReply?: (message: string) => void;

  /**
   * 幻灯片模式配置
   */
  slidesModeProps?: {
    enable?: boolean;
    afterOpenChange?: (message: MessageBubbleData<Record<string, any>>) => void;
  };

  /**
   * 文档列表配置
   */
  docListProps?: DocInfoListProps & {
    enable?: boolean;
  };

  /**
   * 额外内容渲染
   */
  extraRender?: WithFalse<
    (props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode
  >;

  /**
   * 气泡引用
   */
  bubbleRef?: any;

  /**
   * 取消点赞的回调函数
   * @description 当用户点击取消点赞按钮时触发
   * @callback
   * @optional
   */
  onCancelLike?: (e: BubbleProps['originData']) => void;

  /**
   * 控制复制按钮的显示
   * @description 控制复制按钮是否显示的函数或布尔值
   * - 如果传入函数，则调用函数判断是否显示，函数接收 bubble 作为参数
   * - 如果传入布尔值，则直接使用该值控制显示
   * - 如果未传入（undefined），则使用默认逻辑判断
   * @param bubble - 聊天项的数据对象
   * @returns 是否显示复制按钮
   * @optional
   */
  shouldShowCopy?: boolean | ((bubble: BubbleExtraProps['bubble']) => boolean);
}
