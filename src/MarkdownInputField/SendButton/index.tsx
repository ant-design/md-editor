import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect } from 'react';
import { SendIcon } from './SendIcon';
import { useStyle } from './style';

type SendButtonProps = {
  isHover: boolean;
  typing: boolean;
  onClick: () => void;
  style: React.CSSProperties;
  onInit?: () => void;
  compact?: boolean;
  disabled?: boolean;
};

export const SendButton: React.FC<SendButtonProps> = (props) => {
  const { isHover, disabled, typing, onClick, style } = props;
  useEffect(() => {
    props.onInit?.();
  }, []);
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const baseCls = getPrefixCls('md-input-field-send-button');
  const { wrapSSR, hashId } = useStyle(baseCls);
  return wrapSSR(
    <div
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
      style={style}
      className={classNames(baseCls, hashId, {
        [`${baseCls}-compact`]: props.compact,
        [`${baseCls}-disabled`]: disabled,
        [`${baseCls}-typing`]: typing,
      })}
    >
      <SendIcon
        hover={isHover && !disabled}
        disabled={disabled}
        typing={typing}
      />
    </div>,
  );
};
