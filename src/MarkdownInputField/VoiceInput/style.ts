import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      height: '32px',
      width: '32px',
      padding: '8px',
      cursor: 'pointer',
      borderRadius: '8px',
      backdropFilter: 'blur(20px)',
      '&:hover': {
        background: 'rgba(0, 28, 57, 0.0353)',
      },
      '&&-disabled': {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
      '&&-recording': {
        background: 'rgba(0, 116, 255, 0.09)',
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('VoiceInputButton', (token) => {
    const componentToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [resetComponent(componentToken), genStyle(componentToken)];
  });
}


