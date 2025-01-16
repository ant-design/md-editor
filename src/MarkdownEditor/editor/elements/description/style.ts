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
      borderRadius: '0.5em',
      border: '1px solid rgb(232, 232, 232)',
      table: {
        '& th': {
          padding: '12px 20px',
          textAlign: 'left',
          fontWeight: 500,
          border: '1px solid rgb(232, 232, 232)',
          borderRadius: '0.5em',
        },
        '& td': {
          padding: '12px 20px',
          textAlign: 'left',
          border: '1px solid rgb(232, 232, 232)',
          borderRadius: '0.5em',
        },
        '& tr': {
          'td:first-child': {
            borderLeft: 'none',
          },
          'td:last-child': {
            borderRight: 'none',
          },
          'th:first-child': {
            borderLeft: 'none',
          },
        },
        '& tr:first-child': {
          th: {
            borderTop: 'none',
          },
          td: {
            borderTop: 'none',
          },
        },
        '& tr:last-child': {
          th: {
            borderBottom: 'none',
          },
          td: {
            borderBottom: 'none',
          },
        },
        '& .ant-descriptions-view table,.ant-descriptions-view th,.ant-descriptions-view td':
          {
            border: 'none',
          },
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
