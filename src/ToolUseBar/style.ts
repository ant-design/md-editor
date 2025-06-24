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
      gap: 8,
      '*': {
        boxSizing: 'border-box',
      },
      '&-tool': {
        borderRadius: '200px',
        background: 'rgba(0, 37, 110, 0.03)',
        boxSizing: 'border-box',
        border: '0px solid rgba(0, 30, 75, 0.07)',
        boxShadow: 'inset 0px 0px 1px 0px rgba(0, 0, 0, 0.15)',
        maxWidth: '800px',
        display: 'flex',
        alignItems: 'center',
        padding: '2px 4px',
        width: 'max-content',
        gap: '8px',
        zIndex: 2,
      },

      '&-tool-arrow': {
        color: 'rgba(0, 4, 15, 27%)',
        transition: 'transform 0.3s ease',
      },

      '&-tool-header': {
        height: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      },

      '&-tool-header-left': {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      },

      '&-tool-name': {
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: '20px',
        letterSpacing: 'normal',
        color: 'rgba(0, 2, 7, 0.61)',
      },

      '&-tool-image-wrapper': {
        width: '24px',
        height: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4px',
        gap: '0px 8px',
        flexWrap: 'wrap',
        alignContent: 'center',
        borderRadius: '200px',
        boxSizing: 'border-box',
        border: '1px solid rgba(0, 16, 40, 0.13)',
        zIndex: 0,
      },

      '&-tool-target': {
        fontSize: '12px',
        fontWeight: 'normal',
        lineHeight: '20px',
        letterSpacing: 'normal',
        color: 'rgba(0, 5, 27, 0.45)',
      },
      '&-tool-time': {
        fontSize: '12px',
        fontWeight: 'normal',
        lineHeight: '12px',
        letterSpacing: '0.04em',
        color: 'rgba(0, 4, 15, 0.27)',
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('tool-use-bar', (token) => {
    const toolBarToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genStyle(toolBarToken)];
  });
}
