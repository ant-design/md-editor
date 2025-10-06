import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      padding: '8px',
      verticalAlign: 'middle',
      border: '1px solid var(--table-border-color)',
      backgroundColor: 'var(--color-gray-bg-card-white)',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: 'var(--color-gray-control-fill-secondary-hover)',
      },
      '&[data-selected="true"]': {
        backgroundColor: 'var(--color-primary-control-fill-secondary-hover)',
      },
    },
  };
};

/**
 * Td 样式 hook
 * @param prefixCls 组件前缀类名
 * @returns 样式相关的对象
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('md-editor-table-td', (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls || 'md-editor-table-td'}`,
    };

    return [resetComponent(editorToken), genStyle(editorToken)];
  });
}
