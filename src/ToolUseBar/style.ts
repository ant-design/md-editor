import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
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
        minHeight: '20px',
        width: 'max-content',
        maxWidth: 'min(800px,100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4px',
        gap: '4px',
        zIndex: 1,
      },

      '&-tool-bar': {
        borderRadius: '12px',
        minHeight: '20px',
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
        height: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'space-between',
      },

      '&-tool-header-right': {
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
        fontSize: 'var(--font-size-base)',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: 'rgba(20, 22, 28, 0.06)',
          color: '#959DA8',
        },
      },

      '&-tool-name': {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 500,
        lineHeight: '20px',
        letterSpacing: 'normal',
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        lineClamp: 1,
        color: '#767E8B',
        '&-loading': {
          position: 'relative',
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
            background:
              'conic-gradient(from var(--rotate, 0deg), var(--sub1-color) 0 45deg, transparent 45deg 360deg)',
            WebkitMask:
              'radial-gradient(50% 50% at 50% 50%, rgba(255, 0, 0, 0) 65%, #FF0000 100%)',
            mask: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 0, 0, 0) 65%, #FF0000 100%)',
            transformOrigin: '50% 50%',
            filter: 'blur(4px)',
          },
        },
      },

      '&-tool-image': {
        color: '#767E8B',
        fontSize: 'var(--font-size-lg)',
        position: 'absolute',
        zIndex: 999,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },

      '&-tool-target': {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'normal',
        lineHeight: '20px',
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        lineClamp: 1,
        overflow: 'hidden',
        textWrap: 'nowrap ',
        color: '#959DA8',

        marginRight: 30,
        '&-loading': {
          position: 'relative',
        },
      },
      '&-tool-time': {
        fontSize: 'var(--font-size-sm)',
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
        zIndex: 1,
      },
      '&-tool-container': {
        display: 'flex',
        width: '100%',
      },
      '&-tool-content': {
        flex: 1,
        fontSize: 'var(--font-size-sm)',
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
        fontSize: 'var(--font-size-base)',
        alignItems: 'center',
        gap: 8,
      },
      '&-tool-content-error-icon': {
        alignItems: 'center',
        fontSize: 'var(--font-size-base)',
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
  } as any;
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
