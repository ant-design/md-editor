/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { BaseEditor } from 'slate';
import { DOMEditor, type DOMEditorInterface } from 'slate-dom';
import { HistoryEditor } from 'slate-history';

/**
 * A React and DOM-specific version of the `Editor` interface.
 */

export interface ReactEditor extends DOMEditor, BaseEditor, HistoryEditor {}

export interface ReactEditorInterface extends DOMEditorInterface {}

export const ReactEditor: ReactEditorInterface = DOMEditor;
