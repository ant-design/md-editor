import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      overflow: 'hidden',
      minHeight: 200,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0px',
      gap: 24,
      '&&-compact': {
        gap: 24,
      },
      [`${token.componentCls}-content-list`]: {
        paddingTop: `${token.padding}px`,
        paddingBottom: `${token.padding}px`,
      },

      '&-loading': {
        padding: '0 24px',
      },
    },
  };
};

/**
 * BubbleItem
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('BubbleItem', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(proChatToken), resetComponent(proChatToken)];
  });
}
