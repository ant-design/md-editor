import { genStyleHooks, type GenStyleFn } from '../../Hooks/useStyle';

const genStyle: GenStyleFn<'WorkspaceRealtimeFollow'> = (token) => {
  return {
    [`${token.componentCls}`]: {
      [`&-container`]: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flex: 1,
        minHeight: 0,
        minWidth: 0,
      },

      [`&-header`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        flexWrap: 'wrap',
        gap: token.marginXS,
        padding: '8px 12px',
        marginLeft: '-12px',
        marginRight: '-12px',
        borderBottom: '1px solid var(--color-gray-border-light)',

        // 返回按钮
        [`&-back-button`]: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          flexShrink: 0,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          color: 'var(--color-gray-text-secondary)',
          touchAction: 'manipulation',
          transition: `color ${token.motionDurationFast}, background-color ${token.motionDurationFast}`,
          borderRadius: 'var(--radius-control-base)',

          '&:hover': {
            background: 'var(--color-gray-control-fill-active)',
          },
          '&:focus-visible': {
            outline: `${token.lineWidthFocus}px solid ${token.colorPrimaryBorder}`,
            outlineOffset: token.lineWidth,
          },
          '@media (pointer: coarse)': {
            width: token.controlHeightLG,
            height: token.controlHeightLG,
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
          flex: `1 1 ${token.controlHeightLG * 4}px`,
          minWidth: 0,
          overflow: 'hidden',
        },

        [`&-icon`]: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          fontSize: token.fontSizeHeading3,
          flexShrink: 0,

          [`&--html`]: {
            width: '40px',
            height: '40px',
            color: 'var(--color-blue-text-default)',
            background:
              'linear-gradient(180deg, rgba(0, 181, 253, 0.15), rgba(0, 181, 253, 0.08))',
          },

          [`&--md`]: {
            width: '40px',
            height: '40px',
            color: 'var(--color-orange-text-default)',
            background:
              'linear-gradient(180deg, rgba(35, 214, 220, 0.15), rgba(35, 214, 220, 0.08))',
          },

          [`&--default`]: {
            width: '40px',
            height: '40px',
            background:
              'linear-gradient(180deg, var(--color-gray-bg-page-light), var(--color-gray-bg-page))',
          },
        },

        [`&-content`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: 0,
          flex: 1,
        },

        [`&-title-wrapper`]: {
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          flex: 1,
          minWidth: 0,
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
          minWidth: 0,
          overflowWrap: 'anywhere',
        },

        [`&-subtitle`]: {
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'normal',
          color: 'var(--color-gray-text-secondary)',
          font: 'var(--font-text-body-sm)',
          letterSpacing: 'var(--letter-spacing-body-sm, normal)',
          gridColumn: '1 / span 2', // 下一行并与图标左对齐，横跨两列
          display: 'block',
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },

        [`&-right`]: {
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          maxWidth: '100%',
          marginInlineStart: 'auto',

          [`${token.antCls}-segmented`]: {
            borderRadius: 'var(--radius-control-base)',
          },

          [`${token.antCls}-segmented-item-selected `]: {
            borderRadius: 'var(--radius-control-base)',
          },
        },

        // Segmented 右侧额外内容容器
        [`&-segmented-right`]: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        },
      },

      [`&--shell`]: {
        height: 'calc(100% + 16px)',
        paddingTop: 0,
        paddingBottom: 0,
        margin: '0 -12px -16px',

        [`${token.componentCls}-header`]: {
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
        },

        [`${token.componentCls}-content`]: {
          width: 'unset',
          margin: 0,
          flex: 1,
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
          '.ace-tm .ace_gutter': {
            background: 'transparent',
          },
          '.ace-tm .ace_gutter-active-line': {
            color: 'var(--color-gray-bg-card-white)',
            background: 'transparent',
          },

          '.ace-tm .ace_comment': {
            color: 'rgba(255, 255, 255, 0.27)',
          },

          '.ace-tm .ace_keyword': {
            color: 'var(--color-sub5-text-default)',
          },

          '.ace_identifier, .ace_paren': {
            color: 'var(--color-gray-bg-card-white)',
          },

          '.ace-tm .ace_constant.ace_numeric': {
            color: 'var(--color-green-text-default)',
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

          [`${token.antCls}-empty-description`]: {
            color: 'var(--color-gray-text-light)',
          },
        },
      },

      [`&--markdown`]: {
        [`${token.antCls}-agentic-md-editor-content div[data-be="paragraph"]:last-child`]:
          {
            paddingBottom: '16px',
            color: 'var(--color-gray-text-light)',
            font: 'var(--font-text-code-base)',
            letterSpacing: 'var(--letter-spacing-code-base, normal)',
          },
      },

      [`&-content`]: {
        position: 'relative',
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        width: 'auto',
        overflow: 'auto',
        overscrollBehavior: 'contain',
        margin: '0 -12px',
        [`${token.antCls}-workspace-html-preview-content`]: {
          '.ace-container': {
            border: 'unset',
            borderRadius: 'unset',
            boxShadow: 'unset',
          },

          '.ace_gutter-cell': {
            paddingLeft: 12,
          },

          '.code-editor-container': {
            maxHeight: '100%',
            borderRadius: 'var(--radius-card-base)',

            '.code-editor-content': {
              padding: '0!important',

              '.ace_gutter': {
                color: 'var(--color-gray-text-light)',
                font: 'var(--font-text-code-base)',
                letterSpacing: 'var(--letter-spacing-code-base, normal)',
                background: 'var(--color-gray-bg-card-white)',
              },

              '.ace-tm .ace_scroller .ace_content': {
                fontFamily: 'Roboto Mono',
              },

              '.ace-tm .ace_gutter-active-line': {
                color: 'var(--color-gray-text-default)',
                background: 'var(--color-gray-control-fill-hover)',
              },

              '.ace-tm .ace_marker-layer .ace_active-line': {
                background: 'var(--color-gray-control-fill-hover)',
              },
              '.ace_cursor': {
                display: 'none !important',
              },
            },
          },
        },

        '.code-editor-container': {
          position: 'relative',
          borderRadius: 'var(--radius-card-base)',
          background: 'var(--color-gray-bg-card-white)',
          transition: 'border-color 0.2s ease-in-out',
          boxSizing: 'border-box',
          overflow: 'hidden',

          '.ace-github': {
            background: 'transparent',
          },
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
          color: 'var(--color-red-text-default)',
        },
      },

      [`&-empty`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '240px',
        padding: '24px',
        boxSizing: 'border-box',
        textAlign: 'center',
      },
      '@media (prefers-reduced-motion: reduce)': {
        [`${token.componentCls}-header-back-button, .code-editor-container, ${token.antCls}-segmented-thumb`]:
          {
            transition: 'none',
          },
      },
    },
  };
};

const useGenStyle = genStyleHooks('WorkspaceRealtimeFollow', genStyle);

export function useRealtimeFollowStyle(prefixCls?: string) {
  const [, hashId] = useGenStyle(prefixCls ?? 'WorkspaceRealtimeFollow');
  return { hashId };
}
