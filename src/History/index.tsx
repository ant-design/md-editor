import {
  DeleteOutlined,
  HistoryOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  ConfigProvider,
  Input,
  Popconfirm,
  Popover,
  Space,
  Spin,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import useClickAway from '../hooks/useClickAway';
import { HistoryIcon } from '../icons/HistoryIcon';
import { ActionIconBox, BubbleConfigContext, useRefFunction } from '../index';
import { WhiteBoxProcessInterface } from '../ThoughtChainList';
import GroupMenu from './menu';

function NewChatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <rect width={16} height={16} rx={0} />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <path
          d="M12.198 7.487c.67 0 1.327-.203 1.888-.583.057.356.087.723.087 1.096 0 3.682-2.874 6.667-6.42 6.667a6.203 6.203 0 01-3.023-.784l-3.397.784.755-3.528A6.842 6.842 0 011.333 8c0-3.682 2.874-6.667 6.42-6.667.622 0 1.223.092 1.791.263a3.674 3.674 0 00-.803 2.301c0 1.983 1.547 3.59 3.457 3.59zM9.235 4.154l.81.312a2.77 2.77 0 011.605 1.666l.3.842.3-.842a2.77 2.77 0 011.605-1.666l.812-.312-.812-.312a2.77 2.77 0 01-1.604-1.666l-.3-.843-.3.843a2.77 2.77 0 01-1.605 1.666l-.811.312zM4.543 8c0 1.84 1.437 3.333 3.21 3.333s3.21-1.492 3.21-3.333H9.679c0 1.105-.862 2-1.926 2s-1.926-.895-1.926-2H4.543z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

function StarFilledIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <rect width={14} height={14} rx={0} />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <path
          d="M4.853 3.81L6.2 1.08q.246-.497.8-.497t.8.497l1.348 2.73q.152.308.492.358l3.013.44q.548.08.72.608.172.527-.226.915l-2.18 2.122q-.246.24-.188.58l.515 2.997q.096.547-.355.875-.452.328-.944.066l-2.691-1.415q-.304-.16-.609 0l-2.692 1.416q-.491.26-.942-.068-.45-.327-.354-.876l.514-2.995q.058-.34-.189-.58L.853 6.132q-.4-.386-.227-.916.172-.53.724-.608l3.01-.44q.34-.05.493-.358z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <rect width={14} height={14} rx={0} />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <path
          d="M4.853 3.81L6.2 1.08q.246-.497.8-.497t.8.497l1.348 2.73q.152.308.492.358l3.013.44q.548.08.72.608.172.527-.226.915l-2.18 2.122q-.246.24-.188.58l.515 2.997q.096.547-.355.875-.452.328-.944.066l-2.691-1.415q-.304-.16-.609 0l-2.692 1.416q-.491.26-.942-.068-.45-.327-.354-.876l.514-2.995q.058-.34-.189-.58L.853 6.132q-.4-.386-.227-.916.172-.53.724-.608l3.01-.44q.34-.05.493-.358zm1.046.517q-.424.857-1.37.995l-2.465.36 1.782 1.735q.687.669.525 1.613l-.42 2.451 2.202-1.158q.847-.445 1.694 0l2.203 1.159-.42-2.453q-.162-.943.524-1.612l1.781-1.734-2.465-.361q-.945-.139-1.368-.996L7 2.096 5.9 4.325z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

const formatTime = (time: number | string) => {
  //如果是今天
  if (dayjs().isSame(dayjs(time), 'day')) {
    return '今日';
  }
  if (dayjs().isSame(dayjs(time).add(1, 'day'), 'day')) {
    return '昨日';
  }
  if (dayjs().isSame(dayjs(time).add(7, 'day'), 'day')) {
    return '一周内';
  }
  //@ts-ignore 如果是昨天
  return dayjs(time)?.fromNow?.();
};

const groupByCategory = (list: any[], key: (item: any) => string) => {
  return list.reduce((prev, curr) => {
    const group = key(curr);
    if (!prev[group]) {
      prev[group] = [];
    }
    prev[group].push(curr);
    return prev;
  }, {});
};

const TimeBox: React.FC<{
  children: React.ReactNode;
  onDeleteItem?: () => void;
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
  item?: HistoryDataType;
  onFavorite?: (sessionId: string, isFavorite: boolean) => void;
}> = (props) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls();
  const { locale } = useContext(BubbleConfigContext) || {};
  const [isHover, setIsHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  return (
    <div
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        if (!open) {
          setIsHover(false);
        }
      }}
      style={{
        color: 'rgba(0, 0, 0, 0.25)',
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'max-content',
      }}
    >
      {isHover || props.agent?.enabled ? (
        <Space>
          {props.agent?.enabled && props.item && props.onFavorite && (
            <ActionIconBox
              scale
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onFavorite?.(
                  props.item!.sessionId!,
                  !props.item!.isFavorite,
                );
              }}
              title={props.item!.isFavorite ? '取消收藏' : '收藏'}
            >
              {props.item!.isFavorite ? (
                <StarFilledIcon
                  style={{
                    color: '#1D7AFC',
                  }}
                />
              ) : (
                <StarIcon
                  style={{
                    color: '--color-icon-secondary',
                  }}
                />
              )}
            </ActionIconBox>
          )}
          {props?.onDeleteItem && props.item && (
            <Popconfirm
              open={open}
              onOpenChange={(visible) => {
                setOpen(visible);
              }}
              getPopupContainer={() =>
                (document.getElementsByClassName(
                  `${prefixCls}-agent-chat-history-menu`,
                )[0] as HTMLDivElement) ||
                (document.getElementsByClassName(
                  `${prefixCls}-agent-chat`,
                )[0] as HTMLDivElement) ||
                document.body
              }
              placement="left"
              title={
                locale?.['chat.history.delete.popconfirm'] ||
                '确定删除该消息吗？'
              }
              onConfirm={(e) => {
                e?.stopPropagation();
                e?.preventDefault();
                props?.onDeleteItem?.();
              }}
              onCancel={(e) => {
                e?.stopPropagation();
                e?.preventDefault();
              }}
            >
              <ActionIconBox
                scale
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                title={locale?.['chat.history.delete'] || '删除'}
              >
                <DeleteOutlined />
              </ActionIconBox>
            </Popconfirm>
          )}
        </Space>
      ) : !props.agent?.enabled ? (
        props.children
      ) : (
        <span style={{ width: 24, height: 24 }}></span>
      )}
    </div>
  );
};

