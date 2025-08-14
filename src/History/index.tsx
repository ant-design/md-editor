import { DeleteOutlined } from '@ant-design/icons';
import {
  ConfigProvider,
  Dropdown,
  Menu,
  Popconfirm,
  Space,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import useClickAway from '../hooks/useClickAway';
import { HistoryIcon } from '../icons/HistoryIcon';
import { ActionIconBox, BubbleConfigContext, useRefFunction } from '../index';
import { WhiteBoxProcessInterface } from '../ThoughtChainList';

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
      }}
    >
      {isHover && props?.onDeleteItem ? (
        <Space>
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
              locale?.['chat.history.delete.popconfirm'] || '确定删除该消息吗？'
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
              borderLess
              title={locale?.['chat.history.delete'] || '删除'}
              type="primary"
            >
              <DeleteOutlined />
            </ActionIconBox>
          </Popconfirm>
        </Space>
      ) : (
        props.children
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

  const groupList = useMemo(() => {
    return groupByCategory(chatList || [], (item: HistoryDataType) => {
      if (props.groupBy) {
        return props.groupBy?.(item);
      }
      return dayjs(item.gmtCreate).format('YYYY-MM-DD');
    });
  }, [chatList, props.groupBy]);

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
                    marginLeft: props.standalone ? -12 : -8,
                  }}
                >
                  <Tooltip
                    open={
                      (item.sessionTitle?.length || 10) > 10 ? undefined : false
                    }
                    title={item.sessionTitle}
                  >
                    <div
                      style={{
                        color: '#666F8D',
                        maxWidth: 'max(173px,calc(100% - 64px))',
                        overflow: 'hidden',
                        textWrap: 'nowrap',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
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
                  <TimeBox
                    onDeleteItem={
                      props.onDeleteItem
                        ? async () => {
                            await props.onDeleteItem?.(item.sessionId!);
                            loadHistory();
                          }
                        : undefined
                    }
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

  if (props.standalone) {
    return (
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              colorBgTextHover: '#F0F2F5',
              itemBorderRadius: 2,
              itemSelectedBg: '#F0F2F5',
            },
          },
        }}
      >
        <Menu
          selectedKeys={[props.sessionId]}
          inlineIndent={20}
          items={items}
          className={menuPrefixCls}
        />
      </ConfigProvider>
    );
  }

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      menu={{
        items: items,
        className: menuPrefixCls,
        style: {
          maxHeight: 'min(480px,100%)',
          overflow: 'auto',
          maxWidth: 'min(480px,100%)',
          borderRadius: 'inherit',
          border: '1px solid #f0f2f5',
        },
      }}
      getPopupContainer={(p) => {
        return p.parentElement || document.body;
      }}
      trigger={['click']}
    >
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          padding: 4,
          alignItems: 'center',
          fontSize: '0.85em',
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
    </Dropdown>
  );
};
