import { act, cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RollingText } from '../RollingText';

const controls = vi.hoisted(() => ({
  start: vi.fn(() => Promise.resolve()),
  stop: vi.fn(),
  set: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    span: ({
      children,
      style,
    }: {
      children: React.ReactNode;
      style: React.CSSProperties;
    }) => <span style={style}>{children}</span>,
  },
  useAnimationControls: () => controls,
  useInView: () => true,
}));

let enterViewport: (visible: boolean) => void;

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
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

describe('hero rolling text', () => {
  it('reuses character nodes across cycles and stops replaying outside the viewport', async () => {
    const { container } = render(<RollingText text="首页" />);
    const firstCharacter = container.querySelector('[aria-hidden="true"]');
    expect(controls.start).not.toHaveBeenCalled();
    await act(async () => {
      enterViewport(true);
    });
    expect(controls.start).toHaveBeenCalledTimes(2);
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(controls.start).toHaveBeenCalledTimes(4);
    expect(container.querySelector('[aria-hidden="true"]')).toBe(
      firstCharacter,
    );
    act(() => enterViewport(false));
    controls.start.mockClear();
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    expect(controls.start).not.toHaveBeenCalled();
    expect(controls.stop).toHaveBeenCalledTimes(2);
  });

  it('keeps a supplementary Unicode character in one animation cell', () => {
    const { container } = render(<RollingText text="A🙂" />);
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  });

  it('renders plain readable text for reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const { container } = render(<RollingText text="首页" />);
    act(() => enterViewport(true));
    expect(container.textContent).toBe('首页');
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
    expect(controls.start).not.toHaveBeenCalled();
  });
});
