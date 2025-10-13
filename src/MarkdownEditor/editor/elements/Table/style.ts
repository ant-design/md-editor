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
      '--table-hover-bg': 'rgba(0, 0, 0, 0.04)',
      '--table-cell-min-width': '120px',
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
      table: {
        borderCollapse: 'separate',
        borderSpacing: 0,
        display: 'block', // 改为 block 以支持水平滚动
        width: '100%',
        tableLayout: 'fixed',
        margin: '16px 0',
        position: 'relative',
        fontVariant: 'tabular-nums',
        borderRadius: 'var(--table-border-radius)',
        border: '1px solid var(--table-border-color)',

        // 表格主体和表头使用 table 布局
        'tbody, thead': {
          display: 'table',
          width: '100%',
          tableLayout: 'fixed',
          position: 'relative',
          background: 'inherit',
        },
        'th.config-th,td.config-td': {
          borderBottom: '1px solid var(--table-border-color)',
          borderLeft: '1px solid var(--table-border-color)',
        },
        'tr td.config-td:first-child': {
          borderLeft: 'none',
        },

        'th:not(.config-td)': {
          backgroundColor: 'var(--table-header-bg)',
          borderBottom: '1px solid var(--table-border-color)',
          textWrap: 'nowrap',
          verticalAlign: 'top',
          padding: '16px 12px',
          textAlign: 'left',
          lineHeight: '24px',
          fontSize: '15px',
          fontWeight: 600,
          borderTop: 'none',
          minWidth: 'var(--table-cell-min-width)',
          width: 'var(--table-cell-min-width)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          zIndex: 1,
          background: 'inherit',
        },
        'td:not(.config-td)': {
          textWrap: 'nowrap',
          verticalAlign: 'top',
          padding: '16px 12px',
          textAlign: 'left',
          position: 'relative',
          lineHeight: '24px',
          fontSize: '15px',
          minWidth: 'var(--table-cell-min-width)',
          width: 'var(--table-cell-min-width)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          zIndex: 1,
          background: 'inherit',
          'div[data-be="paragraph"]': {
            margin: 0,
          },
        },
        'tr:not(.config-tr)': {
          background: 'inherit',

          '&:first-child td:not(.config-td)': {
            borderTop: 'none',
          },
          'td:not(.config-td)': {
            borderBottom: '1px solid var(--table-border-color)',
            borderLeft: '1px solid var(--table-border-color)',

            '&:first-child': {
              fontSize: '15px',
              lineHeight: '24px',
              fontWeight: 600,
            },
          },
          'td:first-child:not(.config-td)': {
            borderLeft: 'none',
          },
          '&:last-child td:not(.config-td)': {
            borderBottom: 'none',
          },
        },

        // 第一列固定（当列数大于4时）
        'th:first-child:not(.config-td), td:first-child:not(.config-td)': {
          position: 'sticky',
          left: 0,
          zIndex: 100,
          minWidth: 'var(--table-cell-min-width)',
          width: 'var(--table-cell-min-width)',
          background: 'inherit',
        },

        // 悬停效果
        'tbody tr:not(.config-tr):hover': {
          background:
            'linear-gradient(var(--table-hover-bg), var(--table-hover-bg)), linear-gradient(white, white)',
        },
        // 表格圆角处理 - 重新设计逻辑
        // 1. 先为所有单元格重置圆角
        'th:not(.config-td), td:not(.config-td)': {
          borderRadius: '0',
        },

        // 2. 为表格四个角的单元格设置圆角（仅当它们不是合并单元格时）
        'tr:not(.config-tr):first-child th:first-child:not(.config-td):not([colspan]):not([rowspan]), tr:not(.config-tr):first-child td:first-child:not(.config-td):not([colspan]):not([rowspan])':
          {
            borderTopLeftRadius: 'var(--table-border-radius)',
          },
        'tr:not(.config-tr):first-child th:last-child:not(.config-td):not([colspan]):not([rowspan]), tr:not(.config-tr):first-child td:last-child:not(.config-td):not([colspan]):not([rowspan])':
          {
            borderTopRightRadius: 'var(--table-border-radius)',
          },
        'tr:not(.config-tr):last-child td:first-child:not(.config-td):not([colspan]):not([rowspan]), tr:not(.config-tr):last-child th:first-child:not(.config-td):not([colspan]):not([rowspan])':
          {
            borderBottomLeftRadius: 'var(--table-border-radius)',
          },
        'tr:not(.config-tr):last-child td:last-child:not(.config-td):not([colspan]):not([rowspan]), tr:not(.config-tr):last-child th:last-child:not(.config-td):not([colspan]):not([rowspan])':
          {
            borderBottomRightRadius: 'var(--table-border-radius)',
          },

        // 3. 处理合并单元格的圆角
        // 左上角 - 第一行第一列的合并单元格
        'tr:not(.config-tr):first-child th:not(.config-td)[colspan]:first-child, tr:not(.config-tr):first-child td:not(.config-td)[colspan]:first-child,tr:not(.config-tr):first-child th:not(.config-td)[rowspan]:first-child, tr:not(.config-tr):first-child td:not(.config-td)[rowspan]:first-child':
          {
            borderTopLeftRadius: 'var(--table-border-radius)',
          },

        // 右上角 - 第一行最后一列的合并单元格
        'tr:not(.config-tr):first-child th:not(.config-td)[colspan]:last-child, tr:not(.config-tr):first-child td:not(.config-td)[colspan]:last-child,tr:not(.config-tr):first-child th:not(.config-td)[rowspan]:last-child, tr:not(.config-tr):first-child td:not(.config-td)[rowspan]:last-child':
          {
            borderTopRightRadius: 'var(--table-border-radius)',
          },

        // 左下角 - 最后一行第一列的合并单元格
        'tr:not(.config-tr):last-child td:not(.config-td)[colspan]:first-child, tr:not(.config-tr):last-child th:not(.config-td)[colspan]:first-child,tr:not(.config-tr):last-child td:not(.config-td)[rowspan]:first-child, tr:not(.config-tr):last-child th:not(.config-td)[rowspan]:first-child':
          {
            borderBottomLeftRadius: 'var(--table-border-radius)',
          },

        // 右下角 - 最后一行最后一列的合并单元格
        'tr:not(.config-tr):last-child td:not(.config-td)[colspan]:last-child, tr:not(.config-tr):last-child th:not(.config-td)[colspan]:last-child,tr:not(.config-tr):last-child td:not(.config-td)[rowspan]:last-child, tr:not(.config-tr):last-child th:not(.config-td)[rowspan]:last-child':
          {
            borderBottomRightRadius: 'var(--table-border-radius)',
          },

        // 4. 特殊处理：如果合并单元格跨越整个表格宽度
        'tr:not(.config-tr):first-child:last-child th:not(.config-td)[colspan]:first-child:last-child, tr:not(.config-tr):first-child:last-child td:not(.config-td)[colspan]:first-child:last-child':
          {
            borderRadius: 'var(--table-border-radius)',
          },

        // 5. 特殊处理：如果合并单元格跨越整个表格高度
        'th:not(.config-td)[rowspan]:first-child:last-child, td:not(.config-td)[rowspan]:first-child:last-child':
          {
            borderTopLeftRadius: 'var(--table-border-radius)',
            borderBottomLeftRadius: 'var(--table-border-radius)',
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
