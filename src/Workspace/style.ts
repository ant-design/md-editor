import type { ChatTokenType, GenerateStyle } from '../hooks/useStyle';
import { useEditorStyleRegister } from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      height: '100%',
      borderRadius: 'var(--radius-modal-base)',
      background: 'var(--color-gray-bg-card-white)',
      border: '1px solid rgba(140, 171, 255, 0.12)',
      boxShadow: 'var(--shadow-card-base)',

      [`${token.componentCls}-header`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 'var(--margin-3x) var(--margin-4x)',
      },

      [`${token.componentCls}-title`]: {
        font: 'var(--font-text-h5-base)',
        color: 'var(--color-gray-text-default)',
        letterSpacing: 'var(--letter-spacing-h5-base, normal)',
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
        color: 'var(--color-gray-text-secondary)',
        font: 'var(--font-text-body-base)',
        letterSpacing: 'var(--letter-spacing-body-base, normal)',
        background: 'var(--color-gray-control-fill-active)',
        borderRadius: '8px',

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
        color: 'var(--color-gray-text-secondary)',
        font: 'var(--font-text-number-xs)',
        letterSpacing: 'var(--letter-spacing-number-xs, normal)',
        backgroundColor: 'var(--color-gray-control-fill-active)',
        borderRadius: '200px',
        boxSizing: 'border-box',
      },

      [`${token.componentCls}-content`]: {
        height: 'calc(100% - 90px)',
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
