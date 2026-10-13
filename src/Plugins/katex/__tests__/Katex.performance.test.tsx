import { act, cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CodeNode, InlineKatexNode } from '../../../MarkdownEditor/el';
import { InlineKatex } from '../InlineKatex';
import { Katex } from '../Katex';
import { loadKatex } from '../loadKatex';

const selection = vi.hoisted(() => ({ selected: false, readonly: false }));
const renderFormula = vi.hoisted(() =>
  vi.fn((code: string, target: HTMLElement) => {
    target.innerHTML = `<span data-formula>${code}</span>`;
  }),
);
vi.mock('../loadKatex', () => ({ loadKatex: vi.fn() }));
vi.mock('../../../MarkdownEditor/editor/store', () => ({
  useEditorStore: () => ({
    readonly: selection.readonly,
    markdownEditorRef: { current: null },
  }),
}));
vi.mock('../../../MarkdownEditor/hooks/editor', () => ({
  useSelStatus: () => [selection.selected, [0]],
}));

const code = (source: string): CodeNode => ({
  type: 'code',
  value: source,
  language: 'katex',
  children: [{ text: source }],
});
const flush = async () => {
  await act(async () => {});
  await act(() => vi.advanceTimersByTimeAsync(350));
};
beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'development');
  vi.useFakeTimers();
  vi.clearAllMocks();
  selection.selected = false;
  selection.readonly = false;
  vi.mocked(loadKatex).mockResolvedValue({
    default: { render: renderFormula },
  } as unknown as Awaited<ReturnType<typeof loadKatex>>);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe('KaTeX rendering ownership', () => {
  it('keeps source visible between library loading and the first paint', async () => {
    const { container } = render(<Katex el={code('x^2')} />);
    await act(async () => {});
    expect(screen.queryByText('Formula')).toBeNull();
    expect(screen.getByText('x^2').tagName).toBe('PRE');
    expect(container.querySelector('.katex-container')).toHaveStyle({
      display: 'none',
    });
    expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
    await flush();
    expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
    expect(container.querySelector('.katex-container')).not.toHaveStyle({
      display: 'none',
    });
  });

  it('hides the rendered target while an updated formula falls back to source', async () => {
    const { rerender, container } = render(<Katex el={code('x^2')} />);
    await flush();
    renderFormula.mockImplementationOnce(() => {
      throw new Error('invalid formula');
    });
    rerender(<Katex el={code('invalid')} />);
    await flush();
    expect(screen.getByText('invalid').tagName).toBe('PRE');
    expect(container.querySelector('.katex-container')).toHaveStyle({
      display: 'none',
    });
    rerender(<Katex el={code('y^2')} />);
    await flush();
    expect(container.querySelector('[data-formula]')?.textContent).toBe('y^2');
    expect(container.querySelector('.katex-container')).not.toHaveStyle({
      display: 'none',
    });
  });

  it('keeps rendered math when only node metadata changes', async () => {
    const { rerender, container } = render(<Katex el={code('x^2')} />);
    await flush();
    expect(renderFormula).toHaveBeenCalledTimes(1);
    const formula = container.querySelector('[data-formula]');
    rerender(<Katex el={{ ...code('x^2'), otherProps: { finished: true } }} />);
    await flush();
    expect(renderFormula).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[data-formula]')).toBe(formula);
    expect(
      container.querySelector('.katex-container')?.getAttribute('style'),
    ).toContain('overflow-x: auto');
  });

  it('removes the previous formula immediately when cleared', async () => {
    const { rerender, container } = render(<Katex el={code('x^2')} />);
    await flush();
    rerender(<Katex el={code(' ')} />);
    expect(container.querySelector('[data-formula]')).toBeNull();
    expect(screen.getByText('Formula')).toBeTruthy();
  });

  it('keeps unfinished streaming math as source without loading or parsing', async () => {
    const { rerender } = render(
      <Katex el={{ ...code('\\frac{1}{'), otherProps: { finished: false } }} />,
    );
    await flush();
    expect(loadKatex).not.toHaveBeenCalled();
    expect(screen.getByText('\\frac{1}{')).toBeTruthy();
    rerender(
      <Katex
        el={{ ...code('\\frac{1}{2}'), otherProps: { finished: true } }}
      />,
    );
    await flush();
    expect(renderFormula).toHaveBeenCalledTimes(1);
  });

  it('shows the formula source when loading fails', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(loadKatex).mockRejectedValueOnce(new Error('offline'));
    render(<Katex el={code('x^2')} />);
    await flush();
    expect(screen.getByText('x^2').tagName).toBe('PRE');
    expect(renderFormula).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('reuses inline math across metadata and selection changes, then paints a new readonly target', async () => {
    const element: InlineKatexNode = {
      type: 'inline-katex',
      children: [{ text: 'x^2' }],
    };
    const props = { element, attributes: {}, children: <span>x^2</span> };
    const { rerender, container } = render(<InlineKatex {...props} />);
    await flush();
    expect(renderFormula).toHaveBeenCalledTimes(1);
    rerender(<InlineKatex {...props} element={{ ...element }} />);
    selection.selected = true;
    rerender(<InlineKatex {...props} />);
    selection.selected = false;
    rerender(<InlineKatex {...props} />);
    expect(renderFormula).toHaveBeenCalledTimes(1);
    selection.selected = true;
    selection.readonly = true;
    rerender(<InlineKatex {...props} />);
    expect(renderFormula).toHaveBeenCalledTimes(2);
    expect(container.querySelector('[data-formula]')).toBeTruthy();
  });
});
