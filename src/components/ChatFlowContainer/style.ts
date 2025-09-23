import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',

      '&-header': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--padding-3x) var(--padding-4x)',
        // borderBottom: '1px solid var(--color-gray-border-light)',
        backgroundColor: 'var(--color-gray-bg-card-white)',
        minHeight: '48px',
        flexShrink: 0,
        zIndex: 10,
        borderTopLeftRadius: 'var(--radius-xl)',
        borderTopRightRadius: 'var(--radius-xl)',

        '&-left': {
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--margin-2x)',

          '&-title': {
            fontSize: 'var(--font-size-lg)',
            fontWeight: 600,
            color: 'var(--color-gray-text-default)',
            margin: 0,
            lineHeight: '1.4',
          },

          '&-collapse-btn': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'var(--font-size-2xl)',
            height: 'var(--font-size-2xl)',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--color-gray-text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: 0,

            '&:hover': {
              backgroundColor: 'var(--color-blue-control-fill-hover)',
              color: 'var(--color-gray-text-default)',
            },

            '&:active': {
              backgroundColor: 'var(--color-gray-bg-active)',
            },
          },
        },

        '&-right': {
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--margin-2x)',

          '&-share-btn': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // width: '32px',
            padding: '0 8px',
            height: 'var(--font-size-2xl)',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--color-gray-text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',

            '&:hover': {
              backgroundColor: 'var(--color-blue-control-fill-hover)',
              color: 'var(--color-gray-text-default)',
            },

            '&:active': {
              backgroundColor: 'var(--color-gray-bg-active)',
            },

            // '&:focus': {
            //   outline: '2px solid var(--color-primary-control-fill-primary)',
            //   outlineOffset: '2px',
            // },
          },

          '&-collapse-btn': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'var(--font-size-2xl)',
            height: 'var(--font-size-2xl)',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--color-gray-text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: 0,

            '&:hover': {
              backgroundColor: 'var(--color-blue-control-fill-hover)',
              color: 'var(--color-gray-text-default)',
            },

            '&:active': {
              backgroundColor: 'var(--color-gray-bg-active)',
            },

            // '&:focus': {
            //   outline: '2px solid var(--color-primary-control-fill-primary)',
            //   outlineOffset: '2px',
            // },
          },
        },
      },

      '&-content': {
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: 'var(--color-gray-bg-card-white)',

        '&-scrollable': {
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 'var(--padding-6x)',
          scrollBehavior: 'smooth',

          '&::-webkit-scrollbar': {
            width: '6px',
          },

          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--color-gray-border-light)',
            borderRadius: '3px',

            '&:hover': {
              backgroundColor: 'var(--color-gray-border-default)',
            },
          },
        },
      },

      '&-footer': {
        padding: 'var(--padding-3x) var(--padding-4x)',
        // borderTop: '1px solid var(--color-gray-border-light)',
        backgroundColor: 'var(--color-gray-bg-card-white)',
        flexShrink: 0,
        zIndex: 10,
        position: 'sticky',
        bottom: 0,
        borderBottomLeftRadius: 'var(--radius-xl)',
        borderBottomRightRadius: 'var(--radius-xl)',
      },
    },
  };
};

/**
 * ChatFlowContainer 样式 Hook
 * @param prefixCls 组件类名前缀
 * @returns 样式对象
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('ChatFlowContainer', (token) => {
    const chatFlowToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(chatFlowToken), genStyle(chatFlowToken)];
  });
}
