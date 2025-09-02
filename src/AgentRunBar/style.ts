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
  return {
    [token.componentCls]: {
      width: 326,
      height: 56,
      padding: 8,
      gap: 4,
      zIndex: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 200,
      background:
        'linear-gradient(180deg, rgba(248, 249, 251, 0%) 0%, #f8f9fb 33%)',
      boxSizing: 'border-box',
      border: '1px solid rgba(0, 30, 75, 0.07)',
      boxShadow: '0 1.5px 4px -1px rgba(0, 1, 3, 7%)',

      '&-left': {
        display: 'flex',
        alignItems: 'center',
        gap: 4,

        span: {
          fontSize: 14,
          fontWeight: 600,
          lineHeight: '22px',
          letterSpacing: 'normal',
          color: 'rgba(0, 2, 7, 0.87)',
        },

        '.task-running-icon-wrapper': {
          marginRight: 9,
          display: 'flex',
          padding: 6,
        },

        '.task-running-text': {
          fontSize: 12,
          fontWeight: 'normal',
          lineHeight: '20px',
          letterSpacing: 'normal',
          color: 'rgba(0, 3, 9, 45%)',
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
  };
};

/**
 * 任务运行组件的样式 Hook
 *
 * 该 Hook 用于生成任务运行组件所需的样式，包括：
 * - 容器样式
 * - 左侧区域样式（图标和文本）
 * - 暂停按钮样式
 * - 其他按钮样式
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
