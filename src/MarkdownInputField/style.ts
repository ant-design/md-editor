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
      boxShadow: `0 1px 2px 0 rgba(0, 0, 0, 0.03),0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)`,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#E6ECF4',
      padding: '2px',
      borderRadius: '12px',
      minHeight: '32px',
      maxWidth: 980,
      backdropFilter: 'blur(5.44px)',
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
      '&:hover': {
        boxShadow:
          '0px 2px 9px 0px rgba(202, 218, 255, 0.3671),0px 1px 7px 0px rgba(51, 0, 123, 0.07),0px 0px 1px 0px rgba(74, 0, 255, 0.0806),inset 0px 1px 4px 0px rgba(225, 235, 240, 0.5),inset 0px 1px 1px 0px rgba(204, 214, 220, 0.5)',

        [`${token.componentCls}-background`]: {
          opacity: 1,
        },
      },
      '&-background': {
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
        backgroundColor: '#FFF',
        width: '100%',
        zIndex: 9,
        maxHeight: 120,
        overflowY: 'auto',
        scrollbarColor: '#B9C0CB transparent',
        scrollbarWidth: 'thin',
        '&&-disabled': {
          backgroundColor: 'rgba(0,0,0,0.04)',
          cursor: 'not-allowed',
        },
      },
      '&&-disabled': {
        backgroundColor: 'rgba(0,0,0,0.04)',
        cursor: 'not-allowed',
        padding: 0,
        '&:hover': {
          [`${token.componentCls}-background`]: {
            opacity: 0,
          },
        },
      },
      '&-send-before-actions': {
        position: 'absolute',
        left: 4,
        zIndex: 99,
        bottom: 8,
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      },
      '&-send-actions': {
        position: 'absolute',
        right: 4,
        zIndex: 99,
        bottom: 8,
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      },
    },
  };
};

/**
 * ProchatItem
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
