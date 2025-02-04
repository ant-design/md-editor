import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../utils/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      border: '1px solid rgb(209 213 219 / 0.8)',
      "div[data-be='paragraph']": {
        marginTop: '0',
      },
      '> div': {
        borderRight: '1px solid rgb(209 213 219 / 0.8)',
        padding: '16px 16px',
        textAlign: 'left',
        fontWeight: 500,
        flex: 1,
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
