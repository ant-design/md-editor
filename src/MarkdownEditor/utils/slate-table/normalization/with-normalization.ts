/* eslint-disable no-param-reassign */
import { Editor } from 'slate';
import { WithTableOptions } from '../options';
import { normalizeAttributes } from './normalize-attributes';
import { normalizeContent } from './normalize-content';
import { normalizeSections } from './normalize-sections';
import { normalizeTable } from './normalize-table';
import { normalizeTr } from './normalize-tr';

export function withNormalization<T extends Editor>(
  editor: T,
  options: WithTableOptions,
): T {
  if (!options.withNormalization) {
    return editor;
  }

  editor = normalizeAttributes(editor, options);
  editor = normalizeContent(editor, options);
  editor = normalizeSections(editor, options);
  editor = normalizeTable(editor);
  // editor = normalizeTd(editor, options);
  editor = normalizeTr(editor, options);

  return editor;
}
