import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MermaidApi } from '../types';
import { useMermaidRender } from '../useMermaidRender';
import { loadMermaid, renderSvgToContainer } from '../utils';

vi.mock('../utils', async () => ({
  ...(await vi.importActual('../utils')),
  loadMermaid: vi.fn(),
  renderSvgToContainer: vi.fn(),
  cleanupTempElement: vi.fn(),
}));

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
};
const advance = () => act(() => vi.advanceTimersByTimeAsync(100));

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Mermaid request ownership', () => {
  it('does not parse an obsolete source after loading the library', async () => {
    const loading = deferred<MermaidApi>();
    const render = vi.fn(async () => ({ svg: '<svg />' }));
    vi.mocked(loadMermaid).mockReturnValue(loading.promise);
    const divRef = { current: document.createElement('div') };
    const { rerender, result } = renderHook(
      ({ code }) => useMermaidRender(code, divRef, 'diagram', true),
      { initialProps: { code: 'old source' } },
    );
    await advance();
    rerender({ code: 'new source' });
    await advance();
    await act(async () => {
      loading.resolve({ render } as unknown as MermaidApi);
    });
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith('diagram', 'new source');
    expect(result.current.renderedCode).toBe('new source');
  });

  it('does not parse after unmount while the library is loading', async () => {
    const loading = deferred<MermaidApi>();
    const render = vi.fn(async () => ({ svg: '<svg />' }));
    vi.mocked(loadMermaid).mockReturnValue(loading.promise);
    const { unmount } = renderHook(() =>
      useMermaidRender('source', { current: null }, 'diagram', true),
    );
    await advance();
    unmount();
    await act(async () => {
      loading.resolve({ render } as unknown as MermaidApi);
    });
    expect(render).not.toHaveBeenCalled();
  });

  it('keeps each shared API theme active until its render settles', async () => {
    const first = deferred<{ svg: string }>();
    let activeColor = '';
    const initialize = vi.fn((config) => {
      activeColor = config.themeVariables.primaryColor;
    });
    const render = vi.fn(async (id: string) => {
      if (id === 'first' && render.mock.calls.length === 1) {
        await first.promise;
      }
      return { svg: `<svg>${activeColor}</svg>` };
    });
    vi.mocked(loadMermaid).mockResolvedValue({
      initialize,
      render,
    } as unknown as MermaidApi);
    const refA = { current: document.createElement('div') };
    const refB = { current: document.createElement('div') };
    const { rerender } = renderHook(
      ({ code }) => {
        useMermaidRender(code, refA, 'first', true, {
          colorPrimary: '#ff0000',
        });
        useMermaidRender('second', refB, 'second', true, {
          colorPrimary: '#0000ff',
        });
      },
      { initialProps: { code: 'first' } },
    );
    await advance();
    expect(initialize).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledTimes(1);
    await act(async () => first.resolve({ svg: '' }));
    expect(renderSvgToContainer).toHaveBeenCalledWith(
      '<svg>#ff0000</svg>',
      refA.current,
    );
    expect(renderSvgToContainer).toHaveBeenCalledWith(
      '<svg>#0000ff</svg>',
      refB.current,
    );
    rerender({ code: 'updated first' });
    await advance();
    expect(renderSvgToContainer).toHaveBeenLastCalledWith(
      '<svg>#ff0000</svg>',
      refA.current,
    );
  });

  it('does not restore an earlier request when source changes away and back', async () => {
    const first = deferred<{ svg: string }>();
    const render = vi
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockResolvedValue({ svg: '<svg>current</svg>' });
    vi.mocked(loadMermaid).mockResolvedValue({
      render,
    } as unknown as MermaidApi);
    const ref = { current: document.createElement('div') };
    const { rerender } = renderHook(
      ({ code }) => useMermaidRender(code, ref, 'diagram', true),
      { initialProps: { code: 'A' } },
    );
    await advance();
    rerender({ code: 'B' });
    await advance();
    rerender({ code: 'A' });
    await advance();
    await act(async () => first.resolve({ svg: '<svg>obsolete</svg>' }));
    expect(render).toHaveBeenCalledTimes(2);
    expect(renderSvgToContainer).toHaveBeenCalledTimes(1);
    expect(renderSvgToContainer).toHaveBeenCalledWith(
      '<svg>current</svg>',
      ref.current,
    );
  });
});
