import { SendOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { BaseMarkdownEditor } from '../MarkdownEditor';

export type MarkdownInputFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style: React.CSSProperties;
  className?: string;
  disabled?: boolean;
};

const disableStyle: React.CSSProperties = {
  opacity: 0.5,
  backgroundColor: 'rgba(0,0,0,0.04)',
  cursor: 'not-allowed',
};

export const MarkdownInputField: React.FC<MarkdownInputFieldProps> = (
  props,
) => {
  return (
    <div
      className={props.className}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        boxShadow: `0 1px 2px 0 rgba(0, 0, 0, 0.03),0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)`,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        outline: '1px solid #d9d9d9',
        borderRadius: '12px',
        minHeight: '32px',
        maxWidth: 980,
        position: 'relative',
        ...(props.disabled ? disableStyle : {}),
        ...props.style,
      }}
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
      <Button
        style={{
          position: 'absolute',
          right: 8,
          bottom: 8,
        }}
        disabled={props.disabled}
        type="primary"
        shape="circle"
        icon={<SendOutlined />}
      />
    </div>
  );
};
