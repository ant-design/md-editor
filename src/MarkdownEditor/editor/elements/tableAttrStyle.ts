import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '4px 8px',
      backgroundColor: token.colorBgElevated,
      border: '1px solid ' + token.colorSplit,
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 5%)',
      position: 'absolute',
      zIndex: 10,
      gap: '4px',
      color: token.colorText,
      borderRadius: '12px',
      '&-item': {
        display: 'flex',
        fontSize: '1.1em',
        alignItems: 'center',
        gap: '4px',
        padding: '4px',
        borderRadius: '8px',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: token.colorBgTextHover,
        },
        '&&-delete': {
          color: token?.colorError,
          '&:hover': {
            color: token?.colorErrorActive,
          },
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
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('TableAttr-' + prefixCls, (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(editorToken), genStyle(editorToken)];
  });
}
