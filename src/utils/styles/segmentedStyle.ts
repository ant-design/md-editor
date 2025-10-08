import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

// segmented 的 cssinjs 样式
export const genSegmentedStyle: GenerateStyle<any> = () => ({
  '.ant-segmented': {
    borderRadius: 'var(--radius-control-base)',
    background: 'var(--color-gray-control-fill-active)',
    padding: '1px',
  },
  '.ant-segmented .ant-segmented-item': {
    fontSize: 'var(--font-size-base)',
    font: 'var(--font-text-body-base)',
    letterSpacing: 'var(--letter-spacing-body-base, normal)',
    color: 'var(--color-gray-text-secondary)',
  },
  '.ant-segmented .ant-segmented-item:hover:not(.ant-segmented-item-selected):not(.ant-segmented-item-disabled)::after':
    {
      borderRadius: 'var(--radius-control-base)',
    },
  '.ant-segmented .ant-segmented-item .ant-segmented-item-title': {
    display: 'inline-flex',
    gap: '8px',
    alignItems: 'center',
  },
  '.ant-segmented .ant-segmented-item .ant-segmented-item-tag': {
    minWidth: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4px 6px',
    gap: '8px',
    zIndex: 1,
    borderRadius: '200px',
    background: 'var(--color-gray-control-fill-active)',
    color: 'var(--color-gray-text-secondary)',
    font: 'var(--font-text-number-xs)',
    letterSpacing: 'var(--letter-spacing-number-xs, normal)',
  },
  '.ant-segmented .ant-segmented-item .ant-segmented-item-label': {
    minHeight: '14px',
    padding: 'var(--padding-2x) var(--padding-3x)',
    lineHeight: '14px',
    display: 'inline-flex',
    alignItems: 'center',
  },
  '.ant-segmented .ant-segmented-item .ant-segmented-item-label .ant-segmented-item-icon':
    {
      fontSize: '16px',
    },
  '.ant-segmented .ant-segmented-item-selected': {
    font: 'var(--font-text-h6-base)',
    letterSpacing: 'var(--letter-spacing-h6-base, normal)',
    color: 'var(--color-gray-text-default)',
    borderRadius: 'var(--radius-control-base)',
    background: 'var(--color-gray-bg-card-white)',
    boxShadow: 'var(--shadow-control-base)',
  },
});

export function useStyle(prefixCls: string = 'ant') {
  return useEditorStyleRegister('reset-ant-segmented', (token: any) => {
    const styleToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    } as ChatTokenType;
    return [genSegmentedStyle(styleToken)];
  });
}
