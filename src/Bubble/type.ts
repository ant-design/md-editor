import { TooltipProps } from 'antd';
import type { MotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { MarkdownEditorProps } from '../MarkdownEditor';
import { AttachmentFile } from '../MarkdownInputField/FileMapView';
import { WhiteBoxProcessInterface } from '../ThoughtChainList';
import { BubbleExtraProps } from './MessagesContent/BubbleExtra';
import { DocInfoListProps } from './MessagesContent/DocInfo';

export interface ChatMessage<
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

export interface BubbleMetaData {
  /**
   * 角色头像
   * @description 可选参数，如果不传则使用默认头像
   */
  avatar?: string;
  /**
   *  背景色
   * @description 可选参数，如果不传则使用默认背景色
   */
  backgroundColor?: string;
  /**
   * 名称
   * @description 可选参数，如果不传则使用默认名称
   */
  title?: string;

  /**
   * 附加数据
   * @description 可选参数，如果不传则使用默认名称
   */
  [key: string]: any;
}
/**
 * 将类型 T 与 false 联合的类型
 * @template T 任意类型
 * @example
 * type Result = WithFalse<string>; // string | false
 */
export type WithFalse<T> = T | false;

/**
 * 聊天项组件的属性接口
 * @template T 扩展的额外数据类型，默认为 Record<string, any>
 * @interface BubbleProps
 */
export interface BubbleProps<T = Record<string, any>> {
  /**
   * 动画配置
   * @description framer-motion 动画配置
   */
  animation?: MotionProps;

  /**
   * 消息内容
   * @description 可以是字符串或 React 节点
   */
  time?: number;

  /**
   * 头像的元数据
   * @description 包含头像相关的所有信息，如头像URL、名称等
   * @required
   */
  avatar: BubbleMetaData;

  /**
   * 是否启用纯净模式
   * @description 启用后将移除阴影和边框，适用于需要更简洁界面的场景
   * @default false
   */
  pure?: boolean;

  /**
   * 聊天项组件的自定义渲染配置
   * @description 提供各个子组件的自定义渲染函数
   */
  bubbleRenderConfig?: {
    /**
     * 标题组件的自定义渲染函数
     * @param props - 聊天项的所有属性
     * @param defaultDom - 默认的标题 DOM 节点
     * @returns 自定义的标题 React 节点
     */
    titleRender?: WithFalse<
      (props: BubbleProps, defaultDom: ReactNode) => ReactNode
    >;

    /**
     * 内容组件的自定义渲染函数
     * @param props - 聊天项的所有属性
     * @param defaultDom - 默认的内容 DOM 节点
     * @returns 自定义的内容 React 节点
     */
    contentRender?: WithFalse<
      (props: BubbleProps, defaultDom: ReactNode) => ReactNode
    >;

    /**
     * 操作组件的自定义渲染函数
     * @param props - 聊天项的所有属性
     * @param defaultDom - 默认的操作区域 DOM 节点
     * @returns 自定义的操作区域 React 节点
     */
    contentAfterRender?: WithFalse<
      (props: BubbleProps, defaultDom: ReactNode) => ReactNode
    >;

    /**
     * 前置组件的自定义渲染函数
     * @param props - 聊天项的所有属性
     * @param defaultDom - 默认的前置内容 DOM 节点
     * @returns 自定义的前置内容 React 节点
     */
    contentBeforeRender?: WithFalse<
      (props: BubbleProps, defaultDom: ReactNode) => ReactNode
    >;

    /**
     * 头像组件的自定义渲染函数
     * @param props - 聊天项的所有属性
     * @param defaultDom - 默认的头像 DOM 节点
     * @returns 自定义的头像 React 节点
     */
    avatarRender?: WithFalse<
      (props: BubbleProps, defaultDom: ReactNode) => ReactNode
    >;

    /**
     * 聊天项的自定义配置
     * @description 包含提示框、弹出框等配置项
     */
    customConfig?: CustomConfig;

    /**
     * 聊天项组件的自定义渲染函数
     * @param props - 聊天项的所有属性
     * @param domsMap - 包含所有子组件的 DOM 节点映射
     * @param defaultDom - 默认的聊天项 DOM 节点
     * @returns 自定义的聊天项 React 节点
     */
    render?: WithFalse<
      (
        props: BubbleProps,
        domsMap: {
          avatar: ReactNode;
          title: ReactNode;
          messageContent: ReactNode;
          itemDom: ReactNode;
        },
        defaultDom: ReactNode,
      ) => ReactNode
    >;

    /**
     * 额外内容的自定义渲染函数
     * @param props - 聊天项的所有属性
     * @param defaultDom - 默认的额外内容 DOM 节点
     * @returns 自定义的额外内容 React 节点
     */
    extraRender?: WithFalse<
      (props: BubbleProps, defaultDom: ReactNode) => ReactNode
    >;

    /**
     * 右侧额外内容的自定义渲染函数
     * @description 用于渲染聊天项右侧的额外内容
     */
    bubbleRightExtraRender?: BubbleExtraProps['render'];
  };

  /**
   * 聊天项的自定义 CSS 类名
   * @description 用于自定义聊天项容器的样式类名
   * @optional
   */
  className?: string;

  /**
   * 聊天项是否处于加载状态
   * @description 当设置为 true 时，显示加载动画
   * @default false
   * @optional
   */
  loading?: boolean;

  /**
   * 头像点击事件的回调函数
   * @description 当用户点击头像时触发
   * @callback
   * @optional
   */
  onAvatarClick?: () => void;

  /**
   * 双击事件的回调函数
   * @description 当用户双击聊天项时触发
   * @callback
   * @optional
   */
  onDoubleClick?: () => void;

  /**
   * 聊天项的放置位置
   * @description 控制聊天项在对话中的显示位置
   * @default 'left'
   * @optional
   */
  placement?: 'left' | 'right';

  /**
   * 聊天项组件的自定义 CSS 样式
   * @description 用于自定义聊天项容器的样式
   * @optional
   */
  style?: React.CSSProperties;

  /**
   * 与聊天项关联的额外数据
   * @description 包含消息的原始数据和其他扩展信息
   * @optional
   */
  originData?: T & ChatMessage;

  /**
   * 聊天项内容的自定义 CSS 样式
   * @description 用于自定义消息内容的样式
   * @optional
   */
  chatListItemContentStyle?: React.CSSProperties;

  /**
   * 聊天项标题的自定义 CSS 样式
   * @description 用于自定义标题的样式
   * @optional
   */
  chatListItemTitleStyle?: React.CSSProperties;

  /**
   * 聊天项头像的自定义 CSS 样式
   * @description 用于自定义头像的样式
   * @optional
   */
  chatListItemAvatarStyle?: React.CSSProperties;

  /**
   * 聊天项额外内容的自定义 CSS 样式
   * @description 用于自定义额外内容的样式
   * @optional
   */
  chatListItemExtraStyle?: React.CSSProperties;

  /**
   * 聊天项内容的自定义 CSS 类名
   * @description 用于自定义消息内容的样式类名
   * @optional
   */
  chatListItemContentClassName?: string;

  /**
   * 聊天项标题的自定义 CSS 类名
   * @description 用于自定义标题的样式类名
   * @optional
   */
  chatListItemTitleClassName?: string;

  /**
   * 聊天项头像的自定义 CSS 类名
   * @description 用于自定义头像的样式类名
   * @optional
   */
  chatListItemAvatarClassName?: string;

  /**
   * 是否为最后一条消息
   * @description 用于标识当前消息是否为对话中的最后一条
   * @optional
   */
  isLast?: boolean;

  /**
   * 聊天项的唯一标识
   * @description 用于标识和定位特定的聊天项
   * @optional
   */
  id?: string;

  /**
   * 聊天列表的引用
   * @description 用于访问聊天列表的 DOM 元素
   * @optional
   */
  chatListRef?: any;

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

  chatRef?: any;
}

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
