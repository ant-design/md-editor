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
        padding: '8px 16px',
        marginLeft: -16,
        marginRight: -16,
        marginBottom: 8,
        borderBottom: '1px solid var(--color-gray-border-light)',

        // 返回按钮
        [`&-back-button`]: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          color: '#767e8b',
          transition: 'all 0.2s ease',
          borderRadius: 'var(--radius-control-base)',
          backdropFilter: 'blur(20px)',

          '&:hover': {
            background: '#f0f0f0',
          },
        },

        // 返回图标
        [`&-back-icon`]: {
          fontSize: '16px',
        },

        [`&-with-border`]: {
          borderBottom: '1px solid rgba(20, 22, 28, 0.07)',
        },

        [`&-with-back`]: {
          [`${token.componentCls}-header-icon`]: {
            [`&--html`]: {
              width: '16px',
              height: '16px',
              background: 'transparent',
            },

            [`&--default`]: {
              width: '16px',
              height: '16px',
              background: 'transparent',
            },
          },
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
          borderRadius: '6px',

          [`&--html`]: {
            width: '40px',
            height: '40px',
            color: '#00B5FD',
            background: 'rgba(219, 248, 255, 1)',
          },

          [`&--default`]: {
            width: '40px',
            height: '40px',
            background: 'linear-gradient(90deg, #EAEEF4, #F4F6F9)',
          },
        },

        [`&-content`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        },

        [`&-title-wrapper`]: {
          display: 'flex',
          flexDirection: 'column',
          gap: '-4px',
        },

        [`&-title`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontFamily: 'AlibabaPuHuiTi',
          fontSize: '14px',
          fontWeight: '500',
          lineHeight: '22px',
          letterSpacing: 'normal',
          color: 'var(--color-gray-text-default)',
          gridColumn: '2', // 与图标同一行，位于第二列
          alignSelf: 'center',
        },

        [`&-subtitle`]: {
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'normal',
          color: 'var(--color-gray-text-secondary)',
          font: 'var(--font-text-body-sm)',
          letterSpacing: 'var(--letter-spacing-body-sm, normal)',
          gridColumn: '1 / span 2', // 下一行并与图标左对齐，横跨两列
        },

        [`&-right`]: {
          display: 'flex',
          alignItems: 'center',

          '.ant-segmented': {
            /* 圆角-控件-base */
            borderRadius: 'var(--radius-control-base)',
            /* gray/gray-控件填充-按下.激活 */
            background: 'var(--color-gray-control-fill-active)',
          },

          '.ant-segmented-item-selected': {
            borderRadius: 'var(--radius-control-base)',
            /* gray/gray-背景-白色卡片 */
            /* 样式描述：contrast */
            background: 'var(--color-gray-bg-card-white)',
            /* 投影-控件-base */
            boxShadow: 'var(--shadow-control-base)',
          },
        },

        // Segmented 右侧额外内容容器
        [`&-segmented-right`]: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',

          button: {
            background: 'none',
            cursor: 'pointer',
            color: '#CC545D6D',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(20px)',
            borderRadius: 'var(--radius-control-sm)',
            boxSizing: 'border-box',
            border: '0px solid rgba(0, 30, 75, 0.07)',

            '&:hover': {
              background: '#f0f0f0',
            },
          },
        },
      },

      [`&--shell`]: {
        [`${token.componentCls}-header`]: {
          marginBottom: 0,
        },

        [`${token.componentCls}-content`]: {
          width: 'unset',
          margin: '0 -16px',
          paddingTop: 16,
          paddingBottom: 16,
          background: 'var(--color-gray-text-default)',

          '.ace-container': {
            borderRadius: 'unset',
          },

          '.ace-tm': {
            color: 'rgba(255, 255, 255, 0.27)',
            background: 'transparent',
          },

          '.ace_gutter': {
            color: 'rgba(255, 255, 255, 0.45)',
            font: 'var(--font-text-code-base)',
            letterSpacing: 'var(--letter-spacing-code-base, normal)',
            background: 'transparent',
          },

          '.ace_gutter-cell': {
            paddingLeft: 12,
          },

          '.ace-tm .ace_gutter-active-line': {
            background: 'var(--color-gray-text-default)',
          },

          '.ace-tm .ace_comment': {
            color: 'rgba(255, 255, 255, 0.27)',
          },

          '.ace-tm .ace_keyword': {
            color: '#E873BB',
          },

          '.ace_identifier, .ace_paren': {
            color: '#FFFFFF',
          },

          '.ace-tm .ace_constant.ace_numeric': {
            color: '#84DC18',
          },

          '.code-editor-container': {
            marginTop: 0,
            marginBottom: 0,
            maxHeight: '100%',
            background: 'transparent !important',
            border: 'none',
            boxShadow: 'none',
          },

          '.code-editor-content': {
            padding: 0,
            background: 'transparent',
          },
        },
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

        '.ant-workspace-html-preview-content .ace-container': {
          border: 'none',
          borderRadius: 'unset',
          boxShadow: 'none!important',
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
        },
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
