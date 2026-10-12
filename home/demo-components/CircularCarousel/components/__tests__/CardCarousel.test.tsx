import { act, cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CardAnimationContext } from '../CardAnimationContext';
import { CardCarousel } from '../CardCarousel';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      animate,
      children,
    }: {
      animate: { x: number };
      children: React.ReactNode;
    }) => <div data-x={animate.x}>{children}</div>,
  },
}));

vi.mock('../cardData', () => ({
  getCardsByFeatureId: () =>
    ['A', 'B', 'C'].map((id) => ({ id, component: id })),
}));

let enterViewport: (visible: boolean) => void;

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback) {
        enterViewport = (visible) =>
          callback(
            [{ isIntersecting: visible } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
      }
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function cardPosition() {
  return screen.getByText('A').closest('[data-x]')?.getAttribute('data-x');
}

describe('back-face carousel activity', () => {
  it('advances visible cards every two seconds and pauses when outside the viewport', () => {
    render(<CardCarousel />);
    act(() => vi.advanceTimersByTime(2000));
    expect(cardPosition()).toBe('300');
    act(() => enterViewport(true));
    act(() => vi.advanceTimersByTime(2000));
    expect(cardPosition()).toBe('173');
    act(() => enterViewport(false));
    act(() => vi.advanceTimersByTime(4000));
    expect(cardPosition()).toBe('173');
  });

  it('does not advance a mounted back face while it is rotated away', () => {
    const { rerender } = render(
      <CardAnimationContext.Provider
        value={{ frontActive: true, backActive: false }}
      >
        <CardCarousel />
      </CardAnimationContext.Provider>,
    );
    act(() => enterViewport(true));
    act(() => vi.advanceTimersByTime(2000));
    expect(cardPosition()).toBe('300');
    rerender(
      <CardAnimationContext.Provider
        value={{ frontActive: false, backActive: true }}
      >
        <CardCarousel />
      </CardAnimationContext.Provider>,
    );
    act(() => vi.advanceTimersByTime(2000));
    expect(cardPosition()).toBe('173');
    rerender(
      <CardAnimationContext.Provider
        value={{ frontActive: true, backActive: false }}
      >
        <CardCarousel />
      </CardAnimationContext.Provider>,
    );
    act(() => vi.advanceTimersByTime(4000));
    expect(cardPosition()).toBe('173');
  });

  it('keeps the cards still when reduced motion is requested', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    render(<CardCarousel />);
    act(() => enterViewport(true));
    act(() => vi.advanceTimersByTime(4000));
    expect(cardPosition()).toBe('300');
  });
});
