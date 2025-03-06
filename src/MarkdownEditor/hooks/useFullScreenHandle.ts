import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface FullScreenHandle {
  active: boolean;
  enter: () => Promise<void>;
  exit: () => Promise<void>;
  node: React.MutableRefObject<HTMLDivElement | null>;
}
export function useFullScreenHandle(): FullScreenHandle {
  const [active, setActive] = useState<boolean>(false);
  const node = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleChange = async () => {
      setActive(document.fullscreenElement === node.current);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const enter = useCallback(async () => {
    if (document.fullscreenElement) {
      return document.exitFullscreen().then(() => {
        return node.current?.requestFullscreen();
      });
    } else if (node.current) {
      return node.current?.requestFullscreen();
    }
  }, []);

  const exit = useCallback(async () => {
    if (document.fullscreenElement === node.current) {
      return document.exitFullscreen();
    }
    return Promise.resolve();
  }, []);

  return useMemo(
    () => ({
      active,
      enter,
      exit,
      node,
    }),
    [active, enter, exit],
  );
}
