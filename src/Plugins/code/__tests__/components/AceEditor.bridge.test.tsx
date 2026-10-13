import { act, cleanup, fireEvent, render } from '@testing-library/react';
import type { Ace } from 'ace-builds';
import React from 'react';
import { createEditor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EditorStoreTestProvider } from '../../../../MarkdownEditor/editor/__tests__/helpers/editorStoreTestContext';
import { withCodeBlockPlugin } from '../../../../MarkdownEditor/editor/plugins/withCodeBlockPlugin';
import { EditorStore } from '../../../../MarkdownEditor/editor/store';
import type { CodeNode } from '../../../../MarkdownEditor/el';
import { AceEditor } from '../../components/AceEditor';

const aceFactory = vi.hoisted(() => ({
  edit: vi.fn(),
  load: vi.fn(),
  loadTheme: vi.fn(),
}));
vi.mock('../../loadAceEditor', () => ({
  loadAceEditor: () => aceFactory.load(),
  loadAceTheme: (theme: string) => aceFactory.loadTheme(theme),
}));
vi.mock('../../../../MarkdownEditor/editor/utils/ace', () => ({
  modeMap: new Map(),
  getAceLangs: async () => new Set(['text']),
}));

function makeAce(host: HTMLElement, value: string) {
  const handlers = new Map<string, (() => void)[]>();
  const textarea = document.createElement('textarea');
  textarea.setAttribute('aria-label', 'Ace code');
  host.append(textarea);
  const session = {
    setMode: vi.fn(),
    insert: vi.fn(),
    getDocument: () => ({ getLength: () => 1, getLine: () => value }),
  };
  return {
    value,
    textarea,
    setTheme: vi.fn(),
    getSession: () => session,
    session,
    commands: { addCommand: vi.fn() },
    selection: { on: vi.fn(), clearSelection: vi.fn() },
    on: (event: string, handler: () => void) => {
      handlers.set(event, [...(handlers.get(event) || []), handler]);
    },
    emit(event: string) {
      handlers.get(event)?.forEach((handler) => handler());
    },
    getValue() {
      return this.value;
    },
    setValue(next: string) {
      this.value = next;
      this.emit('change');
    },
    clearSelection: vi.fn(),
    destroy: vi.fn(() => textarea.remove()),
  };
}

