/**
 * 全局样式定义文件
 * 包含图标、文字、间距、边距、圆角、投影等基础样式定义
 */

/**
 * 图标样式定义
 * 包含不同尺寸的图标样式
 */
export const iconStyles = {
  /** 小号图标样式 16x16 */
  iconSS: {
    fontSize: 16,
    width: 16,
    height: 16,
  },
  /** 中号图标样式 18x18 */
  iconSM: {
    fontSize: 18,
    width: 18,
    height: 18,
  },
} as const;

/**
 * 文字样式定义
 * 包含基础文字样式、标题样式、正文样式等
 */
export const textStyles = {
  /** 基础文字样式 */
  textBase: {
    fontFamily: 'AlibabaPuHuiTi',
    fontVariationSettings: '"opsz" auto',
    fontFeatureSettings: '"kern" on',
  },
  /** H1 - 巨大标题 */
  textH1Mega: {
    fontSize: 56,
    lineHeight: '64px',
    letterSpacing: '4%',
  },
  /** H2 - 标语 */
  textH2Slogan: {
    fontSize: 30,
    lineHeight: '38px',
  },
  /** H3 - 主题 */
  textH3Theme: {
    fontSize: 24,
    lineHeight: '32px',
  },
  /** H4 - 页面标题 */
  textH4PageTitle: {
    fontSize: 18,
    lineHeight: '26px',
  },
  /** H5 - 卡片标题 */
  textH5CardTitle: {
    fontSize: 15,
    lineHeight: '24px',
  },
  /** H6 - 副标题 */
  textH6Subtitle: {
    fontSize: 13,
    lineHeight: '20px',
  },
  /** 紧凑正文 - 微小字号 */
  textBodyXS: {
    fontSize: 10,
    lineHeight: '18px',
  },
  /** 紧凑正文 - 小字号 */
  textBodySM: {
    fontSize: 12,
    lineHeight: '20px',
  },
  /** 紧凑正文 - 小字号加粗 */
  textBodySMBold: {
    fontSize: 12,
    lineHeight: '20px',
    fontWeight: 600,
  },
  /** 紧凑正文 - 基础字号 */
  textBodyM: {
    fontSize: 13,
    lineHeight: '20px',
  },
  /** 紧凑正文 - 大字号 */
  textBodyL: {
    fontSize: 15,
    lineHeight: '24px',
  },
} as const;

/**
 * 间距样式定义
 * 包含组件内、区块内、区块间等不同场景的间距定义
 */
export const margins = {
  /** 无间距 */
  none: 0,
  /** 组件内间距 */
  component: {
    /** 超小间距 2px */
    xs: 2,
    /** 小间距 4px */
    sm: 4,
    /** 基础间距 8px */
    base: 8,
    /** 大间距 12px */
    lg: 12,
  },
  /** 区块内间距 */
  block: {
    /** 超小间距 4px */
    xs: 4,
    /** 小间距 8px */
    sm: 8,
    /** 基础间距 12px */
    base: 12,
    /** 超大间距 16px */
    xl: 16,
  },
  /** 区块间间距 */
  section: {
    /** 极小间距 4px */
    '2xs': 4,
    /** 超小间距 8px */
    xs: 8,
    /** 小间距 16px */
    sm: 16,
    /** 基础间距 24px */
    base: 24,
    /** 大间距 32px */
    lg: 32,
    /** 超大间距 40px */
    xl: 40,
  },
} as const;

/**
 * 边距样式定义
 * 包含卡片、对话框、页面等不同场景的内边距定义
 */
