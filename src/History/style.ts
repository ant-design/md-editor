import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [`${token.componentCls}-new-chat`]: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
      padding: '5px 12px',
      borderRadius: 'var(--radius-control-base)',
      background: 'var(--color-primary-control-fill-secondary)',
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '22px',
      letterSpacing: 'normal',
      color: 'var(--color-primary-text-secondary)',
      boxShadow: 'var(--shadow-border-base)',

      '&:hover': {
        background: 'var(--color-primary-control-fill-secondary-hover)',
      },
    },

    [token.componentCls]: {
      width: '100%',
      backgroundColor: 'transparent',
      outline: 'none',
      padding: '0',

      '&-item': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        borderRadius: 'var(--radius-control-base)',
        padding: '5px 12px',
        backgroundColor: 'transparent',
        color: token.colorText || 'var(--color-gray-text-default)',
        fontSize: 'var(--font-size-base)',
        fontWeight: 400,
        position: 'relative',
        userSelect: 'none',
        lineHeight: '20px',
        transition: 'all 0.2s ease',

        '&:hover:not(&-disabled)': {
          backgroundColor: 'var(--color-gray-control-fill-active)',
          color: 'var(--color-gray-text-default)',
        },

        '&-selected': {
          backgroundColor: 'var(--color-gray-control-fill-active)',
          fontWeight: 600,
          color: 'var(--color-gray-text-default)',
        },

        '&-disabled': {
          cursor: 'not-allowed',
          color: token.colorTextDisabled || 'var(--color-gray-text-default)',
          opacity: 0.6,

          '&:hover': {
            backgroundColor: 'transparent',
          },
        },

        '&-content': {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 1,
          minWidth: 0,
        },

        '&-icon': {
          fontSize: 'var(--font-size-base)',
          width: '16px',
          height: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'inherit',
        },

        '&-group': {
          cursor: 'default',
          backgroundColor: 'transparent',
          height: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 'var(--font-size-base)',
          fontWeight: 500,
          padding: '6px 12px 6px',
          lineHeight: '20px',
          letterSpacing: 'normal',
          color: 'var(--color-gray-text-default)',
          zIndex: 0,
        },
        '&:active:not(&-disabled)': {
          backgroundColor: 'transparent',
        },
      },

      '&-submenu': {
        gap: 4,
        display: 'flex',
        flexDirection: 'column',

        [`${token.componentCls}-item`]: {
          fontSize: 'var(--font-size-base)',
        },

        [`${token.componentCls}-submenu`]: {
          marginLeft: '16px',
          [`${token.componentCls}-item`]: {
            paddingLeft: '28px',
            fontSize: 'var(--font-size-base)',
          },
        },
      },

      '&-submenu-title': {
        fontSize: 'var(--font-size-base)',
        color: token.colorTextSecondary || 'var(--color-gray-text-default)',
        fontWeight: 500,
        padding: '5px 12px',
      },

      // Container focus styles
      '&:focus-within': {
        outline: 'none',
      },

      // Scrollbar styles
      '&::-webkit-scrollbar': {
        width: '6px',
      },

      '&::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
      },

      '&::-webkit-scrollbar-thumb': {
        backgroundColor: token.colorBorder || 'var(--color-gray-border-light)',
        borderRadius: '3px',

        '&:hover': {
          backgroundColor:
            token.colorTextSecondary || 'var(--color-gray-text-default)',
        },
      },

      // Animation for menu items
      [`${token.componentCls}-item`]: {
        animationName: 'fadeIn',
        animationDuration: '0.2s',
        animationTimingFunction: 'ease-in-out',
      },

      '@keyframes fadeIn': {
        '0%': {
          opacity: 0,
          transform: 'translateY(-2px)',
        },
        '100%': {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('GroupMenu', (token) => {
    const groupMenuToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(groupMenuToken)];
  });
}
