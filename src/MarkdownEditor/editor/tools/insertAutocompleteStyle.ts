import {
    ChatTokenType,
    GenerateStyle,
    resetComponent,
    useEditorStyleRegister,
  } from '../utils/useStyle';
  
  const genStyle: GenerateStyle<ChatTokenType> = (token) => {
    return {
      [token.componentCls]: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        '&-item': {
          display: 'flex',
          alignItems: 'center',
          height: '24px',
          lineHeight: '24px',
          gap: '4px',
          padding: '4px',
          borderRadius: '18px',
          cursor: 'pointer',
          '&:hover': {
          backgroundColor: 'rgb(209 213 219 / 0.4)',
          },
        },
      },
    };
  };
  
  /**
   * AgentChat
   * @param prefixCls
   * @returns
   */
  export function useStyle(prefixCls?: string) {
    return useEditorStyleRegister('InsertAutocomplete-' + prefixCls, (token) => {
      const editorToken = {
        ...token,
        componentCls: `.${prefixCls}`,
      };
  
      return [genStyle(editorToken), resetComponent(editorToken)];
    });
  }
  