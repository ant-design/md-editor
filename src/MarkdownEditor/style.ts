import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      boxSizing: 'border-box',
      height: 'max-content',
      maxWidth: '100%',
      outline: 'none',
      tabSize: 4,
      position: 'relative',
      lineHeight: 1.7,
      whiteSpace: 'normal',
      '> *': {
        boxSizing: 'border-box',
        scrollbarWidth: 'thin',
        fontVariantNumeric: 'tabular-nums',
        WebkitTextSizeAdjust: '100%',
        msTextSizeAdjust: '100%',
        WebkitFontSmoothing: 'antialiased',
        scrollbarColor: 'hsl(#e4e4e7) transparent',
      },
      '&-edit-area': {
        outline: 'none !important',
      },

      // drag handle
      '&-drag-handle': {
        position: 'absolute',
        display: 'flex',
        userSelect: 'none',
        alignItems: 'center',
        padding: 2,
        borderRadius: 2,
        opacity: 0,
        left: -28,
        boxSizing: 'border-box',
        top: 'calc(3px + 0.75em - 14px)',
      },
      '&-drag-icon': {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 18,
        cursor: 'pointer',
        padding: 4,
        fontSize: 16,
        color: 'rgb(38, 38, 38)',
        '&:hover': {
          backgroundColor: 'rgb(244, 245, 245)',
        },
      },
      '&-drag-el:hover > &-drag-handle': {
        opacity: 1,
      },

      // resizable
      '.react-resizable': {
        position: 'relative',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
        border: `1px solid ${token.colorBorder}`,
      },
      '.react-resizable-handle-hide': {
        display: 'none',
      },
      '.react-resizable-selected img': {
        transform: 'scale(1.02)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        borderRadius: 4,
        outline: `2px solid ${token.colorPrimary}`,
        outlineOffset: 2,
      },
      '.react-resizable-handle': {
        position: 'absolute',
        padding: '0 3px 3px 0',
        backgroundRepeat: 'no-repeat',
        backgroundOrigin: 'content-box',
        boxSizing: 'border-box',
        cursor: 'se-resize',
        zIndex: 9999,
        width: 14,
        height: 14,
        border: '2px solid #fff',
        backgroundColor: '#2f8ef4',
        borderRadius: 10,
        bottom: -7,
        right: -7,
        pointerEvents: 'all',
      },

      // overflow shadow
      '.overflow-shadow-container::before, .overflow-shadow-container::after': {
        content: "''",
        position: 'absolute',
        top: 13,
        bottom: 8,
        width: 10,
        opacity: 0,
        transition: 'opacity 0.1s',
        zIndex: 100,
        pointerEvents: 'none',
        userSelect: 'none',
        height: 'calc(100% - 32px)',
      },
      '.overflow-shadow-container::after': {
        right: -4,
        background:
          'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1))',
      },
      '.overflow-shadow-container.is-overflowing:not(.is-scrolled-right)::after': {
        opacity: 1,
      },
      '.overflow-shadow-container.is-overflowing:not(.is-scrolled-left)::before': {
        opacity: 1,
      },
      '.overflow-shadow-container::before': {
        left: 3,
        background:
          'linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1))',
      },

      // move mark
      '.move-mark': {
        height: '0.125em',
        backgroundColor: token.colorPrimary,
        left: 0,
        zIndex: 1000,
        display: 'block',
        position: 'absolute',
        borderRadius: '0.25em',
        top: 0,
        transitionDuration: '200ms',
      },

      // hidden util
      '&-hidden': {
        display: 'none',
      },

      // ace container
      '.ace-container': {
        position: 'relative',
        borderRadius: '0.25em',
        border: `1px solid ${token.colorBorderSecondary || '#0000001a'}`,
        marginBottom: '0.5em',
        fontSize: 13,
        minWidth: 'min(320px, 100%)',
        marginTop: 8,
        '&.frontmatter::before': {
          top: 3,
          content: '"Front Matter"',
          width: '100%',
          height: 22,
          lineHeight: '21px',
          position: 'absolute',
          zIndex: 10,
          left: 0,
          paddingLeft: 10,
          fontSize: 12,
          color: '#0009',
        },
        '&.frontmatter:is(.dark *)::before': {
          color: '#fff9',
        },
      },

      '.ace_gutter': {
        background: 'var(--color-gray-bg-card-white)!important',
      },

      '.ace_gutter-cell': {
        font: 'var(--font-text-code-base)',
        letterSpacing: 'var(--letter-spacing-code-base, normal)',
        color: 'var(--color-gray-text-light)',
      },

      '.ace-tm .ace_gutter': {
        color: 'rgba(80, 92, 113, 0.42)',
      },
      
      '.ace_hidden-cursors': {
        display: 'none !important',
      },

      '.ace_line_group': {
        font: 'var(--font-text-code-base)',
        letterSpacing: 'var(--letter-spacing-code-base, normal)',
        fontFamily: 'Roboto Mono',
        fontSize: '12px',
        fontWeight: 'normal',
      },
      
      // match highlight
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
        backgroundColor: 'rgb(14 165 233 / 0.2)',
      },

      // katex
      '.katex-container': {
        '.newline': {
          margin: '4px 0',
        },
      },

      // inline code input
      '.inline-code-input': {
        lineHeight: '1.3em',
        borderRadius: '0.125em',
        color: 'rgb(13 148 136 / 1)',
        fontFamily:
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', Segoe UI Symbol, 'Noto Color Emoji'",
        '&::before, &::after': {
          content: "'$'",
          fontSize: '1em',
          color: 'rgb(107 114 128 / 1)',
        },
        '&::before': {
          marginRight: 2,
        },
        '&::after': {
          marginLeft: 2,
        },
      },

      // composition placeholder fix
      'div.composition &-content-edit > div.empty:first-child::before': {
        display: 'none',
      },

      // handsontable tweaks
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

      // typewriter caret
      '&-content .typewriter > *:last-of-type span[data-slate-leaf]:last-of-type span[data-slate-string]': {
        borderRight: `0.15em solid ${token.colorPrimary}`,
        animation: 'typing 3.5s steps(30, end), blink-caret 0.5s step-end infinite',
      },

      // scoped scrollbars
      '*': {
        scrollbarWidth: 'thin',
        scrollbarColor: 'hsl(240 5.9% 90%) transparent',
        boxSizing: 'border-box',
      },
    },
  };
};

/**
 * BubbleChat
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('MarkdownEditor', (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(editorToken), genStyle(editorToken)];
  });
}
