import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../utils/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      maxWidth: '100%',
      overflow: 'auto',
      borderRadius: '16px',
      'th,td': {
        padding: '8px 16px',
        textAlign: 'left',
        fontWeight: 500,
        border: '1px solid rgb(232, 232, 232)',
      },
      '& tr:first-child:': {
        'th,td': {
          fontWeight: 600,
        },
      },
      '& .ant-descriptions-view table,.ant-descriptions-view th,.ant-descriptions-view td':
        {
          border: 'none',
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
  return useEditorStyleRegister('editor-content-description', (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(editorToken)];
  });
}
