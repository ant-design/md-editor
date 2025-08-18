import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
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
        borderRadius: '8px',
        height: '32px',
        padding: '12px 6px 12px 12px',
        backgroundColor: 'transparent',
        color: token.colorText || 'rgba(0, 0, 0, 0.88)',
        fontSize: '13px',
        fontWeight: 400,
        position: 'relative',
        userSelect: 'none',
        lineHeight: '20px',
        transition: 'all 0.2s ease',

        '&:hover:not(&-disabled)': {
          backgroundColor: 'rgba(0, 16, 32, 0.0627)',
          color: '#343A45',
        },

        '&-selected': {
          backgroundColor: 'rgba(0, 16, 32, 0.0627)',
          fontWeight: 600,
          color: '#343A45',
        },

        '&-disabled': {
          cursor: 'not-allowed',
          color: token.colorTextDisabled || 'rgba(0, 0, 0, 0.25)',
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
          fontSize: '14px',
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
          fontSize: '13px',
          fontWeight: 500,
          lineHeight: '20px',
          letterSpacing: 'normal',
          color: 'rgba(0, 25, 61, 0.3255)',
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
          fontSize: '13px',
        },

        [`${token.componentCls}-submenu`]: {
          marginLeft: '16px',
          [`${token.componentCls}-item`]: {
            paddingLeft: '28px',
            fontSize: '13px',
          },
        },
      },

      '&-submenu-title': {
        fontSize: '13px',
        color: token.colorTextSecondary || 'rgba(0, 0, 0, 0.45)',
        fontWeight: 500,
        padding: '4px 12px',
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
        backgroundColor: token.colorBorder || '#d9d9d9',
        borderRadius: '3px',

        '&:hover': {
          backgroundColor: token.colorTextSecondary || '#bfbfbf',
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
  return useEditorStyleRegister('GroupMenu', (token: ChatTokenType) => {
    const groupMenuToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(groupMenuToken)];
  });
}
