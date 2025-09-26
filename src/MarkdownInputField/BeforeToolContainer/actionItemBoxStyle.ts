import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      minHeight: '46px',
      borderRadius: '11px',
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      width: '100%',
      cursor: 'pointer',
      gap: '12px',
      justifyContent: 'space-between',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#FFF',

      '&&-hover-bg': {
        '&:hover': {
          boxShadow: '0px 2px 4px 0px rgba(225, 225, 225, 0.5)',
          backgroundImage:
            'radial-gradient(134% 291% at 7% -1%, rgba(249, 243, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(69% 177% at 100% -1%, rgba(236, 255, 241, 0.5) 0%, rgba(230, 238, 255, 0) 100%)',
        },
      },

      backgroundImage:
        'radial-gradient(14% 223% at 100% 62%, rgba(162, 255, 255, 0.126) 0%, rgba(153, 202, 255, 0.0537) 13%, rgba(229, 189, 255, 0.0371) 38%, rgba(235, 255, 245, 0) 100%)',
      '&&-standalone': {},
      '&-has-icon': {
        minHeight: '64px',
        height: '100%',
      },
      '&&-compact': {
        padding: '6px 12px',
        minHeight: '32px',
        borderRadius: '12px',
      },
      [`&&-compact&-small`]: {
        padding: '4px',
        minHeight: '24px',
      },
      '&-container': {
        borderRadius: '13px',
        display: 'flex',
        backgroundColor: 'rgba(230, 236, 244, 0.75)',
        alignItems: 'center',
        width: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: 1,
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          [`${token.componentCls}-option`]: {
            transform: 'translateX(0.4em)',
            color: '#1677FF',
          },
          [token.componentCls + '-icon']: {
            backgroundColor: '#fff',
          },
          backgroundColor: 'rgba(78, 135, 255, 0.8838)',
          [`& ${token.componentCls}-container-overflow-indicator::before`]: {
            opacity: 0.85,
          },
        },
        '&&-no-hover:hover': {
          [`${token.componentCls}-option`]: {
            transform: 'none',
            color: 'inherit',
          },
          [token.componentCls + '-icon']: {
            backgroundColor: 'inherit',
          },
          backgroundColor: 'inherit',
        },
        '&&-hover-bg': {
          '&:hover': {
            backgroundImage:
              'radial-gradient(17% 58% at -1% 11%, #FF75F4 0%, rgba(255, 129, 245, 0.9644) 11%, rgba(255, 255, 255, 0) 100%),linear-gradient(180deg, rgba(78, 135, 255, 0.8838) -1%, rgba(0, 147, 255, 0.6678) 100%)',
          },
        },
        '&-overflow-container': {
          pointerEvents: 'auto',
          position: 'absolute',
          right: 0,
          top: 2,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          background:
            'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
          borderRadius: 12,
          width: 120,

          '&-indicator': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: '100%',
            zIndex: 10,
            background: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.45)',
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.25), 0 2px 10px rgba(16,24,40,0.06)',
            borderRadius: 12,
            '&-icon': {
              color: '#767E8B',
            },
          },
          '&-popup': {
            position: 'relative',
            maxHeight: 360,
            overflowY: 'auto',
            background: '#fff',
            borderRadius: 8,
            marginBottom: 8,
            zIndex: 1000,
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            boxShadow:
              '0px 0px 1px 0px rgba(0, 15, 41, 0.05),0px 6px 16px 0px rgba(0, 15, 41, 0.08)',
            '> *': {
              width: 'auto',
              maxWidth: '100%',
            },
            '&-item': {
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: 'auto',
              alignSelf: 'flex-start',
              maxWidth: '100%',
              minWidth: 0,
              borderRadius: 8,
              transition: 'background-color 0.2s ease',
            },
            '&-item:hover': {
              backgroundColor: 'rgba(0, 16, 32, 0.04)'
            },
            // ensure hover background applies regardless of which node captures hover
            [`&-item:hover ${token.componentCls}`]: {
              backgroundColor: 'rgba(0, 16, 32, 0.0627)',
              backgroundImage: 'none',
              boxShadow: 'none',
            },
            [`&-item ${token.componentCls}:hover`]: {
              backgroundColor: 'rgba(0, 16, 32, 0.0627)',
              backgroundImage: 'none',
              boxShadow: 'none',
            },
            // drag states
            [`&-item.${token.componentCls.slice(1)}-dragging`]: {
              opacity: 0.6,
            },
            [`&-item.${token.componentCls.slice(1)}-drag-over`]: {
              backgroundColor: 'rgba(22, 119, 255, 0.08)',
              outline: '1px dashed rgba(22, 119, 255, 0.45)'
            },
            // popup specific overrides
            [`${token.componentCls}-container`]: {
              background: 'transparent',
              padding: 0,
              '&:hover': {
              backgroundColor: 'transparent',
              backgroundImage: 'none',
              },
            },
            [token.componentCls]: {
              background: 'transparent',
              boxShadow: 'none',
              padding: '0 8px',
              minHeight: 28,
              height: 28,
              lineHeight: '28px',
              borderRadius: 8,
              '&:hover': {
                backgroundColor: 'rgba(0, 16, 32, 0.0627)',
                backgroundImage: 'none',
                boxShadow: 'none',
                borderRadius: 8,
              },
            },
            // disable hover-bg variants inside popup
            [`${token.componentCls}-container-hover-bg`]: {
              '&:hover': {
                backgroundImage: 'none',
                backgroundColor: 'rgba(0, 16, 32, 0.0627)',
              },
            },
            [`${token.componentCls}-hover-bg`]: {
              '&:hover': {
                backgroundImage: 'none',
                backgroundColor: 'rgba(0, 16, 32, 0.0627)',
                boxShadow: 'none',
              },
            },
            [`${token.componentCls}-option`]: {
              display: 'none',
            },
            // drag handle visuals
            [`${token.componentCls}-drag-handle`]: {
              width: 14,
              height: 14,
              minWidth: 14,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#505C71',
              opacity: 0.6,
              cursor: 'grab',
              userSelect: 'none',
            },
            [`${token.componentCls}-drag-handle:active`]: {
              cursor: 'grabbing',
              opacity: 1,
            },
            [`${token.componentCls}-icon`]: {
              width: 20,
              height: 20,
              minWidth: 20,
              maxWidth: 20,
              borderRadius: 6,
              backgroundColor: '#F7F9FC',
            },
            [`${token.componentCls}-content-description`]: {
              display: 'none',
            },
            [`${token.componentCls}-content-title`]: {
              fontSize: '13px',
              lineHeight: '28px',
              fontWeight: 500,
            },
          },
        },

        '&-small': {
          borderRadius: 13,
        },
      },

      '&-small': {
        padding: '6px 14px',
        minHeight: 24,
        borderRadius: 12,
        gap: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      },
      '&-icon': {
        width: 40,
        height: 40,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minWidth: 40,
        maxWidth: 40,
        borderRadius: 12,
        backgroundColor: '#FBFCFD',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        '&-small': {
          backgroundColor: 'transparent',
          borderRadius: 2,
        },
      },

      '&-content': {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        maxWidth: '100%',
        '&-title': {
          fontWeight: 500,
          lineHeight: '24px',
          fontSize: '1em',
          color: '#19213D',
        },
        '&-title-no-description': {
          color: '#666F8D',
          lineHeight: '20px',
          fontWeight: 'normal',
        },
        '&-description': {
          color: '#666F8D',
          fontSize: '1em',
          textWrap: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          lineHeight: 1,
        },
      },
      '&-option': {
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  };
};

/**
 * ActionItemBox
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('ActionItemBox', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(proChatToken), resetComponent(proChatToken)];
  });
}
