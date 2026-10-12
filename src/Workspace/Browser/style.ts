import { Keyframes } from '@ant-design/cssinjs';
import { genStyleHooks, type GenStyleFn } from '../../Hooks/useStyle';

const fadeInUp = new Keyframes('fadeInUp', {
  from: {
    opacity: 0,
    transform: 'translateY(8px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

const genStyle: GenStyleFn<'WorkspaceBrowser'> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      '&-suggestion': {
        boxSizing: 'border-box',
        touchAction: 'manipulation',
        borderRadius: 'var(--radius-control-base)',
        '&:focus-visible': {
          outline: `${token.lineWidthFocus}px solid ${token.colorPrimaryBorder}`,
          outlineOffset: -token.lineWidthFocus,
        },
        '&:hover': {
          borderRadius: 'var(--radius-control-base)',
          background: 'var(--color-gray-control-fill-hover)',
        },
        [`${componentCls}-suggestion-content`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          width: '100%',
          minWidth: 0,
          overflow: 'hidden',
          [`${componentCls}-suggestion-icon`]: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            boxSizing: 'border-box',
            flexShrink: 0,
            padding: 'var(--padding-1x)',
            borderRadius: '200px',
            border: '1px solid var(--color-gray-border-dark)',
            color: 'var(--color-gray-text-secondary)',
          },
          [`${componentCls}-suggestion-text`]: {
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            font: 'var(--font-text-body-sm)',
            letterSpacing: 'var(--letter-spacing-body-sm, normal)',
            color: 'var(--color-gray-text-secondary)',
          },
        },
        [`${token.antCls}-tag`]: {
          marginInlineEnd: '0',
        },
      },

      '&-header': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        minHeight: '48px',
        minWidth: 0,
        gap: token.marginXS,
        width: 'calc(100% - 8px)',
        padding: '8px',
        margin: '4px',
        [`${token.antCls}-tag`]: {
          marginInlineEnd: '0',
        },
        [`${componentCls}-header-left`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          overflow: 'hidden',
          flex: 1,
          minWidth: 0,
          [`${componentCls}-header-title`]: {
            flex: 1,
            minWidth: 0,
            marginInlineEnd: '4px',
            fontWeight: 500,
            fontSize: '14px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'var(--color-gray-text-default)',
          },
        },
      },

      '&-header-wrapper': {
        marginLeft: '-12px',
        marginRight: '-12px',
      },

      '&-result-item': {
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        padding: '4px',
        animationName: fadeInUp,
        animationDuration: token.motionDurationMid,
        animationTimingFunction: 'ease-out',
        animationFillMode: 'backwards',
        '&:nth-child(n + 7)': {
          animation: 'none',
        },
        '&:hover': {
          borderRadius: '12px',
          background: 'var(--color-gray-control-fill-hover)',
        },
        [`${componentCls}-result-item-title`]: {
          fontSize: '12px',
          color: 'var(--color-gray-text-default)',
          display: 'block',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        [`${componentCls}-result-item-title-wrapper`]: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '14px',
          color: 'var(--color-gray-text-default)',
        },
        [`${componentCls}-result-item-site-text`]: {
          font: 'var(--font-text-paragraph-sm)',
          letterSpacing: 'var(--letter-spacing-paragraph-sm, normal)',
          color: 'var(--color-gray-text-light)',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        [`${componentCls}-result-item-site`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '12px',
          cursor: 'pointer',
          touchAction: 'manipulation',
          '&:focus-visible': {
            outline: `${token.lineWidthFocus}px solid ${token.colorPrimaryBorder}`,
            outlineOffset: -token.lineWidthFocus,
            borderRadius: token.borderRadiusSM,
          },
        },
      },
      '@media (prefers-reduced-motion: reduce)': {
        [`${componentCls}-result-item`]: {
          animation: 'none',
        },
      },
    },
  };
};

const useGenStyle = genStyleHooks('WorkspaceBrowser', genStyle);

export function useBrowserStyle(prefixCls?: string) {
  const [, hashId] = useGenStyle(prefixCls ?? 'WorkspaceBrowser');
  return { hashId };
}
