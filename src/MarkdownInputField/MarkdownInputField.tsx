import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { useMergedState } from 'rc-util';
import React, { useContext, useEffect } from 'react';
import { useRefFunction } from '../hooks/useRefFunction';
import { BaseMarkdownEditor, MarkdownEditorInstance } from '../MarkdownEditor';
import { SendButton } from './SendButton';
import { useStyle } from './style';

export type MarkdownInputFieldProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
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
  const markdownEditorRef = React.useRef<MarkdownEditorInstance>();
  const [value, setValue] = useMergedState('', {
    value: props.value,
    onChange: props.onChange,
  });

  useEffect(() => {
    markdownEditorRef.current?.store?.setMDContent(value);
  }, [props.value]);

  const sendMessage = useRefFunction(() => {
    if (props.onSend && value) {
      setLoading(true);
      props
        .onSend(value)
        .then(() => {
          markdownEditorRef?.current?.store?.clearContent();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  });
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
      onKeyDown={(e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.stopPropagation();
          e.preventDefault();
          if (props.onSend) {
            sendMessage();
          }
        }
      }}
    >
      <BaseMarkdownEditor
        editorRef={markdownEditorRef}
        style={{
          width: '100%',
          minHeight: '32px',
          height: '100%',
          pointerEvents: props.disabled ? 'none' : 'auto',
        }}
        contentStyle={{
          padding: '12px',
        }}
        textAreaProps={{
          enable: true,
          placeholder: props.placeholder,
        }}
        initValue={props.value}
        onChange={(value) => {
          setValue(value);
        }}
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
          right: 4,
          bottom: 8,
        }}
        typing={!!props.typing || loading}
        isHover={isHover}
        disabled={props.disabled}
        onClick={() => {
          if (props.onSend) {
            sendMessage();
          }
        }}
      />
    </div>,
  );
};
