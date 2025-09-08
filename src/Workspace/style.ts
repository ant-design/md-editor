import type { ChatTokenType, GenerateStyle } from '../hooks/useStyle';
import { useEditorStyleRegister } from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      height: '100%',
      borderRadius: '20px',
      background: 'var(--color-gray-bg-card-white)',
      border: '1px solid rgba(140, 171, 255, 0.12)',
      boxShadow: '0px 1.5px 2px -1px rgba(0, 19, 41, 0.07)',

      [`${token.componentCls}-header`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 'var(--margin-3x) var(--margin-4x)',
      },

      [`${token.componentCls}-title`]: {
        fontSize: 'var(--font-size-lg)',
        fontWeight: 600,
        color: 'var(--color-gray-text-default)',
      },

      [`${token.componentCls}-close`]: {
        padding: 'var(--padding-1x)',
        borderRadius: '6px',
        color: 'var(--color-gray-text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',

        '&:hover': {
          color: 'var(--color-gray-text-default)',
          backgroundColor: 'var(--color-gray-control-fill-hover)',
        },

        '&:focus': {
          outline: '2px solid var(--color-primary-control-fill-primary)',
          outlineOffset: '2px',
        },
      },

      [`${token.componentCls}-tabs`]: {
        margin: 'var(--margin-3x) var(--margin-4x)',
      },

      [`${token.componentCls}-segmented`]: {
        // 覆盖 Segmented 组件内部的样式
        '.ant-segmented-item': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
        },

        '.ant-segmented-item-label': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
        },
      },

      [`${token.componentCls}-tab-item`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
      },

      [`${token.componentCls}-tab-title`]: {
        fontSize: 'var(--font-size-base)',
        fontWeight: 500,
      },

      [`${token.componentCls}-tab-count`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '20px',
        height: '20px',
        padding: '4px 6px',
        marginLeft: '4px',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 500,
        lineHeight: 1,
        color: '#767e8b',
        backgroundColor: 'rgba(20, 22, 28, 0.06)',
        borderRadius: '200px',
        boxSizing: 'border-box',
      },

      [`${token.componentCls}-content`]: {
        height: 'calc(100% - 90px)',
        overflow: 'auto',
        padding: '0 16px 16px',
      },
    },
  };
};

export function useWorkspaceStyle(prefixCls?: string) {
  return useEditorStyleRegister('Workspace', (token) => {
    const workspaceToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(workspaceToken)];
  });
}
