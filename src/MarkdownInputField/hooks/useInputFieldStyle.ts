/**
 * useInputFieldStyle Hook - 输入框样式计算
 *
 * 从 MarkdownInputField.tsx 中提取，用于计算输入框的各种样式
 */

import { useMemo } from 'react';
import type { MarkdownInputFieldProps } from '../MarkdownInputField';

export interface UseInputFieldStyleResult {
  collapsedHeight: number;
  collapsedHeightPx: number;
  enlargedStyle: React.CSSProperties;
  computedRightPadding: number;
}

export const useInputFieldStyle = (
  props: MarkdownInputFieldProps,
  rightPadding: number,
  topRightPadding: number,
  quickRightOffset: number,
  isEnlarged: boolean,
): UseInputFieldStyleResult => {
  const collapsedHeight = useMemo(() => {
    const mh = props.style?.maxHeight;
    const base =
      typeof mh === 'number' ? mh : mh ? parseFloat(String(mh)) || 114 : 114;
    return base;
  }, [props.style?.maxHeight, props.attachment?.enable]);

  const collapsedHeightPx = useMemo(() => {
    const extra = props.attachment?.enable ? 90 : 0;
    return collapsedHeight + extra;
  }, [collapsedHeight, props.attachment?.enable]);

  const enlargedStyle = useMemo(() => {
    if (!isEnlarged) return {};
    return {
      maxHeight: '980px',
      minHeight: '280px',
    } as React.CSSProperties;
  }, [isEnlarged]);

  const computedRightPadding = useMemo(() => {
    const bottomOverlayPadding = props.toolsRender ? 0 : rightPadding || 52;
    const topOverlayPadding = (topRightPadding || 0) + (quickRightOffset || 0);
    return Math.max(bottomOverlayPadding, topOverlayPadding);
  }, [props.toolsRender, rightPadding, topRightPadding, quickRightOffset]);

  return {
    collapsedHeight,
    collapsedHeightPx,
    enlargedStyle,
    computedRightPadding,
  };
};

