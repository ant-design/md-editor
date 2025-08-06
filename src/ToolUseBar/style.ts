import { Keyframes } from '@ant-design/cssinjs';
import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';
const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  const moveLighting = new Keyframes(`lui-tool-use-bar-move-lighting`, {
    '100%': { left: '100%' },
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
        '&-loading': {
          '&::before': {
            display: 'none',
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '-50%',
            height: '200%',
            zIndex: 999,
            boxShadow: '0 0 20px 6px rgba(243, 244, 245, 1)',
            transform: 'translateY(-50%) rotateZ(-45deg)',
            animation: 'moveLighting 0.7s ease-out 0s infinite',
            animationName: moveLighting,
          },
        },
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
      },

      '&-tool-image': {
        color: '#767E8B',
        fontSize: '14px',
      },

      '&-tool-target': {
        fontSize: '12px',
        fontWeight: 'normal',
        lineHeight: '20px',
        flex: 1,
        color: '#959DA8',
        marginRight: 30,
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
