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
        '&::before': {
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
        borderRadius: '200px',
        background: 'rgba(20, 22, 28, 0.06)',
        boxSizing: 'border-box',
        border: '0px solid rgba(20, 22, 28, 0.07)',
        boxShadow: 'inset 0px 0px 1px 0px rgba(0, 19, 41, 0.15)',
        minHeight: '28px',
        width: 'max-content',
        display: 'flex',
        alignItems: 'center',
        padding: '2px 3px 2px 2px',
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
      },

      '&-tool-header-left': {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
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
        letterSpacing: 'normal',
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
