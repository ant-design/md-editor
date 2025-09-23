import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [`${token.componentCls}-skill-mode-container`]: {
      overflow: 'hidden',
    },

    [`${token.componentCls}-skill-mode`]: {
      borderWidth: '0px 0px 1px 0px',
      width: '100%',
      height: 'fit-content',
      minHeight: '48px',
      alignSelf: 'stretch',
      borderStyle: 'solid',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    [`${token.componentCls}-skill-mode-title`]: {
      font: 'var(--font-text-h5-base)',
      letterSpacing: 'var(--letter-spacing-h5-base, normal)',
      color: 'var(--color-primary-control-fill-primary)',
    },

    [`${token.componentCls}-skill-mode-right`]: {
      font: 'var(--font-text-body-sm)',
      letterSpacing: 'var(--letter-spacing-body-sm, normal)',
      color: 'var(--color-gray-text-secondary)',
    },

    [`${token.componentCls}-skill-mode-divider`]: {
      margin: '0',
    },

    [`${token.componentCls}-skill-mode-close`]: {
      cursor: 'pointer',
      outline: 'none',
      border: 'none',
      background: 'transparent',
      padding: '4px',
      borderRadius: '4px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',

      '&:hover': {
        backgroundColor: 'var(--color-gray-control-fill-active)',
        color: 'var(--color-gray-text-default)',
      },

      '&:active': {
        backgroundColor: 'var(--color-gray-control-fill-pressed)',
        outline: 'none',
        border: 'none',
      },

      '&:focus': {
        outline: '2px solid #3b82f6',
        outlineOffset: '2px',
      },

      '&:focus:not(:focus-visible)': {
        outline: 'none',
      },
    },
  };
};

/**
 * SkillModeBar 样式 Hook
 * @param prefixCls 类名前缀
 * @returns 样式相关函数和变量
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('SkillModeBar', (token) => {
    const skillModeToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(skillModeToken), genStyle(skillModeToken)];
  });
}
