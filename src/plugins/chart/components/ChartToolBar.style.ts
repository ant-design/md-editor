import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      padding: '16px 0',

      '.header-title': {
        fontFamily: 'PingFang SC',
        fontSize: 15,
        fontWeight: 600,
        lineHeight: '24px',
        letterSpacing: 0,
        fontVariationSettings: '"opsz" auto',
        color: '#343a45',
      },

      '.header-actions': {
        display: 'flex',
        alignItems: 'center',

        '.time-icon': {
          fontSize: 14,
          color: '#00183d',
          marginRight: 2,
        },

        '.data-time': {
          fontFamily: 'PingFang SC',
          fontSize: 12,
          fontWeight: 'normal',
          lineHeight: '20px',
          letterSpacing: 0,
          fontVariationSettings: '"opsz" auto',
          color: 'rgba(0, 25, 61, 0.3255)',
          marginRight: 8,
        },

        '.download-btn': {
          color: 'rgba(0, 25, 61, 0.3255)',
          padding: '4px 2px',
          height: 'auto',

          '&:hover': {
            color: '#1677ff',
          },
        },
      },

      // Dark theme styles
      '&.dark': {
        '.header-title': {
          color: '#fff',
        },

        '.header-actions': {
          '.time-icon': {
            color: '#fff',
          },

          '.data-time': {
            color: 'rgba(255, 255, 255, 0.65)',
          },

          '.download-btn': {
            color: 'rgba(255, 255, 255, 0.65)',

            '&:hover': {
              color: '#40a9ff',
            },
          },
        },
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('ChartToolBar', (token) => {
    const toolbarToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(toolbarToken)];
  });
}
