import { ConfigProvider, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useContext, useMemo, useState } from 'react';
import { RefreshCcw, SwapRight } from '../../icons';
import { useStyle } from './style';

export interface SuggestionItem {
  key?: React.Key;
  text: string;
  icon?: React.ReactNode;
  tooltip?: string;
  disabled?: boolean;
  onClick?: (text: string) => void | Promise<void>;
  actionIcon?: React.ReactNode;
}

export interface SuggestionListProps {
  className?: string;
  style?: React.CSSProperties;
  items?: SuggestionItem[];
  onItemClick?: (value: string) => void | Promise<void>;
  /** 最大显示数量 */
  maxItems?: number;
  /** 布局类型：垂直布局、水平布局 */
  layout?: 'vertical' | 'horizontal';
  /** 样式类型：基础版、透明版、白色版 */
  type?: 'basic' | 'transparent' | 'white';
  /** 是否展示左上角“搜索更多”入口 */
  showMore?: { enable: boolean; onClick?: () => void };
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
  className,
  style,
  items,
  onItemClick,
  layout = 'vertical',
  maxItems = 6,
  type = 'basic',
  showMore,
}) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const prefixCls = context?.getPrefixCls('follow-up');

  const { wrapSSR, hashId } = useStyle(prefixCls);
  const [submitting, setSubmitting] = useState(false);

  const derivedItems: SuggestionItem[] = useMemo(() => {
    if (Array.isArray(items) && items.length > 0)
      return items.slice(0, maxItems);
    return [];
  }, [items, maxItems]);

  const rootCls = classNames(
    prefixCls,
    className,
    hashId,
    `${prefixCls}-${layout}`,
    `${prefixCls}-${type}`,
  );

  return wrapSSR(
    <div className={rootCls} style={style} role="group" aria-label="追问区域">
      {derivedItems?.length > 0 ? (
        <div
          className={classNames(`${prefixCls}-suggestions`, hashId, {
            [`${prefixCls}-suggestions-${layout}`]: layout,
          })}
          aria-label="追问建议"
        >
          {showMore?.enable ? (
            <div
              className={classNames(`${prefixCls}-more`, hashId)}
              aria-label="搜索更多"
            >
              <span className={classNames(`${prefixCls}-more-text`, hashId)}>
                搜索更多
              </span>
              <span
                className={classNames(`${prefixCls}-more-icon`, hashId)}
                role="button"
                onClick={() => showMore?.onClick?.()}
                aria-hidden
              >
                <RefreshCcw width={14} height={14} />
              </span>
            </div>
          ) : null}
          {derivedItems?.map((item) => {
            const label =
              typeof item?.text === 'string' ? item?.text : undefined;
            const isDisabled = submitting || item?.disabled;
            const handleClick = async () => {
              if (isDisabled) return;
              try {
                setSubmitting(true);
                if (item?.onClick) {
                  await item?.onClick(label ?? '');
                } else {
                  await onItemClick?.(label ?? '');
                }
              } finally {
                setSubmitting(false);
              }
            };
            return (
              <div
                key={item?.key ?? label}
                role="button"
                className={classNames(`${prefixCls}-suggestion`, hashId, {
                  [`${prefixCls}-suggestion-disabled`]: isDisabled,
                })}
                onClick={handleClick}
                aria-label={`选择建议：${label || '追问'}`}
              >
                {item?.icon ? (
                  <span className={classNames(`${prefixCls}-icon`, hashId)}>
                    {item?.icon}
                  </span>
                ) : null}
                <Tooltip
                  mouseEnterDelay={0.3}
                  title={item?.tooltip ?? label}
                  placement="top"
                >
                  <span className={classNames(`${prefixCls}-label`, hashId)}>
                    {item?.text}
                  </span>
                </Tooltip>
                <span
                  className={classNames(`${prefixCls}-arrow`, hashId, {
                    [`${prefixCls}-arrow-action`]: item.actionIcon,
                  })}
                  aria-hidden
                >
                  {item.actionIcon ? (
                    item.actionIcon
                  ) : (
                    <SwapRight width={16} height={16} />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>,
  );
};

export default SuggestionList;
