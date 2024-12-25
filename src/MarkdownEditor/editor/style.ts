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
      '::-webkit-scrollbar': { width: '8px', height: '8px' },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: '#a1a1aa',
        borderRadius: '20px',
      },
      '[data-empty]:before': {
        display: 'none',
      },
      '&-edit': {
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
        width: 'fit-content',
        minWidth: '100%',
        position: 'relative',
        borderCollapse: 'collapse',
        whiteSpace: 'nowrap',
        borderSpacing: '0',
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
      pre: {
        margin: '0',
        overflowX: 'auto',
      },
      p: {
        marginBottom: '1em',
        lineHeight: 1.5,
        padding: '3px 0',
      },
      'h1,h2,h3,h4,h5,h6': {
        position: 'relative',
        lineHeight: 1.3,
        padding: '3px 0',
        marginBottom: '3px',
        '.ant-md-editor-drag-handle': {
          top: 'calc(3px + 0.65em - 14px) !important',
        },
      },
      h1: {
        fontSize: '1.875em',
        marginTop: '1.2em',
        fontWeight: 700,
        '&:first-child': {
          marginTop: 0,
        },
      },
      h2: {
        fontWeight: 600,
        fontSize: '1.5em',
        marginTop: '1em',
        marginBottom: '1em',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.4em',
        marginTop: '0.8em',
      },
      h4: {
        fontWeight: 500,
        fontSize: '1.3em',
        marginTop: '0.7em',
        lineHeight: 1.2,
      },
      a: {
        color: '#1677ff',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
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

      'pre,code,kbd,samp': {
        fontSize: '1em',
        fontFamily:
          "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier,monospace",
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
      'p:not(:last-child)': {
        marginBottom: '0.1em!important',
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
