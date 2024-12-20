import { Editor } from 'slate';
const tryCatchCallback =
  (editorFunc: any) =>
  (...editorFuncArgs: any) => {
    try {
      return editorFunc(...editorFuncArgs);
    } catch (error) {
      console.error(error);
      // editor.undo();
    }
  };
export const withErrorReporting = (editor: any): Editor => {
  Object.entries(editor).forEach(([key, value]) => {
    if (typeof value === 'function') {
      editor[key] = tryCatchCallback(value);
    }
  });

  return editor as Editor;
};
