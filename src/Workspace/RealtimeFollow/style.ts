import type { ChatTokenType, GenerateStyle } from '../../hooks/useStyle';
import { useEditorStyleRegister } from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [`${token.componentCls}`]: {
      [`&-container`]: {
        height: '100%',
      },

      [`&-header`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '8px',
        paddingBottom: '8px',

        [`&-with-border`]: {
          borderBottom: '1px solid rgba(20, 22, 28, 0.07)',
        },

        [`&-left`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },

        [`&-icon`]: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '6px',

          [`&--html`]: {
            background: '#e0f9ff',
          },

          [`&--default`]: {
            background: '#eef1f6',
          },
        },

        [`&-content`]: {
          display: 'flex',
          flexDirection: 'column',
        },

        [`&-title`]: {
          fontSize: '13px',
          fontWeight: 500,
          color: '#343a45',
        },

        [`&-subtitle`]: {
          fontSize: '12px',
          fontWeight: 'normal',
          color: '#767e8b',
        },

        [`&-right`]: {
          display: 'flex',
          alignItems: 'center',
        },
      },

      [`&--shell`]: {
        '.ace-container': {
          marginTop: 0,
          borderRadius: 'unset',
        },
      },

      [`&--markdown`]: {
        '.ant-md-editor-content div[data-be="paragraph"]:last-child': {
          paddingBottom: '16px',
        },
      },

      [`&-content`]: {
        position: 'relative',
        width: '100%',
        height: '100%',
      },

      [`&-overlay`]: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,

        [`&--loading`]: {
          background: 'rgba(255, 255, 255, 0.6)',
        },

        [`&--error`]: {
          background: 'rgba(255, 245, 245, 0.6)',
          color: '#cb1e1e',
        },
      },
    },
  };
};

export function useRealtimeFollowStyle(prefixCls?: string) {
  return useEditorStyleRegister(
    'WorkspaceRealtimeFollow',
    (token: ChatTokenType) => {
      const realtimeToken = {
        ...token,
        componentCls: `.${prefixCls}`,
      };

      return [genStyle(realtimeToken)];
    },
  );
}
