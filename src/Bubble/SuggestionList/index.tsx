import { ConfigProvider, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useContext, useMemo, useState } from 'react';
import { SwapRight } from '../../icons';
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
  layout?: 'vertical' | 'horizontal';
  maxItems?: number;
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
  className,
  style,
  items,
  onItemClick,
  layout = 'vertical',
  maxItems = 6,
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
                <Tooltip title={item?.tooltip ?? label} placement="top">
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
