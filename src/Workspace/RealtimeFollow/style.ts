import type { ChatTokenType, GenerateStyle } from '../../hooks/useStyle';
import { useEditorStyleRegister } from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [`${token.componentCls}`]: {
      [`&-container`]: {
        height: '100%',
      },

      [`&-header`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '8px',
        paddingBottom: '8px',

        [`&-with-border`]: {
          borderBottom: '1px solid var(--color-gray-border-light)',
        },

        [`&-left`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },

        [`&-icon`]: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '6px',

          [`&--html`]: {
            background: '#e0f9ff',
          },

          [`&--default`]: {
            background: '#eef1f6',
          },
        },

        [`&-content`]: {
          display: 'flex',
          flexDirection: 'column',
        },

        [`&-title`]: {
          fontSize: 'var(--font-size-base)',
          fontWeight: 500,
          lineHeight: '22px',
          color: 'var(--color-gray-text-default)',
        },

        [`&-subtitle`]: {
          color: 'var(--color-gray-text-secondary)',
          font: 'var(--font-text-body-sm)',
          letterSpacing: 'var(--letter-spacing-body-sm, normal)',
        },

        [`&-right`]: {
          display: 'flex',
          alignItems: 'center',
        },

        // Segmented 右侧额外内容容器
        [`&-segmented-right`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },
      },

      [`&--shell`]: {
        '.ace-container': {
          marginTop: 0,
          borderRadius: 'unset',
        },

        '.ace_gutter': {
          color: 'var(--color-gray-text-light)',
          font: 'var(--font-text-code-base)',
          letterSpacing: 'var(--letter-spacing-code-base, normal)',
          background: 'var(--color-gray-bg-card-white)',
        },

        '.ace_gutter-cell': {
          paddingLeft: 12,
        },

        '.ace-tm .ace_comment': {
          color: '#008604',
        },

        '.ace-tm .ace_keyword': {
          color: '#B14089',
        },

        '.ace_identifier, .ace_paren': {
          color: '#343A45',
        }
      },

      [`&--markdown`]: {
        '.ant-md-editor-content div[data-be="paragraph"]:last-child': {
          paddingBottom: '16px',
          color: 'var(--color-gray-text-light)',
          font: 'var(--font-text-code-base)',
          letterSpacing: 'var(--letter-spacing-code-base, normal)',
        },
      },

      [`&-content`]: {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'auto', // 添加滚动支持
      },

      [`&-overlay`]: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,

        [`&--loading`]: {
          background: 'rgba(255, 255, 255, 0.6)',
        },

        [`&--error`]: {
          background: 'rgba(255, 245, 245, 0.6)',
          color: '#cb1e1e',
        },
      },

      [`&-empty`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '240px',
        padding: '24px',
        textAlign: 'center',
      },

      // ==================== Overrides ====================
      [`&-segmented`]: {
        color: 'var(--color-gray-text-secondary)',
        fontSize: '13px',
        background: 'var(--color-gray-control-fill-active)',
        borderRadius: '8px',

        '.ant-segmented-item-selected': {
          color: 'var(--color-gray-text-default)',
          background: 'var(--color-gray-bg-card-white)',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-control-base)',

          '.ant-workspace-tab-title': {
            font: 'var(--font-text-h6-base)',
            letterSpacing: 'var(--letter-spacing-h6-base, normal)',
          },
        },

        '.ant-segmented-item:hover:not(.ant-segmented-item-selected):not(.ant-segmented-item-disabled)':
          {
            color: 'var(--color-gray-text-default)',
          },
      },
    },
  };
};

export function useRealtimeFollowStyle(prefixCls?: string) {
  return useEditorStyleRegister('WorkspaceRealtimeFollow', (token) => {
    const realtimeToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(realtimeToken)];
  });
}
