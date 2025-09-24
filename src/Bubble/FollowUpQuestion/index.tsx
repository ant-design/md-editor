import { ConfigProvider, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useContext, useMemo, useState } from 'react';
import { SwapRightIcon } from '../../icons';
import { useStyle } from './style';

export interface FollowUpItem {
  key?: React.Key;
  text: string;
  icon?: React.ReactNode;
  tooltip?: string;
  disabled?: boolean;
  onClick?: (text: string) => void | Promise<void>;
}

export interface FollowUpQuestionProps {
  className?: string;
  style?: React.CSSProperties;
  items?: FollowUpItem[];
  onAsk?: (value: string) => void | Promise<void>;
}

export const FollowUpQuestion: React.FC<FollowUpQuestionProps> = ({
  className,
  style,
  items,
  onAsk,
}) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const prefixCls = context?.getPrefixCls('follow-up');

  const { wrapSSR, hashId } = useStyle(prefixCls);
  const [submitting, setSubmitting] = useState(false);

  const derivedItems: FollowUpItem[] = useMemo(() => {
    if (Array.isArray(items) && items.length > 0) return items;
    return [];
  }, [items]);

  const rootCls = classNames(prefixCls, className, hashId);

  return wrapSSR(
    <div className={rootCls} style={style} role="group" aria-label="追问区域">
      {derivedItems?.length > 0 ? (
        <div
          className={classNames(`${prefixCls}-suggestions`, hashId)}
          aria-label="追问建议"
        >
          {derivedItems?.slice(0, 6).map((item) => {
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
                  await onAsk?.(label ?? '');
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
                  className={classNames(`${prefixCls}-arrow`, hashId)}
                  aria-hidden
                >
                  <SwapRightIcon width={16} height={16} />
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>,
  );
};

export default FollowUpQuestion;
