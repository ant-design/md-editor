import { act, cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MakeCanvasRevealEffect } from '..';
import { CardAnimationContext } from '../../../../CardAnimationContext';

interface TestCanvasContext {
  clearRect: ReturnType<typeof vi.fn>;
  fillRect: ReturnType<typeof vi.fn>;
  drawImage: ReturnType<typeof vi.fn>;
  fillStyle: string;
}

let enterViewport: (visible: boolean) => void;
let resize: () => void;
let frames: Map<number, FrameRequestCallback>;
let contexts: WeakMap<HTMLCanvasElement, TestCanvasContext>;
let nextFrame: number;

function drawFrame(time: number) {
  act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(time));
  });
}

function renderEffect(frontActive = true) {
  return render(
    <CardAnimationContext.Provider value={{ frontActive, backActive: false }}>
      <div>
        <MakeCanvasRevealEffect dotSize={1} animationSpeed={1} />
      </div>
    </CardAnimationContext.Provider>,
  );
}

beforeEach(() => {
  vi.useFakeTimers();
  frames = new Map();
  contexts = new WeakMap();
  nextFrame = 0;
  vi.spyOn(performance, 'now').mockReturnValue(0);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(120);
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(80);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
    function () {
      let context = contexts.get(this);
      if (!context) {
        context = {
          clearRect: vi.fn(),
          fillRect: vi.fn(),
          drawImage: vi.fn(),
          fillStyle: '',
        };
        contexts.set(this, context);
      }
      return context as unknown as CanvasRenderingContext2D;
    },
  );
  vi.mocked(HTMLCanvasElement.prototype.getContext).mockClear();
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
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      const id = ++nextFrame;
      frames.set(id, callback);
      return id;
    }),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((id: number) => frames.delete(id)),
  );
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('carousel particle animation', () => {
  it('does no canvas work before entering the viewport and pauses when it leaves', () => {
    renderEffect();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    act(() => enterViewport(true));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    drawFrame(1000);
    act(() => enterViewport(false));
    act(() => vi.advanceTimersByTime(1000));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(frames.size).toBe(0);
  });

  it('caches static dots and redraws only the flickering dots at six frames per second', () => {
    const { container } = renderEffect();
    act(() => enterViewport(true));
    drawFrame(1000);
    const canvas = container.querySelector('canvas')!;
    const context = contexts.get(canvas)!;
    expect(canvas.width).toBe(120);
    expect(canvas.height).toBe(80);
    expect(context.drawImage).toHaveBeenCalledTimes(1);
    expect(context.fillRect.mock.calls.length).toBeLessThan((60 * 40) / 3);
    act(() => vi.advanceTimersByTime(150));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(30));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
    drawFrame(1180);
    expect(context.drawImage).toHaveBeenCalledTimes(2);
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledTimes(2);
  });

  it('keeps an unchanged layout resize from restarting the reveal', () => {
    renderEffect();
    act(() => enterViewport(true));
    drawFrame(1000);
    act(() => resize());
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledTimes(2);
  });

  it('stops rendering when the page becomes hidden', () => {
    renderEffect();
    act(() => enterViewport(true));
    drawFrame(1000);
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    act(() => vi.advanceTimersByTime(1000));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(frames.size).toBe(0);
  });

  it('does no front-face work while the card shows its back', () => {
    renderEffect(false);
    act(() => enterViewport(true));
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(HTMLCanvasElement.prototype.getContext).not.toHaveBeenCalled();
  });

  it('draws a single settled frame for reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const { container } = renderEffect();
    act(() => enterViewport(true));
    drawFrame(16);
    expect(
      contexts.get(container.querySelector('canvas')!)!.drawImage,
    ).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(1000));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
  });
});
