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
        [`${token.componentCls}-message-title-time`]: {
          visibility: 'visible',
          opacity: 1,
          fontWeight: 400,
        },
      },
      '&-message-avatar': {
        width: 40,
        height: 40,
      },
      '&-message-avatar-title': {
        fontSize: '1em',
        lineHeight: '24px',
        color: '#666F8D',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        span: {
          fontSize: '1em',
          color: '#666F8D',
          display: 'flex',
          alignItems: 'center',
        },
      },
      '&-message-avatar-title-right': {
        display: 'none',
      },
      '&-message-avatar-emoji': {
        fontSize: 24,
        textAlign: 'center',
        lineHeight: '36px',
      },
      '&-message-container': {
        width: '100%',
        display: 'flex',
        '&-right': {
          alignItems: 'flex-end',
        },
        '&-left': {
          alignItems: 'flex-start',
        },
      },
      '&-message-content': {
        fontSize: '1em',
        maxWidth: '100%',
        borderRadius: '6px 12px 12px 12px',
        display: 'flex',
        minHeight: '2em',
        width: 'max-content',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 0,
        lineHeight: '22px',
        padding: 0,
        backdropFilter: 'blur(10px)',
        color: '#666F8D',
        boxShadow: '0px 1px 3px 0px rgba(25, 33, 61, 0.1)',
        backgroundColor: token.colorBgContainer,
        '&&-compact': {
          minHeight: '38px',
          padding: '0px',
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
      '&-message-content-right': {
        background:
          'linear-gradient(0deg, #1677FF, #1677FF), linear-gradient(0deg, #00315D, #00315D), #FFFFFF',
        color: '#fff',
        borderRadius: '12px 6px 12px 12px',
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

    return [genStyle(proChatToken), resetComponent(proChatToken)];
  });
}