export const paddings = {
  /** 无边距 */
  none: {
    padding: 0,
  },
  /** 卡片边距 */
  card: {
    /** 覆盖型卡片边距 4px */
    cover: {
      padding: 4,
    },
    /** 小型卡片边距 8px */
    sm: {
      padding: 8,
    },
    /** 基础卡片边距 12px */
    base: {
      padding: 12,
    },
    /** 大型卡片边距 16px */
    lg: {
      padding: 16,
    },
  },
  /** 对话框边距 */
  dialog: {
    /** 基础对话框边距 24px 32px */
    base: {
      padding: '24px 32px',
    },
  },
  /** 页面容器边距 */
  page: {
    /** 小型页面容器边距 16px 24px */
    sm: {
      padding: '16px 24px',
    },
    /** 基础页面容器边距 16px 40px */
    base: {
      padding: '16px 40px',
    },
  },
  /** 控件边距 */
  control: {
    /** 28高度控件边距 3px 8px */
    s28: {
      padding: '3px 8px',
    },
    /** 28高度带图标控件边距 6px 8px 6px 6px */
    s28Icon: {
      padding: '6px 8px 6px 6px',
    },
    /** 32高度控件边距 5px 12px */
    m32: {
      padding: '5px 12px',
    },
  },
  /** 标签边距 */
  tag: {
    /** 24高度标签边距 0 6px */
    24: {
      padding: '0 6px',
    },
  },
  /** 表格边距 */
  table: {
    /** 32高度表格边距 5px 0 */
    s32: {
      padding: '5px 0',
    },
    /** 40高度表格边距 9px 0 */
    m40: {
      padding: '9px 0',
    },
    /** 60高度表格边距 19px 0 */
    lg60: {
      padding: '19px 0',
    },
  },
} as const;

/**
 * 圆角样式定义
 * 包含控件、卡片、对话框等不同场景的圆角定义
 */
export const borderRadius = {
  /** 控件圆角 */
  control: {
    /** 超小圆角 4px */
    xs: {
      borderRadius: 4,
    },
    /** 小圆角 6px */
    sm: {
      borderRadius: 6,
    },
    /** 基础圆角 8px */
    base: {
      borderRadius: 8,
    },
  },
  /** 卡片圆角 */
  card: {
    /** 基础卡片圆角 12px */
    base: {
      borderRadius: 12,
    },
    /** 大型卡片圆角 16px */
    lg: {
      borderRadius: 16,
    },
  },
  /** 对话框圆角 */
  dialog: {
    /** 基础对话框圆角 20px */
    base: {
      borderRadius: 20,
    },
  },
  /** 胶囊形圆角 72px */
  capsule: {
    borderRadius: 72,
  },
  /** 无圆角 */
  none: {
    borderRadius: 0,
  },
} as const;

/**
 * 投影样式定义
 * 包含边框、控件、卡片、气泡、对话框等不同场景的投影定义
 */
export const shadows = {
  /** 投影-描边-L1 */
  borderL1: {
    boxShadow: 'inset 0 0 1px 0 rgba(0, 0, 0, 15%)',
  },
  /** 投影-控件-B1 */
  controlB1: {
    boxShadow:
      '0 0 1px 0 rgba(0, 1, 3, 20%), 0 1.5px 4px -1px rgba(0, 1, 3, 4%)',
  },
  /** 投影-控件-L0 */
  controlL0: {
    boxShadow:
      '0 0 1px 0 rgba(0, 1, 3, 20%), 0 1.5px 4px -1px rgba(0, 1, 3, 4%)',
  },
  /** 投影-控件-L1 */
  controlL1: {
    boxShadow:
      '0 0 1px 0 rgba(0, 1, 3, 5%), 0 2px 7px 0 rgba(0, 1, 3, 5%), 0 2px 5px -2px rgba(0, 1, 3, 6%)',
  },
  /** 投影-卡片-L1 */
  cardL1: {
    boxShadow: '0 1.5px 4px -1px rgba(0, 1, 3, 7%)',
  },
  /** 投影-气泡-L2 */
  bubbleL2: {
    boxShadow: '0 0 1px 0 rgba(0, 1, 3, 5%), 0 6px 16px 0 rgba(0, 1, 3, 8%)',
  },
  /** 投影-对话框-L3 */
  dialogL3: {
    boxShadow:
      '0 0 3px -1px rgba(0, 1, 3, 4%), 0 32px 33px -15px rgba(0, 1, 3, 17%)',
  },
} as const;

