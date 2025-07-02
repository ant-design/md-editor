/**
 * @fileoverview 全屏控制Hook
 * 处理代码编辑器的全屏切换逻辑
 */

import { useCallback } from 'react';
import { useFullScreenHandle } from '../../../MarkdownEditor/hooks/useFullScreenHandle';

export function useFullScreenControl() {
  const handle = useFullScreenHandle();

  const handleFullScreenToggle = useCallback(() => {
    if (handle.active) {
      handle.exit();
    } else {
      handle.enter();
    }
  }, [handle]);

  return {
    handle,
    isFullScreen: handle.active,
    handleFullScreenToggle,
  };
}
