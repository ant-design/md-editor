import { Keyframes } from '@ant-design/cssinjs';
import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../Hooks/useStyle';

const animateGradientText = new Keyframes('animateGradientText', {
  '0%': {
    backgroundPosition: '0% 50%',
  },
  '50%': {
    backgroundPosition: '100% 50%',
  },
  '100%': {
    backgroundPosition: '0% 50%',
  },
});

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      position: 'relative',
      margin: '0 auto',
      display: 'flex',
      maxWidth: 'fit-content',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      backdropFilter: 'blur(10px)',
      transition: 'box-shadow 0.5s ease-out',
      overflow: 'hidden',
      cursor: 'pointer',

      ['&-gradient-overlay']: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundSize: '300% 100%',
        animationName: animateGradientText,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        borderRadius: 'inherit',
        zIndex: 0,
        pointerEvents: 'none',

        '&::before': {
          content: "''",
          position: 'absolute',
          left: 0,
          top: 0,
          borderRadius: 'inherit',
          width: 'calc(100% - 2px)',
          height: 'calc(100% - 2px)',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#060010',
          zIndex: -1,
        },
      },

      ['&-text-content']: {
        display: 'inline-block',
        position: 'relative',
        zIndex: 2,
        backgroundSize: '300% 100%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        animationName: animateGradientText,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
      },
    },
  };
};

export const useGradientTextStyle = (prefixCls: string) => {
  return useEditorStyleRegister('gradient-text', (token) => {
    const gradientTextToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(gradientTextToken)];
  });
};
