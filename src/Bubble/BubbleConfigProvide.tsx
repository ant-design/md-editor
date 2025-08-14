import React from 'react';
import { BubbleProps } from './type';
import { ThoughtChainListProps } from '../ThoughtChainList';

export type ChatConfigType = {
  agentId?: string;
  sessionId?: string;
  standalone: boolean;
  clientIdRef?: React.MutableRefObject<string>;
  thoughtChain?: {
    enable?: boolean;
    alwaysRender?: boolean;
    render?: (
      bubble: BubbleProps<Record<string, any>>,
      taskList: string,
    ) => React.ReactNode;
  } & ThoughtChainListProps;
  tracert?: {
    /**
     * 是否开启
     */
    enable: boolean;
  };
  locale: {
    'chat.inputArea.placeholder': string;
    'chat.inputArea.max_input_length': string;
    'chat.list.helloMessage': string;
    'chat.newsession.popconfirm': string;
    'chat.newsession': string;
    'chat.close': string;
    'chat.history': string;
    'chat.history.delete': string;
    'chat.history.delete.popconfirm': string;
    'chat.message.thinking': string;
    'chat.message.error': string;
    'chat.message.error.retry': string;
    'chat.message.timeout': string;
    'chat.message.retrySend': string;
    'chat.message.aborted': string;
    'chat.message.copy': string;
    'chat.message.copy.success': string;
    'chat.message.copy.error': string;
    'chat.message.like': string;
    'chat.message.cancel-like': string;
    'chat.message.feedback-success': string;
    'chat.message.dislike': string;
    'chat.message.exception': string;
    'chat.helloMessage.pre_hello_text': string;
  };
  bubble?: BubbleProps<{
    /**
     * 聊天内容
     */
    content: string;
    /**
     * 聊天项的唯一标识
     */
    uuid: number;
  }>;
  compact?: boolean;
};

export const zhCN: ChatConfigType['locale'] = {
  'chat.inputArea.placeholder': '请输入问题',
  'chat.inputArea.max_input_length': '输入内容过长，请控制在1000字以内',
  'chat.list.helloMessage': '您好，我是您的专属客服，有什么可以帮助您的吗？',
  'chat.newsession.popconfirm': '您确定要结束当前会话吗？',
  'chat.newsession': '新建会话',
  'chat.history': '历史记录',
  'chat.close': '关闭',
  'chat.history.delete': '删除',
  'chat.history.delete.popconfirm': '确认删除该消息吗？',
  'chat.message.error': '消息发送失败,请稍后重试',
  'chat.message.exception': '消息发送失败,请稍后重试',
  'chat.message.error.retry': '重试',
  'chat.message.timeout': '消息发送超时,请稍后重试',
  'chat.message.retrySend': '重新生成',
  'chat.message.aborted': '回答已停止生成',
  'chat.message.copy': '复制',
  'chat.message.copy.success': '复制成功',
  'chat.message.copy.error': '复制失败',
  'chat.message.like': '喜欢',
  'chat.message.cancel-like': '取消点赞',
  'chat.message.feedback-success': '已经反馈过了哦',
  'chat.message.dislike': '不喜欢',
  'chat.helloMessage.pre_hello_text': '您好，我是',
  'chat.message.thinking': '思考中',
};

export const enUS: ChatConfigType['locale'] = {
  'chat.inputArea.placeholder':
    'Please enter a question or "/" to get the template',
  'chat.inputArea.max_input_length':
    'Input content is too long, please keep it under 1000 characters',
  'chat.list.helloMessage':
    'Hello, I am your dedicated customer service, how can I help you?',
  'chat.close': 'Close',
  'chat.newsession.popconfirm':
    'Are you sure you want to end the current session?',
  'chat.newsession': 'New session',
  'chat.history': 'History',
  'chat.history.delete': 'Deleting',
  'chat.history.delete.popconfirm': 'Confirm deletion of this message?',
  'chat.message.error': 'Message delivery failed, please try again later',
  'chat.message.exception': 'Message delivery failed, please try again later',
  'chat.message.retrySend': 'Re-generate',
  'chat.message.aborted': 'Answer has stopped being generated',
  'chat.message.copy': 'Copying',
  'chat.message.copy.success': 'Copying was successful',
  'chat.message.like': 'Like',
  'chat.message.cancel-like': 'Cancel Like',
  'chat.message.feedback-success': 'Feedback has been received.',
  'chat.message.dislike': 'Dislike',
  'chat.helloMessage.pre_hello_text': 'Hello',
  'chat.message.error.retry': 'Retry',
  'chat.message.timeout': 'Message delivery timeout, please try again later.',
  'chat.message.copy.error': 'Copy Failure',
  'chat.message.thinking': 'thinking',
};

export const BubbleConfigContext = React.createContext<
  ChatConfigType | undefined
>({
  standalone: false,
  locale: zhCN,
});
