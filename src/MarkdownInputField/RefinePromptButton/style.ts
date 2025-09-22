import { Keyframes } from '@ant-design/cssinjs';
import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const spinnerRotate = new Keyframes('refineSpinnerRotate', {
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      width: 28,
      height: 28,
      padding: 4,
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      cursor: 'pointer',
      // 图标颜色
      color: 'rgba(0, 25, 61, 0.3255)',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(0, 25, 61, 0.06)',
        color: 'rgba(0, 25, 61, 0.65)',
      },
      '&&-disabled': {
        cursor: 'not-allowed',
        opacity: 0.6,
      },
      '.refine-icon-ring': {
        opacity: 0.15,
      },
      '.refine-icon-spinner': {
        transformOrigin: '16px 16px',
        animationName: spinnerRotate,
        animationDuration: '1s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('RefinePromptButton', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(proChatToken), genStyle(proChatToken)];
  });
}


