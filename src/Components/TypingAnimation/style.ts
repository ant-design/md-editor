import { Keyframes } from '@ant-design/cssinjs';
import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../Hooks/useStyle';

const animation = new Keyframes('animation', {
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      lineHeight: '5rem',
      tracking: '-0.02em',

      ['&-cursor']: {
        display: 'inline-block',
      },

      ['&-cursor-blinking']: {
        animationName: animation,
        animationDuration: '1s',
        animationTimingFunction: 'steps(1, end)',
        animationIterationCount: 'infinite',
      },
    },
  };
};

export const useTypingAnimationStyle = (prefixCls: string) => {
  return useEditorStyleRegister('typing-animation', (token) => {
    const typingAnimationToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(typingAnimationToken)];
  });
};
