import React from 'react';
import { BaseMarkdownEditor } from '../MarkdownEditor';

export type MarkdownInputFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const MarkdownInputField: React.FC<MarkdownInputFieldProps> = (
  props,
) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #f0f0f0',
        borderRadius: '12px',
        minHeight: '32px',
      }}
    >
      <BaseMarkdownEditor
        style={{
          width: '100%',
          minHeight: '32px',
          height: '100%',
        }}
        textAreaProps={{
          enable: true,
          placeholder: props.placeholder,
        }}
        initValue={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};
