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
      flexDirection: 'column',
      flexWrap: 'nowrap',
      overflow: 'auto',
      gap: '8px',
      borderRadius: 'inherit',
      padding: 8,
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&-left': {
        flexDirection: 'row',
      },
      '&-right': {
        flexDirection: 'row-reverse',
      },
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
        color: 'var(--color-gray-a9)',
        fontSize: 'var(--font-size-base)',
        border: '1px solid #E6ECF4',

        '&:hover': {
          background: '#F7F8FA',
          transform: 'scale(1.05)',
        },
        '&-icon': {
          transform: 'rotate(-90deg)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          color: 'var(--color-gray-a9)',
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
        background: 'var(--color-gray-bg-card-white)',
        boxSizing: 'border-box',
        border: '1px solid #E6ECF4',
        padding: 6,
      },
      '&-more-file-container': {
        width: 'calc(100% - 16px)',
        height: '56px',
        borderRadius: 'var(--radius-card-base)',
        background: 'var(--color-gray-bg-card-white)',
        border: '1px solid var(--color-gray-border-light)',
        margin: '0 8px 8px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        justifyContent: 'center',
        '&:hover': {
          boxShadow:
            '0px 0px 1px 0px rgba(0, 19, 41, 0.05),0px 2px 7px 0px rgba(0, 19, 41, 0.05),0px 2px 5px -2px rgba(0, 19, 41, 0.06)',
        },
      },
      '&-more-file-icon': {
        width: '15px',
        height: '17px',
      },
      '&-more-file-name': {
        font: 'var(--font-size-h6)',
        letterSpacing: 'var(--letter-spacing-h6-base, normal)',
        color: 'var(--color-gray-text-secondary)',
      },
      '&-item': {
        width: '100%',
        height: '56px',
        borderRadius: 'var(--radius-card-base)',
        opacity: 1,
        background: 'var(--color-gray-bg-card-white)',
        boxSizing: 'border-box',
        border: '1px solid var(--color-gray-border-light)',
        padding: '8px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'pointer',
        gap: '8px',
        position: 'relative',
        '&:hover': {
          boxShadow:
            '0px 0px 1px 0px rgba(0, 19, 41, 0.05),0px 2px 7px 0px rgba(0, 19, 41, 0.05),0px 2px 5px -2px rgba(0, 19, 41, 0.06)',
        },
        '&-action-bar': {
          position: 'absolute',
          right: 8,
          top: 8,
          display: 'flex',
          gap: 8,
        },
        '&-action-btn': {
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderRadius: 8,
          background: 'var(--color-gray-control-fill-secondary)',
          backdropFilter: 'blur(40px)',
          cursor: 'pointer',
        },
        // “更多”省略号图标：使用父容器 flex 居中，仅保留旋转
        '&-more-icon': {
          transform: 'rotate(90deg)',
        },
        '&-more-custom': {
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        },
        '&-file-icon': {
          width: '40px',
          height: '40px',
          opacity: 1,
          overflow: 'hidden',
          '> svg': {
            width: '40px',
            height: '40px',
          },
        },
        '&-file-info': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 2,
        },
        '&-file-name': {
          color: 'var(--color-gray-text-default)',
          fontSize: 'var(--font-text-h6-base)',
          width: '150px',
          alignItems: 'center',
          lineHeight: '18px',
          fontFamily: token.fontFamily,
          gap: -1,
          '&-text': {
            maxWidth: '150px',
            whiteSpace: 'nowrap',
            width: '100%',
            overflow: 'hidden',
            display: 'inline-block',
            textOverflow: 'ellipsis',
            height: 18,
            lineHeight: 1,
          },
        },
        '&-file-name-extension-container': {
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          color: 'var(--color-gray-text-light)',
          fontSize: '12px',
        },
        '&-file-size': {
          padding: '0 4px',
          color: 'var(--color-gray-text-light)',
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

    return [resetComponent(proChatToken), genStyle(proChatToken)];
  });
}
