import type { ChatTokenType, GenerateStyle } from '../../hooks/useStyle';
import { useEditorStyleRegister } from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [`${token.componentCls}`]: {
      padding: '4px',
    },
  };
};

export function useTaskStyle(prefixCls?: string) {
  return useEditorStyleRegister('WorkspaceTask', (token) => {
    const taskToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(taskToken)];
  });
}
