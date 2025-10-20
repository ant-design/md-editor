import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '600px',
      backgroundColor: 'transparent',
      borderRadius: 'var(--radius-modal-base)',
      boxShadow: 'var(--shadow-card-base)',
      overflow: 'hidden',
      border: 'none',
      boxSizing: 'border-box',

      // 主体内容区域
      [`${token.componentCls}-body`]: {
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
      },

      // 侧边栏基础样式
      [`${token.componentCls}-sidebar-left`]: {
        display: 'flex',
        flexDirection: 'column',

        backgroundColor:
          token.colorBgContainer || 'var(--color-gray-bg-page-light)',
        borderRight: `1px solid ${token.colorBorder || 'var(--color-gray-border-light)'}`,
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
      [`&.${token.componentCls}-sidebar-right`]: {
        borderRight: 'none',
        height: '100%',
        borderLeft: `1px solid ${token.colorBorder || 'var(--color-gray-border-light)'}`,
      },

      // 折叠状态样式
      [`${token.componentCls}-sidebar-right-collapsed`]: {
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
      [`${token.componentCls}-sidebar-content`]: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
      },

      // 主内容区域
      [`${token.componentCls}-main`]: {
        flex: 1,
        minWidth: 0,
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
