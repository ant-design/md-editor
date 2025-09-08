import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      position: 'relative',
      maxWidth: '100vw',
      padding: 'var(--padding-0-5x) var(--padding-3x)',
      marginBottom: 'var(--margin-6x)',
      cursor: 'pointer',
      '&&-compact': {
        padding: 'var(--padding-0-5x) var(--padding-3x)',
      },
      '.md-editor-code': {
        borderRadius: '12px !important',
        overflow: 'auto',
        padding: 'var(--padding-3x)',
      },
      '&:hover': {
        [`${token.componentCls}-bubble-title-time`]: {
          visibility: 'visible',
          opacity: 1,
          fontWeight: 400,
        },
      },
      '&-bubble-avatar': {
        width: 40,
        height: 40,
      },
      '&-bubble-avatar-title': {
        lineHeight: '20px',
        textAlign: 'justify',
        letterSpacing: 'normal',
        color: 'var(--color-gray-text-default)',
        fontSize: '1em',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--margin-1x)',
        span: {
          fontWeight: 600,
          fontSize: '1em',
          color: 'var(--color-gray-text-default)',
          display: 'flex',
          alignItems: 'center',
        },
      },
      '&-bubble-avatar-title-right': {
        display: 'none',
      },
      '&-bubble-avatar-emoji': {
        fontSize: 24,
        textAlign: 'center',
        lineHeight: '36px',
      },
      '&-bubble-container': {
        width: '100%',
        display: 'flex',
        '&-right': {
          alignItems: 'flex-end',
        },
        '&-left': {
          alignItems: 'flex-start',
        },
      },
      '&-bubble-content': {
        fontSize: '1em',
        minHeight: '2em',
        width: 'max-content',
        borderRadius: '12px',
        background: 'var(--color-gray-bg-card-white)',
        boxShadow:
          '0px 0px 1px 0px rgba(0, 19, 41, 0.2),0px 1.5px 4px -1px rgba(0, 19, 41, 0.04)',
        maxWidth: 'min(860px,100%)',
        justifyContent: 'center',
        gap: 0,
        lineHeight: '22px',
        padding: 0,
        backdropFilter: 'blur(10px)',
        color: 'var(--color-gray-text-secondary)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 0,
        '&&-compact': {
          minHeight: '38px',
          padding: '0px',
        },
        '&&-pure': {
          boxShadow: 'none',
          backgroundColor: 'transparent',
          color: 'var(--color-gray-text-default)',
        },
        '&-standalone': {
          maxWidth: 'min(860px,100%)',
        },
        '*': {
          whiteSpace: 'pre-wrap',
          textWrap: 'wrap',
          wordWrap: 'break-word',
        },
        video: {
          borderRadius: '12px',
          overflow: 'auto',
        },
        [`div['data-be=code']`]: {
          borderRadius: '12px',
          overflow: 'auto',
        },
        img: {
          borderRadius: '12px',
          overflow: 'auto',
        },
      },
      '&-bubble-after': {
        width: 'max-content',
        minWidth: '0px',
        display: 'flex',
        maxWidth: 'min(860px,100%)',
        '&-left': {
          justifyContent: 'flex-start',
        },
        '&-right': {
          justifyContent: 'flex-end',
        },
      },
      '&-bubble-before': {
        width: 'max-content',
        minWidth: '0px',
        maxWidth: 'min(860px,100%)',
      },
      '&-bubble-content-right': {
        background: 'var(--color-primary-bg-card-light)',
        color: 'var(--color-gray-text-default)',
        borderRadius: '12px 6px 12px 12px',
        '&&-pure': {
          background: 'var(--color-primary-control-fill-primary)',
        },
      },
    },
  };
};

/**
 * Probubble
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('ListItem', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(proChatToken), genStyle(proChatToken)];
  });
}
