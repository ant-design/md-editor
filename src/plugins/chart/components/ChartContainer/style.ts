import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      // 图表容器基础样式
      position: 'relative',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      // 响应式边框样式
      borderRadius: '6px',
      padding: '12px',

      // 浅色主题边框
      '&[class*="-light-theme"]': {
        border: '1px solid #e8e8e8',
        backgroundColor: '#fff',
      },

      // 深色主题无边框
      '&[class*="-dark-theme"]': {
        border: 'none',
        backgroundColor: '#1a1a1a',
      },

      // 移动端适配
      '&[class*="-mobile"]': {
        borderRadius: '6px',
        padding: '12px',
        margin: '0 auto',
        maxWidth: '100%',
      },

      // 桌面端适配
      '&[class*="-desktop"]': {
        borderRadius: '8px',
        padding: '20px',
        margin: 'initial',
        maxWidth: 'none',
      },

      // 轮廓变体
      '&[class*="-outline"]': {
        border: '2px solid #1677ff',
        backgroundColor: 'transparent',
      },

      // 无边框变体
      '&[class*="-borderless"]': {
        border: 'none',
        backgroundColor: 'transparent',
        padding: 0,
      },
    },
  };
};

/**
 * 样式钩子
 * @param baseClassName 基础类名
 * @returns 样式相关对象
 */
export const useStyle = (baseClassName: string) => {
  return useEditorStyleRegister('ChartContainer', (token) => {
    const containerToken = {
      ...token,
      componentCls: `.${baseClassName}`,
    };

    return [genStyle(containerToken)];
  });
};
