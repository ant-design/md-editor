import { Keyframes } from '@ant-design/cssinjs';
import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../hooks/useStyle';

// MarkdownInputField 样式常量
// Glow border effect constants - 辉光边框效果常量
const GLOW_BORDER_OFFSET = 2; // px - 辉光边框偏移量
const GLOW_BORDER_TOTAL_OFFSET = GLOW_BORDER_OFFSET * 2; // 2px - 总偏移量（上下左右）

// CSS helpers for glow border effect - 辉光边框效果的 CSS 助手函数
const getGlowBorderOffset = () => `-${GLOW_BORDER_OFFSET}px`;

// 不需要 calc() 包裹的所有关键字
const DIRECT_RETURN_KEYWORDS: ReadonlySet<string> = new Set([
  'auto',
  'inherit',
  'initial',
  'unset',
  'revert',
  'revert-layer', // CSS 全局关键字
  'min-content',
  'max-content', // CSS 内在尺寸关键字
]);

// 为任意尺寸值添加辉光边框偏移 - Add glow border offset to any size value
export const addGlowBorderOffset = (size: string | number): string => {
  // 数字类型直接处理
  if (typeof size === 'number') return `${size + GLOW_BORDER_TOTAL_OFFSET}px`;

  const val = size.trim();

  // 空字符串防御
  if (val === '') return `${GLOW_BORDER_TOTAL_OFFSET}px`;

  const valLower = val.toLowerCase();

  // 直接返回的关键字或 fit-content() 函数（忽略大小写）
  if (
    DIRECT_RETURN_KEYWORDS.has(valLower) ||
    /^fit-content\s*\(.*\)$/i.test(val)
  ) {
    return val;
  }

  // 纯数字字符串 -> 添加偏移并转为 px
  if (/^-?\d+(\.\d+)?$/.test(val)) {
    return `${parseFloat(val) + GLOW_BORDER_TOTAL_OFFSET}px`;
  }

  // 其他值用 calc() 包裹
  return `calc(${val} + ${GLOW_BORDER_TOTAL_OFFSET}px)`;
};

// Input field padding constants - 输入字段内边距常量
const INPUT_FIELD_PADDING = {
  NONE: '0px',
  SMALL: `${GLOW_BORDER_OFFSET}px`,
} as const;

// 定义旋转动画
const stopIconRotate = new Keyframes('stopIconRotate', {
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      width: '100%',
      height: '100%',
      display: 'flex',
      boxShadow: `0px 0px 1px 0px rgba(0, 19, 41, 0.05),0px 2px 7px 0px rgba(0, 19, 41, 0.05),0px 2px 5px -2px rgba(0, 19, 41, 0.06)`,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: INPUT_FIELD_PADDING.NONE,
      margin: INPUT_FIELD_PADDING.SMALL,
      borderRadius: '16px',
      minHeight: '48px',
      maxWidth: 980,
      backdropFilter: 'blur(5.44px)',
      position: 'relative',
      tableIndex: 1,
      transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
      '> * ': {
        boxSizing: 'border-box',
      },
      '&:active,&.active': {
        [`${token.componentCls}-background`]: {
          opacity: 1,
          backgroundColor: '#1890ff',
        },
      },

      '&:hover': {
        [`${token.componentCls}-background`]: {
          opacity: 1,
          // backgroundColor: 'rgba(0, 9, 50, 0.1)',
        },
      },

      '&-background': {
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
        position: 'absolute',
        top: getGlowBorderOffset(),
        left: getGlowBorderOffset(),
        width: addGlowBorderOffset('100%'),
        height: addGlowBorderOffset('100%'),
        zIndex: 2,
        backgroundColor: 'rgba(0, 9, 50, 0.1)',
        pointerEvents: 'none',
        borderRadius: 'inherit',
      },
      '&:focus': {
        boxShadow: 'none',
        [`${token.componentCls}-background`]: {
          opacity: 1,
          backgroundColor: '#1890ff',
        },
      },
      '&-editor': {
        boxSizing: 'border-box',
        backgroundColor: 'var(--color-gray-bg-card-white)',
        width: '100%',
        zIndex: 9,
        maxHeight: 400,
        height: '100%',
        borderRadius: 'inherit',
        overflowY: 'visible',
        scrollbarColor: 'var(--color-gray-text-tertiary) transparent',
        scrollbarWidth: 'thin',
        '&&-disabled': {
          backgroundColor: 'rgba(0,0,0,0.04)',
          cursor: 'not-allowed',
        },
        'div[data-be="paragraph"]': {
          margin: '0 !important',
          padding: '0 !important',
        },
      },
      '&-editor-content': {
        overflowY: 'auto',
        maxHeight: 'inherit',
        scrollbarColor: 'var(--color-gray-text-tertiary) transparent',
        scrollbarWidth: 'thin',
        borderRadius: 'inherit',
      },
      '&&-disabled': {
        backgroundColor: 'rgba(0,0,0,0.04)',
        cursor: 'not-allowed',
        padding: 0,
      },
      '&-send-tools': {
        boxSizing: 'border-box',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        font: 'var(--font-text-body-base)',
        color: 'var(--color-gray-text-default)',
      },
      '&-send-actions': {
        position: 'absolute',
        userSelect: 'none',
        right: 4,
        boxSizing: 'border-box',
        zIndex: 99,
        bottom: 8,
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        font: 'var(--font-text-body-base)',
        color: 'var(--color-gray-text-default)',
      },
      '&-quick-actions': {
        position: 'absolute',
        userSelect: 'none',
        right: 18,
        top: 12,
        boxSizing: 'border-box',
        zIndex: 99,
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      },
      '&-send-has-tools': {
        boxSizing: 'border-box',
        position: 'relative',
        left: 'inherit',
        right: 'inherit',
        bottom: 'inherit',
        top: 'inherit',
      },

      // 旋转动画样式
      '.stop-icon-ring': {
        transition: 'transform 0.1s ',
        transformOrigin: '16px 16px',
        animationName: stopIconRotate,
        animationDuration: '1s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
      },
    },
    [`${token.componentCls}-before-tools`]: {
      display: 'flex',
      gap: 8,
      width: '100%',
      padding: '0 10px 0 0',
      marginBottom: '8px',
      font: 'var(--font-text-body-base)',
      color: 'var(--color-gray-text-default)',
      '> div': {
        cursor: 'pointer',
      },
    },
  };
};

/**
 * Probubble
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('MarkdownInputField', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(proChatToken), genStyle(proChatToken)];
  });
}
