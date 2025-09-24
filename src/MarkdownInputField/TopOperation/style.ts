import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingBottom: '8px',

      '&-left-spacer': {
        flex: 1,
      },

      '&-center': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        flex: 0,
      },

      '&-right-spacer': {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minWidth: '40px',
      },

      '&-arrow-icon': {
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
        
        '&:hover': {
          transform: 'scale(1.05)',
          opacity: 0.8,
        },
        
        '&:active': {
          transform: 'scale(0.95)',
        },
      },

      '&-up-arrow-icon': {
        // 基础样式，不包含特殊间距
      },

      '&-up-arrow-icon-with-both': {
        marginRight: '-40px',
      },

      '&-button': {
        width: '66px',
        height: '32px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 12px',
        gap: '8px',
        zIndex: 1,
        borderRadius: '4px',
        backgroundColor: 'var(--color-gray-bg-button-default)',
        border: '1px solid var(--color-gray-border-button-default)',
        cursor: 'pointer',
        color: 'var(--color-gray-text-default)',
        transition: 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
      },

      '&-button-first': {
        borderRadius: '8px',
        background: 'var(--color-gray-control-fill-secondary)',
        backdropFilter: 'blur(40px)',
        fontFamily: 'PingFang SC',
        fontSize: '13px',
        fontWeight: 'normal',
        lineHeight: '22px',
        letterSpacing: 'normal',
        color: 'var(--color-gray-text-default)',
      },

      '&-button-second': {
        borderRadius: '8px',
        background: 'var(--color-gray-control-fill-primary)',
        boxShadow: 'var(--shadow-control-lg)',
        fontFamily: 'PingFang SC',
        fontSize: '14px',
        fontWeight: 'normal',
        lineHeight: '22px',
        letterSpacing: 'normal',
        color: 'var(--color-gray-contrast)',
      },
    },
  };
};

/**
 * TopOperation 样式 hook
 * @param prefixCls 样式前缀
 * @returns 样式相关函数和类名
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('TopOperation', (token) => {
    const topOperationToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(topOperationToken), genStyle(topOperationToken)];
  });
}
