import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      position: 'relative',
      margin: '0 4px',
      cursor: 'pointer',
      padding: '0px 4px',
      borderRadius: '4px',
      fontSize: '0.9em',
      display: 'inline-flex',
      lineHeight: '1.5',
      color: 'var(--markdown-input-field-tag-color)',
      border: '1px solid var(--markdown-input-field-tag-border-color)',

      '&-tag-popup-input': {
        '&:not(.tag-popup-input-composition).empty::before': {
          color: 'var(--markdown-input-field-tag-placeholder-color)',
          content: 'attr(title)',
          opacity: 0.5,
          userSelect: 'none',
          position: 'absolute',
          left: '4px',
          top: 0,
        },

        '&:hover::before': {
          opacity: 0.6,
        },

        '&.empty::after': {
          content: 'attr(title)',
          opacity: 0,
          height: '0.5px',
          overflow: 'hidden',
          userSelect: 'none',
        },
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('editor-content-tag-popup', (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(editorToken)];
  });
}
