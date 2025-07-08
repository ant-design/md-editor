/**
 * 全局 CSS 变量定义
 * 用于 CSS-in-JS 样式系统
 */

/**
 * CSS 变量映射表
 */
export const cssVariables = {
  // 颜色 - Gray
  '--color-gray-1': '#fcfcfd',
  '--color-gray-2': '#f8f9fb',
  '--color-gray-3': '#F3F4F7',
  '--color-gray-4': '#e6e8eb',
  '--color-gray-5': '#dfe1e4',
  '--color-gray-6': '#d8d9dc',
  '--color-gray-7': '#cdced1',
  '--color-gray-8': '#babbbe',
  '--color-gray-9': '#8c8d90',
  '--color-gray-10': '#818385',
  '--color-gray-11': '#636467',
  '--color-gray-12': '#1f2022',

  // 颜色 - Gray Alpha
  '--color-gray-a1': '#00005503',
  '--color-gray-a2': '#00256e07',
  '--color-gray-a3': '#001e4b11',
  '--color-gray-a4': '#00153319',
  '--color-gray-a5': '#00102820',
  '--color-gray-a6': '#00071b27',
  '--color-gray-a7': '#00061532',
  '--color-gray-a8': '#00040f45',
  '--color-gray-a9': '#00030973',
  '--color-gray-a10': '#0005097e',
  '--color-gray-a11': '#0002079c',
  '--color-gray-a12': '#000103e0',

  // 颜色 - Blue
  '--color-blue-1': '#fbfdff',
  '--color-blue-2': '#f4f9ff',
  '--color-blue-3': '#e9f3ff',
  '--color-blue-4': '#d9ecff',
  '--color-blue-5': '#c7e2ff',
  '--color-blue-6': '#b2d5ff',
  '--color-blue-7': '#97c3ff',
  '--color-blue-8': '#6fabfc',
  '--color-blue-9': '#1a85ff',
  '--color-blue-10': '#0077f4',
  '--color-blue-11': '#006ee6',
  '--color-blue-12': '#033268',

  // 颜色 - Blue Alpha
  '--color-blue-a1': '#0080ff04',
  '--color-blue-a2': '#0074ff0b',
  '--color-blue-a3': '#0074ff16',
  '--color-blue-a4': '#0080ff26',
  '--color-blue-a5': '#007bff38',
  '--color-blue-a6': '#0074ff4d',
  '--color-blue-a7': '#006cff68',
  '--color-blue-a8': '#006bfa90',
  '--color-blue-a9': '#0077ffe5',
  '--color-blue-a10': '#0077f4',
  '--color-blue-a11': '#006ee6',
  '--color-blue-a12': '#003066fc',

  // 语义化颜色
  '--color-primary': 'var(--color-blue-9)',
  '--color-primary-hover': 'var(--color-blue-8)',
  '--color-primary-active': 'var(--color-blue-10)',
  '--color-primary-disabled': 'var(--color-blue-3)',

  // 背景色
  '--color-bg-default': 'var(--color-gray-1)',
  '--color-bg-secondary': 'var(--color-gray-2)',
  '--color-bg-tertiary': 'var(--color-gray-3)',
  '--color-bg-quaternary': 'var(--color-gray-4)',
  '--color-bg-hover': 'var(--color-gray-2)',
  '--color-bg-active': 'var(--color-gray-3)',
  '--color-bg-disabled': 'var(--color-gray-2)',

  // 文本颜色
  '--color-text-primary': 'var(--color-gray-12)',
  '--color-text-secondary': 'var(--color-gray-11)',
  '--color-text-tertiary': 'var(--color-gray-9)',
  '--color-text-quaternary': 'var(--color-gray-8)',
  '--color-text-disabled': 'var(--color-gray-7)',
  '--color-text-inverse': 'var(--color-gray-1)',

  // 边框颜色
  '--color-border-default': 'var(--color-gray-4)',
  '--color-border-strong': 'var(--color-gray-5)',
  '--color-border-hover': 'var(--color-gray-6)',
  '--color-border-active': 'var(--color-gray-7)',
  '--color-border-disabled': 'var(--color-gray-3)',

  // 图标颜色
  '--color-icon-secondary': '#666F8D',

  // 字体
  '--font-family-base':
    '"AlibabaPuHuiTi", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  '--font-family-code':
    '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',

  // 字号
  '--font-size-xs': '10px',
  '--font-size-sm': '12px',
  '--font-size-base': '13px',
  '--font-size-lg': '15px',
  '--font-size-xl': '18px',
  '--font-size-2xl': '24px',
  '--font-size-3xl': '30px',
  '--font-size-4xl': '56px',

  // 行高
  '--line-height-xs': '18px',
  '--line-height-sm': '20px',
  '--line-height-base': '24px',
  '--line-height-lg': '26px',
  '--line-height-xl': '32px',
  '--line-height-2xl': '38px',
  '--line-height-3xl': '64px',

  // 间距
  '--spacing-component-xs': '2px',
  '--spacing-component-sm': '4px',
  '--spacing-component-base': '8px',
  '--spacing-component-lg': '12px',

  '--spacing-block-xs': '4px',
  '--spacing-block-sm': '8px',
  '--spacing-block-base': '12px',
  '--spacing-block-xl': '16px',

  '--spacing-section-2xs': '4px',
  '--spacing-section-xs': '8px',
  '--spacing-section-sm': '16px',
  '--spacing-section-base': '24px',
  '--spacing-section-lg': '32px',
  '--spacing-section-xl': '40px',

  // 圆角
  '--radius-control-xs': '4px',
  '--radius-control-sm': '6px',
  '--radius-control-base': '8px',
  '--radius-card-base': '12px',
  '--radius-card-lg': '16px',
  '--radius-dialog-base': '20px',
  '--radius-capsule': '72px',

  // 动画
  '--transition-duration-base': '200ms',
  '--transition-duration-slow': '300ms',
  '--transition-duration-slower': '400ms',
  '--transition-timing-function-ease-in-out':
    'cubic-bezier(0.645, 0.045, 0.355, 1)',
  '--transition-timing-function-ease-out':
    'cubic-bezier(0.215, 0.61, 0.355, 1)',
  '--transition-timing-function-ease-in':
    'cubic-bezier(0.55, 0.055, 0.675, 0.19)',

  // 阴影
  '--shadow-border-l1': 'inset 0 0 1px 0 rgba(0, 0, 0, 15%)',
  '--shadow-control-b1':
    '0 0 1px 0 rgba(0, 1, 3, 20%), 0 1.5px 4px -1px rgba(0, 1, 3, 4%)',
  '--shadow-control-l0':
    '0 0 1px 0 rgba(0, 1, 3, 20%), 0 1.5px 4px -1px rgba(0, 1, 3, 4%)',
  '--shadow-control-l1':
    '0 0 1px 0 rgba(0, 1, 3, 5%), 0 2px 7px 0 rgba(0, 1, 3, 5%), 0 2px 5px -2px rgba(0, 1, 3, 6%)',
  '--shadow-card-l1': '0 1.5px 4px -1px rgba(0, 1, 3, 7%)',
  '--shadow-bubble-l2':
    '0 0 1px 0 rgba(0, 1, 3, 5%), 0 6px 16px 0 rgba(0, 1, 3, 8%)',
  '--shadow-dialog-l3':
    '0 0 3px -1px rgba(0, 1, 3, 4%), 0 32px 33px -15px rgba(0, 1, 3, 17%)',

  // 层级
  '--z-index-dropdown': '1000',
  '--z-index-sticky': '1020',
  '--z-index-fixed': '1030',
  '--z-index-modal-backdrop': '1040',
  '--z-index-modal': '1050',
  '--z-index-popover': '1060',
  '--z-index-tooltip': '1070',
} as const;
