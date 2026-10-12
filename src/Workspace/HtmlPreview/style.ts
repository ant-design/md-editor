import { genStyleHooks, type GenStyleFn } from '../../Hooks/useStyle';

const genStyle: GenStyleFn<'WorkspaceHtmlPreview'> = (token) => {
  return {
    [`${token.componentCls}`]: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
      minWidth: 0,
      flex: 1,

      [`${token.componentCls}-actions`]: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexShrink: 0,
        padding: '8px 0',
      },

      [`${token.componentCls}-content`]: {
        position: 'relative',
        // 无显式父高度时保留可用预览尺寸；固定高度容器中仍允许收缩。
        flex: '1 1 240px',
        minHeight: 0,
        minWidth: 0,
        width: '100%',
        overflow: 'hidden',
      },

      [`${token.componentCls}-iframe`]: {
        display: 'block',
        width: '100%',
        height: '100%',
        border: 'none',
        background: token.colorBgContainer,
      },

      [`${token.componentCls}-overlay`]: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,

        [`&--loading`]: {
          // 与 antd 遮罩一致，随亮/暗主题变化
          background: token.colorBgMask,
        },

        [`&--error`]: {
          background: token.colorErrorBg,
          color: token.colorError,
        },
      },

      [`${token.componentCls}-empty`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: 0,
        padding: '24px',
        boxSizing: 'border-box',
        textAlign: 'center',
      },
    },
  };
};

const useGenStyle = genStyleHooks('WorkspaceHtmlPreview', genStyle);

export function useHtmlPreviewStyle(prefixCls?: string) {
  const [, hashId] = useGenStyle(prefixCls ?? 'WorkspaceHtmlPreview');
  return { hashId };
}
