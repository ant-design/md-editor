import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

// input 的 cssinjs 样式（Hover 使用样式继承，避免重复）
export const genInputStyle: GenerateStyle<any> = () => ({
  '.ant-input-outlined': {
    borderRadius: 'var(--radius-control-base)',
    background: 'var(--color-gray-bg-card-white)',
    boxShadow: 'var(--shadow-control-base)',
    boxSizing: 'border-box',
    font: 'var(--font-text-body-base)',
    letterSpacing: 'var(--letter-spacing-body-base, normal)',
    color: 'var(--color-gray-text-default)',
    border: '1px solid transparent',
  },
  // Hover 仅修改差异属性，复用基础样式
  '.ant-input-outlined:hover': {
    borderColor: 'var(--color-primary-control-fill-primary-active)',
  },
  '.ant-input-affix-wrapper-outlined:focus, .ant-input-affix-wrapper-outlined:focus-within':
    {
      borderRadius: 'var(--radius-control-base)',
      background: 'var(--color-gray-bg-card-white)',
      boxSizing: 'border-box',
      border: '1px solid var(--color-primary-control-fill-primary-active)',
      boxShadow: 'var(--shadow-control-base)',
    },
  '.ant-input-outlined.ant-input-disabled, .ant-input[disabled]': {
    borderColor: 'transparent',
    color: 'var(--color-gray-text-default)',
    borderRadius: 'var(--radius-control-base)',
    background: 'var(--color-gray-control-fill-disabled)',
  },
});

export function useStyle(prefixCls: string = 'ant') {
  return useEditorStyleRegister('reset-ant-input', (token: any) => {
    const styleToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    } as ChatTokenType;
    return [genInputStyle(styleToken)];
  });
}
