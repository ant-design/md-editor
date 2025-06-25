import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [`${token.componentCls}`]: {
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      overflow: 'auto',
      gap: '8px',
      borderRadius: 'inherit',
      padding: 8,
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&::-webkit-scrollbar': {
        width: 6,
      },
      '&-collapse-button': {
        width: '68px',
        height: '32px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '4px 8px',
        cursor: 'pointer',
        gap: 4,
        float: 'right',
        borderRadius: '18px',
        opacity: 1,
        boxSizing: 'border-box',
        color: '#666F8D',
        fontSize: '14px',
        border: '1px solid #E6ECF4',

        '&:hover': {
          background: '#F7F8FA',
          transform: 'scale(1.05)',
        },
        '&-icon': {
          transform: 'rotate(-90deg)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          color: '#666F8D',
          '&-collapse': {
            transform: 'rotate(90deg)',
          },
        },
      },
      [`${token.antCls}-image-mask`]: {
        borderRadius: '16px',
      },
      img: {
        objectFit: 'cover',
      },
      '&-image': {
        borderRadius: '18px',
        opacity: 1,
        background: '#FFFFFF',
        boxSizing: 'border-box',
        border: '1px solid #E6ECF4',
        padding: 6,
      },
      '&-item': {
        width: '178px',
        height: '56px',
        borderRadius: '12px',
        opacity: 1,
        background: '#FFFFFF',
        boxSizing: 'border-box',
        border: '1px solid #E6ECF4',
        padding: '8px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'pointer',
        gap: '8px',
        position: 'relative',
        '&:hover': {
          boxShadow:
            '0px 2px 9px 0px rgba(202, 218, 255, 0.3671),0px 1px 7px 0px rgba(51, 0, 123, 0.07),0px 0px 1px 0px rgba(74, 0, 255, 0.0806),inset 0px 1px 4px 0px rgba(225, 235, 240, 0.5),inset 0px 1px 1px 0px rgba(204, 214, 220, 0.05)',
        },
        '&-file-icon': {
          width: '40px',
          height: '40px',
          opacity: 1,
          background: '#F7F8FA',
          border: '0.5px solid #E6ECF4',
          borderRadius: '6px',
          overflow: 'hidden',
        },
        '&-file-info': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 2,
        },
        '&-file-name': {
          display: 'flex',
          width: '112px',
          alignItems: 'center',
          lineHeight: '18px',
          fontFamily: token.fontFamily,
          gap: -1,
          '&-text': {
            maxWidth: '92px',
            whiteSpace: 'nowrap',
            width: 'max-content',
            overflow: 'hidden',
            display: 'flex',
            textOverflow: 'ellipsis',
            height: 18,
            lineHeight: 1,
          },
          '&-extension': {
            height: 18,
            whiteSpace: 'nowrap',
            display: 'flex',
            lineHeight: 1,
          },
        },
        '&-file-size': {
          color: '#B0B7C3',
          fontSize: '12px',
        },
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
  return useEditorStyleRegister('md-md-editor-file-view', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(proChatToken), resetComponent(proChatToken)];
  });
}
