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
      gap: 4,
      '*': {
        boxSizing: 'border-box',
      },

      cursor: 'pointer',
      '&:hover': {
        boxShadow: 'inset 0px 0px 1px 0px rgba(0, 19, 41, 0.15)',
      },
      boxSizing: 'border-box',
      minHeight: '28px',
      width: 'max-content',
      maxWidth: 'min(348px,100%)',
      alignItems: 'center',
      padding: '4px',
      zIndex: 1,
      borderRadius: 'var(--radius-card-base)',
      background: 'var(--color-gray-bg-card-white)',
      boxShadow: 'var(--shadow-control-base)',
      '&-light': {
        border: 'none',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      '&-expanded': {
        gap: 0,
      },
      '&-success': {
        borderRadius: 'var(--radius-card-base)',
        background: 'var(--color-gray-bg-card-light)',
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
        fontWeight: 500,
        lineHeight: '20px',
        font: 'var(--font-text-body-emphasized-sm)',
        letterSpacing: 'var(--letter-spacing-body-emphasized-sm, normal)',
        color: 'var(--color-gray-text-secondary)',
        '&-light': {
          color: 'var(--color-gray-text-default)',
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
        lineHeight: '20px',
        flex: 1,
        marginRight: 30,
        font: 'var(--font-text-body-emphasized-sm)',
        letterSpacing: 'var(--letter-spacing-body-emphasized-sm, normal)',
        color: 'var(--color-gray-text-secondary)',
      },
      '&-time': {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'normal',
        lineHeight: '12px',
        letterSpacing: '0.04em',
        color: 'var(--color-gray-text-disabled)',
      },
      '&-container': {
        width: '100%',
        padding: 8,
        display: 'flex',
        maxHeight: 700,
        position: 'relative',
        '&-light': {
          borderLeft: '1px solid var(--color-gray-border-light)',
        },
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
        fontSize: '13px',
        fontWeight: 'normal',
        lineHeight: '22px',
        letterSpacing: 'normal',
        color: 'var(--color-gray-text-light)',
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
