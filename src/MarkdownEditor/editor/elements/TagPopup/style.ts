import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      position: 'relative',
      cursor: 'pointer',
      padding: '0px 4px',
      display: 'inline-flex',
      lineHeight: '1.5',
      font: 'var(--font-text-body-base)',
      color: 'var(--color-primary-text-secondary)',
      borderRadius: 'var(--radius-control-sm)',
      background: 'var(--color-primary-bg-tip)',

      '&-tag-popup-input': {
        '&:not(.tag-popup-input-composition).empty::before': {
          color: 'var(--color-primary-text-disabled)',
          content: 'attr(title)',
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
          overflow: 'hidden',
          userSelect: 'none',
        },
        '&-arrow': {
          position: 'absolute',
          right: '4px',
          top: '50%',
          transform: 'translateY(-50%)',
        },
      },
      '&-tag-popup-input-has-arrow.empty': {
        paddingRight: '12px',
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
