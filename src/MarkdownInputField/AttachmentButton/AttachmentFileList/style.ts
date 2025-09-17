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
      background: 'var(--color-gray-bg-page-light)',
      gap: 'var(--margin-2x)',
      height: '127px',
      borderRadius: 'inherit',
      padding: 'var(--padding-3x)',
      flexWrap: 'wrap',
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&::-webkit-scrollbar': {
        width: 'var(--padding-1-5x)',
      },
      '&-close-icon': {
        width: 'var(--height-control-xs)',
        height: 'var(--height-control-xs)',
        background: 'var(--color-red-control-fill-primary)',
        fontSize: 'var(--font-size-lg)',
        position: 'absolute',
        top: 'var(--margin-3x)',
        borderRadius: '50%',
        right: 'var(--margin-3x)',
        color: 'var(--color-gray-contrast)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      },
      '&:hover': {
        backgroundColor: 'var(--color-gray-bg-card-light)',
        [`${token.componentCls}-close-icon`]: {
          display: 'flex',
        },
      },
      '&-item': {
        width: '168px',
        height: 'var(--height-control-lg)',
        opacity: 1,
        borderRadius: 'var(--radius-card-base)',
        background: 'var(--color-gray-bg-card-white)',
        boxShadow:
          '0px 0px 1px 0px rgba(0, 19, 41, 0.2),0px 1.5px 4px -1px rgba(0, 19, 41, 0.04)',
        boxSizing: 'border-box',
        border: '1px solid var(--color-gray-border-light)',
        padding: 'var(--padding-2x)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'pointer',
        gap: 'var(--margin-2x)',
        position: 'relative',
        '&:hover': {
          backgroundColor: 'var(--color-gray-bg-card-light)',
          [`${token.componentCls}-item-close-icon`]: {
            display: 'flex',
          },
        },
        '&-file-icon': {
          width: '40px',
          height: '40px',
          opacity: 1,
          background: 'var(--color-gray-bg-card-light)',
          border: '0.5px solid var(--color-gray-border-light)',
          borderRadius: 'var(--radius-control-sm)',
          overflow: 'hidden',
        },
        '&-file-info': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 'var(--margin-0-5x)',
        },
        '&-file-name': {
          display: 'flex',
          width: '112px',
          alignItems: 'center',
          lineHeight: 'var(--line-height-xs)',
          fontFamily: token.fontFamily,
          gap: -1,
          '&-text': {
            maxWidth: '92px',
            whiteSpace: 'nowrap',
            width: 'max-content',
            overflow: 'hidden',
            display: 'flex',
            color: 'var(--color-gray-text-default)',
            textOverflow: 'ellipsis',
            height: 'var(--line-height-xs)',
            lineHeight: 1,
          },
          '&-extension': {
            height: 'var(--line-height-xs)',
            whiteSpace: 'nowrap',
            display: 'flex',
            color: 'var(--color-gray-text-default)',
            lineHeight: 1,
          },
        },
        '&-file-size': {
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-gray-text-tertiary)',
        },
        '&-close-icon': {
          width: 'var(--padding-4x)',
          height: 'var(--padding-4x)',
          backgroundColor: 'var(--color-gray-text-default)',
          fontSize: 'var(--font-size-sm)',
          position: 'absolute',
          top: 'var(--margin-1-5x)',
          borderRadius: '50%',
          right: 'var(--margin-1-5x)',
          color: 'var(--color-gray-contrast)',
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
          fontSize: 'var(--font-size-2xl)',
          display: 'flex',
          padding: 'var(--padding-2x)',
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
  return useEditorStyleRegister('md-editor-attachment-file-list', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [resetComponent(proChatToken), genStyle(proChatToken)];
  });
}
