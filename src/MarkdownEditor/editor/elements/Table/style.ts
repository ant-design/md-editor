import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      '--table-border-radius': '8px',
      '--table-border-color': '#E7E9E8',
      '--table-header-bg': '#f7f7f9',
      '--table-odd-row-bg': 'rgba(35,35,38,.04)',
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
        overflow: 'auto',
        fontVariant: 'tabular-nums',
        borderRadius: 'var(--table-border-radius)',
        border: '1px solid var(--table-border-color)',
        th: {
          backgroundColor: 'var(--table-header-bg)',
          borderBottom: '1px solid var(--table-border-color)',
          textWrap: 'nowrap',
          verticalAlign: 'top',
          padding: '12px 20px',
          textAlign: 'left',
          lineHeight: 1,
          borderTop: 'none',
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
            borderTop: 'none',
          },
          td: {
            borderBottom: '1px solid var(--table-border-color)',
          },
          '&:last-child td': {
            borderBottom: 'none',
          },
        },
        // 只为真正的表格四个角添加圆角，避免合并单元格的问题
        'tr:first-child th:first-child, tr:first-child td:first-child': {
          borderTopLeftRadius: 'var(--table-border-radius)',
        },
        'tr:first-child th:last-child, tr:first-child td:last-child': {
          borderTopRightRadius: 'var(--table-border-radius)',
        },
        'tr:last-child td:first-child, tr:last-child th:first-child': {
          borderBottomLeftRadius: 'var(--table-border-radius)',
        },
        'tr:last-child td:last-child, tr:last-child th:last-child': {
          borderBottomRightRadius: 'var(--table-border-radius)',
        },
        // 处理合并单元格的情况 - 重置所有内部单元格的圆角
        'td[colspan], th[colspan], td[rowspan], th[rowspan]': {
          borderRadius: 0,
        },
        // 确保合并单元格跨越边界时能正确显示圆角
        'tr:first-child th[colspan]:first-child, tr:first-child td[colspan]:first-child':
          {
            borderTopLeftRadius: 'var(--table-border-radius)',
            borderTopRightRadius: 0,
          },
        'tr:first-child th[colspan]:last-child, tr:first-child td[colspan]:last-child':
          {
            borderTopRightRadius: 'var(--table-border-radius)',
            borderTopLeftRadius: 0,
          },
        'tr:last-child td[colspan]:first-child, tr:last-child th[colspan]:first-child':
          {
            borderBottomLeftRadius: 'var(--table-border-radius)',
            borderBottomRightRadius: 0,
          },
        'tr:last-child td[colspan]:last-child, tr:last-child th[colspan]:last-child':
          {
            borderBottomRightRadius: 'var(--table-border-radius)',
            borderBottomLeftRadius: 0,
          },
        'th,td': {
          padding: '8px 12px',
          lineHeight: 1.7,
          textAlign: 'left',
          borderLeft: 'none',
        },
        'th:not(:first-child),td:not(:first-child)': {
          borderLeft: '1px solid var(--table-border-color)',
        },
        'th:last-child,td:last-child': {
          borderRight: 'none',
        },
        '& tr:nth-child(odd) td': {
          backgroundColor: 'var(--table-odd-row-bg)',
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
 * BubbleChat
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

    return [resetComponent(editorToken), genStyle(editorToken)];
  });
}
