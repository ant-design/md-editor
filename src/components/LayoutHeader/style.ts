import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--padding-4x)',
      backgroundColor: 'var(--color-gray-bg-page-light)',
      minHeight: '48px',
      flexShrink: 0,
      zIndex: 10,
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit',

      // 左侧区域样式
      [`${token.componentCls}-left`]: {
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
      },

      // 右侧区域样式
      [`${token.componentCls}-right`]: {
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
          transition: 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',

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
  };
};

export const useLayoutHeaderStyle = (prefixCls: string) => {
  return useEditorStyleRegister('layout-header', (token) => {
    const layoutHeaderToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(layoutHeaderToken)];
  });
};
