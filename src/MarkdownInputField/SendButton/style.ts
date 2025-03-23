import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      fontSize: 32,
      padding: '0px 6px',
      height: 40,
      display: 'flex',
      alignItems: 'center',
      lineHeight: '40px',
      cursor: 'pointer',
      '&&-compact': {
        height: 34,
        fontSize: 32,
        lineHeight: 1,
      },
      '&&-disabled': {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
    },
  };
};

/**
 * ProchatItem
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('SendButton', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(proChatToken), resetComponent(proChatToken)];
  });
}
