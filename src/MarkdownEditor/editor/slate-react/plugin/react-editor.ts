import { DOMEditor, type DOMEditorInterface } from 'slate-dom';

/**
 * A React and DOM-specific version of the `Editor` interface.
 */

export type ReactEditor = DOMEditor;

export type ReactEditorInterface = DOMEditorInterface;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ReactEditor: ReactEditorInterface = DOMEditor;
