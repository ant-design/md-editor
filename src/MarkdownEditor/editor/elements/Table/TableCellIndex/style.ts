import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      width: '12px',
      maxWidth: 12,
      padding: 0,
      position: 'relative',
      verticalAlign: 'middle',
      contentEditable: false,
      backgroundColor: 'var(--color-gray-control-fill-secondary)',
      '&:hover': {
        backgroundColor: 'var(--color-gray-control-fill-secondary-hover)',
      },
    },
    [`${token.componentCls}-delete-icon`]: {
      position: 'absolute',
      top: '50%',
      right: '28px',
      zIndex: 10,
      padding: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      opacity: 0,
      border: '1px solid var(--table-border-color)',
      width: '24px',
      height: '24px',
      cursor: 'pointer',
      backgroundPosition: '50%',
      backgroundRepeat: 'no-repeat',
      transition:
        'opacity 0.2s cubic-bezier(0.645, 0.045, 0.355, 1), color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
      borderRadius: '2px',
      background: 'var(--color-gray-bg-card-white)',
      boxShadow: 'var(--shadow-border-base)',
      color: 'var(--color-gray-text-secondary)',
      '&:hover': {
        color: '#ff4d4f',
        backgroundColor: '#FFF',
        boxShadow: 'var(--shadow-control-lg)',
      },
    },
    [`${token.componentCls}-delete-icon-visible`]: {
      opacity: 1,
    },
  };
};

/**
 * TableCellIndex 样式 hook
 * @param prefixCls 组件前缀类名
 * @returns 样式相关的对象
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('md-editor-table-cell-index', (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(editorToken), genStyle(editorToken)];
  });
}
