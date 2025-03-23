import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      overflow: 'auto',
      '&-container': {
        display: 'flex',
        gap: 1,
        maxWidth: '100%',
        minWidth: 0,
        outline: 'none',
        position: 'relative',
        marginBottom: 12,
      },
      '&-container-editable': {
        width: '100%',
      },
      '&-editor-table': {
        marginTop: '1em',
      },
      'table:not(.htCore)': {
        borderCollapse: 'separate',
        borderSpacing: 0,
        display: 'table',
        minWidth: '100%',
        position: 'relative',
        whiteSpace: 'nowrap',
        width: 'max-content',
        maxWidth: '100%',
        borderWidth: '0',
        cursor: 'default',
        margin: '0',
        outlineWidth: '0',
        fontFamily:
          '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Helvetica Neue,Arial,sans-serif',
        tableLayout: 'fixed',
        overflow: 'auto',
        fontVariant: 'tabular-nums',
        th: {
          backgroundColor: '#f7f7f9',
          borderBottom: '1px solid #e5e5e9',
          textWrap: 'nowrap',
          verticalAlign: 'top',
          padding: '12px 20px',
          textAlign: 'left',
          lineHeight: 1,
          borderTop: '1px solid #e5e5e9',
        },
        td: {
          textWrap: 'nowrap',
          verticalAlign: 'top',
          padding: '7px 20px',
          textAlign: 'left',
          position: 'relative',
          lineHeight: 1,
        },
        tr: {
          '&:first-child td': {
            borderTop: '1px solid #e5e5e9',
          },
          td: {
            borderBottom: '1px solid #e5e5e9',
          },
        },
        'th,td': {
          padding: '8px 12px',
          lineHeight: '1.5',
          fontFamily:
            '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Helvetica Neue,Arial,sans-serif',
          textAlign: 'left',
          borderLeft: '1px solid #e5e5e9',
        },
        'th:last-child,td:last-child': {
          borderRight: '1px solid #e5e5e9',
        },
        'th:last-child': {
          borderTopRightRadius: 8,
        },
        'th:first-child': {
          borderTopLeftRadius: 8,
        },
        '& tr:nth-child(odd) td': {
          backgroundColor: 'rgba(35,35,38,.04)',
        },
      },
      'table.htCore': {
        boxSizing: 'content-box',
        '*': {
          boxSizing: 'content-box',
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
export function useTableStyle(
  prefixCls: string,
  propsToken: Partial<ChatTokenType>,
) {
  return useEditorStyleRegister('md-editor-table', (token) => {
    const editorToken = {
      ...token,
      ...propsToken,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(editorToken), resetComponent(editorToken)];
  });
}
