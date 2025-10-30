import {
    ChatTokenType,
    GenerateStyle,
    resetComponent,
    useEditorStyleRegister,
  } from '../../Hooks/useStyle';
  
  const genStyle: GenerateStyle<ChatTokenType> = (token) => {
    return {
      [`${token.componentCls}`]: {
        width: '20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '0px',
        gap: '8px',
        backgroundColor: 'transparent',
  
        '&-icon': {
          width: '20px',
          height: '20px',
          color: 'var(--color-gray-text-tertiary)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-control-base)',
          padding: '4px',
  
          '&:hover': {
            color: 'var(--color-gray-text-secondary)',
            backgroundColor: 'var(--color-gray-bg-hover)',
            transform: 'scale(1.1)',
          },
  
          '&:active': {
            transform: 'scale(0.95)',
          },
  
          '&.enlarged': {
            color: 'var(--color-primary)',
            backgroundColor: 'var(--color-primary-bg-hover)',
          },
        },
      },
    };
  };
  
  /**
   * Enlargement组件样式
   * @param prefixCls
   * @returns
   */
  export function useStyle(prefixCls?: string) {
    return useEditorStyleRegister('md-enlargement', (token) => {
      const enlargementToken = {
        ...token,
        componentCls: `.${prefixCls}`,
      };
  
      return [resetComponent(enlargementToken), genStyle(enlargementToken)];
    });
  }