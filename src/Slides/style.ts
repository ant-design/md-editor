import { ChatTokenType, useEditorStyleRegister } from '../hooks/useStyle';

const genStyle = (token: ChatTokenType) => {
  return {
    [`${token.componentCls}`]: {
      // 深色背景样式
      'section.has-dark-background, section.has-dark-background h1, section.has-dark-background h2, section.has-dark-background h3, section.has-dark-background h4, section.has-dark-background h5, section.has-dark-background h6':
        {
          color: '#fff',
        },

      // CSS变量定义
      ':root': {
        '--r-background-color': '#fff',
        '--r-main-font': 'Source Sans Pro, Helvetica, sans-serif',
        '--r-main-font-size': '42px',
        '--r-main-color': '#222',
        '--r-block-margin': '20px',
        '--r-heading-margin': '0 0 20px 0',
        '--r-heading-font': 'Source Sans Pro, Helvetica, sans-serif',
        '--r-heading-color': '#222',
        '--r-heading-line-height': '1.2',
        '--r-heading-letter-spacing': 'normal',
        '--r-heading-text-transform': 'uppercase',
        '--r-heading-text-shadow': 'none',
        '--r-heading-font-weight': '600',
        '--r-heading1-text-shadow': 'none',
        '--r-heading1-size': '2.5em',
        '--r-heading2-size': '1.6em',
        '--r-heading3-size': '1.3em',
        '--r-heading4-size': '1em',
        '--r-code-font': 'monospace',
        '--r-link-color': '#2a76dd',
        '--r-link-color-dark': '#1a53a1',
        '--r-link-color-hover': '#6ca0e8',
        '--r-selection-background-color': '#98bdef',
        '--r-selection-color': '#fff',
        '--r-overlay-element-bg-color': '0, 0, 0',
        '--r-overlay-element-fg-color': '240, 240, 240',
      },

      // Reveal视口样式
      '&.reveal-viewport': {
        background: '#fff',
        backgroundColor: 'var(--r-background-color)',
      },

      // Reveal主容器样式
      '&.reveal': {
        fontFamily: 'var(--r-main-font)',
        fontSize: 'var(--r-main-font-size)',
        fontWeight: 'normal',
        color: 'var(--r-main-color)',
      },

      // 选择样式
      '&.reveal ::selection': {
        color: 'var(--r-selection-color)',
        background: 'var(--r-selection-background-color)',
        textShadow: 'none',
      },

      '&.reveal ::-moz-selection': {
        color: 'var(--r-selection-color)',
        background: 'var(--r-selection-background-color)',
        textShadow: 'none',
      },

      // 幻灯片样式
      '&.reveal .slides section, &.reveal .slides section > section': {
        lineHeight: '1.3',
        fontWeight: 'inherit',
      },

      // 标题样式
      '&.reveal h1, &.reveal h2, &.reveal h3, &.reveal h4, &.reveal h5, &.reveal h6':
        {
          margin: 'var(--r-heading-margin)',
          color: 'var(--r-heading-color)',
          fontFamily: 'var(--r-heading-font)',
          fontWeight: 'var(--r-heading-font-weight)',
          lineHeight: 'var(--r-heading-line-height)',
          letterSpacing: 'var(--r-heading-letter-spacing)',
          textTransform: 'var(--r-heading-text-transform)',
          textShadow: 'var(--r-heading-text-shadow)',
          wordWrap: 'break-word',
        },

      '&.reveal h1': {
        fontSize: 'var(--r-heading1-size)',
        textShadow: 'var(--r-heading1-text-shadow)',
      },

      '&.reveal h2': {
        fontSize: 'var(--r-heading2-size)',
      },

      '&.reveal h3': {
        fontSize: 'var(--r-heading3-size)',
      },

      '&.reveal h4': {
        fontSize: 'var(--r-heading4-size)',
      },

      // Slate节点样式
      '&.reveal [data-slate-node="element"]:not(th):not(td)': {
        width: '100%',
      },

      '&.reveal [data-be="card-before"]': {
        display: 'none',
      },

      '&.reveal [data-be="card-after"]': {
        display: 'none',
      },

      // 段落样式
      '&.reveal p': {
        margin: 'var(--r-block-margin) 0',
        lineHeight: '1.3',
      },

      // 标题末尾边距
      '&.reveal h1:last-child, &.reveal h2:last-child, &.reveal h3:last-child, &.reveal h4:last-child, &.reveal h5:last-child, &.reveal h6:last-child':
        {
          marginBottom: 0,
        },

      // 媒体元素样式
      '&.reveal img, &.reveal video, &.reveal iframe': {
        maxWidth: '95%',
        maxHeight: '95%',
      },

      // 文本样式
      '&.reveal strong, &.reveal b': {
        fontWeight: 'bold',
      },

      '&.reveal em': {
        fontStyle: 'italic',
      },

      // 列表样式
      '&.reveal ol, &.reveal dl, &.reveal ul': {
        display: 'inline-block',
        textAlign: 'left',
        margin: '0 0 0 1em',
      },

      '&.reveal ol': {
        listStyleType: 'decimal',
      },

      '&.reveal ul': {
        listStyleType: 'disc',
      },

      '&.reveal ul ul': {
        listStyleType: 'square',
      },

      '&.reveal ul ul ul': {
        listStyleType: 'circle',
      },

      '&.reveal ul ul, &.reveal ul ol, &.reveal ol ol, &.reveal ol ul': {
        display: 'block',
        marginLeft: '40px',
      },

      // 定义列表样式
      '&.reveal dt': {
        fontWeight: 'bold',
      },

      '&.reveal dd': {
        marginLeft: '40px',
      },

      // 引用样式
      '&.reveal blockquote': {
        display: 'block',
        position: 'relative',
        width: '70%',
        margin: 'var(--r-block-margin) auto',
        padding: '5px',
        fontStyle: 'italic',
        background: 'rgba(255, 255, 255, 0.05)',
        boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.2)',
      },

      '&.reveal blockquote p:first-child, &.reveal blockquote p:last-child': {
        display: 'inline-block',
      },

      '&.reveal q': {
        fontStyle: 'italic',
      },

      // 代码样式
      '&.reveal pre': {
        display: 'block',
        position: 'relative',
        width: '90%',
        margin: 'var(--r-block-margin) auto',
        textAlign: 'left',
        fontSize: '0.55em',
        fontFamily: 'var(--r-code-font)',
        lineHeight: '1.2em',
        wordWrap: 'break-word',
        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)',
      },

      '&.reveal code': {
        fontFamily: 'var(--r-code-font)',
        textTransform: 'none',
        tabSize: 2,
      },

      '&.reveal pre code': {
        display: 'block',
        padding: '5px',
        overflow: 'auto',
        maxHeight: '400px',
        wordWrap: 'normal',
      },

      '&.reveal .code-wrapper': {
        whiteSpace: 'normal',
      },

      '&.reveal .code-wrapper code': {
        whiteSpace: 'pre',
      },

      // 上标下标样式
      '&.reveal sup': {
        verticalAlign: 'super',
        fontSize: 'smaller',
      },

      '&.reveal sub': {
        verticalAlign: 'sub',
        fontSize: 'smaller',
      },

      // 小字体样式
      '&.reveal small': {
        display: 'inline-block',
        fontSize: '0.6em',
        lineHeight: '1.2em',
        verticalAlign: 'top',
      },

      '&.reveal small *': {
        verticalAlign: 'top',
      },

      // 图片样式
      '&.reveal img': {
        margin: 'var(--r-block-margin) 0',
      },

      // 链接样式
      '&.reveal a': {
        color: 'var(--r-link-color)',
        textDecoration: 'none',
        transition: 'color 0.15s ease',
      },

      '&.reveal a:hover': {
        color: 'var(--r-link-color-hover)',
        textShadow: 'none',
        border: 'none',
      },

      '&.reveal .roll span:after': {
        color: '#fff',
        background: 'var(--r-link-color-dark)',
      },

      // 框架样式
      '&.reveal .r-frame': {
        border: '4px solid var(--r-main-color)',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)',
      },

      '&.reveal a .r-frame': {
        transition: 'all 0.15s linear',
      },

      '&.reveal a:hover .r-frame': {
        borderColor: 'var(--r-link-color)',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.55)',
      },

      // 导航控制样式
      '&.reveal .controls': {
        color: 'var(--r-link-color)',
      },

      // 进度条样式
      '&.reveal .progress': {
        background: 'rgba(0, 0, 0, 0.2)',
        color: 'var(--r-link-color)',
      },

      // 打印样式
      '@media print': {
        '.backgrounds': {
          backgroundColor: 'var(--r-background-color)',
        },
      },
    },
  };
};

/**
 * Slides 样式 Hook
 * @param prefixCls 样式前缀
 * @returns 样式对象
 */
export function useSlidesStyle(prefixCls?: string) {
  return useEditorStyleRegister('Slides', (token: ChatTokenType) => {
    const slidesToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return genStyle(slidesToken) as any;
  });
}
