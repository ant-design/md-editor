import { useCallback, useEffect, useRef, useState } from 'react';

/** Run finite demo updates on demand, cancelling the previous run on replay. */
export function useDemoReplay(onFrame: (markdown: string) => void, delay = 80) {
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const framesRef = useRef<Iterator<string> | undefined>(undefined);
  const [running, setRunning] = useState(false);

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = undefined;
    framesRef.current?.return?.();
    framesRef.current = undefined;
  }, []);

  const stop = useCallback(() => {
    cancel();
    setRunning(false);
  }, [cancel]);

  const start = useCallback(
    (frames: Iterable<string>) => {
      cancel();
      const iterator = frames[Symbol.iterator]();
      framesRef.current = iterator;
      setRunning(true);

      const next = () => {
        if (framesRef.current !== iterator) return;
        const frame = iterator.next();
        if (frame.done) {
          stop();
          return;
        }
        onFrameRef.current(frame.value);
        if (framesRef.current === iterator) {
          timerRef.current = setTimeout(next, delay);
        }
      };
      next();
    },
    [cancel, delay, stop],
  );

  useEffect(() => cancel, [cancel]);
  return { running, start, stop };
}

export function* markdownChunks(markdown: string, chunkSize = 128) {
  for (let end = chunkSize; end < markdown.length; end += chunkSize) {
    yield markdown.slice(0, end);
  }
  yield markdown;
}
