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

  //@ts-ignore
  EDITOR_TO_WITH_TABLE_OPTIONS.set(editor, optionsWithDefaults);

  //@ts-ignore
  editor = withDelete(editor, optionsWithDefaults);
  //@ts-ignore
  editor = withFragments(editor, optionsWithDefaults);
  //@ts-ignore
  editor = withInsertText(editor, optionsWithDefaults);
  //@ts-ignore
  editor = withNormalization(editor, optionsWithDefaults);
  //@ts-ignore
  editor = withSelection(editor, optionsWithDefaults);
  //@ts-ignore
  editor = withSelectionAdjustment(editor, optionsWithDefaults);

  return editor;
}
