import { Keyframes } from '@ant-design/cssinjs';
import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

// 定义旋转动画
const pauseIconRotate = new Keyframes('pauseIconRotate', {
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

/**
 * 生成任务运行组件的样式
 *
 * @param token - 主题令牌，包含全局样式变量
 * @returns CSS-in-JS 样式对象
 */
const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      position: 'relative',
      minWidth: 398,
      width: 'max-content',
      maxWidth: 'min(800px,100%)',
      height: 58,
      padding: 8,
      gap: 12,
      zIndex: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 16,

      '&-border': {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background:
          'conic-gradient(from 180deg at 50% 50%, #D3FEFF -31deg, #D3FEFF 82deg, #FFF16F 110deg, rgba(82, 212, 255, 0.2329) 221deg, #D3FEFF 329deg, #D3FEFF 427deg)',
        borderRadius: 16,
        boxShadow:
          '0px 0px 1px 0px rgba(0, 15, 41, 0.05),0px 6px 16px 0px rgba(0, 15, 41, 0.08)',
        pointerEvents: 'none',
      },

      '&-background': {
        position: 'absolute',
        top: 2,
        left: 2,
        right: 2,
        bottom: 2,
        zIndex: -1,
        background: '#FFFFFF',
        borderRadius: 14,
        pointerEvents: 'none',
      },

      '&-left': {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 'var(--font-size-base)',
        lineHeight: '20px',
        color: '#343A45',
      },

      '&-left-icon-wrapper': {
        display: 'flex',
        padding: 2,
        width: 40,
        height: 40,
      },

      '&-left-content': {
        display: 'flex',
        flexDirection: 'column',
      },

      // title
      '&-left-main-text': {
        fontSize: 'var(--font-size-base)',
        lineHeight: '20px',
        fontWeight: 600,
        color: '#343A45',
      },

      // description
      '&-left-text': {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'normal',
        lineHeight: '20px',
        alignItems: 'center',
        letterSpacing: 'normal',
        display: '-webkit-box',
        '-webkit-line-clamp': '1',
        lineClamp: 1,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: 'rgba(0, 25, 61, 0.3255)',
      },

      '&-button-wrapper': {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
        '> * ': {
          cursor: 'pointer',
        },
      },

      '&-pause': {
        width: 32,
        color: '#343A45',
        height: 32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0,
        cursor: 'pointer',
      },

      '&-play': {
        width: 32,
        color: '#343A45',
        height: 32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0,
        cursor: 'pointer',
      },

      button: {
        borderRadius: 200,
      },

      // 旋转动画样式
      '.pause-icon-ring': {
        transition: 'transform 0.1s ',
        transformOrigin: '16px 16px',
        animationName: pauseIconRotate,
        animationDuration: '1s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
      },
    },

    // Simple variant
    [`${componentCls}${componentCls}-simple`]: {
      width: '100%',
      height: 39,
      padding: '8px 12px',
      borderRadius: 8,

      [`${componentCls}-border`]: {
        background: '#F1F2F4',
        borderRadius: 8,
        boxShadow:
          '0px 0px 1px 0px rgba(0, 19, 41, 0.2),0px 1.5px 4px -1px rgba(0, 19, 41, 0.04)',
      },

      [`${componentCls}-background`]: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#F1F2F4',
        borderRadius: 8,
      },

      // title
      [`${componentCls}-left-main-text`]: {
        color: '#343A45',
        fontSize: 'var(--font-size-base)',
        fontWeight: 'normal',
        lineHeight: '16px',
      },

      [`${componentCls}-button-wrapper`]: {
        gap: 12,
      },

      [`${componentCls}-pause`]: {
        width: 20,
        height: 20,
      },

      [`${componentCls}-play`]: {
        width: 20,
        height: 20,
      },
    },
  };
};

/**
 * 任务运行组件的样式 Hook
 *
 * 该 Hook 用于生成任务运行组件所需的样式，包括：
 * - 容器样式
 * - 左侧区域样式（图标、标题和描述）
 * - 按钮区域样式（暂停、操作按钮）
 * - 动画效果
 *
 * @param prefixCls - 组件类名前缀
 * @returns 包含样式和 SSR 包装器的对象
 *
 * @example
 * ```tsx
 * const { wrapSSR, hashId } = useStyle('my-prefix');
 * ```
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('task-running', (token) => {
    const taskRunningToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genStyle(taskRunningToken)];
  });
}
