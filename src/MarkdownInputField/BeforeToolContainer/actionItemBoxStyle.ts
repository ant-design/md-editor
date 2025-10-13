import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      borderRadius: '11px',
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      width: '100%',
      cursor: 'pointer',
      gap: '12px',
      justifyContent: 'space-between',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#FFF',
      '&-overflow-container': {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        pointerEvents: 'none',
        background:
          'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.85) 60%, #FFFFFF 100%)',
        borderRadius: 12,
        width: 72,
        height: '80%',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',

        '&-indicator': {
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          zIndex: 10,
          // background: 'var(--color-gray-control-fill-active)',
          background:
            'linear-gradient(270deg, #FFFFFF 57%, rgba(255, 255, 255, 0) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow: 'var(--shadow-border-base)',
          borderRadius: 'var(--radius-control-base)',
          '&-icon': {
            color: '#767E8B',
          },
        },
        '&-popup': {
          position: 'relative',
          maxHeight: 360,
          overflowY: 'auto',
          overscrollBehaviorY: 'contain',
          background: 'var(--color-gray-bg-card-white)',
          borderRadius: 'var(--radius-card-base)',
          marginBottom: 8,
          zIndex: 1000,
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          boxShadow: 'var(--shadow-popover-base)',
          '> *': {
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          },
          '&-item': {
            display: 'flex',
            alignItems: 'stretch',
            gap: 8,
            alignSelf: 'stretch',
            width: '100%',
            minWidth: 0,
            borderRadius: 8,
            transition: 'background-color 0.2s ease',
          },
          // make the wrapper around entry.node fill available width
          ['&-item > div[draggable="false"]']: {
            flex: 1,
            width: '100%',
            minWidth: 0,
            display: 'flex',
          },
          // ensure the immediate child (motion.div) also stretches
          ['&-item > div[draggable="false"] > div']: {
            flex: '1 1 auto',
            width: '100%',
            minWidth: 0,
            display: 'flex',
          },
          // ensure hover background applies regardless of which node captures hover
          [`&-item:hover ${token.componentCls}`]: {
            backgroundColor: 'var(--color-gray-control-fill-active)',
            backgroundImage: 'none',
            boxShadow: 'none',
          },
          // drag states
          [`&-item.${token.componentCls.slice(1)}-dragging`]: {
            opacity: 0.6,
          },
          [`&-item.${token.componentCls.slice(1)}-drag-over`]: {
            backgroundColor: 'rgba(22, 119, 255, 0.08)',
            outline: '1px dashed rgba(22, 119, 255, 0.45)',
          },
          // ensure the inner ActionItemBox layout inside popup
          [`${token.componentCls}-container`]: {
            background: 'transparent',
            padding: 0,
            width: '100%',
            boxShadow: 'none',
            border: 'none',
            '&:hover': {
              backgroundColor: 'transparent',
              backgroundImage: 'none',
            },
          },
          [token.componentCls]: {
            background: 'transparent',
            boxShadow: 'none',
            border: 'none',
            width: '100%',
            minHeight: 28,
            height: 28,
            lineHeight: '28px',
            borderRadius: 8,
            padding: '3px 8px',
            '&:hover': {
              backgroundColor: 'var(--color-gray-control-fill-active)',
              backgroundImage: 'none',
            },
          },
          [`${token.componentCls}-option`]: {
            display: 'none',
          },
          // drag handle visuals
          [`${token.componentCls}-drag-handle`]: {
            width: 14,
            height: 28,
            lineHeight: 28,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#505C71',
            opacity: 0.6,
            cursor: 'grab',
            userSelect: 'none',
          },
          [`${token.componentCls}-drag-handle:active`]: {
            cursor: 'grabbing',
            opacity: 1,
          },
          [`${token.componentCls}-icon`]: {
            width: 20,
            height: 20,
            borderRadius: 6,
            backgroundColor: '#F7F9FC',
          },
          [`${token.componentCls}-content-description`]: {
            display: 'none',
          },
          [`${token.componentCls}-content-title`]: {
            fontSize: '13px',
            lineHeight: '28px',
          },
        },
      },
      '&-container': {
        borderRadius: 'var(--radius-control-base)',
        position: 'relative',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        width: '100%',
        cursor: 'pointer',
        overflow: 'visible',
      },
      '&-icon': {
        width: 40,
        height: 40,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&-small': {
          backgroundColor: 'transparent',
          borderRadius: 2,
        },
      },

      '&-content': {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        maxWidth: '100%',
        '&-title': {
          lineHeight: '24px',
          fontSize: '1em',
          color: 'var(--color-gray-text-default)',
        },
        '&-title-no-description': {
          letterSpacing: 'var(--letter-spacing-body-base, normal)',
          font: 'var(--font-text-body-base)',
          color: 'var(--color-gray-text-default)',
          lineHeight: '20px',
          fontWeight: 'normal',
        },
      },
      '&-option': {
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // hover background for item itself when `-hover-bg` class present
      ['&-hover-bg:hover']: {
        backgroundColor: 'var(--color-gray-control-fill-active)',
        backgroundImage: 'none',
      },
      // hover background when hovering the container (with `-container-hover-bg`)
      // apply to the inner item so the whole row highlights
      ['&-container-hover-bg:hover ' + token.componentCls]: {
        backgroundColor: 'var(--color-gray-control-fill-active)',
        backgroundImage: 'none',
      },
    },
  };
};

/**
 * ActionItemBox
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('ActionItemBox', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    // Apply reset first, then component styles to allow overrides like padding
    return [resetComponent(proChatToken), genStyle(proChatToken)];
  });
}
