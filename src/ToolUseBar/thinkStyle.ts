import { Keyframes } from '@ant-design/cssinjs';
import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  const rotate = new Keyframes(`lui-tool-use-bar-think-rotate`, {
    '100%': { transform: 'rotate(360deg)' },
  });
  const maskMove = new Keyframes(`lui-tool-use-bar-think-maskMove`, {
    '0%': { backgroundPosition: '200% 0' },
    '40%': { backgroundPosition: '0% 0' },
    '100%': { backgroundPosition: '-100% 0' },
  });

  return {
    [token.componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      '*': {
        boxSizing: 'border-box',
      },
      '&-active': {
        background: '#FFFFFF',
        boxSizing: 'border-box',
        boxShadow:
          '0px 0px 1px 0px rgba(0, 19, 41, 0.2),0px 1.5px 4px -1px rgba(0, 19, 41, 0.04)',
      },
      cursor: 'pointer',
      '&:hover': {
        boxShadow: 'inset 0px 0px 1px 0px rgba(0, 19, 41, 0.15)',
      },
      borderRadius: '12px',
      boxShadow: 'inset 0px 0px 1px 0px rgba(0, 19, 41, 0.15)',
      boxSizing: 'border-box',
      minHeight: '28px',
      width: 'max-content',
      maxWidth: 'min(348px,100%)',
      alignItems: 'center',
      padding: '4px',
      zIndex: 1,
      '&-expanded': {
        gap: 0,
      },
      '&-success': {
        background: 'rgba(0, 28, 57, 0.0353)',
        boxShadow: 'inset 0px 0px 1px 0px rgba(0, 19, 41, 0.15)',
      },
      '&-loading': {},
      '&-bar': {
        borderRadius: '12px',
        minHeight: '28px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 1,
      },

      '&-header': {
        height: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'space-between',
      },

      '&-header-left': {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      },

      '&-expand': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        color: '#767E8B',
        fontSize: 'var(--font-size-base)',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: 'rgba(29, 122, 252, 0.1)',
          color: '#767E8B',
        },
      },

      '&-name': {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 500,
        lineHeight: '20px',
        letterSpacing: 'normal',
        color: '#767E8B',
        '&-loading': {
          position: 'relative',
          background:
            'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 30%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0.6) 70%, rgba(0, 0, 0, 0) 100%)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          animationName: maskMove,
          animationDuration: '2s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          backgroundSize: '200% auto',
        },
      },

      '&-image-wrapper': {
        width: '24px',
        height: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4px',
        gap: '0px 8px',
        flexWrap: 'wrap',
        alignContent: 'center',
        borderRadius: '200px',
        boxSizing: 'border-box',
        background:
          'linear-gradient(180deg, rgba(0, 0, 85, 0) 0%, rgba(0, 0, 85, 0.02) 100%), #FFFFFF',
        border: '1px solid rgba(0, 31, 62, 0.1294)',
        zIndex: 0,
        '&-loading': {
          borderRadius: '50%',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0',
            borderRadius: '50%',
            padding: '2px',
            left: '-2px',
            top: '-2px',
            right: '-2px',
            bottom: '-2px',
            background:
              'conic-gradient(from 0deg, #767E8B; 0deg, #4facfe 60deg, transparent 120deg, transparent 360deg)',
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation:
              'spin 1.2s cubic-bezier(0.55, 0.06, 0.68, 0.19) infinite',
            animationName: rotate,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: '4px',
            background: '#f9f9f9',
            borderRadius: '50%',
          },
        },
      },

      '&-image': {
        color: '#767E8B',
        fontSize: 'var(--font-size-lg)',
        position: 'absolute',
        zIndex: 999,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },

      '&-target': {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'normal',
        lineHeight: '20px',
        flex: 1,
        color: '#959DA8',
        marginRight: 30,
      },
      '&-time': {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'normal',
        lineHeight: '12px',
        letterSpacing: '0.04em',
        color: 'rgba(0, 24, 61, 0.2471)',
      },
      '&-container': {
        width: '100%',
        padding: 8,
        display: 'flex',
        maxHeight: 700,
        position: 'relative',
      },
      '&-container-loading': {
        display: 'flex',
        width: '100%',
        flexDirection: 'column-reverse',
        maxHeight: 158,
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          [`&-floating-expand`]: {
            opacity: 1,
            visibility: 'visible',
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          height: 48,
          right: 0,
          borderRadius: '12px',
          background:
            'linear-gradient(to bottom, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 48,
          right: 0,
          borderRadius: '12px',
          background:
            'linear-gradient(to top, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        },
      },
      '&-content': {
        flex: 1,
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'normal',
        lineHeight: '160%',
        letterSpacing: 'normal',
        color: '#767E8B',
      },
      '&-floating-expand': {
        position: 'absolute',
        bottom: '8px',
        right: 'calc(50% - 35px)',
        width: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '32px',
        color: '#767E8B',
        fontSize: 'var(--font-size-base)',
        cursor: 'pointer',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0, 19, 41, 0.1)',
        boxShadow: '0px 2px 8px rgba(0, 19, 41, 0.15)',
        transition: 'all 0.2s ease',
        padding: '16px 5px',
        zIndex: 10,
        '&:active': {
          transform: 'translateY(0px)',
        },
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('tool-use-bar-think', (token) => {
    const toolBarToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genStyle(toolBarToken)];
  });
}
