import { WhiteBoxProcessInterface } from '../../ThoughtChainList';

export type HistoryDataType = {
  /** 会话记录ID，自增主键 */
  id?: number | string;
  /** 租户ID */
  tenantId?: string;
  /** 会话标题 */
  sessionTitle?: React.ReactNode;
  /** 会话描述/副标题 */
  description?: React.ReactNode;
  /** 会话图标 */
  icon?: React.ReactNode;
  /** ai agent ID */
  agentId?: string;
  /** 会话唯一标识 */
  sessionId?: string;
  /** 记录创建时间 */
  gmtCreate?: number | string;
  /** 最近对话时间 */
  gmtLastConverse?: number | string;
  /** 是否收藏 */
  isFavorite?: boolean;
  /** 是否选中（多选模式） */
  isSelected?: boolean;
};

export type HistoryChatType = {
  /** 问答对状态：median中值，thumbsUp赞,thumbsDown踩 */
  feedback?: string;
  /** 租户ID */
  tenantId?: string;
  /** ai agent ID */
  agentId?: string;
  /** 提问内容 */
  questionContent?: {
    /** 角色 */
    role?: string;
    /** 内容 */
    content?: string;
    /** 内容类型 */
    contentType?: string;
  };
  /** 回答内容 */
  answerContent?: {
    /** 角色 */
    role?: string;
    /** 内容 */
    content?: string;
    /** 内容类型 */
    contentType?: string;
    /**
     * 白盒处理
     * @description 仅在白盒模式下生效
     */
    white_box_process?: WhiteBoxProcessInterface[];
  };
  /** 会话唯一标识 */
  sessionId?: string;
  /** 客户ID */
  clientId?: string;
  /** 记录创建时间 */
  gmtCreate?: string | number;
};