async function renderAce(value = '', enabled = true) {
  const editor = withCodeBlockPlugin(withReact(withHistory(createEditor())));
  const store = new EditorStore({ current: editor });
  const element: CodeNode = {
    type: 'code',
    value,
    language: 'text',
    children: [{ text: '' }],
  };
  editor.children = [
    element,
    { type: 'paragraph', children: [{ text: 'after' }] },
  ];
  const onUpdate = vi.fn();
  let ace: ReturnType<typeof makeAce>;
  aceFactory.edit.mockImplementation(
    (host: HTMLElement, options: Ace.EditorOptions) => {
      ace = makeAce(host, String(options.value || ''));
      return ace;
    },
  );
  function Host({
    readonly = false,
    node = element,
    enabled: active = enabled,
    theme = 'github',
  }: {
    readonly?: boolean;
    node?: CodeNode;
    enabled?: boolean;
    theme?: string;
  }) {
    return (
      <EditorStoreTestProvider value={{ readonly, store }}>
        <Code node={node} enabled={active} theme={theme} />
      </EditorStoreTestProvider>
    );
  }
  function Code({
    node,
    enabled,
    theme,
  }: {
    node: CodeNode;
    enabled: boolean;
    theme: string;
  }) {
    const { dom } = AceEditor({
      element: node,
      onUpdate,
      onShowBorderChange: () => {},
      onHideChange: () => {},
      theme,
      enabled,
    });
    return <div ref={dom} />;
  }
  const view = render(<Host />);
  await act(async () => {});
  return { ...view, editor, store, onUpdate, ace: ace!, Host };
}

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'development');
  vi.useFakeTimers();
  aceFactory.edit.mockClear();
  aceFactory.load.mockReset().mockResolvedValue({ default: aceFactory });
  aceFactory.loadTheme.mockReset().mockResolvedValue(undefined);
});
afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe('Ace and Slate bridge', () => {
  it('defers loading and mounting Ace until the code view is visible', async () => {
    const { rerender, Host } = await renderAce('preview only', false);
    expect(aceFactory.load).not.toHaveBeenCalled();
    expect(aceFactory.edit).not.toHaveBeenCalled();
    rerender(<Host enabled />);
    await act(async () => {});
    expect(aceFactory.edit).toHaveBeenCalledTimes(1);
  });

  it('ignores a pending loader after the code view is hidden', async () => {
    let resolve!: (module: { default: typeof aceFactory }) => void;
    aceFactory.load.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done;
      }),
    );
    const { rerender, Host } = await renderAce('initial');
    rerender(<Host enabled={false} />);
    await act(async () => resolve({ default: aceFactory }));
    expect(aceFactory.edit).not.toHaveBeenCalled();
  });

  it('flushes accepted edits before hiding the code view and restores them on reopening', async () => {
    const { editor, ace, onUpdate, rerender, Host } =
      await renderAce('initial');
    ace.value = 'draft';
    ace.emit('change');
    rerender(<Host enabled={false} />);
    expect(editor.children[0]).toMatchObject({ value: 'draft' });
    expect(ace.destroy).toHaveBeenCalledTimes(1);
    rerender(<Host enabled />);
    await act(async () => {});
    expect(aceFactory.edit.mock.results.at(-1)?.value.getValue()).toBe('draft');
    await act(async () => vi.advanceTimersByTime(200));
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('keeps the latest theme when older theme loading finishes later', async () => {
    let resolveFirst!: () => void;
    let resolveLatest!: () => void;
    aceFactory.loadTheme.mockImplementation(
      (theme: string) =>
        new Promise<void>((done) => {
          if (theme === 'github') resolveFirst = done;
          else resolveLatest = done;
        }),
    );
    const { ace, rerender, Host } = await renderAce('initial');
    rerender(<Host theme="chaos" />);
    await act(async () => resolveLatest());
    await act(async () => resolveFirst());
    expect(ace.setTheme).toHaveBeenCalledExactlyOnceWith('ace/theme/chaos');
  });

  it('cancels delayed blur selection updates on unmount', async () => {
    const { ace, unmount } = await renderAce('initial');
    await act(async () => vi.advanceTimersByTime(20));
    ace.emit('blur');
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('uses current Ace text for Backspace while the Slate update is still debounced', async () => {
    const { editor, ace } = await renderAce();
    ace.value = 'const value = 1';
    ace.emit('change');
    fireEvent.keyDown(ace.textarea, { key: 'Backspace' });
    expect(editor.children[0]).toMatchObject({ type: 'code', value: '' });
  });

  it('keeps IME keyboard and intermediate text inside Ace until composition ends', async () => {
    const { editor, ace, onUpdate } = await renderAce();
    fireEvent.compositionStart(ace.textarea);
    fireEvent.keyDown(ace.textarea, { key: 'Backspace', isComposing: true });
    ace.value = 'ni';
    ace.emit('change');
    await act(async () => vi.advanceTimersByTime(120));
    expect(editor.children[0]).toMatchObject({ type: 'code' });
    expect(onUpdate).not.toHaveBeenCalled();
    ace.value = '你';
    fireEvent.compositionEnd(ace.textarea);
    await act(async () => vi.advanceTimersByTime(120));
    expect(onUpdate).toHaveBeenCalledExactlyOnceWith({ value: '你' });
  });

  it('preserves an accepted pending draft when readonly replaces the Ace instance', async () => {
    const { editor, ace, onUpdate, rerender, Host } = await renderAce();
    ace.value = 'queued';
    ace.emit('change');
    rerender(<Host readonly />);
    fireEvent.keyDown(ace.textarea, { key: 'Backspace' });
    await act(async () => vi.advanceTimersByTime(120));
    expect(onUpdate).not.toHaveBeenCalled();
    expect(editor.children[0]).toMatchObject({ type: 'code', value: 'queued' });
    expect(ace.destroy).toHaveBeenCalledTimes(1);
    expect(aceFactory.edit.mock.results.at(-1)?.value.getValue()).toBe(
      'queued',
    );
  });

  it('preserves accepted input on cleanup without firing a delayed callback', async () => {
    const { editor, ace, onUpdate, unmount } = await renderAce();
    ace.value = 'queued';
    ace.emit('change');
    unmount();
    expect(editor.children[0]).toMatchObject({ value: 'queued' });
    await act(async () => vi.advanceTimersByTime(120));
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('does not commit a delayed update after the Slate code node was removed', async () => {
    const { editor, ace, onUpdate } = await renderAce('initial');
    ace.value = 'queued';
    ace.emit('change');
    Transforms.removeNodes(editor, { at: [0] });
    await act(async () => vi.advanceTimersByTime(120));
    expect(onUpdate).not.toHaveBeenCalled();
    expect(editor.children[0]).toMatchObject({ type: 'paragraph' });
  });

  it('ignores keyboard and queued changes after the same Slate node changes type', async () => {
    const { editor, ace, onUpdate } = await renderAce();
    ace.value = 'queued';
    ace.emit('change');
    Transforms.setNodes(editor, { type: 'paragraph' }, { at: [0] });
    fireEvent.keyDown(ace.textarea, { key: 'Enter', ctrlKey: true });
    await act(async () => vi.advanceTimersByTime(120));
    expect(onUpdate).not.toHaveBeenCalled();
    expect(editor.children).toHaveLength(2);
    expect(editor.children[0]).toMatchObject({ type: 'paragraph' });
  });

  it('cancels a pending draft when the document replaces its code before readonly', async () => {
    const { editor, ace, onUpdate, rerender, Host } =
      await renderAce('initial');
    ace.value = 'queued';
    ace.emit('change');
    Transforms.removeNodes(editor, { at: [0] });
    Transforms.insertNodes(
      editor,
      {
        type: 'code',
        value: 'fresh',
        children: [{ text: '' }],
      },
      { at: [0] },
    );
    rerender(<Host readonly />);
    await act(async () => vi.advanceTimersByTime(120));
    expect(onUpdate).not.toHaveBeenCalled();
    expect(editor.children[0]).toMatchObject({ type: 'code', value: 'fresh' });
  });

  it('does not overwrite a newer external value when readonly flushes pending input', async () => {
    const { editor, ace, rerender, Host } = await renderAce('initial');
    ace.value = 'queued';
    ace.emit('change');
    Transforms.setNodes(editor, { value: 'external' }, { at: [0] });
    rerender(<Host readonly />);
    expect(editor.children[0]).toMatchObject({
      type: 'code',
      value: 'external',
    });
  });

  it('ignores a queued change when the same Slate node receives an external value before React rerenders', async () => {
    const { editor, ace, onUpdate } = await renderAce('initial');
    ace.value = 'queued';
    ace.emit('change');
    Transforms.setNodes(editor, { value: 'external' }, { at: [0] });
    await act(async () => vi.advanceTimersByTime(120));
    expect(onUpdate).not.toHaveBeenCalled();
    expect(editor.children[0]).toMatchObject({ value: 'external' });
  });

  it('does not echo a programmatic Ace setValue into Slate onUpdate', async () => {
    const { editor, ace, onUpdate, rerender, Host } =
      await renderAce('initial');
    Transforms.setNodes(editor, { value: 'external' }, { at: [0] });
    rerender(<Host node={editor.children[0] as CodeNode} />);
    await act(async () => vi.advanceTimersByTime(120));
    expect(ace.getValue()).toBe('external');
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('cancels pending input when the Slate editor instance is replaced even with shared nodes', async () => {
    const { editor, store, ace, onUpdate, rerender, Host } =
      await renderAce('initial');
    ace.value = 'queued';
    ace.emit('change');
    const replacement = withCodeBlockPlugin(
      withReact(withHistory(createEditor())),
    );
    replacement.children = editor.children;
    store._editor.current = replacement;
    rerender(<Host readonly />);
    await act(async () => vi.advanceTimersByTime(120));
    expect(onUpdate).not.toHaveBeenCalled();
    expect(replacement.children[0]).toMatchObject({ value: 'initial' });
  });
});
