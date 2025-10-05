import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      contentEditable: false,
    },
  };
};

/**
 * TableCellIndexSpacer 样式 hook
 * @param prefixCls 组件前缀类名
 * @returns 样式相关的对象
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister(
    'md-editor-table-cell-index-spacer',
    (token) => {
      const editorToken = {
        ...token,
        componentCls: `.${prefixCls}`,
      };

      return [resetComponent(editorToken), genStyle(editorToken)];
    },
  );
}
