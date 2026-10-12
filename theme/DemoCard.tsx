import React, { useEffect, useRef, useState } from 'react';

export interface DemoCardProps {
  /** demo 稳定 ID（对应 /~demos/<demoId> 路由） */
  demoId: string;
  /** iframe 高度（dumi 的 iframe=540 语义） */
  height?: number;
  /** demo 容器背景，如 var(--main-bg-color) */
  background?: string;
  title?: string;
  description?: string;
}

const DEFAULT_DEMO_BG = 'var(--main-bg-color, #fff)';

function useNearViewport() {
  const containerRef = useRef<HTMLElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isNearViewport) return;

    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: '300px 0px' },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [isNearViewport]);

  return { containerRef, isNearViewport };
}

/**
 * iframe 加载独立 demo 路由页，外层只提供说明与代码操作。
 */
export function DemoCard({
  demoId,
  height = 480,
  background = DEFAULT_DEMO_BG,
  title,
  description,
}: DemoCardProps) {
  const [showSource, setShowSource] = useState(false);
  const { containerRef, isNearViewport } = useNearViewport();

  return (
    <section ref={containerRef} className="demo-card" data-demo-id={demoId}>
      <div className="demo-card__canvas" style={{ background, height }}>
        {isNearViewport && (
          <iframe
            src={`/~demos/${demoId}`}
            title={title ?? demoId}
            data-demo-frame={demoId}
            loading="lazy"
          />
        )}
      </div>
      <div className="demo-card__meta">
        {(title || description) && (
          <div className="demo-card__desc">
            {title && (
              <h5>
                <a href={`#/~demos/${demoId}`}>{title}</a>
              </h5>
            )}
            {description && <p>{description}</p>}
          </div>
        )}
        <button
          type="button"
          className="demo-card__action"
          onClick={() => setShowSource((v) => !v)}
          aria-label={showSource ? 'Collapse Code' : 'Expand Code'}
          aria-expanded={showSource}
        >
          {showSource ? '隐藏代码' : '查看代码'}
        </button>
      </div>
      {showSource && (
        <div className="demo-card__source">
          <a href={`/~demos/${demoId}`} target="_blank" rel="noreferrer">
            在新窗口打开该示例（源码见 docs/demos）
          </a>
        </div>
      )}
    </section>
  );
}
