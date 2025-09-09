import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      marginBottom: 16,
      display: 'flex',
      gap: 16,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexWrap: 'wrap',

      '.region-filter': {
        display: 'flex',
        alignItems: 'center',
        gap: 8,

        '.region-dropdown-btn': {
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          backgroundColor: '#fff',
          color: '#666',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minWidth: 80,
          justifyContent: 'space-between',
          height: 32,
          padding: '0 12px',

          '&:hover': {
            borderColor: '#8c8c8c',
            color: '#343a45',
            backgroundColor: '#f9f9f9',

            '.dropdown-icon': {
              color: '#8c8c8c',
            },
          },

          '.dropdown-icon': {
            fontSize: 12,
            color: '#666',
          },
        },
      },

      '.segmented-filter': {
        backgroundColor: '#f5f5f5',
        height: 32,
        display: 'flex',
        alignItems: 'center',
        borderRadius: 8,

        '&.custom-segmented': {
          '.ant-segmented-item': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            
            '.ant-segmented-item-label': {
              fontFamily: 'PingFang SC',
              fontSize: 13,
              fontWeight: 'normal',
              lineHeight: '22px',
              letterSpacing: 0,
            },
          },

          '.ant-segmented-group': {
            height: 30,
          },

          '.ant-segmented-item-selected': {
            borderRadius: 8,
            backgroundColor: '#fff !important',
            border: '1px solid #d9d9d9 !important',
            boxShadow: 
              '0px 0px 1px 0px rgba(0, 19, 41, 0.2), 0px 1.5px 4px -1px rgba(0, 19, 41, 0.04)',
            
            '.ant-segmented-item-label': {
              fontFamily: 'PingFang SC',
              fontSize: 13,
              fontWeight: 600,
              lineHeight: '20px',
              letterSpacing: 0,
              fontVariationSettings: '"opsz" auto',
              color: '#343a45 !important',
            },
          },
        },
      },

      // Dark theme styles
      '&.dark': {
        '.region-filter': {
          '.region-dropdown-btn': {
            border: '1px solid #434343',
            backgroundColor: '#1a1a1a',
            color: 'rgba(255, 255, 255, 0.85)',

            '&:hover': {
              borderColor: '#595959',
              color: '#fff',
              backgroundColor: '#262626',

              '.dropdown-icon': {
                color: 'rgba(255, 255, 255, 0.8)',
              },
            },

            '.dropdown-icon': {
              color: 'rgba(255, 255, 255, 0.65)',
            },
          },
        },

        '.segmented-filter': {
          backgroundColor: '#262626',

          '&.custom-segmented': {
            '.ant-segmented-item': {
              '.ant-segmented-item-label': {
                color: 'rgba(255, 255, 255, 0.65)',
              },
            },

            '.ant-segmented-item-selected': {
              backgroundColor: '#fff !important',
              border: '1px solid #434343 !important',

              '.ant-segmented-item-label': {
                color: '#343a45 !important',
              },
            },

            '.ant-segmented-thumb': {
              backgroundColor: '#343a45 !important',
            },
          },
        },
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('ChartFilter', (token) => {
    const filterToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(filterToken)];
  });
}
