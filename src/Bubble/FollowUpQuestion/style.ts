import { ChatTokenType, GenerateStyle, useEditorStyleRegister } from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      padding: 0,
      background: 'transparent',
      borderRadius: 0,
      boxShadow: 'none',

      '&-suggestions': {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      },

      '&-suggestion': {
        width: 'max-content',
        maxWidth: '100%',
        alignSelf: 'flex-start',
        height: 37,
        padding: 8,
        boxSizing: 'border-box',
        borderRadius: 'var(--radius-card-base)',
        background: 'var(--color-gray-bg-card-white)',
        border: 'var(--color-gray-border-light)',
        boxShadow: 'var(--shadow-control-base)',
        color: 'var(--color-gray-text-secondary)',
        borderWidth: '1px',
        borderStyle: 'solid',
        cursor: 'pointer',
        fontSize: 13,
        lineHeight: '21px',
        textAlign: 'left',
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        transition:
          'background-color .2s ease, box-shadow .2s ease, transform .08s ease',

        // hover 态（非禁用）
        '&:hover:not(:disabled)': {
          background: 'var(--color-gray-bg-card-light, var(--color-gray-bg-card-white))',
          boxShadow: 'var(--shadow-control-base)',
        },

        // active 态（非禁用）
        '&:active:not(:disabled)': {
          transform: 'scale(0.99)',
        },

        // 禁用态
        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
          boxShadow: 'none',
        },

        // hover 时箭头位移动画
        [`&:hover:not(:disabled) ${token.componentCls}-arrow`]: {
          transform: 'translateX(2px)',
        },
      },

      '&-icon': {
        flex: '0 0 auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        color: 'var(--color-gray-text-secondary)',
        marginRight: 8,
      },

      '&-label': {
        display: 'inline-flex',
        alignItems: 'center',
        minWidth: 0,
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: 'var(--color-gray-text-default)',
        fontSize: 13,
      },

      '&-arrow': {
        flex: '0 0 auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-gray-text-light)',
        fontSize: 12,
        marginLeft: 12,
        transition: 'transform .2s ease',
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('follow-up', (token) => {
    const followToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    } as ChatTokenType;
    return [genStyle(followToken)];
  });
}


