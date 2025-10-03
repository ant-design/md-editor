import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

// select 的 cssinjs 样式（Hover 使用样式继承，避免重复）
export const genSelectStyle: GenerateStyle<any> = () => ({
  '.ant-select.ant-select-outlined': {
    font: 'var(--font-text-body-base)',
    letterSpacing: 'var(--letter-spacing-body-base, normal)',
    color: 'var(--color-gray-text-default)',
    borderRadius: 'var(--radius-control-base)',
    background: 'var(--color-gray-bg-card-white)',
  },
  '.ant-select.ant-select-outlined .ant-select-selector': {
    border: '1px solid transparent',
    boxShadow: 'var(--shadow-control-base)',
    boxSizing: 'border-box',
    borderRadius: 'var(--radius-control-base)',
    background: 'var(--color-gray-bg-card-white)',
  },
  // Hover 仅修改差异属性，复用基础样式
  '.ant-select-outlined:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer):hover .ant-select-selector':
    {
      borderColor: 'var(--color-primary-control-fill-primary-active)',
    },
  '.ant-select.ant-select-outlined.ant-select-disabled': {
    color: 'var(--color-gray-text-default)',
    borderRadius: 'var(--radius-control-base)',
    background: 'var(--color-gray-control-fill-disabled)',
  },
  '.ant-select.ant-select-outlined.ant-select-disabled .ant-select-selector': {
    borderColor: 'transparent',
    border: '1px solid transparent',
    boxShadow: 'none',
  },
});

export function useStyle(prefixCls: string = 'ant') {
  return useEditorStyleRegister('reset-ant-select', (token: any) => {
    const styleToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    } as ChatTokenType;
    return [genSelectStyle(styleToken)];
  });
}
