import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      border: '1px solid rgb(209 213 219 / 0.8)',
      '&-readonly': {
        border: 'none',
      },
      "div[data-be='paragraph']": {
        marginTop: '0',
      },
      '&-resize-handle': {
        outline: 'none',
        flex: '0 0 .25rem',
        padding: '0.5px!important',
        justifyContent: 'stretch',
        alignItems: 'stretch',
        transition: 'background-color .2s linear',
        display: 'flex',
        borderRight: '1px solid rgb(209 213 219 / 0.8)',
      },
      '> div': {
        padding: '16px 16px',
        textAlign: 'left',
        fontWeight: 500,
        flex: 1,
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
  return useEditorStyleRegister('editor-content-column', (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(editorToken)];
  });
}
