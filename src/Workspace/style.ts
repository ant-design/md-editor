import type { ChatTokenType, GenerateStyle } from '../hooks/useStyle';
import { useEditorStyleRegister } from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      height: '100%',
      borderRadius: '20px',
      background: '#ffffff',
      border: '1px solid rgba(140, 171, 255, 0.12)',
      boxShadow: '0px 1.5px 2px -1px rgba(0, 19, 41, 0.07)',

      [`${token.componentCls}-header`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '12px 16px',
      },

      [`${token.componentCls}-title`]: {
        fontSize: '15px',
        fontWeight: 600,
        color: '#343a45',
      },

      [`${token.componentCls}-close`]: {
        padding: '5px',
        borderRadius: '6px',
        color: '#959da8',
        cursor: 'pointer',
        transition: 'all 0.2s ease',

        '&:hover': {
          color: 'rgb(0 0 0 / 88%)',
          backgroundColor: '#f0f0f0',
        },

        '&:focus': {
          outline: '2px solid #1890ff',
          outlineOffset: '2px',
        },
      },

      [`${token.componentCls}-tabs`]: {
        margin: '12px 16px',
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
        fontSize: '13px',
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
        fontSize: '11px',
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
  return useEditorStyleRegister('Workspace', (token: ChatTokenType) => {
    const workspaceToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(workspaceToken)];
  });
}
