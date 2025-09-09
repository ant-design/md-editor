import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      padding: '16px 0',

      [`${token.componentCls}-header-title`]: {
        fontFamily: 'PingFang SC',
        fontSize: '15px',
        fontWeight: 600,
        lineHeight: '24px',
        letterSpacing: '0em',
        fontVariationSettings: '"opsz" auto',
        color: '#343a45',
      },

      [`${token.componentCls}-header-actions`]: {
        display: 'flex',
        alignItems: 'center',

        [`${token.componentCls}-time-icon`]: {
          fontSize: '14px',
          color: '#00183d',
          marginRight: '2px',
        },

        [`${token.componentCls}-data-time`]: {
          fontFamily: 'PingFang SC',
          fontSize: '12px',
          fontWeight: 'normal',
          lineHeight: '20px',
          letterSpacing: '0em',
          fontVariationSettings: '"opsz" auto',
          /* gray/gray-文本-浅色注释 */
          /* 样式描述：--gray-a9 */
          color: 'rgba(0, 25, 61, 0.3255)',
          marginRight: '8px',
        },

        [`${token.componentCls}-download-btn`]: {
          color: 'rgba(0, 25, 61, 0.3255)',
          padding: '4px 2px',
          height: 'auto',

          '&:hover': {
            color: '#1677ff',
          },
        },
      },

      // Dark theme styles
      '&-dark': {
        [`${token.componentCls}-header-title`]: {
          color: '#fff',
        },

        [`${token.componentCls}-header-actions`]: {
          [`${token.componentCls}-time-icon`]: {
            color: '#fff',
          },

          [`${token.componentCls}-data-time`]: {
            color: 'rgba(255, 255, 255, 0.65)',
          },

          [`${token.componentCls}-download-btn`]: {
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

/**
 * ChartToolBar Style
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('ChartToolBar', (token) => {
    const chartToolBarToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(chartToolBarToken), genStyle(chartToolBarToken)];
  });
}
