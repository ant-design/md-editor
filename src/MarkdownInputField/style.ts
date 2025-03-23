import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      width: '100%',
      height: '100%',
      display: 'flex',
      boxShadow: `0 1px 2px 0 rgba(0, 0, 0, 0.03),0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)`,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      outline: '1px solid #d9d9d9',
      borderRadius: '12px',
      minHeight: '32px',
      maxWidth: 980,
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
      '&:hover': {
        outline: '2px solid #1890ff',
      },
      '&&-disabled': {
        opacity: 0.5,
        backgroundColor: 'rgba(0,0,0,0.04)',
        cursor: 'not-allowed',
        '&:hover': {
          outline: '1px solid #d9d9d9',
        },
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
  return useEditorStyleRegister('MarkdownInputField', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(proChatToken), genStyle(proChatToken)];
  });
}
