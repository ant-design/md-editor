import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      '&-thoughtChainItem': {
        marginBottom: 4,
        display: 'flex',
        '.ai-paas-spin-dot-item': {
          color: 'var(--color-primary-control-fill-primary)',
        },
      },

      '&-left': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 0 0',
        gap: 4,
      },

      '&-right': {
        padding: '8px 0',
      },

      '&-content-left': {
        flex: 1,
        flexShrink: 0,
        width: 16,
        display: 'flex',
        justifyContent: 'center',
      },

      '&-dash-line': {
        width: 1,
        boxSizing: 'border-box',
        height: '100%',
        borderLeft: '1px dashed rgba(0, 3, 9, 0.45)',
      },

      '&-status': {
        display: 'flex',
        lineHeight: '20px',
        height: 20,
        alignItems: 'center',
        color: 'rgba(0, 3, 9, 0.45)',
        svg: {
          width: 16,
          height: 16,
        },
      },

      '&-top': {
        display: 'flex',
        marginBottom: 4,
        gap: 4,
        cursor: 'pointer',

        [`${token.componentCls}-titleContainer`]: {
          paddingTop: 8,
          display: 'flex',
          alignItems: 'center',
        },

        [`${token.componentCls}-title`]: {
          marginLeft: 12,
          lineHeight: '20px',
          textAlign: 'justify',
          letterSpacing: 'normal',
          color: 'var(--color-gray-text-default)',
          fontSize: 'var(--font-size-base)',
          fontWeight: 600,
        },

        [`${token.componentCls}-loading`]: {
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },

        [`${token.componentCls}-arrowContainer`]: {
          height: 20,
          lineHeight: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },

        [`${token.componentCls}-arrow`]: {
          flexShrink: 0,
          width: 16,
          height: 16,
          color: 'rgba(0, 3, 9, 45%)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'var(--icon-hover-bg)',
            borderRadius: 'var(--icon-hover-border-radius)',
          },
        },
      },

      '&-body': {
        display: 'flex',

        [`${token.componentCls}-content`]: {
          marginLeft: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'normal',
          lineHeight: '160%',
          letterSpacing: 'normal',
          color: 'var(--color-gray-text-secondary)',
        },
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('task-list', (token) => {
    const taskListToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genStyle(taskListToken)];
  });
}
