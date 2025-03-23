import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      maxWidth: '400px',
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
