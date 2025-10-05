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
