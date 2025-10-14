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
      justifyContent: 'center',
      position: 'relative',
      zIndex: 0,

      // wrapper 样式
      [`${token.componentCls}-wrapper1, ${token.componentCls}-wrapper2`]: {
        position: 'absolute',
        borderRadius: '50%',
        transformStyle: 'preserve-3d',
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
