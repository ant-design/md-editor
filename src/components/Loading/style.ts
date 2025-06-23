import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      width: 20,
      height: 4,
      display: 'flex',
      padding: '0 4px 0 0',
      gap: 2,
      zIndex: 0,

      [`${token.componentCls}-item`]: {
        width: 4,
        height: 4,
        background: 'rgba(0, 114, 255, 21%)',
        borderRadius: '50%',

        '&:nth-child(1)': {
          animation: 'loading 1.5s infinite',
        },

        '&:nth-child(2)': {
          animation: 'loading 1.5s infinite',
          animationDelay: '0.5s',
        },

        '&:nth-child(3)': {
          animation: 'loading 1.5s infinite',
          animationDelay: '1s',
        },
      },

      '@keyframes loading': {
        '0%': {
          backgroundColor: '#74a9fc',
        },
        '100%': {
          background: 'rgba(0, 114, 255, 21%)',
        },
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('loading', (token) => {
    const loadingToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genStyle(loadingToken)];
  });
}