export type HistoryDataType = {
  /** 会话记录ID，自增主键 */
  id?: number | string;
  /** 租户ID */
  tenantId?: string;
  /** 会话标题 */
  sessionTitle?: React.ReactNode;
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
  onInit?: () => void;
  onShow?: () => void;
  request: (params: { agentId: string }) => Promise<HistoryDataType[]>;
  onSelected?: (sessionId: string) => void;
  onDeleteItem?: (sessionId: string) => void;
  customDateFormatter?: (date: number | string | Date) => string;
  groupBy?: (item: HistoryDataType) => string;
  extra?: (item: HistoryDataType) => React.ReactElement;
  sessionSort?:
    | ((pre: HistoryDataType, current: HistoryDataType) => number | boolean)
    | false;
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
  };
}

/**
 * History 组件 - 用于显示和管理聊天历史记录
 *
 * @component
 * @param {Object} props - 组件属性
 * @param {string} props.agentId - 代理ID，用于获取历史记录
 * @param {string} props.sessionId - 会话ID，变更时会触发数据重新获取
 * @param {Function} props.request - 请求函数，用于获取历史数据
 * @param {Function} [props.onInit] - 组件初始化时的回调函数
 * @param {Function} [props.onShow] - 组件显示时的回调函数
 * @param {Function} [props.onSelected] - 选择历史记录项时的回调函数
 * @param {Function} [props.onDeleteItem] - 删除历史记录项时的回调函数
 * @param {Function} [props.customDateFormatter] - 日期格式化函数
 * @param {boolean} [props.standalone] - 是否以独立模式显示，为true时直接显示菜单，否则显示为下拉菜单
 *
 * @returns {React.ReactElement|null} 返回历史记录组件或null（当没有历史记录时）
 *
 * @description
 * 该组件提供两种显示模式：
 * 1. 独立模式 (standalone=true)：直接显示为菜单列表
 * 2. 下拉菜单模式 (standalone=false)：显示为一个可点击的图标，点击后显示下拉菜单
 *
 * 历史记录按日期分组显示，每组内按时间倒序排列。
 * 支持查看历史会话和删除历史记录。
 */
