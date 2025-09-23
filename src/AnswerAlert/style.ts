import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      padding: '3px 8px',
      color: 'var(--color-gray-text-default)',
      background: 'var(--color-gray-bg-card-white)',
      borderRadius: '8px',
      boxShadow: 'var(--shadow-control-base)',

      '&-content': {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      },

      '&-icon': {
        width: 14,
        height: 14,
        fontSize: 14,
      },

      '&-message': {
        flex: 1,
        fontSize: '13px',
        fontWeight: '500',
        lineHeight: '22px',
        letterSpacing: 'normal',
      },

      '&-description': {
        fontSize: '13px',
        fontWeight: 'normal',
      },

      '&-action': {},

      '&-close-icon': {
        padding: 0,
        backgroundColor: 'transparent',
        fontSize: 14,
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
      },
    },

    // ================== With description ================
    [`${token.componentCls}-with-description`]: {
      padding: '12px',
      borderRadius: 'var(--radius-card-base)',

      [`${token.componentCls}-content`]: {
        marginBottom: 8,
      },

      [`${token.componentCls}-icon`]: {
        width: 18,
        height: 18,
        fontSize: 18,
      },

      [`${token.componentCls}-message`]: {
        font: 'var(--font-text-h5-base)',
        letterSpacing: 'var(--letter-spacing-h5-base, normal)',
      },
    },

    // ================== Types ==================

    [`${token.componentCls}-success`]: {
      color: 'var(--color-green-text-secondary)',
      backgroundColor: 'var(--color-green-bg-tip)',
    },

    [`${token.componentCls}-warning`]: {
      color: 'var(--color-yellow-text-secondary)',
      backgroundColor: 'var(--color-yellow-bg-tip)',
    },

    [`${token.componentCls}-error`]: {
      color: 'var(--color-red-text-secondary)',
      backgroundColor: 'var(--color-red-bg-tip)',
    },

    [`${token.componentCls}-info`]: {
      color: 'var(--color-blue-text-secondary)',
      backgroundColor: 'var(--color-blue-bg-tip)',
    },

    [`${token.componentCls}-gray`]: {
      color: 'var(--color-gray-text-secondary)',
      backgroundColor: 'var(--color-gray-bg-tip)',
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('answer-alert', (token) => {
    const answerAlertToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genStyle(answerAlertToken)];
  });
}
