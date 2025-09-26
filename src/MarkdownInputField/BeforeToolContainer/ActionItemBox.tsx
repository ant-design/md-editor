import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useContext, useEffect } from 'react';
import { useStyle } from './actionItemBoxStyle';

type ActionItemBoxProps = {
  onClick: () => void;
  icon?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  iconSize?: number;
  index?: number;
  actionIcon?: React.ReactNode;
  style?: React.CSSProperties;
  size?: 'small' | 'large' | 'default';
  onInit?: () => void;
  standalone?: boolean;
  compact?: boolean;
  hoverBg?: boolean;
};

export const ActionItemBox = (props: ActionItemBoxProps) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const basePrefixCls = getPrefixCls('agent-chat-action-item-box');
  const { wrapSSR, hashId } = useStyle(basePrefixCls);

  useEffect(() => {
    props?.onInit?.();
  }, []);

  return wrapSSR(
    <motion.div
      style={{
        flex: props.size ? 'none' : 1,
        display: 'flex',
        height: 'min-content',
        ...props.style,
      }}
      key={props.index}
      variants={{
        hidden: { x: -10, opacity: 0 },
        visible: {
          x: 0,
          opacity: 1,
        },
      }}
    >
      <div
        className={classNames(
          `${basePrefixCls}-container`,
          {
            [`${basePrefixCls}-container-${props.size}`]: props.size,
            [`${basePrefixCls}-container-standalone`]: props.standalone,
            [`${basePrefixCls}-container-compact`]:
            props.compact,
            [`${basePrefixCls}-container-hover-bg`]: props.hoverBg ?? true,
          },
          hashId,
        )}
      >
        <div
          onClick={props.onClick}
          className={classNames(basePrefixCls, hashId, {
            [`${basePrefixCls}-${props.size}`]: props.size,
            [`${basePrefixCls}-has-icon`]: !!props.icon && !props.compact,
            [`${basePrefixCls}-standalone`]: props.standalone,
            [`${basePrefixCls}-compact`]: props.compact,
            [`${basePrefixCls}-hover-bg`]: props.hoverBg ?? true,
          })}
        >
          <div
            style={{
              display: 'flex',
              gap: props.size === 'small' ? 4 : 12,
              alignItems: 'center',
              maxWidth: '100%',
              flex: 1,
              minWidth: 0,
            }}
          >
            {props.icon && !props.compact ? (
              <div
                style={{
                  width: props.iconSize || 24,
                  height: props.iconSize || 24,
                  minWidth: props.iconSize || 24,
                  minHeight: props.iconSize || 24,
                  padding: props.size === 'small' ? 2 : 8,
                }}
                className={classNames(
                  `${basePrefixCls}-icon`,
                  {
                    [`${basePrefixCls}-icon-${props.size}`]: props.size,
                  },
                  hashId,
                )}
              >
                {props.icon.startsWith('http') ? (
                  <img
                    src={props.icon}
                    alt="action-box-icon"
                    style={{
                      height: '100%',
                      maxWidth: props.iconSize || 24,
                      maxHeight: props.iconSize || 24,
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                  >
                    {props.icon}
                  </span>
                )}
              </div>
            ) : null}
            <div className={classNames(`${basePrefixCls}-content`, hashId)}>
              <span
                className={classNames(
                  `${basePrefixCls}-content-title`,
                  hashId,
                  {
                    [`${basePrefixCls}-content-title-no-description`]:
                      !props.description,
                  },
                )}
              >
                {props.title}
              </span>
              {props.description && !props.compact ? (
                <span
                  className={classNames(
                    `${basePrefixCls}-content-description`,
                    hashId,
                  )}
                  style={{
                    maxWidth: `310px`,
                  }}
                >
                  {props.description}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>,
  );
};

ActionItemBox.displayName = 'ActionItemBox';
