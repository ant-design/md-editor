import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      '&-tool': {
        borderRadius: '200px',
        maxWidth: '100%',
        marginBottom: 12,
        background: 'var(--color-bg-container)',
        boxSizing: 'border-box',
        border: `1px solid var(--color-border-secondary)`,
        boxShadow: 'inset 0 0 1px 0 rgba(0, 0, 0, 15%)',
        padding: '2px 3px',
        color: 'rgba(0, 5, 27, 45%)',
        display: 'flex',
        gap: 8,
      },

      '&-tool-arrow': {
        color: 'var(--color-text-secondary)',
      },

      '&-tool-collapse': {
        marginBottom: 12,
        borderRadius: 12,
        background: 'var(--color-bg-container)',
        boxShadow: 'inset 0 0 1px 0 rgba(0, 0, 0, 15%)',
        padding: 12,
      },

      '&-tool-header': {
        height: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      },

      '&-tool-header-left': {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      },

      '&-tool-name': {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '22px',
        letterSpacing: 'normal',
        color: 'var(--color-text)',
      },

      '&-tool-result': {
        padding: 8,
        lineHeight: '160%',
        backgroundColor: '#f5f5f5',
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('tool-use-bar', (token) => {
    const toolBarToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genStyle(toolBarToken)];
  });
}
