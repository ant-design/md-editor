import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,

      '&-playBox': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        cursor: 'pointer',
        borderRadius: 6,
        boxSizing: 'border-box',
      },

      '&-playBox:hover': {
        background: 'rgba(0, 28, 57, 0.0353)',
      },

      '&-playingWrap': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 6,
        background: '#FFFFFF',
        boxShadow:
          '0px 0px 1px 0px rgba(0, 19, 41, 0.2),0px 1.5px 4px -1px rgba(0, 19, 41, 0.04)',
        width: 82,
        height: 24,
        padding: '2px',
      },

      '&-playingBox': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: 6,
        cursor: 'pointer',
      },
      '&-playingBox:hover': {
        background: 'rgba(0, 28, 57, 0.0353)',
      },

      '&-rateBox': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 8px',
        width: 56,
        height: 20,
        gap: 2,
        cursor: 'pointer',
        borderRadius: 6,
      },
      '&-rateBox:hover': {
        background: 'rgba(0, 28, 57, 0.0353)',
      },

      '&-rateItem': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 90,
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('VoiceButton', (token) => {
    const cls = prefixCls ? `.${prefixCls}` : `${token.chatCls}-voice-button`;
    const proChatToken = { ...token, componentCls: cls };
    return [resetComponent(proChatToken), genStyle(proChatToken)];
  });
}
