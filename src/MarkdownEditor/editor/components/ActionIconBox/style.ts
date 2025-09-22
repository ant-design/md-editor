import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      minWidth: 14,
      minHeight: 14,
      maxHeight: 24,
      lineHeight: 1,
      display: 'flex',
      cursor: 'pointer',
      padding: 4,
      alignItems: 'center',
      gap: 4,
      transition: 'all 0.3s',
      justifyContent: 'center',
      borderRadius: 'var(--radius-control-sm)',
      fontSize: '1em',
      color: 'var(--color-gray-a9)',
      '&-noPadding': {
        padding: 0,
      },
      '&:hover': {
        background: 'var(--color-gray-control-fill-active)',
        boxSizing: 'border-box',
        border: 'var(--color-gray-border-light)',
      },
      '&-standalone': {
        minWidth: 'inherit',
        minHeight: 'inherit',
        maxHeight: 'inherit',
        padding: '8px 12px',
        color: '#000000',
        borderRadius: 18,
        border: '1px solid #E6ECF4',
        background: `radial-gradient(22% 66% at 96% 113%, rgba(255, 255, 245, 0.52) 0%, rgba(230, 238, 255, 0) 100%),radial-gradient(14% 234% at 100% 50%, rgba(162, 255, 255, 0.28) 0%, rgba(153, 202, 255, 0.1193) 13%, rgba(229, 189, 255, 0.0826) 38%, rgba(231, 211, 252, 0.0544) 59%, rgba(235, 255, 245, 0) 100%)`,
      },
      '&-danger': {
        '&:hover': {
          color: token.colorError,
          background: token.colorErrorBgHover,
        },
      },
      '&-primary': {
        '&:hover': {
          color: token.colorPrimary,
          background: token.colorPrimaryBgHover,
        },
      },
      '&-border-less': {
        height: 'auto',
        lineHeight: 1,
        background: 'none!important',
        '&:hover': {
          color: token.colorPrimary,
          background: 'none!important',
        },
      },
      '&-only-icon': {
        '&:hover': {
          transform: 'scale(1.1)',
        },
      },
      '&-transform': {
        '&:hover': {
          color: token.colorPrimary,
          transform: 'translateX(8px) scale(1.1)',
          background: 'none',
        },
      },
      '&-active': {
        color: token.colorPrimary,
      },
    },
  };
};

/**
 * Probubble
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls: string) {
  return useEditorStyleRegister('ActionIconBox', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(proChatToken)];
  });
}
