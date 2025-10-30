import type { ChatTokenType, GenerateStyle } from '../../Hooks/useStyle';
import { useEditorStyleRegister } from '../../Hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = () => {
  return {
    // Browser 组件目前没有特殊样式，保持空的状态
  };
};

export function useBrowserStyle(prefixCls?: string) {
  return useEditorStyleRegister('WorkspaceBrowser', (token) => {
    const browserToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(browserToken)];
  });
}
