import { useEffect, useState } from 'react';

interface AnimationElementRef {
  readonly current: Element | null;
}

/** Decorative animations only need work while their element and page are visible. */
export function useAnimationVisibility(ref: AnimationElementRef) {
  const [inViewport, setInViewport] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setInViewport(entry.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    const updateVisibility = () => {
      setPageVisible(document.visibilityState !== 'hidden');
    };
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () =>
      document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = () => setReducedMotion(query.matches);
    updateReducedMotion();

    // Safari versions supported by the site still expose the legacy listeners.
    if (query.addEventListener) {
      query.addEventListener('change', updateReducedMotion);
      return () => query.removeEventListener('change', updateReducedMotion);
    }
    query.addListener(updateReducedMotion);
    return () => query.removeListener(updateReducedMotion);
  }, []);

  return { isVisible: inViewport && pageVisible, reducedMotion };
}
