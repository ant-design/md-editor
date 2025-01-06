import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../utils/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      right: 0,
      top: 0,
      width: 300,
      paddingRight: 12,
      gap: 8,
      borderLeft: '1px solid rgba(0,0,0,0.04)',
      maxWidth: '400px',
      height: '100vh',
      '&-item': {
        padding: '12px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        '&:hover': {
          backgroundColor: '#f9f9f9',
        },
        '&-header': {
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          '&-title': {
            display: 'flex',
            gap: 8,
            flex: 1,
            alignItems: 'flex-end',
          },
          '&-name': {
            display: 'flex',
            gap: 4,
            alignItems: 'center',
          },
          '&-time': {
            color: '#bfbfbf',
            fontSize: '12px',
          },
          '&-action': {
            display: 'flex',
            gap: 8,
            '& &-item': {
              cursor: 'pointer',
              '&:hover': {
                color: token.colorPrimary,
              },
            },
          },
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
  return useEditorStyleRegister('editor-content-column', (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(editorToken)];
  });
}
