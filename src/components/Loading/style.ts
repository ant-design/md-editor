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
      width: '2em',
      height: '2em',
      zIndex: 0,
      // 添加黑色背景以匹配图片效果
      backgroundColor: '#000000',
      borderRadius: '8px',
      overflow: 'hidden',
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
