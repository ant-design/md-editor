import { Editor, Element } from 'slate';
import { WithTableOptions } from './options';
import { NodeEntryWithContext } from './utils/types';

/** Weak reference between the `Editor` and the `WithTableOptions` */
export const EDITOR_TO_WITH_TABLE_OPTIONS = new WeakMap<
  Editor,
  WithTableOptions
>();

/** Weak reference between the `Editor` and the selected elements */
export const EDITOR_TO_SELECTION = new WeakMap<
  Editor,
  NodeEntryWithContext[][]
>();

/** Weak reference between the `Editor` and a set of the selected elements */
export const EDITOR_TO_SELECTION_SET = new WeakMap<Editor, WeakSet<Element>>();
