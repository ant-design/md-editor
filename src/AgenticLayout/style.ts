import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      height: '100%',
      minHeight: '600px',
      backgroundColor: 'transparent',
      overflow: 'hidden',
      border: 'none',
      boxSizing: 'border-box',
      margin: 2,
      '*': {
        boxSizing: 'border-box',
      },
      // 主体内容区域
      [`${token.componentCls}-body`]: {
        display: 'flex',
        flex: 1,
        boxShadow: 'var(--shadow-card-base)',
        borderRadius: 'var(--radius-modal-base)',
        overflow: 'hidden',
        border: '1px solid rgba(140, 171, 255, 0.12)',
      },

      // 侧边栏基础样式
      [`${token.componentCls}-sidebar-left`]: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-gray-bg-page-light)',
        borderRight: `1px solid var(--color-gray-border-light)`,
        overflow: 'hidden',
        boxSizing: 'border-box',
        padding: '12px',
      },
      [`${token.componentCls}-sidebar-left-collapsed`]: {
        padding: '0 !important',
        width: '0 !important',
        minWidth: '0 !important',
        maxWidth: '0 !important',
        border: 'none !important',
      },

      // 右侧边栏特殊样式
      [`&-sidebar-right`]: {
        borderRight: 'none',
        height: '100%',
        marginLeft: 8,
      },

      // 折叠状态样式
      [`&-sidebar-right-collapsed`]: {
        width: '0 !important',
        minWidth: '0 !important',
        maxWidth: '0 !important',
        padding: '0 !important',
        opacity: 0,
        overflow: 'hidden',

        [`${token.componentCls}-sidebar-content`]: {
          display: 'none',
        },
      },

      // 侧边栏内容
      [`&-sidebar-content`]: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
      },

      // 主内容区域
      [`&-main`]: {
        flex: 1,
        minWidth: 0,
        backgroundColor: 'var(--color-gray-bg-page-light)',
        borderTopRightRadius: 'var(--radius-modal-base)',
        borderBottomRightRadius: 'var(--radius-modal-base)',
        overflow: 'hidden',
        '&-content': {
          flex: 1,
          height: 'calc(100% - 48px)',
        },
      },
    },
  };
};

export const useAgenticLayoutStyle = (prefixCls: string) => {
  return useEditorStyleRegister('agentic-layout', (token) => {
    const agenticLayoutToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(agenticLayoutToken)];
  });
};
