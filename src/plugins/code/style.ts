import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      borderRadius: '1.15px',
      fontFeatureSettings: 'normal',
      fontVariationSettings: 'normal',
      textSizeAdjust: '100%',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'break-word',
      direction: 'ltr',
      position: 'relative',
      marginBottom: '1em',
      marginTop: '1em',
      tabSize: 2,
      background: 'rgb(250, 250, 250)',
      padding: '12px',
      '> *': {
        boxSizing: 'border-box',
      },
      '&  &-num': {
        code: {
          paddingLeft: 5,
        },
      },
      '&  &-header': {
        direction: 'ltr',
        tabSize: 2,
        WebkitUserModify: 'read-only',
        boxSizing: 'border-box',
        color: '#666f8d',
        zIndex: 10,
        display: 'flex',
        userSelect: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 12px',
        paddingTop: '0px',
        borderBottom: '1px solid rgba(186, 192, 204, 0.25)',
        '&-actions': {
          display: 'flex',
          gap: '8px',
          '&-item': {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            boxSizing: 'border-box',
          },
        },
        '&-lang': {
          fontSize: '12px',
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
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('editor-content-code', (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(editorToken)];
  });
}
