import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../hooks/useStyle';
import './keyframes.css';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      boxSizing: 'border-box',
      caretColor: '#1677ff',
      color: 'inherit',
      outline: 'none !important',
      minWidth: '0px',
      width: '100%',
      margin: '0 auto',
      '::-webkit-scrollbar': { width: '8px', height: '8px' },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: '#a1a1aa',
        borderRadius: '20px',
      },
      '&-edit': {
        '> div.empty:first-child': {
          '[data-slate-zero-width="n"]': {
            display: 'inline-block',
            minWidth: 20,
          },
          '&::before': {
            cursor: 'text',
            content: 'attr(data-slate-placeholder)',
            color: 'rgba(0,0,0,0.45)',
            display: 'inline-block',
            position: 'absolute',
            width: 'max-content',
            maxWidth: '100%',
            fontSize: '1em',
            lineHeight: 1.7,
            wordBreak: 'break-word',
            whiteSpace: 'wrap',
          },
        },
        '> div.empty:first-child [data-slate-node="text"]': {
          display: 'inline-block',
          minWidth: 20,
        },
      },

      '&> *:first-child': {
        marginTop: 0,
      },
      '& > .link': { textDecoration: 'underline' },
      '& > .attach': {
        padding: '3px 0',
      },
      '& >.attach:not(:last-child)': {
        marginBottom: '0.3em',
      },
      '.attach .file': {
        borderRadius: '12px',
        borderWidth: '1px',
        borderColor: 'rgb(229 231 235 / 1)',
        backgroundColor: 'rgb(249 250 251 / 1)',
        paddingTop: '0.5em',
        paddingBottom: '0.5em',
        paddingLeft: '0.75em',
        paddingRight: '0.75em',
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
        position: 'relative',
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
        paddingLeft: '0.125em',
        paddingRight: '0.125em',
        color: 'rgb(101 163 13 /1)',
        transitionDuration: '200ms',
        '&:hover': {
          color: 'rgb(101 163 13 /1)',
        },
      },

      '&:last-child': {
        marginBottom: 0,
      },
      'pre,code,kbd,samp': {
        marginTop: '0',
        marginBottom: '0',
        fontFamily:
          'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
        fontSize: '0.9em',
        wordWrap: 'normal',
      },
      'div[data-be="paragraph"]': {
        position: 'relative',
        paddingTop: '.25em',
        display: 'block',
        paddingBottom: '.25em',
        fontSize: '1em',
        lineHeight: 1.7,
        marginTop: '0',
        marginBottom: '0.5em',
        '&:first-child': {
          marginTop: 0,
          paddingTop: 0,
        },
        '&:last-child': {
          marginBottom: 0,
          paddingBottom: 0,
        },
      },
      'h1,h2,h3,h4,h5,h6': {
        position: 'relative',
        textWrap: 'balance',
        marginTop: '1.5em',
        marginBottom: '1em',
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
      'ol,ul': {
        paddingLeft: '1.4em',
      },
      'ul ul,ul ol,ol ol,ol ul': {
        marginTop: '0',
        marginBottom: '0',
        position: 'relative',
      },
      'li > p': { marginTop: '1em' },
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
          borderRadius: '12px',
          backgroundColor: 'rgb(107 114 128 / 1)',
        },
      },
      '@media screen and (max-width: 600px)': {
        h1: {
          fontSize: '1.5em',
        },
        h2: {
          fontSize: '1.25em',
        },
        h3: {
          fontSize: '1.125em',
        },
        h4: {
          fontSize: '1em',
        },
        'h1,h2': {
          marginTop: '1em',
          marginBottom: '1em',
        },
        'h3,h4,h5,h6': {
          marginTop: '0.8em',
          marginBottom: '0.8em',
        },
        'ol,ul': {
          paddingLeft: '0.2em',
        },
      },
      '[data-be]:not(p):not(data-be="list")': {
        position: 'relative',
        '*': {
          outline: 'none',
          boxSizing: 'border-box',
        },
      },
      '[data-be="list"] > ul': {
        marginTop: '0.25em',
        marginBottom: '0.25em',
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
        borderRadius: '12px',
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
      '[data-align="left"]': {
        textAlign: 'left',
      },
      '[data-align="center"]': {
        textAlign: 'center',
      },
      '[data-align="right"]': {
        textAlign: 'right',
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
      [`${token.componentCls}-description-table`]: {
        display: 'table',
        'th,td': {
          padding: '8px 16px',
          textAlign: 'left',
          borderBottom: '1px solid rgb(209 213 219 / 0.8)',
          borderRight: '1px solid rgb(209 213 219 / 0.8)',
        },
        'th:last-child,td:last-child': {
          borderRight: '1px solid #e5e5e9',
        },
        'th:last-child': {
          borderTopRightRadius: 8,
        },
        'th:first-child': {
          borderTopLeftRadius: 8,
        },
        'tr:last-child th,tr:last-child td': {
          borderBottom: 'none',
        },
        th: {
          backgroundColor: 'rgb(229 231 235 / 0.5)',
        },
      },
    },
    [`${token.componentCls}-tag`]: {
      position: 'absolute',
      zIndex: 1000,
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
      resetComponent(editorToken),
      genStyle(editorToken),
      genSlideStyle(editorToken),
    ];
  });
}
