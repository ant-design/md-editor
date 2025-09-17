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
        transition: 'all 0.2s ease',
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
        width: '24px',
        height: '24px',
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
