import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [`${token.componentCls}`]: {
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'row',
      overflow: 'auto',
      background: '#FBFCFD',
      gap: '8px',
      height: 76,
      borderRadius: 'inherit',
      padding: 8,
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&::-webkit-scrollbar': {
        width: 6,
      },
      '&-close-icon': {
        width: '24px',
        height: '24px',
        background: '#353E5C',
        fontSize: 16,
        position: 'absolute',
        top: -4,
        borderRadius: '50%',
        right: 4,
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      },
      '&:hover': {
        backgroundColor: '#F7F8FA',
        [`${token.componentCls}-close-icon`]: {
          display: 'flex',
        },
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
          backgroundColor: '#F7F8FA;',
          [`${token.componentCls}-item-close-icon`]: {
            display: 'flex',
          },
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
        '&-close-icon': {
          width: '16px',
          height: '16px',
          backgroundColor: '#353E5C',
          fontSize: 12,
          position: 'absolute',
          top: -6,
          borderRadius: '50%',
          right: -6,
          color: '#FFFFFF',
          display: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        '&-uploading-icon': {
          width: '40px',
          height: '40px',
          fontSize: 24,
          display: 'flex',
          padding: '8px',
        },
      },
    },
  };
};

/**
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('lui-chat-attachment-file-list', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(proChatToken), resetComponent(proChatToken)];
  });
}
