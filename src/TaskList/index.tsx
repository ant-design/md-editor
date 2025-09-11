import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActionIconBox } from '../MarkdownEditor/editor/components';
import { I18nContext } from '../i18n';
import { LoadingLottie } from './LoadingLottie';
import { useStyle } from './style';

const DashPendingIcon = memo((props: React.SVGProps<SVGSVGElement>) => {
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
      <g>
        <path
          d="M9.14 2.11q-1.14-.221-2.28 0A.666.666 0 116.607.8Q8 .53 9.393.8a.667.667 0 01-.253 1.31zm0 11.78q-1.14.221-2.28 0a.667.667 0 10-.254 1.309q1.394.27 2.787.001a.667.667 0 00-.253-1.31zm4.946-9.981q-.794-1.182-1.973-1.98a.667.667 0 00-.748 1.104q.965.653 1.614 1.62a.667.667 0 001.107-.744zM2.12 6.733a.667.667 0 01-.012.127q-.22 1.14 0 2.28A.667.667 0 01.8 9.393Q.53 8 .8 6.607a.667.667 0 011.321.126zm12.065 5.006c0 .134-.04.264-.115.374q-.798 1.179-1.98 1.973a.667.667 0 01-.744-1.107q.967-.65 1.62-1.614a.667.667 0 011.219.374zm-.307-5.006c0 .043.004.085.012.127q.22 1.14 0 2.28a.665.665 0 00.654.793c.32 0 .594-.226.655-.54q.27-1.393 0-2.786a.667.667 0 00-1.321.126zM4.947 2.467c0 .222-.11.43-.295.554q-.966.65-1.62 1.614a.667.667 0 11-1.103-.748q.798-1.179 1.98-1.973a.667.667 0 011.038.553zM1.801 11.72c0 .133.04.262.113.372q.794 1.182 1.972 1.98a.667.667 0 10.749-1.104q-.965-.653-1.614-1.62a.667.667 0 00-1.22.372z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
});

DashPendingIcon.displayName = 'DashPendingIcon';

const SuccessIcon = memo((props: React.SVGProps<SVGSVGElement>) => {
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
      <g>
        <path
          d="M8 15.333A7.333 7.333 0 108 .667a7.333 7.333 0 000 14.666zm-.963-4.1l5.33-5.279-1.033-1.042-4.297 4.256-2.004-1.986L4 8.224l3.036 3.008z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
});

SuccessIcon.displayName = 'SuccessIcon';

export const ChevronUpIcon = memo((props: React.SVGProps<SVGSVGElement>) => {
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
      <g>
        <path
          d="M3.529 9.529l4-4a.667.667 0 01.942 0l4 4a.667.667 0 01-.942.942l-3.53-3.528-3.528 3.528a.667.667 0 11-.942-.942z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
});

ChevronUpIcon.displayName = 'ChevronUpIcon';

function ErrorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={14.666666984558105}
      height={14.666666984558105}
      viewBox="0 0 14.666666984558105 14.666666984558105"
      {...props}
    >
      <path
        d="M.586 10.955l3.125 3.126q.586.585 1.414.586h4.416q.828 0 1.414-.586l3.126-3.125q.585-.586.586-1.415V5.125q0-.828-.586-1.414L10.956.586Q10.37 0 9.54 0H5.125q-.828 0-1.414.586L.586 3.71Q0 4.297 0 5.125v4.416q0 .828.586 1.414zm4.54 2.378q-.277 0-.472-.195L1.53 10.013q-.196-.196-.196-.472V5.125q0-.276.196-.47l3.125-3.126q.196-.196.471-.196h4.416q.276 0 .471.196l3.126 3.125q.195.196.195.471v4.416q0 .276-.195.471l-3.125 3.126q-.196.195-.472.195H5.125zm4.874-8c0 .177-.07.347-.195.472L8.276 7.333l1.528 1.529a.667.667 0 11-.942.942L7.333 8.276 5.805 9.805a.667.667 0 01-.943-.943L6.39 7.333 4.86 5.805a.667.667 0 11.944-.943l1.528 1.529 1.529-1.529A.667.667 0 0110 5.333z"
        fillRule="evenodd"
        fill="#F15B50"
      />
    </svg>
  );
}

type ThoughtChainProps = {
  items: {
    key: string;
    title: string;
    content: React.ReactNode | React.ReactNode[];
    status: 'success' | 'pending' | 'loading' | 'error';
  }[];
  className?: string;
};

