import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      boxSizing: 'border-box',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      flexFlow: 'wrap',
      gap: '4px',
      // 容器样式

      [`${token.componentCls}-item`]: {
        marginRight: '-12px',
        marginBottom: '0px',
        borderRadius: '8px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        position: 'relative',
        zIndex: 1,
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
        '&:hover': {
          marginRight: '0px',
          marginLeft: '12px',
          boxShadow: '0 2px 8px rgba(0, 122, 204, 0.15)',
        },
      },

      [`${token.componentCls}-link`]: {
        display: 'flex',
        textDecoration: 'none',
        color: 'inherit',

        '&:focus': {
          outline: '2px solid #007acc',
          outlineOffset: '2px',
        },
      },

      [`${token.componentCls}-image`]: {
        objectFit: 'cover',
        display: 'block',
        width: '18px',
        height: '18px',
      },

      [`${token.componentCls}-loading`]: {
        display: 'flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40px',
        color: '#666',
        fontSize: '14px',
      },

      [`${token.componentCls}-empty`]: {
        display: 'flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40px',
        color: '#999',
        fontSize: '14px',
        fontStyle: 'italic',
      },

      // 圆形头像样式
      [`${token.componentCls}-item-circle`]: {
        borderRadius: '50%',
      },

      // 变体样式
      [`${token.componentCls}-outline`]: {
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        padding: '12px',
        backgroundColor: '#fafafa',
      },

      [`${token.componentCls}-borderless`]: {
        border: 'none',
        padding: 0,
        backgroundColor: 'transparent',
      },

      [`${token.componentCls}-default`]: {
        // 默认样式，无特殊边框处理
      },
    },
    [`${token.componentCls}-container`]: {
      position: 'relative',
      borderRadius: '200px',
      height: 28,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      width: 'max-content',
      padding: '0 8px',
      background: '#FFFFFF',
      boxShadow:
        '0px 0px 1px 0px rgba(0, 19, 41, 0.2),0px 1.5px 4px -1px rgba(0, 19, 41, 0.04)',
    },

    // 描述文字样式
    [`${token.componentCls}-description`]: {
      fontSize: '13px',
      fontWeight: 'normal',
      lineHeight: '22px',
      letterSpacing: 'normal',
      color: '#767E8B',
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('visual-list', (token) => {
    const visualListToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genStyle(visualListToken)];
  });
}
