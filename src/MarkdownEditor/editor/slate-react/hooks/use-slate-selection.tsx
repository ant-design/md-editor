import { BaseSelection, Range } from 'slate';

import { useSlateSelector } from './use-slate-selector';

const isSelectionEqual = (a: BaseSelection, b: BaseSelection) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return Range.equals(a, b);
};

/**
 * Get the current slate selection.
 * Only triggers a rerender when the selection actually changes
 */
export const useSlateSelection = () => {
  return useSlateSelector((editor) => editor.selection, isSelectionEqual);
};
