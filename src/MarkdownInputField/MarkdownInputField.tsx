import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { BaseMarkdownEditor } from '../MarkdownEditor';
import { SendButton } from './SendButton';
import { useStyle } from './style';

export type MarkdownInputFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  typing?: boolean;
  onSend?: (value: string) => Promise<void>;
};

export const MarkdownInputField: React.FC<MarkdownInputFieldProps> = (
  props,
) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const baseCls = getPrefixCls('md-input-field');
  const { wrapSSR, hashId } = useStyle(baseCls);
  const [isHover, setHover] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  return wrapSSR(
    <div
      className={classNames(baseCls, hashId, props.className, {
        [`${baseCls}-disabled`]: props.disabled || loading,
        [`${baseCls}-typing`]: false,
        [`${baseCls}-loading`]: loading,
      })}
      style={props.style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <BaseMarkdownEditor
        style={{
          width: '100%',
          minHeight: '32px',
          height: '100%',
        }}
        readonly={props.disabled}
        contentStyle={{
          padding: '12px',
        }}
        textAreaProps={{
          enable: true,
          placeholder: props.placeholder,
        }}
        initValue={props.value}
        onChange={props.onChange}
        toc={false}
        toolBar={{
          enable: false,
        }}
        floatBar={{
          enable: false,
        }}
      />
      <SendButton
        style={{
          position: 'absolute',
          right: 8,
          bottom: 8,
        }}
        typing={!!props.typing || loading}
        isHover={isHover}
        disabled={props.disabled}
        onClick={() => {
          if (props.onSend) {
            setLoading(true);
            props.onSend(props.value).finally(() => {
              setLoading(false);
            });
          }
        }}
      />
    </div>,
  );
};
