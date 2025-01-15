import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../editor/utils/useStyle';
import './keyframes.css';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      boxSizing: 'border-box',
      caretColor: '#1677ff',
      outline: 'none !important',
      minWidth: '0px',
      width: '100%',
      margin: '0 auto',
      '::-webkit-scrollbar': { width: '8px', height: '8px' },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: '#a1a1aa',
        borderRadius: '20px',
      },
      '[data-empty]:before': {
        display: 'none',
      },
      '&-edit': {
        '>*': {
          maxWidth: 850,
        },
        '> p.empty:nth-child(0)::before': {
          cursor: 'text',
          content: '\'Please enter content, press "/" for quick actions\'',
          display: 'block',
          position: 'absolute',
        },
      },

      '> *:first-child': {
        marginTop: 0,
      },
      '> *:last-child': {
        marginBottom: 0,
      },
      '.link': { textDecoration: 'underline' },
      '.attach': {
        padding: '3px 0',
      },
      '.attach:not(:last-child)': {
        marginBottom: '0.3em',
      },
      '.attach .file': {
        borderRadius: '18px',
        borderWidth: '1px',
        borderColor: 'rgb(229 231 235 / 1)',
        backgroundColor: 'rgb(249 250 251 / 1)',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        paddingLeft: '0.75rem',
        paddingRight: '0.75rem',
        transitionDuration: '100ms',
      },
      '.attach .file.active': {
        borderColor: 'rgb(0 0 0 / 0.5)',
      },

      "[data-fnc='fnc']": {
        background: '#D6EEFF',
        border: '0.4px solid #E6ECF4',
        fontSize: '12px',
        fontWeight: 600,
        height: '14px',
        minWidth: '14px',
        margin: '0 2px',
        lineHeight: '14px',
        top: '-0.5em',
        textAlign: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s',
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        width: 'max-content',
        padding: 2,
        borderRadius: 12,
        '&:hover': {
          background: '#19213D',
          border: '0.4px solid #E6ECF4',
          color: '#FFFFFF',
        },
      },
      "[data-fnd='fnd']": {
        paddingLeft: '0.125rem',
        paddingRight: '0.125rem',
        color: 'rgb(101 163 13 /1)',
        transitionDuration: '200ms',
        '&:hover': {
          color: 'rgb(101 163 13 /1)',
        },
      },

      '&:last-child': {
        marginBottom: 0,
      },
      table: {
        minWidth: '100%',
        position: 'relative',
        borderCollapse: 'collapse',
        whiteSpace: 'nowrap',
        borderSpacing: '0',
        display: 'block',
        width: 'max-content',
        maxWidth: '100%',
        overflow: 'auto',
        fontVariant: 'tabular-nums',
        th: {
          textWrap: 'nowrap',
          verticalAlign: 'top',
          padding: '12px 20px',
          textAlign: 'left',
          lineHeight: 1,
        },
        td: {
          textWrap: 'nowrap',
          verticalAlign: 'top',
          padding: '7px 20px',
          textAlign: 'left',
          lineHeight: 1,
        },
        'tr:first-child': {
          borderBottom: '1px solid #e8e8e8',
        },
      },
      'pre,code,kbd,samp': {
        marginTop: '0',
        marginBottom: '0',
        fontFamily:
          'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
        fontSize: '0.9rem',
        wordWrap: 'normal',
      },
      p: {
        position: 'relative',
        paddingTop: '.25rem',
        paddingBottom: '.25rem',
        fontSize: '1rem',
        lineHeight: '1.5rem',
        marginTop: '0',
        marginBottom: '0.8rem',
      },
      'h1,h2,h3,h4,h5,h6': {
        marginTop: '1.5rem',
        marginBottom: '1rem',
        fontWeight: 600,
        lineHeight: 1.25,
        '.ant-md-editor-drag-handle': {
          top: 'calc(3px + 0.05em) !important',
        },
      },
      h1: {
        fontWeight: 600,
        paddingBottom: '.3em',
        fontSize: '2em',
        borderBottom: '1px solid #d1d9e0b3',
      },
      h2: {
        fontWeight: 600,
        paddingBottom: '0.3em',
        fontSize: '1.5em',
      },
      h3: { fontWeight: 600, fontSize: '1.25em' },
      h4: { fontWeight: 600, fontSize: '1em' },
      h5: { fontWeight: 600, fontSize: '0.875em' },
      h6: { fontWeight: 600, fontSize: '0.85em', color: '#59636e' },

      a: {
        color: '#1677ff',
        backgroundColor: 'transparent',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
      'ul ul,ul ol,ol ol,ol ul': { marginTop: '0', marginBottom: '0' },
      'li > p': { marginTop: '1rem' },
      'li + li': { marginTop: '0.25em' },
      blockquote: {
        display: 'block',
        paddingLeft: '10px',
        margin: '10px 0',
        position: 'relative',
        color: '#262626',
        opacity: 0.7,
        fontSize: '13px',
        '&:before': {
          content: "''",
          left: '0',
          top: '5px',
          height: 'calc(100% - 10px)',
          width: '4px',
          position: 'absolute',
          display: 'block',
          borderRadius: '18px',
          backgroundColor: 'rgb(107 114 128 / 1)',
        },
      },
      '[data-be]:not(p)': {
        position: 'relative',
      },
      '[data-be="chart"]': {
        marginTop: '0.5em',
        marginBottom: '0.5em',
      },
      '[data-be="card"]': {
        marginTop: '0.5em',
        marginBottom: '0.5em',
      },
      '& &-inline-code': {
        display: 'inline',
        backgroundColor: '#0000000f',
        borderRadius: '4px',
        border: '1px solid #e7e9e8',
        padding: '0 4px',
        margin: '1px 3px',
        lineHeight: 1.1,
        wordBreak: 'break-all',
      },
      '& &-comment': {
        borderBottom: '2px solid rgba(250, 173, 20, 0.4)',
        cursor: 'pointer',
      },
      '& &-high-text': {
        borderRadius: '18px',
      },
      '& &-m-html': {
        color: 'rgba(0,0,0,0.45)',
      },
      '&:not(:last-child)': {
        marginBottom: '0.5em',
      },
      "h2 + [data-be='list'] ul": {
        marginTop: '0',
      },
      "h2 + [data-be='list'] ol": {
        marginTop: '0',
      },
      '& .typewriter:last-of-type > *:last-of-type span[data-slate-leaf]:last-of-type  span[data-slate-string]':
        {
          borderRight: '0.15em solid #1677ff',
          animation:
            'typing 3.5s steps(30, end), blink-caret 0.5s step-end infinite',
        },
    },
  };
};

const genSlideStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [`${token.componentCls}-report`]: {
      '>*': {
        maxWidth: '100%',
      },
      '[data-be="chart"]': {
        width: '100%',
      },
      '[data-be="code"]': {
        marginBottom: '12px',
      },
      [`${token.componentCls}-table`]: {
        'th,td': {
          padding: '8px 16px',
          textAlign: 'left',
          borderBottom: '1px solid rgb(209 213 219 / 0.8)',
          borderRight: '1px solid rgb(209 213 219 / 0.8)',
        },
        'th:last-child,td:last-child': {
          borderRight: 'none',
        },
        'th:last-child': {
          borderTopRightRadius: 16,
        },
        'th:first-child': {
          borderTopLeftRadius: 16,
        },
        'tr:last-child th,tr:last-child td': {
          borderBottom: 'none',
        },
        th: { fontWeight: 500, backgroundColor: 'rgb(229 231 235 / 0.5)' },
      },
      [`${token.componentCls}-description-table`]: {
        display: 'table',
        'th,td': {
          padding: '8px 16px',
          textAlign: 'left',
          borderBottom: '1px solid rgb(209 213 219 / 0.8)',
          borderRight: '1px solid rgb(209 213 219 / 0.8)',
        },
        'th:last-child,td:last-child': {
          borderRight: 'none',
        },
        'th:last-child': {
          borderTopRightRadius: 16,
        },
        'th:first-child': {
          borderTopLeftRadius: 16,
        },
        'tr:last-child th,tr:last-child td': {
          borderBottom: 'none',
        },
        th: {
          backgroundColor: 'rgb(229 231 235 / 0.5)',
        },
      },
    },
  };
};

/**
 * AgentChat
 * @param prefixCls
 * @returns
 */
export function useStyle(
  prefixCls: string,
  propsToken: Partial<ChatTokenType>,
) {
  return useEditorStyleRegister('editor-content', (token) => {
    const editorToken = {
      ...token,
      ...propsToken,
      componentCls: `.${prefixCls}`,
    };

    return [
      genStyle(editorToken),
      resetComponent(editorToken),
      genSlideStyle(editorToken),
    ];
  });
}
