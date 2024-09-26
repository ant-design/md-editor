import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../utils/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      listStyle: 'disc',
      paddingLeft: '24px',
      paddingTop: '3px',
      paddingBottom: '3px',
      marginBottom: '0',
      'li::marker': {
        color: 'rgb(107 114 128 /1)',
      },
      p: {
        marginBottom: '0 !important',
        marginTop: '0 !important',
      },
      [`li:not(${token.componentCls}-task) > :first-child .ant-md-editor-drag-handle`]:
        {
          paddingLeft: '2px',
          paddingRight: '18px',
          left: '-44px !important',
        },
      [`li${token.componentCls}-task > :nth-child(2) .ant-md-editor-drag-handle`]:
        {
          paddingLeft: '2px',
          paddingRight: '10px',
          left: '-50px !important',
        },
      '&-check-item': {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        userSelect: 'none',
        height: '1.87em',
        left: '0',
        top: '0',
        zIndex: 10,
      },
      '&-item': {
        position: 'relative',
        wordBreak: 'break-all',
        "> [data-be='list']": {
          marginBottom: '0',
        },
        [`&${token.componentCls}-task`]: {
          paddingLeft: '24px',
        },
      },

      '&.ol': {
        [`&${token.componentCls}`]: {
          listStyle: 'decimal',
          [`& ol${token.componentCls}`]: {
            listStyle: 'lower-alpha',
            [`& ol${token.componentCls}`]: {
              listStyle: 'lower-roman',
              [`& ol${token.componentCls}`]: {
                listStyle: 'decimal',
              },
            },
          },
        },
      },
      '&.ul': {
        [`&${token.componentCls}`]: {
          listStyle: 'disc',
          [`& ul${token.componentCls}`]: {
            listStyle: 'circle',
            [`& ul${token.componentCls}`]: {
              listStyle: 'square',
              [`& ul${token.componentCls}`]: {
                listStyle: 'disc',
              },
            },
          },
        },
      },
      "[data-be='list']": {
        marginBottom: '0.3em',
        paddingTop: '5px',
        paddingBottom: '5px',
      },
      '&[data-task]': {
        listStyle: 'none !important',
        paddingLeft: '0',
      },
    },
  };
};

/**
 * AgentChat
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('editor-content-list', (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(editorToken)];
  });
}
