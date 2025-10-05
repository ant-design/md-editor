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
            borderLeft: '1px solid var(--table-border-color)',
          },
          'td:first-child': {
            borderLeft: 'none',
          },
          '&:last-child td': {
            borderBottom: 'none',
          },
        },
        // 表格圆角处理 - 重新设计逻辑
        // 1. 先为所有单元格重置圆角
        'th, td': {
          borderRadius: '0',
        },

        // 2. 为表格四个角的单元格设置圆角（仅当它们不是合并单元格时）
        'tr:first-child th:first-child:not([colspan]):not([rowspan]), tr:first-child td:first-child:not([colspan]):not([rowspan])':
          {
            borderTopLeftRadius: 'var(--table-border-radius)',
          },
        'tr:first-child th:last-child:not([colspan]):not([rowspan]), tr:first-child td:last-child:not([colspan]):not([rowspan])':
          {
            borderTopRightRadius: 'var(--table-border-radius)',
          },
        'tr:last-child td:first-child:not([colspan]):not([rowspan]), tr:last-child th:first-child:not([colspan]):not([rowspan])':
          {
            borderBottomLeftRadius: 'var(--table-border-radius)',
          },
        'tr:last-child td:last-child:not([colspan]):not([rowspan]), tr:last-child th:last-child:not([colspan]):not([rowspan])':
          {
            borderBottomRightRadius: 'var(--table-border-radius)',
          },

        // 3. 处理合并单元格的圆角
        // 左上角 - 第一行第一列的合并单元格
        'tr:first-child th[colspan]:first-child, tr:first-child td[colspan]:first-child,tr:first-child th[rowspan]:first-child, tr:first-child td[rowspan]:first-child':
          {
            borderTopLeftRadius: 'var(--table-border-radius)',
          },

        // 右上角 - 第一行最后一列的合并单元格
        'tr:first-child th[colspan]:last-child, tr:first-child td[colspan]:last-child,tr:first-child th[rowspan]:last-child, tr:first-child td[rowspan]:last-child':
          {
            borderTopRightRadius: 'var(--table-border-radius)',
          },

        // 左下角 - 最后一行第一列的合并单元格
        'tr:last-child td[colspan]:first-child, tr:last-child th[colspan]:first-child,tr:last-child td[rowspan]:first-child, tr:last-child th[rowspan]:first-child':
          {
            borderBottomLeftRadius: 'var(--table-border-radius)',
          },

        // 右下角 - 最后一行最后一列的合并单元格
        'tr:last-child td[colspan]:last-child, tr:last-child th[colspan]:last-child,tr:last-child td[rowspan]:last-child, tr:last-child th[rowspan]:last-child':
          {
            borderBottomRightRadius: 'var(--table-border-radius)',
          },

        // 4. 特殊处理：如果合并单元格跨越整个表格宽度
        'tr:first-child:last-child th[colspan]:first-child:last-child, tr:first-child:last-child td[colspan]:first-child:last-child':
          {
            borderRadius: 'var(--table-border-radius)',
          },

        // 5. 特殊处理：如果合并单元格跨越整个表格高度
        'th[rowspan]:first-child:last-child, td[rowspan]:first-child:last-child':
          {
            borderTopLeftRadius: 'var(--table-border-radius)',
            borderBottomLeftRadius: 'var(--table-border-radius)',
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
