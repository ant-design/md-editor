import type { ChatTokenType, GenerateStyle } from '../../hooks/useStyle';
import { useEditorStyleRegister } from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = () => {
  return {
    // Browser 组件目前没有特殊样式，保持空的状态
  };
};

export function useBrowserStyle(prefixCls?: string) {
  return useEditorStyleRegister('WorkspaceBrowser', (token: ChatTokenType) => {
    const browserToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(browserToken)];
  });
}
