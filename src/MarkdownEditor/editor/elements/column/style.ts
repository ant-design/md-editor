import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../utils/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      width: '100%',
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
      border: '1px solid rgb(209 213 219 / 0.8)',
      p: {
        marginTop: '0',
      },
      'th,td': {
        border: '1px solid rgb(209 213 219 / 0.8)',
        padding: '8px 16px',
        textAlign: 'left',
        fontWeight: 500,
      },
    },
  };
};

/**
 * AgentChat
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('editor-content-column', (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(editorToken)];
  });
}
