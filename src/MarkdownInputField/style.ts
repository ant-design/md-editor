import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      width: '100%',
      height: '100%',
      display: 'flex',
      boxShadow: `0px 0px 1px 0px rgba(0, 19, 41, 0.05),0px 2px 7px 0px rgba(0, 19, 41, 0.05),0px 2px 5px -2px rgba(0, 19, 41, 0.06)`,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2px',
      borderRadius: '16px',
      minHeight: '32px',
      maxWidth: 980,
      backdropFilter: 'blur(5.44px)',
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
      '> * ': {
        boxSizing: 'border-box',
      },
      '&:hover': {
        boxShadow: 'none',
        backgroundImage:
          'radial-gradient(127% 127% at 0% 0%, rgba(255, 255, 255, 0) 57%, var(--color-gray-control-fill-secondary) 84%)',
        [`${token.componentCls}-background`]: {
          opacity: 1,
        },
      },
      '&-background': {
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
        opacity: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
        borderRadius: 'inherit',
      },
      '&-editor': {
        boxSizing: 'border-box',
        backgroundColor: 'var(--color-gray-bg-card-white)',
        width: '100%',
        zIndex: 9,
        maxHeight: 400,
        height: '100%',
        borderRadius: 'inherit',
        overflowY: 'auto',
        scrollbarColor: 'var(--color-gray-text-tertiary) transparent',
        scrollbarWidth: 'thin',
        '&&-disabled': {
          backgroundColor: 'rgba(0,0,0,0.04)',
          cursor: 'not-allowed',
        },
        'div[data-be="paragraph"]': {
          margin: '0 !important',
          padding: '0 !important',
        },
      },
      '&&-disabled': {
        backgroundColor: 'rgba(0,0,0,0.04)',
        cursor: 'not-allowed',
        padding: 0,
      },
      '&-send-tools': {
        boxSizing: 'border-box',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      },
      '&-send-actions': {
        position: 'absolute',
        userSelect: 'none',
        right: 4,
        boxSizing: 'border-box',
        zIndex: 99,
        bottom: 8,
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      },
      '&-send-has-tools': {
        boxSizing: 'border-box',
        position: 'relative',
        left: 'inherit',
        right: 'inherit',
        bottom: 'inherit',
        top: 'inherit',
      },
    },
  };
};

/**
 * Probubble
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('MarkdownInputField', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(proChatToken), genStyle(proChatToken)];
  });
}
