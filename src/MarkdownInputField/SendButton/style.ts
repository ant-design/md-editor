import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      fontSize: '32px',
      padding: '0px 6px',
      height: 32,
      display: 'flex',
      alignItems: 'center',
      lineHeight: '32px',
      cursor: 'pointer',
      '&&-disabled': {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
      '&&-loading': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
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

    return [resetComponent(proChatToken), genStyle(proChatToken)];
  });
}
