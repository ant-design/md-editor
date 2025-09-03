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
      minWidth: 398,
      width: 'max-content',
      maxWidth: 'min(800px,100%)',
      height: 56,
      padding: 8,
      gap: 4,
      zIndex: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 200,
      background: '#FFFFFF',
      boxShadow:
        '0px 0px 1px 0px rgba(0, 15, 41, 0.05),0px 6px 16px 0px rgba(0, 15, 41, 0.08)',
      '&-left': {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: '13px',
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
        gap: 2,
      },

      '&-left-main-text': {
        fontSize: '13px',
        lineHeight: '20px',
        fontWeight: 600,
        color: '#343A45',
      },

      '&-left-text': {
        fontSize: '12px',
        fontWeight: 'normal',
        lineHeight: '20px',
        display: 'flex',
        alignItems: 'center',
        letterSpacing: 'normal',
        color: 'rgba(0, 25, 61, 0.3255)',
      },

      '&-button-wrapper': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
