import { RefObject, useEffect, useRef, useState } from 'react';

export interface UseIntersectionOnceOptions
  extends Omit<IntersectionObserverInit, 'root'> {
  root?: RefObject<Element | null> | Element | null;
}

export const useIntersectionOnce = <T extends Element>(
  targetRef: RefObject<T>,
  options: UseIntersectionOnceOptions = {},
) => {
  const { root, ...restOptions } = options;
  const [isIntersecting, setIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (isIntersecting) return;

    const element = targetRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIntersecting(true);
      return;
    }

    const resolvedRoot =
      root && 'current' in root ? root.current : (root as Element | null);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setIntersecting(true);
            observerRef.current?.disconnect();
          }
        });
      },
      { ...restOptions, root: resolvedRoot ?? null },
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [
    targetRef,
    restOptions.rootMargin,
    restOptions.threshold,
    root,
    isIntersecting,
  ]);

  return isIntersecting;
};
