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
      padding: '2px 20px',
      marginBottom: '1.2em',
      contentVisibility: 'auto',
      cursor: 'pointer',
      containIntrinsicSize: '100px',
      '&&-compact': {
        padding: '2px 20px',
      },
      '.md-editor-code': {
        borderRadius: '20px !important',
        overflow: 'auto',
        padding: '12px 12px',
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
        fontSize: '1em',
        lineHeight: '24px',
        color: 'var(--color-icon-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        span: {
          fontSize: '1em',
          color: 'var(--color-icon-secondary)',
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
        borderRadius: '6px 12px 12px 12px',
        display: 'flex',
        minHeight: '2em',
        width: 'max-content',
        maxWidth: 'min(860px,100%)',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 0,
        lineHeight: '22px',
        padding: 0,
        backdropFilter: 'blur(10px)',
        color: 'var(--color-icon-secondary)',
        boxShadow: '0px 1px 3px 0px rgba(25, 33, 61, 0.1)',
        backgroundColor: token.colorBgContainer,
        '&&-compact': {
          minHeight: '38px',
          padding: '0px',
        },
        '&&-pure': {
          boxShadow: 'none',
          backgroundColor: 'transparent',
          color: token.colorText,
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
        background:
          'linear-gradient(0deg, #1677FF, #1677FF), linear-gradient(0deg, #00315D, #00315D), #FFFFFF',
        color: '#fff',
        borderRadius: '12px 6px 12px 12px',
        '&&-pure': {
          background: '#1677FF',
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
