/* eslint-disable no-param-reassign */
import { Editor } from 'slate';
import { withNormalization } from './normalization';
import { DEFAULT_WITH_TABLE_OPTIONS, WithTableOptions } from './options';
import { withSelection, withSelectionAdjustment } from './selection';
import { EDITOR_TO_WITH_TABLE_OPTIONS } from './weak-maps';
import { withDelete } from './with-delete';
import { withFragments } from './with-fragments';
import { withInsertText } from './with-insert-text';

type Options = Partial<
  { blocks: Partial<WithTableOptions['blocks']> } & Omit<
    Partial<WithTableOptions>,
    'blocks'
  >
>;

/** The `withTable` plugin adds table specific behaviors to the editor. */
export function withTable<T extends Editor>(editor: T, options: Options): T {
  const { blocks, ...rest } = DEFAULT_WITH_TABLE_OPTIONS;

  const optionsWithDefaults = {
    ...rest,
    ...options,
    //@ts-ignore
    blocks: {
      ...blocks,
      ...options.blocks,
    },
  } satisfies WithTableOptions;

  EDITOR_TO_WITH_TABLE_OPTIONS.set(editor, optionsWithDefaults);

  editor = withDelete(editor, optionsWithDefaults);
  editor = withFragments(editor, optionsWithDefaults);
  editor = withInsertText(editor, optionsWithDefaults);
  editor = withNormalization(editor, optionsWithDefaults);
  editor = withSelection(editor, optionsWithDefaults);
  editor = withSelectionAdjustment(editor, optionsWithDefaults);

  return editor;
}
