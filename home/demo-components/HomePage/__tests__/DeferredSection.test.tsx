import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DeferredSection from '../DeferredSection';

describe('homepage deferred sections', () => {
  const callbacks: IntersectionObserverCallback[] = [];
  const disconnect = vi.fn();
  const observe = vi.fn();

  beforeEach(() => {
    callbacks.length = 0;
    disconnect.mockClear();
    observe.mockClear();
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(function (callback: IntersectionObserverCallback) {
        callbacks.push(callback);
        return { observe, disconnect };
      }),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  const enterViewport = async () => {
    await act(async () => {
      callbacks[0](
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
  };

  it('reserves the section height without loading offscreen demos', () => {
    const load = vi.fn();
    const { container } = render(
      <DeferredSection load={load} minHeight={1237} name="enhance" />,
    );

    expect(load).not.toHaveBeenCalled();
    expect(container.firstChild).toHaveStyle({ minHeight: '1237px' });
    expect(container.firstChild).toHaveAttribute(
      'data-home-section',
      'enhance',
    );
    expect(observe).toHaveBeenCalledOnce();
    expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      rootMargin: '400px 0px',
    });
  });

  it('loads near the viewport and preserves the mounted demo on later rerenders', async () => {
    const load = vi.fn().mockResolvedValue({
      default: () => <input aria-label="Demo input" />,
    });
    const { container, rerender } = render(
      <DeferredSection load={load} minHeight={1237} name="enhance" />,
    );

    await enterViewport();
    fireEvent.change(screen.getByLabelText('Demo input'), {
      target: { value: 'draft' },
    });
    rerender(<DeferredSection load={load} minHeight={1237} name="enhance" />);

    expect(load).toHaveBeenCalledOnce();
    expect(screen.getByLabelText('Demo input')).toHaveValue('draft');
    expect(container.firstChild).not.toHaveStyle({ minHeight: '1237px' });
    expect(disconnect).toHaveBeenCalled();
  });

  it('supports retrying a failed section request', async () => {
    const load = vi
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValue({ default: () => <div>Loaded demo</div> });
    render(<DeferredSection load={load} minHeight={788} name="showroom" />);

    await enterViewport();
    fireEvent.click(await screen.findByRole('button', { name: '重新加载' }));

    expect(await screen.findByText('Loaded demo')).toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('loads in browsers without IntersectionObserver', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const load = vi.fn().mockResolvedValue({
      default: () => <div>Fallback demo</div>,
    });
    render(<DeferredSection load={load} minHeight={788} name="showroom" />);

    expect(await screen.findByText('Fallback demo')).toBeInTheDocument();
  });

  it('does not request interactive demos during server rendering', () => {
    const load = vi.fn();
    const html = renderToString(
      <DeferredSection load={load} minHeight={1878} name="support" />,
    );

    expect(load).not.toHaveBeenCalled();
    expect(html).toContain('min-height:1878px');
  });
});
