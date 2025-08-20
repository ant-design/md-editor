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

export interface HistoryProps {
  agentId: string;
  standalone?: boolean;
  sessionId: string;
  /** 历史记录类型：'chat' | 'task' */
  type?: 'chat' | 'task';
  onInit?: () => void;
  onShow?: () => void;
  request: (params: { agentId: string }) => Promise<HistoryDataType[]>;
  /** @deprecated 请使用 onClick 替代 */
  onSelected?: (sessionId: string) => void;
  onClick?: (sessionId: string, item: HistoryDataType) => void;
  onDeleteItem?: (sessionId: string) => void;
  customDateFormatter?: (date: number | string | Date) => string;
  groupBy?: (item: HistoryDataType) => string;
  extra?: (item: HistoryDataType) => React.ReactElement;
  sessionSort?:
    | ((pre: HistoryDataType, current: HistoryDataType) => number | boolean)
    | false;
  /** 外部操作引用，用于触发 reload 等功能 */
  actionRef?: React.MutableRefObject<{
    reload: () => void;
  } | null>;
  /** Agent 模式配置 */
  agent?: {
    /** 是否启用 agent 模式 */
    enabled?: boolean;
    /** 搜索回调 */
    onSearch?: (keyword: string) => void;
    /** 收藏回调 */
    onFavorite?: (sessionId: string, isFavorite: boolean) => void;
    /** 多选回调 */
    onSelectionChange?: (selectedIds: string[]) => void;
    /** 查看更多回调 */
    onLoadMore?: () => void;
    /** 是否正在加载更多 */
    loadingMore?: boolean;
    /** 新对话回调 */
    onNewChat?: () => void;
    /** 正在运行的记录ID列表，这些记录将显示运行图标 */
    runningId?: string[];
  };
}

export interface HistoryActionsBoxProps {
  /** 子组件，通常是时间显示或其他内容 */
  children: React.ReactNode;
  /** 删除操作回调函数 */
  onDeleteItem?: () => void;
  /** 收藏操作回调函数 */
  /** Agent模式配置 */
  agent?: {
    /** 是否启用 agent 模式 */
    enabled?: boolean;
    /** 搜索回调 */
    onSearch?: (keyword: string) => void;
    /** 收藏回调 */
    onFavorite?: (sessionId: string, isFavorite: boolean) => void;
    /** 多选回调 */
    onSelectionChange?: (selectedIds: string[]) => void;
    /** 查看更多回调 */
    onLoadMore?: () => void;
    /** 是否正在加载更多 */
    loadingMore?: boolean;
  };
  /** 历史数据项 */
  item?: HistoryDataType;
  /** 收藏操作回调函数 */
  onFavorite?: (sessionId: string, isFavorite: boolean) => void;
}

/**
 * @deprecated 请使用 HistoryActionsBoxProps 替代
 */
export interface ActionsBoxProps extends HistoryActionsBoxProps {
  /** @deprecated 请使用 onClick 替代 */
  onSelected?: (sessionId: string) => void;
}
