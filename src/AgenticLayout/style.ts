import { CSSObject } from '@ant-design/cssinjs';
import { GenerateStyle, useEditorStyleRegister } from '@ant-design/md-editor';

export interface ComponentToken {
  /** 侧边栏宽度 */
  sidebarWidth: number;
  /** 侧边栏背景色 */
  sidebarBackground: string;
  /** 侧边栏边框色 */
  sidebarBorderColor: string;
  /** 侧边栏内边距 */
  sidebarPadding: string;
  /** 主内容区背景色 */
  mainBackground: string;
  /** 折叠动画时长 */
  collapseTransitionDuration: string;
}

export const useAgenticLayoutStyle = (prefixCls: string) => {
  return useEditorStyleRegister('agentic-layout', (token) => {
    const agenticLayoutToken: ComponentToken = {
      sidebarWidth: 256,
      sidebarBackground: token.colorBgContainer,
      sidebarBorderColor: token.colorBorder,
      sidebarPadding: '12px',
      mainBackground: token.colorBgLayout,
      collapseTransitionDuration: '300ms',
    };

    const agenticLayoutStyle: GenerateStyle<ComponentToken> = (
      token: ComponentToken,
    ): CSSObject => ({
      [`.${prefixCls}`]: {
        display: 'flex',
        height: '100%',
        minHeight: '600px',
        backgroundColor: agenticLayoutToken.mainBackground,
        borderRadius: 'var(--radius-modal-base)',
        boxShadow: 'var(--shadow-card-base)',
        overflow: 'hidden',
        border: 'none',
        boxSizing: 'border-box',

        // 侧边栏基础样式
        [`.${prefixCls}-sidebar`]: {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: agenticLayoutToken.sidebarBackground,
          borderRight: `1px solid ${agenticLayoutToken.sidebarBorderColor}`,
          transition: `all ${agenticLayoutToken.collapseTransitionDuration} ease-in-out`,
          overflow: 'hidden',
          boxSizing: 'border-box',
          padding: agenticLayoutToken.sidebarPadding,

          // 右侧边栏特殊样式
          [`&.${prefixCls}-sidebar-right`]: {
            borderRight: 'none',
            borderLeft: `1px solid ${agenticLayoutToken.sidebarBorderColor}`,
          },

          // 折叠状态样式
          [`&.${prefixCls}-sidebar-collapsed`]: {
            width: '0 !important',
            minWidth: '0 !important',
            maxWidth: '0 !important',
            padding: '0 !important',
            opacity: 0,
            overflow: 'hidden',

            [`.${prefixCls}-sidebar-content`]: {
              display: 'none',
            },
          },

          // 侧边栏内容
          [`.${prefixCls}-sidebar-content`]: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            width: '100%',
          },
        },

        // 主内容区域
        [`.${prefixCls}-main`]: {
          flex: 1,
          display: 'flex',
          minWidth: 0,
          overflow: 'hidden',
        },
      },
    });

    return [
      {
        [`${prefixCls}`]: agenticLayoutStyle(agenticLayoutToken),
      },
    ];
  });
};
