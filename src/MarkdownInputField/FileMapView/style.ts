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
        background: '#FFFFFF',
        boxSizing: 'border-box',
        border: '1px solid #E6ECF4',
        padding: 6,
      },
      '&-item': {
        width: '350px',
        height: '56px',
        borderRadius: 'var(--radius-card-base)',
        background: 'var(--color-gray-bg-card-white)',
        boxSizing: 'border-box',
        border: 'var(--color-gray-border-light)',
        boxShadow: 'var(--shadow-control-base)',
        opacity: 1,
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
          alignItems: 'center',
          font: 'var(--font-text-h6-base)',
          letterSpacing: 'var(--letter-spacing-h6-base, normal)',
          color: 'var(--color-gray-text-default)',
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        '&-file-size': {
          font: 'var(--font-text-body-sm)',
          letterSpacing: 'var(--letter-spacing-body-sm, normal)',
          color: 'var(--color-gray-text-light)',
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
