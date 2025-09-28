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
      borderTopLeftRadius: 'var(--radius-xl)',
      borderTopRightRadius: 'var(--radius-xl)',
      borderBottomLeftRadius: 'var(--radius-xl)',
      borderBottomRightRadius: 'var(--radius-xl)',
      backgroundColor: 'var(--color-gray-bg-card-white)',

      '&-header': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--padding-3x) var(--padding-4x)',
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
      },

      '&-content': {
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        paddingBottom: 'var(--radius-xl)',
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',

        '&-scrollable': {
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 'var(--padding-6x)',

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
        padding: 'var(--padding-6x)',
        background: 'linear-gradient(to bottom, #fff0 20%, var(--color-gray-bg-card-white) 70%)',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        zIndex: 100,
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
