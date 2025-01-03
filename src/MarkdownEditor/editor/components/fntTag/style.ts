import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../utils/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      background: '#D6EEFF',
      border: '0.4px solid #E6ECF4',
      fontSize: '0.9em',
      fontWeight: 600,
      height: '14px',
      minWidth: '14px',
      margin: '0 2px',
      lineHeight: '14px',
      textAlign: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s',
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',
      width: 'max-content',
      padding: 4,
      borderRadius: 12,
      '&:hover': {
        background: '#19213D',
        border: '0.4px solid #E6ECF4',
        color: '#FFFFFF',
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
  return useEditorStyleRegister('editor-content-TextStyleTag', (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(editorToken)];
  });
}
