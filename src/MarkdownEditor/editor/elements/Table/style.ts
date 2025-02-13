import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../utils/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      '&-container': {
        display: 'flex',
        gap: 1,
        maxWidth: '100%',
        minWidth: 0,
        outline: 'none',
        overflow: 'auto',
        width: '100%',
        position: 'relative',
        marginBottom: 12,
      },
      '&-editor-table': {
        marginTop: '1em',
      },
      table: {
        borderCollapse: 'separate',
        borderSpacing: 0,
        display: 'table',
        // minWidth: '100%',
        position: 'relative',
        whiteSpace: 'nowrap',
        width: 'max-content',
        // maxWidth: '100%',
        overflow: 'auto',
        fontVariant: 'tabular-nums',
        th: {
          backgroundColor: 'rgb(229 231 235 / 0.5)',
          textWrap: 'nowrap',
          verticalAlign: 'top',
          padding: '12px 20px',
          textAlign: 'left',
          lineHeight: 1,
          borderTop: '1px solid rgba(209, 213, 219, 0.8)',
        },
        td: {
          textWrap: 'nowrap',
          verticalAlign: 'top',
          padding: '7px 20px',
          textAlign: 'left',
          position: 'relative',
          lineHeight: 1,
          '&.selected-cell-td': {
            backgroundColor: '#e9effd',
          },
          '&.td-cell-select': {
            userSelect: 'none',
            cursor:
              'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPAgMAAABGuH3ZAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAlQTFRFAAAAAAAA////g93P0gAAAAN0Uk5TAP//RFDWIQAAAC1JREFUeJxjYAgNYGBgyJqCTIRmTQ1gyFq1ago6AZQIYRAFEUg6QoE8BtEQBgAhdBSqzKYB6AAAAABJRU5ErkJggg==) 7 7, auto',
          },
        },
        'tr:first-child': {
          borderBottom: '1px solid #e8e8e8',
        },
        'td:first-child': {
          borderBottom: '1px solid #e8e8e8',
        },
        'th,td': {
          padding: '8px 16px',
          textAlign: 'left',
          borderBottom: '1px solid rgb(209 213 219 / 0.8)',
          borderRight: '1px solid rgb(209 213 219 / 0.8)',
        },
        'th:last-child,td:last-child': {
          borderRight: 'none',
        },
        'th:last-child': {
          borderTopRightRadius: 16,
        },
        'th:first-child': {
          borderTopLeftRadius: 16,
        },
        'tr:last-child th,tr:last-child td': {
          borderBottom: 'none',
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
