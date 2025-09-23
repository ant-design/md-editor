import { useRefFunction } from '@ant-design/md-editor/hooks/useRefFunction';
import { useEffect, useRef } from 'react';
import type { SkillModeConfig } from '../index';

/**
 * 技能模式状态管理 Hook
 * @description 处理技能模式的状态变化，避免重复回调
 * @param skillMode 技能模式配置
 * @param onSkillModeOpenChange 状态变化回调函数
 * @returns 内部状态变化处理函数
 *
 * @example
 * ```tsx
 * const handleInternalChange = useSkillModeState(skillMode, onSkillModeOpenChange);
 *
 * // 在内部操作时使用
 * const handleCloseClick = () => {
 *   handleInternalChange(false); // 避免重复回调
 * };
 * ```
 */
export function useSkillModeState(
  skillMode?: SkillModeConfig,
  onSkillModeOpenChange?: (open: boolean) => void,
) {
  // 追踪技能模式状态变化
  const prevSkillModeOpenRef = useRef<boolean | undefined>(skillMode?.open);

  // 简洁的重复回调防护：标记是否跳过下一次外部回调
  const skipNextCallbackRef = useRef<boolean>(false);

  // 简洁的内部技能模式状态变化处理
  const handleInternalSkillModeChange = useRefFunction((open: boolean) => {
    // 标记跳过下一次外部回调（避免重复）
    skipNextCallbackRef.current = true;
    // 触发回调
    onSkillModeOpenChange?.(open);
  });

  // 监听外部技能模式状态变化
  useEffect(() => {
    const currentOpen = skillMode?.open;
    const prevOpen = prevSkillModeOpenRef.current;

    if (currentOpen !== prevOpen) {
      prevSkillModeOpenRef.current = currentOpen;

      // 如果需要跳过此次回调（避免内部操作的重复回调）
      if (skipNextCallbackRef.current) {
        skipNextCallbackRef.current = false;
        return;
      }

      // 触发外部状态变化回调（排除初始化）
      if (onSkillModeOpenChange && prevOpen !== undefined) {
        onSkillModeOpenChange(!!currentOpen);
      }
    }
  }, [skillMode?.open, onSkillModeOpenChange]);

  return handleInternalSkillModeChange;
}
