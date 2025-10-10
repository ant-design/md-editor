import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

// 按钮 btn 的 cssinjs 样式（优化：Hover/Active 使用样式继承，仅覆盖差异，移除重复项）
export const genBtnStyle: GenerateStyle<any> = () => ({
  '.ant-btn': {
    fontSize: 'var(--font-size-base)',
    height: 'var(--height-control-base)',
    padding: '0px var(--padding-3x)',
    borderRadius: 'var(--radius-control-base)',
  },
  '.ant-btn-lg': {
    height: 'var(--height-control-lg)',
    padding: '0px var(--padding-3x)',
  },
  '.ant-btn-sm': {
    height: 'var(--height-control-sm)',
    padding: '0px var(--padding-2x)',
  },
  '.ant-btn-color-default.ant-btn-variant-solid': {
    color: '#fff',
    background: 'var(--color-gray-control-fill-primary)',
  },
  '.ant-btn-color-default.ant-btn-variant-solid:not(:disabled):not(.ant-btn-disabled):hover':
    {
      color: '#fff',
      background: 'var(--color-gray-control-fill-primary-hover)',
    },
  '.ant-btn-color-default.ant-btn-variant-solid:not(:disabled):not(.ant-btn-disabled):active':
    {
      color: '#fff',
      background: 'var(--color-gray-control-fill-primary-active)',
    },
  '.ant-btn-color-default.ant-btn-variant-solid:disabled, .ant-btn-color-default.ant-btn-variant-solid.ant-btn-disabled':
    {
      cursor: 'not-allowed',
      borderColor: '#d9d9d9',
      color: 'var(--color-gray-contrast)',
      background: 'var(--color-gray-text-disabled)',
      boxShadow: 'none',
    },
  '.ant-btn-color-default.ant-btn-variant-solid.ant-btn-loading': {
    background: 'var(--color-gray-text-disabled)',
    opacity: 1,
  },
  '.ant-btn-color-default.ant-btn-variant-filled': {
    boxShadow: 'none',
    background: 'var(--color-gray-control-fill-secondary)',
    color: 'var(--color-gray-text-default)',
    border: '1px solid transparent',
  },
  '.ant-btn-color-default.ant-btn-variant-filled:disabled, .ant-btn-color-default.ant-btn-variant-filled.ant-btn-disabled':
    {
      cursor: 'not-allowed',
      borderColor: 'transparent',
      color: 'rgba(0, 4, 26, 0.2706)',
      background: 'var(--color-gray-control-fill-secondary)',
      boxShadow: 'none',
    },
  '.ant-btn-color-default.ant-btn-variant-filled:not(:disabled):not(.ant-btn-disabled):hover':
    {
      background: 'var(--color-gray-control-fill-secondary-hover)',
    },
  '.ant-btn-color-default.ant-btn-variant-filled:not(:disabled):not(.ant-btn-disabled):active':
    {
      background: 'var(--color-gray-control-fill-secondary-active)',
    },
  '.ant-btn-variant-outlined': {
    background: '#ffffff',
    color: 'var(--color-gray-text-default)',
    boxShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
    border: '1px solid var(--color-gray-border-light)',
  },
  '.ant-btn-variant-outlined.ant-btn-loading': {
    background: 'var(--color-gray-control-fill-hover)',
    boxSizing: 'border-box',
    border: '1px solid var(--color-gray-border-light)',
  },
  '.ant-btn-variant-outlined:disabled, .ant-btn-variant-dashed:disabled, .ant-btn-variant-outlined.ant-btn-disabled, .ant-btn-variant-dashed.ant-btn-disabled':
    {
      cursor: 'not-allowed',
      borderColor: 'var(--color-gray-border-light)',
      color: 'var(--color-gray-text-disabled)',
      background: '#fff',
      boxShadow: 'none',
    },
  '.ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):hover': {
    // 仅覆盖差异
    background: 'var(--color-gray-control-fill-hover)',
  },
  '.ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):active': {
    // 仅覆盖差异
    background: 'var(--color-gray-control-fill-active)',
  },
  '.ant-btn-color-primary': {
    borderRadius: '200px',
    background: 'var(--color-primary-control-fill-primary)',
    boxShadow: 'var(--shadow-control-lg)',
    border: 'none',
  },
  '.ant-btn-color-primary:not(:disabled):not(.ant-btn-disabled):hover': {
    background: 'var(--color-primary-control-fill-primary-hover)',
  },
  '.ant-btn-color-primary:not(:disabled):not(.ant-btn-disabled):active': {
    background: 'var(--color-primary-control-fill-primary-active)',
  },
  '.ant-btn-color-primary:disabled, .ant-btn-color-primary.ant-btn-disabled': {
    background: 'var(--color-primary-control-fill-primary)',
    opacity: 0.25,
    boxShadow: 'var(--shadow-control-base)',
    color: 'var(--color-gray-contrast)',
  },
  '.ant-btn-color-primary.ant-btn-loading': {
    background: 'var(--color-primary-text-disabled)',
    boxShadow: 'var(--shadow-control-base)',
    color: 'var(--color-gray-contrast)',
  },
  '.ant-btn.ant-btn-variant-outlined.ant-btn-icon-only': {
    width: '32px',
    borderRadius: 'var(--radius-control-base)',
    background: 'var(--color-gray-bg-card-white)',
    boxShadow: 'var(--shadow-border-base)',
    color: 'var(--color-gray-text-secondary)',
    border: 'none',
  },
  '.ant-btn.ant-btn-variant-outlined.ant-btn-icon-only:not(:disabled):not(.ant-btn-disabled):hover':
    {
      // 背景与基础一致，仅提升阴影
      boxShadow: 'var(--shadow-control-lg)',
    },
  '.ant-btn.ant-btn-variant-outlined.ant-btn-icon-only:not(:disabled):not(.ant-btn-disabled):active':
    {
      background: 'var(--color-primary-control-fill-secondary)',
      boxShadow: 'var(--shadow-border-base)',
      color: 'var(--color-primary-control-fill-primary)',
    },
  '.ant-btn.ant-btn-variant-outlined.ant-btn-icon-only:disabled, .ant-btn.ant-btn-variant-outlined.ant-btn-icon-only.ant-btn-disabled':
    {
      color: 'var(--color-gray-text-disabled)',
      background: 'var(--color-gray-bg-card-white)',
      boxShadow: 'var(--shadow-control-base)',
    },
  '.ant-btn.ant-btn-variant-filled.ant-btn-icon-only': {
    width: '32px',
    borderRadius: 'var(--radius-control-base)',
    background: 'var(--color-gray-control-fill-secondary)',
    backdropFilter: 'blur(40px)',
  },
  '.ant-btn.ant-btn-variant-filled.ant-btn-icon-only:not(:disabled):not(.ant-btn-disabled):hover':
    {
      background: 'var(--color-gray-control-fill-secondary-hover)',
      backdropFilter: 'blur(40px)',
    },
  '.ant-btn.ant-btn-variant-filled.ant-btn-icon-only:not(:disabled):not(.ant-btn-disabled):active':
    {
      background: 'var(--color-primary-control-fill-secondary)',
      backdropFilter: 'blur(20px)',
      color: 'var(--color-primary-control-fill-primary)',
    },
  '.ant-btn.ant-btn-variant-filled.ant-btn-icon-only:disabled, .ant-btn.ant-btn-variant-filled.ant-btn-icon-only.ant-btn-disabled':
    {
      background: 'var(--color-gray-control-fill-secondary)',
      backdropFilter: 'blur(40px)',
      color: 'var(--color-gray-text-disabled)',
    },
  '.ant-btn.ant-btn-variant-text.ant-btn-icon-only': {
    width: '32px',
    borderRadius: 'var(--radius-control-base)',
  },
  '.ant-btn.ant-btn-icon-only.ant-btn-variant-text:not(:disabled):not(.ant-btn-disabled):hover':
    {
      background: 'var(--color-gray-control-fill-secondary-hover)',
      backdropFilter: 'blur(40px)',
    },
  '.ant-btn.ant-btn-icon-only.ant-btn-variant-text:not(:disabled):not(.ant-btn-disabled):active':
    {
      background: 'var(--color-primary-control-fill-secondary)',
      backdropFilter: 'blur(20px)',
      color: 'var(--color-primary-control-fill-primary)',
    },
  '.ant-btn.ant-btn-variant-text.ant-btn-icon-only:disabled, .ant-btn.ant-btn-variant-text.ant-btn-icon-only.ant-btn-disabled':
    {
      background: 'var(--color-gray-control-fill-secondary)',
      backdropFilter: 'blur(40px)',
      color: 'var(--color-gray-text-default)',
    },
  '.ant-btn.ant-btn-variant-text': {
    borderRadius: 'var(--radius-control-base)',
    font: 'var(--font-text-body-base)',
    letterSpacing: 'var(--letter-spacing-body-base, normal)',
    color: 'var(--color-gray-text-default)',
    boxShadow: 'none',
  },
  '.ant-btn.ant-btn-variant-text:not(:disabled):not(.ant-btn-disabled):hover': {
    background: 'var(--color-gray-control-fill-hover)',
  },
  '.ant-btn.ant-btn-variant-text:not(:disabled):not(.ant-btn-disabled):active':
    {
      background: 'var(--color-gray-control-fill-active)',
    },
  '.ant-btn.ant-btn-variant-text:disabled, .ant-btn.ant-btn-variant-text.ant-btn-disabled':
    {
      font: 'var(--font-text-body-base)',
      letterSpacing: 'var(--letter-spacing-body-base, normal)',
      color: 'var(--color-gray-text-disabled)',
    },
  '.ant-btn.ant-btn-variant-text.ant-btn-loading': {
    color: 'var(--color-gray-text-disabled)',
    background: 'var(--color-gray-control-fill-hover)',
    opacity: 1,
  },
});

// 提供与组件一致的样式注册 Hook
export function useStyle(prefixCls: string = 'ant') {
  return useEditorStyleRegister('reset-ant-btn', (token: any) => {
    const styleToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    } as ChatTokenType;
    return [genBtnStyle(styleToken)];
  });
}
