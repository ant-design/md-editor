import { Keyframes } from '@ant-design/cssinjs';
import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  const rotate = new Keyframes(`lui-tool-use-bar-rotate`, {
    '100%': { transform: 'rotate(360deg)' },
  });
  const maskMove = new Keyframes(`lui-tool-use-bar-maskMove`, {
    '0%': { backgroundPosition: '200% 0' },
    '40%': { backgroundPosition: '0% 0' },
    '100%': { backgroundPosition: '-100% 0' },
  });

  return {
    [token.componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      '*': {
        boxSizing: 'border-box',
      },
      '&-tool': {
        position: 'relative',
        '&-active': {
          background: '#FFFFFF',
          boxSizing: 'border-box',
          outline: '1.5px solid #1D7AFC',
          boxShadow:
            '0px 0px 1px 0px rgba(0, 19, 41, 0.2),0px 1.5px 4px -1px rgba(0, 19, 41, 0.04)',
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          background: 'rgba(20, 22, 28, 0.06)',
        },
        borderRadius: '12px',
        background: 'rgba(20, 22, 28, 0.03)',
        boxSizing: 'border-box',
        outline: '1px solid rgba(20, 22, 28, 0.07)',
        boxShadow: 'inset 0px 0px 1px 0px rgba(0, 19, 41, 0.15)',
        minHeight: '28px',
        width: 'max-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4px',
        gap: '4px',
        zIndex: 1,
      },

      '&-tool-bar': {
        borderRadius: '12px',
        minHeight: '28px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 1,
      },

      '&-tool-arrow': {
        color: 'rgba(0, 4, 15, 27%)',
        transition: 'transform 0.3s ease',
      },

      '&-tool-header': {
        height: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'space-between',
      },

      '&-tool-header-left': {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      },

      '&-tool-expand': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        color: '#767E8B',
        fontSize: '14px',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: 'rgba(20, 22, 28, 0.06)',
          color: '#959DA8',
        },
      },

      '&-tool-name': {
        fontSize: '12px',
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
          animation: 'maskMove 2s linear infinite',
          backgroundSize: '200% auto',
          animationName: maskMove,
        },
      },

      '&-tool-image-wrapper': {
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
        border: '1px solid rgba(0, 16, 40, 0.13)',
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
              'conic-gradient(from 0deg, #4facfe 0deg, #00f2fe 60deg, transparent 120deg, transparent 360deg)',
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

      '&-tool-image': {
        color: '#767E8B',
        fontSize: '15px',
        position: 'absolute',
        zIndex: 999,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },

      '&-tool-target': {
        fontSize: '12px',
        fontWeight: 'normal',
        lineHeight: '20px',
        flex: 1,
        color: '#959DA8',
        marginRight: 30,
        '&-loading': {
          position: 'relative',
          background:
            'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 30%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0.6) 70%, rgba(0, 0, 0, 0) 100%)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          animation: 'maskMove 2s linear infinite',
          backgroundSize: '200% auto',
          animationName: maskMove,
        },
      },
      '&-tool-time': {
        fontSize: '12px',
        fontWeight: 'normal',
        lineHeight: '12px',
        letterSpacing: '0.04em',
        height: '20px',
        minWidth: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '200px',
        background: 'rgba(20, 22, 28, 0.06)',
        padding: '4px 6px',
        color: '#767E8B',
        gap: '8px',
        fontFamily: `Rubik, sans-serif`,
        zIndex: 1,
      },
      '&-tool-container': {
        display: 'flex',
        width: '100%',
      },
      '&-tool-content': {
        flex: 1,
        fontSize: '12px',
        fontWeight: 'normal',
        lineHeight: '160%',
        letterSpacing: 'normal',
        color: '#767E8B',
      },
      '&-tool-content-error': {
        display: 'flex',
        width: '100%',
        borderRadius: '8px',
        background: 'rgba(255, 187, 0, 0.22)',
        color: '#A56900',
        padding: '8px',
        fontSize: '13px',
        alignItems: 'center',
        gap: 8,
      },
      '&-tool-content-error-icon': {
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '12px',
        letterSpacing: 'normal',
        color: '#A56900',
      },
      '&-tool-error': {
        '&-tool-image-wrapper': {
          '& .anticon': {
            color: '#F15B50',
          },
        },
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('tool-use-bar', (token) => {
    const toolBarToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genStyle(toolBarToken)];
  });
}
