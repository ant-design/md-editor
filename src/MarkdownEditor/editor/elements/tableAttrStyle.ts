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
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '4px 8px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      border: '1px solid #f0f0f0',
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 5%)',
      position: 'absolute',
      zIndex: 10,
      gap: '4px',
      borderRadius: '12px',
      '&-item': {
        display: 'flex',
        fontSize: '1.1em',
        alignItems: 'center',
        gap: '4px',
        padding: '4px',
        borderRadius: '8px',
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
  return useEditorStyleRegister('TableAttr-' + prefixCls, (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(editorToken), genStyle(editorToken)];
  });
}