export const History: React.FC<HistoryProps> = (props) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const menuPrefixCls = getPrefixCls('agent-chat-history-menu');
  const [open, setOpen] = useState(false);
  const [chatList, setChatList] = useState<HistoryDataType[]>(() => []);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filteredList, setFilteredList] = useState<HistoryDataType[]>([]);

  const loadHistory = useRefFunction(async () => {
    const msg = (await props
      .request({
        agentId: props.agentId,
      })
      .then((msg) => {
        return msg;
      })) as HistoryDataType[];
    setChatList(msg);
  });

  useEffect(() => {
    props.onInit?.();
    props.onShow?.();
  }, []);

  useEffect(() => {
    loadHistory();
  }, [props.sessionId]);

  // 搜索过滤逻辑
  useEffect(() => {
    if (!searchKeyword.trim()) {
      setFilteredList(chatList);
    } else {
      const filtered = chatList.filter((item) => {
        const title =
          typeof item.sessionTitle === 'string'
            ? item.sessionTitle
            : String(item.sessionTitle || '');
        return title.toLowerCase().includes(searchKeyword.toLowerCase());
      });
      setFilteredList(filtered);
    }
  }, [chatList, searchKeyword]);

  const groupList = useMemo(() => {
    return groupByCategory(filteredList || [], (item: HistoryDataType) => {
      if (props.groupBy) {
        return props.groupBy?.(item);
      }
      return formatTime(item.gmtCreate as number);
    });
  }, [filteredList, props.groupBy]);

  // 处理收藏
  const handleFavorite = useRefFunction(
    async (sessionId: string, isFavorite: boolean) => {
      await props.agent?.onFavorite?.(sessionId, isFavorite);
      // 更新本地状态
      setChatList((prev) =>
        prev.map((item) =>
          item.sessionId === sessionId ? { ...item, isFavorite } : item,
        ),
      );
    },
  );

  // 处理多选
  const handleSelectionChange = useRefFunction(
    (sessionId: string, checked: boolean) => {
      const newSelectedIds = checked
        ? [...selectedIds, sessionId]
        : selectedIds.filter((id) => id !== sessionId);

      setSelectedIds(newSelectedIds);
      props.agent?.onSelectionChange?.(newSelectedIds);
    },
  );

  // 处理搜索
  const handleSearch = useRefFunction((value: string) => {
    setSearchKeyword(value);
    props.agent?.onSearch?.(value);
  });

  // 处理加载更多
  const handleLoadMore = useRefFunction(async () => {
    await props.agent?.onLoadMore?.();
  });

  // 处理新对话
  const handleNewChat = useRefFunction(async () => {
    await props.agent?.onNewChat?.();
    setOpen(false);
  });

  const items =
    Object.keys(groupList).map((key) => {
      const list = groupList[key];
      return {
        type: 'group',
        //@ts-ignore
        label: props?.customDateFormatter
          ? props?.customDateFormatter(list?.at(0)?.gmtCreate)
          : formatTime(list?.at(0)?.gmtCreate),
        children: list
          ?.sort((a: any, b: any) => {
            if (props.sessionSort === false) {
              return true;
            }
            if (props.sessionSort) {
              return props.sessionSort(a, b);
            }
            return dayjs(b.gmtCreate).valueOf() - dayjs(a.gmtCreate).valueOf();
          })
          ?.map((item: any) => {
            return {
              key: item.sessionId,
              type: 'item',
              label: (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 8,
                    minWidth: 140,
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {props.agent?.enabled && (
                    <Checkbox
                      checked={selectedIds.includes(item.sessionId)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectionChange(item.sessionId, e.target.checked);
                      }}
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <div
                    style={{
                      color: '#666F8D',
                      overflow: 'hidden',
                      textWrap: 'nowrap',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}
                  >
                    <Tooltip
                      open={
                        (item.sessionTitle?.length || 10) > 10
                          ? undefined
                          : false
                      }
                      title={item.sessionTitle}
                    >
                      <div
                        style={{
                          width: 'max-content',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          props.onSelected?.(item.sessionId!);
                          setOpen(false);
                        }}
                      >
                        {item.sessionTitle}
                      </div>
                    </Tooltip>
                  </div>
                  <TimeBox
                    onDeleteItem={
                      props.onDeleteItem
                        ? async () => {
                            await props.onDeleteItem?.(item.sessionId!);
                            loadHistory();
                          }
                        : undefined
                    }
                    agent={props.agent}
                    item={item}
                    onFavorite={handleFavorite}
                  >
                    {dayjs(item.gmtCreate).format('HH:mm')}
                  </TimeBox>
                  {props.extra?.(item)}
                </div>
              ),
            } as any;
          }),
      } as any;
    }) || [];

  const containerRef = React.useRef<HTMLDivElement>(null);

  useClickAway(() => {
    setOpen(false);
  }, containerRef);
  const { locale } = useContext(BubbleConfigContext) || {};

  // Agent 模式下的搜索组件
  const SearchComponent = () => {
    const [loading, setLoading] = useState(false);

    if (!props.agent?.enabled) return null;
    if (!props.agent?.onSearch) return null;

    const handleSearchWithLoading = async (value: string) => {
      try {
        setLoading(true);
        await handleSearch(value);
      } catch (error) {
        // 处理错误
      } finally {
        setLoading(false);
      }
    };

    return (
      <Input
        placeholder="搜索历史记录..."
        suffix={loading ? <Spin size="small" /> : <SearchOutlined />}
        value={searchKeyword}
        onChange={(e) => handleSearchWithLoading(e.target.value)}
        allowClear
        variant="filled"
        disabled={loading}
      />
    );
  };

  // Agent 模式下的新对话按钮组件
  const NewChatComponent = () => {
    const [loading, setLoading] = useState(false);

    if (!props.agent?.enabled || !props.agent?.onNewChat) return null;

    return (
      <Button
        color="default"
        variant="filled"
        icon={<NewChatIcon />}
        loading={loading}
        onClick={async () => {
          try {
            setLoading(true);
            await handleNewChat();
            setLoading(false);
          } catch (error) {
          } finally {
            setLoading(false);
          }
        }}
        style={{
          justifyContent: 'flex-start',
          color: '#0068E8',
        }}
      >
        新对话
      </Button>
    );
  };

  // Agent 模式下的加载更多组件
  const LoadMoreComponent = () => {
    const [loading, setLoading] = useState(false);

    if (!props.agent?.enabled || !props.agent?.onLoadMore) return null;

    return (
      <Button
        type="text"
        variant="text"
        style={{
          color: 'rgba(0, 25, 61, 0.3255)',
          width: '100%',
        }}
        icon={<HistoryOutlined />}
        loading={loading}
        onClick={async () => {
          try {
            setLoading(true);
            await handleLoadMore();
            setLoading(false);
          } catch (error) {
            // 处理错误
          } finally {
            setLoading(false);
          }
        }}
      >
        查看更多
      </Button>
    );
  };

  if (props.standalone) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <NewChatComponent />
        <SearchComponent />
        <GroupMenu
          selectedKeys={[props.sessionId]}
          inlineIndent={20}
          items={items}
          className={menuPrefixCls}
        />
        <LoadMoreComponent />
      </div>
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      className={menuPrefixCls}
      style={{
        maxHeight: 'min(480px,100%)',
        overflow: 'auto',
        maxWidth: 'min(480px,100%)',
        borderRadius: 'inherit',
        border: '1px solid #f0f2f5',
      }}
      getPopupContainer={(p) => p.parentElement || document.body}
      content={
        <div>
          <SearchComponent />
          <NewChatComponent />
          <GroupMenu
            selectedKeys={[props.sessionId]}
            inlineIndent={20}
            items={items}
            className={menuPrefixCls}
          />
          <LoadMoreComponent />
        </div>
      }
    >
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          padding: 4,
          alignItems: 'center',
          fontSize: '0.85em',
          width: 'max-content',
        }}
        data-testid="history-button"
      >
        <ActionIconBox
          key="history"
          style={{
            color: '#666F8D',
            width: 24,
            height: 24,
          }}
          noPadding
          title={locale?.['chat.history'] || '历史记录'}
        >
          <HistoryIcon />
        </ActionIconBox>
      </div>
    </Popover>
  );
};

export { default as GroupMenu } from './menu';
export type { GroupMenuProps, MenuItemType } from './menu';