/**
 * 样式组件定义
 * 包含文本省略、滚动条等常用样式组件
 */
export const components = {
  /** 单行文本省略 */
  textEllipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  /**
   * 多行文本省略
   * @param line 最大行数，默认为2
   */
  textEllipsisMultiple: (line: number = 2) => ({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: line,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
  }),
  /** 滚动条样式 */
  scrollbar: {
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    '&::-webkit-scrollbar': {
      width: 10,
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      width: 4,
      backgroundColor: 'transparent',
      border: '2px solid transparent',
      backgroundClip: 'padding-box',
      borderRadius: 72,
    },
    '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: 'var(--color-gray-border-light)',
      '&:hover': {
        backgroundColor: 'var(--color-gray-text-disabled)',
      },
    },
  },
  /** 显示滚动边缘线 */
  showScrollLine: {
    borderTop: '1px solid transparent',
    borderBottom: '1px solid transparent',
    '&.border-scrolling-top': {
      borderTopColor: 'var(--color-gray-border-light)',
    },
    '&.border-scrolling-bottom': {
      borderBottomColor: 'var(--color-gray-border-light)',
    },
  },
  /** 隐藏滚动条 */
  scrollbarHidden: {
    overflowY: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
} as const;

/**
 * 颜色样式定义
 * 包含灰度、蓝色等基础色板
 */
export const colors = {
  /** Gray 色板 */
  gray: {
    1: '#fcfcfd',
    2: '#f8f9fb',
    3: '#F3F4F7',
    4: '#e6e8eb',
    5: '#dfe1e4',
    6: '#d8d9dc',
    7: '#cdced1',
    8: '#babbbe',
    9: '#8c8d90',
    10: '#818385',
    11: '#636467',
    12: '#1f2022',
    /** Gray 透明度色板 */
    a1: '#00005503',
    a2: '#00256e07',
    a3: '#001e4b11',
    a4: '#00153319',
    a5: '#00102820',
    a6: '#00071b27',
    a7: '#00061532',
    a8: '#00040f45',
    a9: '#00030973',
    a10: '#0005097e',
    a11: '#0002079c',
    a12: '#000103e0',
  },
  /** Blue 色板 */
  blue: {
    1: '#fbfdff',
    2: '#f4f9ff',
    3: '#e9f3ff',
    4: '#d9ecff',
    5: '#c7e2ff',
    6: '#b2d5ff',
    7: '#97c3ff',
    8: '#6fabfc',
    9: '#1a85ff',
    10: '#0077f4',
    11: '#006ee6',
    12: '#033268',
    /** Blue 透明度色板 */
    a1: '#0080ff04',
    a2: '#0074ff0b',
    a3: '#0074ff16',
    a4: '#0080ff26',
    a5: '#007bff38',
    a6: '#0074ff4d',
    a7: '#006cff68',
    a8: '#006bfa90',
    a9: '#0077ffe5',
    a10: '#0077f4',
    a11: '#006ee6',
    a12: '#003066fc',
  },
} as const;

/**
 * 品牌渐变定义
 * 包含主要品牌渐变、AI内容渐变、AI文字渐变等
 */
export const brandGradients = {
  /** 品牌主渐变 */
  gradient:
    'linear-gradient(135deg, var(--color-blue-9) 0%, var(--color-primary-9) 100%)',
  /** AI内容渐变 */
  gradientFill:
    'linear-gradient(46deg, var(--color-purple-9) 13%, var(--color-blue-9) 56%, var(--color-lightBlue-9) 96%)',
  /** AI文字渐变 */
  gradientText:
    'linear-gradient(90deg, var(--color-purple-9) 4%, var(--color-lightBlue-9) 100%)',
} as const;
