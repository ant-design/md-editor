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
        borderCollapse: 'separate',
        borderSpacing: 0,
        display: 'table',
        minWidth: '100%',
        position: 'relative',
        whiteSpace: 'nowrap',
        width: 'max-content',
        maxWidth: '100%',
        overflow: 'auto',
        fontVariant: 'tabular-nums',
        'td,th': {
          borderLeft: '1px solid rgb(232, 232, 232)',
          padding: '0.6em',
        },
        th: {
          padding: '0.6em',
          textAlign: 'left',
          fontWeight: 500,
          backgroundColor: 'rgb(229 231 235 / 0.5)',
        },
        tr: {
          'td,th': {
            borderBottom: '1px solid rgb(232, 232, 232)',
          },
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
