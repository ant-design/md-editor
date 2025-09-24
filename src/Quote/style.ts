import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genQuoteStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      '&-container': {
        height: '34px',
        width: 'fit-content',
        minWidth: '80px',
        maxWidth: '560px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '6px 8px',
        gap: '8px',
        borderRadius: 'var(--radius-control-base)',
        cursor: 'pointer',
      },

      '&-container:hover': {
        background: 'var(--color-gray-control-fill-hover)',
      },

      '&-container:hover &-close-button': {
        display: 'flex',
        alignItems: 'center',
      },

      '&-quote-icon': {
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        color: 'var(--color-gray-text-secondary)',
      },

      '&-close-button': {
        color: 'var(--color-gray-text-default)',
        display: 'none',
      },

      '&-quoteDesc': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
      },

      // 弹出层样式

      '&-popup': {
        position: 'absolute',
        bottom: '40px', // 保持原来的距离
        left: '0',
        minWidth: '240px',
        maxWidth: '800px',
        /* 圆角-卡片-base */

        borderRadius: 'var(--radius-card-base)',
        background: 'var(--color-gray-bg-page-light)', //var(--color-gray-bg-page-light);
        boxSizing: 'border-box',
        border: '1px solid var(--color-gray-border-light)',
        boxShadow: 'var(--shadow-popover-base)',

        display: 'none', // 默认隐藏
        flexDirection: 'column',
        gap: 4,
        zIndex: 1001,
        minHeight: 'auto',

        fontSize: '12px',
        fontWeight: 'normal',
        lineHeight: '20px',
        letterSpacing: 'normal',
        color: 'var(--color-gray-text-secondary)',
        padding: 4,

        // 扩展hover区域，填补与容器之间的空隙
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: '-10px',
          left: '0',
          right: '0',
          height: '10px',
          background: 'transparent',
          pointerEvents: 'auto',
        },
      },

      // hover时显示弹框（包括hover到连接区域）
      '&-container:hover &-popup': {
        display: 'flex',
      },

      '&-popup:hover': {
        display: 'flex',
      },

      /* gray/gray-背景-页面-浅 */
      '&-popup-content': {
        padding: '8px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        maxHeight: '70px', // 固定高度
        overflowY: 'auto',
        lineHeight: '20px',
        boxSizing: 'border-box', // 确保 padding 包含在总高度内
        letterSpacing: 'var(--letter-spacing-body-sm, normal)',
      },

      '&-popup-header': {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 8px',
      },

      '&-popup-title': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      '&-popup-range': {
        flex: 'none',
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('quote', (token) => {
    const quoteToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genQuoteStyle(quoteToken)];
  });
}