const TaskListItem = memo(
  ({
    item,
    isLast,
    prefixCls,
    hashId,
    itemsCollapseStatus,
    onToggle,
  }: {
    item: {
      key: string;
      title: string;
      content: React.ReactNode | React.ReactNode[];
      status: 'success' | 'pending' | 'loading' | 'error';
    };
    isLast: boolean;
    prefixCls: string;
    hashId: string;
    itemsCollapseStatus: React.MutableRefObject<Map<string, boolean>>;
    onToggle: (key: string) => void;
  }) => {
    const { locale } = useContext(I18nContext);
    const isCollapsed = itemsCollapseStatus.current.get(item.key);

    const hasContent = useMemo(() => {
      if (Array.isArray(item.content)) {
        return item.content.length > 0;
      }
      return !!item.content;
    }, [item.content]);

    return (
      <div key={item.key} className={`${prefixCls}-thoughtChainItem ${hashId}`}>
        <div
          className={`${prefixCls}-left ${hashId}`}
          onClick={() => onToggle(item.key)}
        >
          <div
            className={`${prefixCls}-status ${prefixCls}-status-${item.status} ${hashId}`}
          >
            {item.status === 'success' ? <SuccessIcon /> : null}
            {item.status === 'loading' ? <LoadingLottie size={16} /> : null}
            {item.status === 'pending' ? (
              <div className={`${prefixCls}-status-idle ${hashId}`}>
                <DashPendingIcon />
              </div>
            ) : null}
            {item.status === 'error' ? <ErrorIcon /> : null}
          </div>
          <div className={`${prefixCls}-content-left ${hashId}`}>
            {!isLast && (
              <div className={`${prefixCls}-dash-line ${hashId}`}></div>
            )}
          </div>
        </div>
        <div className={`${prefixCls}-right ${hashId}`}>
          <div
            className={`${prefixCls}-top ${hashId}`}
            onClick={() => onToggle(item.key)}
          >
            <div className={`${prefixCls}-title ${hashId}`}>{item.title}</div>
            {hasContent && (
              <div
                className={`${prefixCls}-arrowContainer ${hashId}`}
                onClick={() => onToggle(item.key)}
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
                  <ChevronUpIcon className={`${prefixCls}-arrow ${hashId}`} />
                </ActionIconBox>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className={`${prefixCls}-body ${hashId}`}>
              <div className={`${prefixCls}-content ${hashId}`}>
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
 *
 * @component
 * @description 任务列表组件，显示任务列表和状态管理
 * @param {ThoughtChainProps} props - 组件属性
 * @param {TaskItem[]} props.items - 任务列表数据
 * @param {string} [props.className] - 自定义CSS类名
 *
 * @example
 * ```tsx
 * <TaskList
 *   items={[
 *     {
 *       key: 'task1',
 *       title: '任务1',
 *       content: '任务内容'
 *     }
 *   ]}
 *   className="custom-task-list"
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
 * - 自动管理折叠状态
 */
export const TaskList = memo(({ items, className }: ThoughtChainProps) => {
  const prefixCls = 'task-list';
  const { wrapSSR, hashId } = useStyle(prefixCls);
  const [reFresh, setReFresh] = useState(false);
  const itemsCollapseStatus = useRef(new Map());

  useEffect(() => {
    return () => {
      itemsCollapseStatus.current.clear();
    };
  }, []);

  useEffect(() => {
    let flag = false;
    items.forEach((item) => {
      const oldStatus = itemsCollapseStatus.current.has(item.key);
      if (oldStatus) {
        itemsCollapseStatus.current.set(
          item.key,
          !!itemsCollapseStatus.current.get(item.key),
        );
      } else {
        flag = true;
        itemsCollapseStatus.current.set(item.key, false);
      }
    });
    if (flag) {
      setReFresh(!reFresh);
    }
  }, [items, reFresh]);

  const handleToggle = useCallback(
    (key: string) => {
      itemsCollapseStatus.current.set(
        key,
        !itemsCollapseStatus.current.get(key),
      );
      setReFresh(!reFresh);
    },
    [reFresh],
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
          itemsCollapseStatus={itemsCollapseStatus}
          onToggle={handleToggle}
        />
      ))}
    </div>,
  );
});

TaskList.displayName = 'TaskList';
