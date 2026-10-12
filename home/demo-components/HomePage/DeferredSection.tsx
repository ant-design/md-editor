import React, { useEffect, useRef, useState } from 'react';
import { useSiteI18n } from '../../i18n';

interface DeferredSectionProps {
  load: () => Promise<{ default: React.ComponentType }>;
  minHeight: number;
  name: string;
}

/** Load demos shortly before they enter the viewport, keeping page scroll positions stable. */
const DeferredSection: React.FC<DeferredSectionProps> = ({
  load,
  minHeight,
  name,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [hasError, setHasError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const { locale } = useSiteI18n();

  useEffect(() => {
    const element = containerRef.current;
    if (!element || isNearViewport) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [isNearViewport]);

  useEffect(() => {
    if (!isNearViewport) return;
    let active = true;
    setHasError(false);
    load().then(
      (module) => {
        if (active) setComponent(() => module.default);
      },
      () => {
        if (active) setHasError(true);
      },
    );
    return () => {
      active = false;
    };
  }, [attempt, isNearViewport, load]);

  return (
    <div
      ref={containerRef}
      data-home-section={name}
      style={{ width: '100%', minHeight: Component ? undefined : minHeight }}
    >
      {Component ? (
        <Component />
      ) : hasError ? (
        <button type="button" onClick={() => setAttempt((value) => value + 1)}>
          {locale === 'zh-CN' ? '重新加载' : 'Retry loading'}
        </button>
      ) : null}
    </div>
  );
};

export default DeferredSection;
