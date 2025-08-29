import { Keyframes } from '@ant-design/cssinjs';
import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

// 定义关键帧动画
const typing = new Keyframes('typing', {
  from: { width: 0 },
  to: { width: '100%' },
});

const blinkCaret = new Keyframes('blink-caret', {
  from: { borderColor: 'transparent' },
  to: { borderColor: 'transparent' },
  '50%': { borderColor: '#1677ff' },
});

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    // 拖拽手柄样式
    '.ant-md-editor-drag-handle': {
      position: 'absolute',
      display: 'flex',
      userSelect: 'none',
      alignItems: 'center',
      padding: '2px',
      borderRadius: '2px',
      opacity: 0,
      left: '-28px',
      boxSizing: 'border-box',
      top: 'calc(3px + 0.75em - 14px)',
    },

    // CSS变量定义
    ':root': {
      '--markdown-input-field-tag-color': 'rgb(22, 119, 255)',
      '--markdown-input-field-tag-placeholder-color': 'rgb(22, 119, 255)',
      '--markdown-input-field-tag-border-color': 'rgb(145, 202, 255)',
      '--markdown-input-field-tag-hint-opacity': '0.5',
    },

    // 拖拽图标样式
    '.ant-md-editor-drag-icon': {
      display: 'flex',
      alignItems: 'center',
      borderRadius: '18px',
      cursor: 'pointer',
      padding: '4px',
      fontSize: '16px',
      color: 'rgb(38, 38, 38)',

      '&:hover': {
        backgroundColor: 'rgb(244, 245, 245)',
      },
    },

    // 拖拽元素悬浮效果
    '.ant-md-editor-drag-el:hover > .ant-md-editor-drag-handle': {
      opacity: 1,
    },

    // 可调整大小组件样式
    '.react-resizable': {
      position: 'relative',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      border: '1px solid #eee',
    },

    '.react-resizable-handle-hide': {
      display: 'none',
    },

    '.react-resizable-selected img': {
      transform: 'scale(1.02)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      borderRadius: '4px',
      outline: '2px solid #1890ff',
      outlineOffset: '2px',
    },

    '.react-resizable-handle': {
      position: 'absolute',
      padding: '0 3px 3px 0',
      backgroundRepeat: 'no-repeat',
      backgroundOrigin: 'content-box',
      boxSizing: 'border-box',
      cursor: 'se-resize',
      zIndex: 9999,
      width: '14px',
      height: '14px',
      border: '2px solid #fff',
      backgroundColor: '#2f8ef4',
      borderRadius: '10px',
      bottom: '-7px',
      right: '-7px',
      pointerEvents: 'all',
    },

    // 溢出阴影容器样式
    '.markdown-editor .overflow-shadow-container::before, .markdown-editor .overflow-shadow-container::after': {
      content: "''",
      position: 'absolute',
      top: '13px',
      bottom: '8px',
      width: '10px',
      opacity: 0,
      transition: 'opacity 0.1s',
      zIndex: 100,
      pointerEvents: 'none',
      userSelect: 'none',
      height: 'calc(100% - 32px)',
    },

    '.markdown-editor .overflow-shadow-container::after': {
      right: '-4px',
      background: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1))',
    },

    '.markdown-editor .overflow-shadow-container.is-overflowing:not(.is-scrolled-right)::after': {
      opacity: 1,
    },

    '.markdown-editor .overflow-shadow-container.is-overflowing:not(.is-scrolled-left)::before': {
      opacity: 1,
    },

    '.markdown-editor .overflow-shadow-container::before': {
      left: '3px',
      background: 'linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1))',
    },

    // 移动标记样式
    '.move-mark': {
      height: '0.125em',
      backgroundColor: '#1890ff',
      left: 0,
      zIndex: 1000,
      display: 'block',
      position: 'absolute',
      borderRadius: '0.25em',
      top: 0,
      transitionDuration: '200ms',
    },

    // 隐藏样式
    '.ant-md-editor-hidden': {
      display: 'none',
    },

    // Ace编辑器容器样式
    '.ace-container': {
      position: 'relative',
      borderRadius: '0.25em',
      border: '1px solid #0000001a',
      marginBottom: '0.5em',
      fontSize: '14px',
      minWidth: 'min(320px, 100%)',
      marginTop: '8px',
    },

    '.ace-container.frontmatter:before': {
      top: '3px',
      content: "'Front Matter'",
      width: '100%',
      height: '22px',
      lineHeight: '21px',
      position: 'absolute',
      zIndex: 10,
      left: 0,
      paddingLeft: '10px',
      fontSize: '12px',
      color: '#0009',
    },

    '.ace-container.frontmatter:is(.dark *):before': {
      color: '#fff9',
    },

    '.ace_hidden-cursors': {
      display: 'none !important',
    },

    // 匹配文本样式
    '.match-text, .match-current': {
      position: 'absolute',
      width: 'auto',
    },

    '.match-text': {
      borderRadius: '0.125em',
      backgroundColor: '#00000026',
    },

    '.match-text:is(.dark *)': {
      backgroundColor: '#ffffff26',
    },

    '.match-current': {
      borderRadius: '0.125em',
      '--tw-bg-opacity': 1,
      backgroundColor: 'rgb(14 165 233 / 0.2)',
    },

    // KaTeX容器样式
    '.katex-container': {
      '.newline': {
        margin: '4px 0',
      },
    },

    // 内联代码输入样式
    '.inline-code-input': {
      lineHeight: '1.3em',
      borderRadius: '0.125em',
      color: 'rgb(13 148 136 / 1)',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji"',

      '&:before, &:after': {
        content: "'$'",
        fontSize: '1em',
        color: 'rgb(107 114 128 / 1)',
      },

      '&:before': {
        marginRight: '2px',
      },

      '&:after': {
        marginLeft: '2px',
      },
    },

    // 组合模式样式
    'div.composition .ant-md-editor-content-edit > div.empty:first-child::before': {
      display: 'none',
    },

    // 标签弹窗输入样式
    '.tag-popup-input-warp': {
      position: 'relative',
      margin: '0 4px',
      cursor: 'pointer',
      padding: '0px 4px',
      borderRadius: '4px',
      fontSize: '0.9em',
      display: 'inline-flex',
      lineHeight: '1.5',
      color: 'var(--markdown-input-field-tag-color)',
      border: '1px solid var(--markdown-input-field-tag-border-color)',
    },

    '.tag-popup-input:not(.tag-popup-input-composition).empty::before': {
      color: 'var(--markdown-input-field-tag-placeholder-color)',
      content: 'attr(title)',
      opacity: '0.5',
      userSelect: 'none',
      position: 'absolute',
      left: '4px',
      top: 0,
    },

    '.tag-popup-input:hover::before': {
      opacity: '0.6',
    },

    '.tag-popup-input.empty::after': {
      content: 'attr(title)',
      opacity: 0,
      height: '0.5px',
      overflow: 'hidden',
      userSelect: 'none',
    },

    // Handsontable样式
    '.handsontable thead tr th .relative .colHeader': {
      whiteSpace: 'pre',
    },

    '.ht_clone_top th': {
      whiteSpace: 'normal',
      height: 'auto !important',
    },

    '.handsontable.ht-wrapper .ht_master .htCore thead tr:last-child th:first-child': {
      height: 'auto !important',
    },

    // 打字机效果样式
    '.ant-md-editor-content .typewriter:last-of-type > *:last-of-type span[data-slate-leaf]:last-of-type span[data-slate-string]': {
      borderRight: '0.15em solid #1677ff',
      animation: `${typing.getName()} 3.5s steps(30, end), ${blinkCaret.getName()} 0.5s step-end infinite`,
    },

    // 全局样式
    '*': {
      scrollbarWidth: 'thin',
      scrollbarColor: 'hsl(240 5.9% 90%) transparent',
      boxSizing: 'border-box',
    },
  };
};

/**
 * MarkdownEditor 样式 Hook
 * @param prefixCls 样式前缀
 * @returns 样式对象
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('MarkdownEditor', (token: ChatTokenType) => {
    const componentToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genStyle(componentToken)];
  });
}
