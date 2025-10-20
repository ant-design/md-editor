import { ChevronUp, CircleDashed, SuccessFill, X } from '@sofa-design/icons';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { useMergedState } from 'rc-util';
import React, { memo, useCallback, useContext, useMemo } from 'react';
import { ActionIconBox } from '../components/ActionIconBox';
import { I18nContext } from '../i18n';
import { LoadingLottie } from './LoadingLottie';
import { useStyle } from './style';

type ThoughtChainProps = {
  items: {
    key: string;
    title?: string;
    content: React.ReactNode | React.ReactNode[];
    status: 'success' | 'pending' | 'loading' | 'error';
  }[];
  className?: string;
  /** 受控模式：指定当前展开的任务项 key 数组 */
  expandedKeys?: string[];
  /** 受控模式：展开状态变化时的回调函数 */
  onExpandedKeysChange?: (expandedKeys: string[]) => void;
};

const TaskListItem = memo(
  ({
    item,
    isLast,
    prefixCls,
    hashId,
    expandedKeys,
    onToggle,
  }: {
    item: {
      key: string;
      title?: string;
      content: React.ReactNode | React.ReactNode[];
      status: 'success' | 'pending' | 'loading' | 'error';
    };
    isLast: boolean;
    prefixCls: string;
    hashId: string;
    expandedKeys: string[];
    onToggle: (key: string) => void;
  }) => {
    const { locale } = useContext(I18nContext);
    const isCollapsed = !expandedKeys.includes(item.key);

    const hasContent = useMemo(() => {
      if (Array.isArray(item.content)) {
        return item.content.length > 0;
      }
      return !!item.content;
    }, [item.content]);

    return (
      <div
        key={item.key}
        className={classNames(`${prefixCls}-thoughtChainItem`, hashId)}
        data-testid="task-list-thoughtChainItem"
      >
        <div
          className={classNames(`${prefixCls}-left`, hashId)}
          onClick={() => onToggle(item.key)}
          data-testid="task-list-left"
        >
          <div
            className={classNames(
              `${prefixCls}-status`,
              `${prefixCls}-status-${item.status}`,
              hashId,
            )}
            data-testid={`task-list-status-${item.status}`}
          >
            {item.status === 'success' ? <SuccessFill /> : null}
            {item.status === 'loading' ? <LoadingLottie size={16} /> : null}
            {item.status === 'pending' ? (
              <div className={classNames(`${prefixCls}-status-idle`, hashId)}>
                <CircleDashed />
              </div>
            ) : null}
            {item.status === 'error' ? <X /> : null}
          </div>
          <div className={classNames(`${prefixCls}-content-left`, hashId)}>
            {!isLast && (
              <div
                className={classNames(`${prefixCls}-dash-line`, hashId)}
                data-testid="task-list-dash-line"
              ></div>
            )}
          </div>
        </div>
        <div className={classNames(`${prefixCls}-right`, hashId)}>
          <div
            className={classNames(`${prefixCls}-top`, hashId)}
            onClick={() => onToggle(item.key)}
          >
            <div className={classNames(`${prefixCls}-title`, hashId)}>
              {item.title}
            </div>
            {hasContent && (
              <div
                className={classNames(`${prefixCls}-arrowContainer`, hashId)}
                onClick={() => onToggle(item.key)}
                data-testid="task-list-arrowContainer"
              >
                <ActionIconBox
                  title={
                    !isCollapsed
                      ? locale?.['taskList.collapse'] || '收起'
                      : locale?.['taskList.expand'] || '展开'
                  }
                  iconStyle={{
                    transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                  }}
                  loading={false}
                  onClick={() => onToggle(item.key)}
                >
                  <ChevronUp
                    className={classNames(`${prefixCls}-arrow`, hashId)}
                    data-testid="task-list-arrow"
                  />
                </ActionIconBox>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className={classNames(`${prefixCls}-body`, hashId)}>
              <div className={classNames(`${prefixCls}-content`, hashId)}>
                {item.content}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);

TaskListItem.displayName = 'TaskListItem';

/**
 * TaskList 组件 - 任务列表组件
 *
 * 该组件显示任务列表，支持任务的展开/折叠、状态管理等功能。
 * 每个任务项显示标题、内容等信息，支持点击交互和动画效果。
 * 支持受控和非受控两种模式。
 *
 * @component
 * @description 任务列表组件，显示任务列表和状态管理
 * @param {ThoughtChainProps} props - 组件属性
 * @param {TaskItem[]} props.items - 任务列表数据
 * @param {string} [props.className] - 自定义CSS类名
 * @param {string[]} [props.expandedKeys] - 受控模式：指定当前展开的任务项 key 数组
 * @param {(expandedKeys: string[]) => void} [props.onExpandedKeysChange] - 受控模式：展开状态变化时的回调函数
 *
 * @example
 * // 非受控模式（默认）
 * ```tsx
 * <TaskList
 *   items={[
 *     {
 *       key: 'task1',
 *       title: '任务1',
 *       content: '任务内容',
 *       status: 'success'
 *     }
 *   ]}
 *   className="custom-task-list"
 * />
 * ```
 *
 * @example
 * // 受控模式
 * ```tsx
 * const [expandedKeys, setExpandedKeys] = useState(['task1']);
 *
 * <TaskList
 *   items={[
 *     {
 *       key: 'task1',
 *       title: '任务1',
 *       content: '任务内容',
 *       status: 'success'
 *     },
 *     {
 *       key: 'task2',
 *       title: '任务2',
 *       content: '任务内容',
 *       status: 'pending'
 *     }
 *   ]}
 *   expandedKeys={expandedKeys}
 *   onExpandedKeysChange={setExpandedKeys}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的任务列表组件
 *
 * @remarks
 * - 支持任务列表的展开/折叠
 * - 支持任务状态管理
 * - 显示任务标题和内容
 * - 支持点击交互
 * - 提供动画效果
 * - 自动管理折叠状态（非受控模式）
 * - 支持受控模式，通过 expandedKeys 和 onExpandedKeysChange 控制展开状态
 */
export const TaskList = memo(
  ({
    items,
    className,
    expandedKeys,
    onExpandedKeysChange,
  }: ThoughtChainProps) => {
    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    const prefixCls = getPrefixCls('task-list');
    const { wrapSSR, hashId } = useStyle(prefixCls);

    // 如果是受控模式，使用传入的 expandedKeys
    // 如果是非受控模式，默认所有任务都展开（为了保持向后兼容）
    const defaultExpandedKeys = useMemo(() => {
      return expandedKeys !== undefined ? [] : items.map((item) => item.key);
    }, [items, expandedKeys]);

    // 使用 useMergedState 管理展开状态
    const [internalExpandedKeys, setInternalExpandedKeys] = useMergedState<
      string[]
    >(defaultExpandedKeys, {
      value: expandedKeys,
      onChange: onExpandedKeysChange,
    });

    const handleToggle = useCallback(
      (key: string) => {
        // 在受控模式下使用 expandedKeys，在非受控模式下使用 internalExpandedKeys
        const currentExpanded =
          expandedKeys !== undefined ? expandedKeys : internalExpandedKeys;
        const newExpandedKeys = currentExpanded.includes(key)
          ? currentExpanded.filter((k) => k !== key)
          : [...currentExpanded, key];
        setInternalExpandedKeys(newExpandedKeys);
      },
      [expandedKeys, internalExpandedKeys, setInternalExpandedKeys],
    );

    return wrapSSR(
      <div className={className}>
        {items.map((item, index) => (
          <TaskListItem
            key={item.key}
            item={item}
            isLast={index === items.length - 1}
            prefixCls={prefixCls}
            hashId={hashId}
            expandedKeys={internalExpandedKeys}
            onToggle={handleToggle}
          />
        ))}
      </div>,
    );
  },
);

TaskList.displayName = 'TaskList';
