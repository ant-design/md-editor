import { GripVertical } from '@sofa-design/icons';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStyle } from './actionItemBoxStyle';

type KeyedElement = React.ReactElement & { key: React.Key };

export type ActionItemContainerProps = {
  children: KeyedElement | KeyedElement[];
  size?: 'small' | 'large' | 'default';
  style?: React.CSSProperties;
};

export const ActionItemContainer = (props: ActionItemContainerProps) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const basePrefixCls = getPrefixCls('agent-chat-action-item-box');
  const { wrapSSR, hashId } = useStyle(basePrefixCls);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [isIndicatorHover, setIsIndicatorHover] = useState(false);
  const [showOverflowPopup, setShowOverflowPopup] = useState(false);
  const [popupPos, setPopupPos] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const isHandlePressRef = useRef(false);

  // horizontal drag-to-scroll state (main container only)
  const isPanningRef = useRef(false);
  const panStartXRef = useRef(0);
  const panStartScrollLeftRef = useRef(0);
  const hasPanMovedRef = useRef(false);
  const panIntentRef = useRef(false);

  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    // ignore common interactive elements
    if (
      target.closest(
        'button, a, input, textarea, select, [role="button"], [contenteditable="true"], [data-no-pan]',
      )
    ) {
      return true;
    }
    return false;
  };

  type ChildEntry = { key: React.Key | null; node: React.ReactNode };
  const toEntries = (nodes: React.ReactNode): ChildEntry[] => {
    const array = React.Children.toArray(nodes);
    return array.map((node) => ({ key: (node as any)?.key ?? null, node }));
  };

  const [ordered, setOrdered] = useState<ChildEntry[]>(() =>
    toEntries(props.children),
  );

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    let hasMissingKey = false;
    React.Children.forEach(props.children as any, (child) => {
      if (!React.isValidElement(child)) return;
      if (child.key === null) {
        hasMissingKey = true;
      }
    });
    if (hasMissingKey) {
      throw new Error(
        'ActionItemContainer: all children must include an explicit `key` prop.',
      );
    }
  }, [props.children]);

  // keep ordered list in sync when children change; preserve existing order by key when possible
  useEffect(() => {
    const incoming = toEntries(props.children);
    const existingKeys = new Set(ordered.map((e) => e.key));
    // map existing order
    const merged: ChildEntry[] = [];
    // keep items in previous order for keys that still exist
    for (const e of ordered) {
      if (incoming.find((i) => i.key === e.key)) {
        // replace node to reflect latest props while keeping position
        const updated = incoming.find((i) => i.key === e.key)!;
        merged.push({ key: e.key, node: updated.node });
      }
    }
    // append any new items not seen before
    for (const e of incoming) {
      if (!existingKeys.has(e.key)) {
        merged.push(e);
      }
    }
    // if counts don't match (e.g., many changes), fallback to incoming order
    setOrdered(merged.length === incoming.length ? merged : incoming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.children]);

  // No need to compute hidden index; popup renders all children

  const computePopupPosition = () => {
    if (typeof window === 'undefined') return;
    const el = indicatorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const popupWidth = popupRef.current?.offsetWidth || 320;
    const popupHeight = popupRef.current?.offsetHeight || 220;
    const gap = 8;
    let left = rect.right - popupWidth;
    let top = rect.top - popupHeight - gap;
    // Keep within viewport horizontally
    if (left < 8) left = 8;
    if (left + popupWidth > window.innerWidth - 8)
      left = window.innerWidth - 8 - popupWidth;
    // If not enough space above, place below
    if (top < 8)
      top = Math.min(rect.bottom + gap, window.innerHeight - popupHeight - 8);
    setPopupPos({ left, top });
  };

  useEffect(() => {
    if (!showOverflowPopup) return;
    // position once now, then again after the popup renders to measure actual size
    computePopupPosition();
    requestAnimationFrame(() => computePopupPosition());
    // in case layout/ fonts settle next frame again
    requestAnimationFrame(() =>
      requestAnimationFrame(() => computePopupPosition()),
    );
    if (typeof window === 'undefined') return;
    const onScroll = () => computePopupPosition();
    const onResize = () => computePopupPosition();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    // observe popup size/content changes to keep position in sync (auto width)
    let ro: ResizeObserver | undefined;
    const popupEl = popupRef.current;
    if ('ResizeObserver' in window && popupEl) {
      ro = new ResizeObserver(() => computePopupPosition());
      ro.observe(popupEl);
    }
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      // Ignore clicks on the indicator
      if (indicatorRef.current && indicatorRef.current.contains(target)) return;
      // Keep popup open when clicking inside the popup so item onClick can run
      if (popupRef.current && popupRef.current.contains(target)) return;
      setShowOverflowPopup(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      if (ro && popupEl) ro.disconnect();
      document.removeEventListener('mousedown', onDocClick);
    };
  }, [showOverflowPopup]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', String(index));
    } catch {
      console.error(e);
    }
    setDraggingIndex(index);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (overIndex !== index) setOverIndex(index);
  };

  const reorder = (list: ChildEntry[], from: number, to: number) => {
    const next = list.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const from = draggingIndex;
    if (from === null) return;
    const to = index;
    if (from === to) return;
    setOrdered((prev) => reorder(prev, from, to));
    setDraggingIndex(null);
    setOverIndex(null);
    isHandlePressRef.current = false;
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
    setOverIndex(null);
    isHandlePressRef.current = false;
  };

  const isHandleTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    const handle = target.closest(`.${basePrefixCls}-drag-handle`);
    return !!handle;
  };

  return wrapSSR(
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: 8,
        backgroundColor: 'transparent',
        overflowX: 'auto',
        overflowY: 'visible',
        position: 'relative',
        WebkitOverflowScrolling: 'touch',
        ...props.style,
      }}
      className={classNames(
        `${basePrefixCls}-container`,
        {
          [`${basePrefixCls}-container-${props.size}`]: props.size,
          [`${basePrefixCls}-container-no-hover`]: isIndicatorHover,
        },
        hashId,
      )}
      onPointerDown={(e) => {
        const el = containerRef.current;
        if (!el) return;
        if (e.button !== 0) return;
        // ignore if clicking on the overflow indicator area
        if (
          indicatorRef.current &&
          indicatorRef.current.contains(e.target as Node)
        )
          return;
        // if clicking on an interactive child, don't pan
        if (isInteractiveTarget(e.target)) return;
        panIntentRef.current = true;
        hasPanMovedRef.current = false;
        panStartXRef.current = e.clientX;
        panStartScrollLeftRef.current = el.scrollLeft;
      }}
      onPointerMove={(e) => {
        const el = containerRef.current;
        if (!el) return;
        if (!isPanningRef.current && panIntentRef.current) {
          const dx = e.clientX - panStartXRef.current;
          if (Math.abs(dx) > 6) {
            isPanningRef.current = true;
            hasPanMovedRef.current = true;
            try {
              el.setPointerCapture(e.pointerId);
            } catch {}
          }
        }
        if (isPanningRef.current) {
          const dx = e.clientX - panStartXRef.current;
          el.scrollLeft = panStartScrollLeftRef.current - dx;
          e.preventDefault();
        }
      }}
      onPointerUp={(e) => {
        const el = containerRef.current;
        if (!el) return;
        panIntentRef.current = false;
        if (isPanningRef.current) {
          isPanningRef.current = false;
          try {
            el.releasePointerCapture(e.pointerId);
          } catch {}
        }
      }}
      onPointerCancel={() => {
        isPanningRef.current = false;
        panIntentRef.current = false;
      }}
      onWheel={(e) => {
        const el = containerRef.current;
        if (!el) return;
        // translate vertical wheel into horizontal scroll
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          el.scrollLeft += e.deltaY;
        }
      }}
      onClick={(e) => {
        // prevent accidental click when performing a pan
        if (hasPanMovedRef.current) {
          e.preventDefault();
          e.stopPropagation();
          hasPanMovedRef.current = false;
        }
      }}
    >
      {ordered.map((entry) => (
        <React.Fragment key={entry.key as any}>{entry.node}</React.Fragment>
      ))}
      <div
        className={classNames(
          `${basePrefixCls}-container-overflow-container`,
          hashId,
        )}
      >
        <div
          className={classNames(
            `${basePrefixCls}-container-overflow-container-indicator`,
            hashId,
          )}
          ref={indicatorRef}
          onMouseEnter={() => setIsIndicatorHover(true)}
          onMouseLeave={() => setIsIndicatorHover(false)}
          onClick={() => setShowOverflowPopup((v) => !v)}
        >
          {/* <MicFill /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            version="1.1"
          >
            <defs>
              <clipPath id="overflow_menu_clip">
                <rect x="0" y="0" width="16" height="16" rx="0" />
              </clipPath>
            </defs>
            <g clipPath="url(#overflow_menu_clip)">
              <g>
                <path
                  d="M2.666667,11.333333492279053L13.3333,11.333333492279053C13.7015,11.333333492279053,14,11.631813492279052,14,12.000003492279053C14,12.368193492279053,13.7015,12.666663492279053,13.3333,12.666663492279053L2.666667,12.666663492279053C2.298477,12.666663492279053,2,12.368193492279053,2,12.000003492279053C2,11.631813492279052,2.298477,11.333333492279053,2.666667,11.333333492279053ZM2.666667,3.3333334922790527L13.3333,3.3333334922790527C13.7015,3.3333334922790527,14,3.631810492279053,14,4.000000492279053C14,4.368193492279053,13.7015,4.666663492279053,13.3333,4.666663492279053L2.666667,4.666663492279053C2.298477,4.666663492279053,2,4.368193492279053,2,4.000000492279053C2,3.631810492279053,2.298477,3.3333334922790527,2.666667,3.3333334922790527ZM2.666667,7.333333492279053L13.3333,7.333333492279053C13.7015,7.333333492279053,14,7.631813492279052,14,8.000003492279053C14,8.368193492279053,13.7015,8.666663492279053,13.3333,8.666663492279053L2.666667,8.666663492279053C2.298477,8.666663492279053,2,8.368193492279053,2,8.000003492279053C2,7.631813492279052,2.298477,7.333333492279053,2.666667,7.333333492279053Z"
                  fillRule="evenodd"
                  fill="#545D6D"
                  fillOpacity="0.8"
                />
              </g>
            </g>
          </svg>
        </div>
        {showOverflowPopup && popupPos && typeof document !== 'undefined'
          ? createPortal(
              <div
                className={classNames(
                  `${basePrefixCls}-container-overflow-container-popup`,
                  hashId,
                )}
                ref={popupRef}
                style={{
                  position: 'fixed',
                  left: popupPos.left,
                  top: popupPos.top,
                  zIndex: 1000,
                }}
              >
                {(() => {
                  return ordered.length > 0
                    ? ordered.map((entry, index) => (
                        <div
                          key={entry.key as any}
                          className={classNames(
                            `${basePrefixCls}-container-overflow-container-popup-item`,
                            hashId,
                            {
                              [`${basePrefixCls}-dragging`]:
                                draggingIndex === index,
                              [`${basePrefixCls}-drag-over`]:
                                overIndex === index,
                            },
                          )}
                          draggable
                          onMouseDown={(evt) => {
                            const isHandle = isHandleTarget(evt.target);
                            isHandlePressRef.current = isHandle;
                            if (isHandle) {
                              setDraggingIndex(index);
                            } else {
                              setDraggingIndex(null);
                            }
                          }}
                          onMouseUp={() => {
                            if (draggingIndex === null) {
                              isHandlePressRef.current = false;
                            }
                          }}
                          onDragStart={(evt) => {
                            handleDragStart(evt, index);
                          }}
                          onDragOver={(evt) => handleDragOver(evt, index)}
                          onDrop={(evt) => handleDrop(evt, index)}
                          onDragEnd={handleDragEnd}
                        >
                          <GripVertical
                            className={classNames(
                              `${basePrefixCls}-drag-handle`,
                              hashId,
                            )}
                            onMouseDown={(evt) => {
                              // Explicitly flag handle press to allow parent dragstart
                              isHandlePressRef.current = true;
                              setDraggingIndex(index);
                              evt.stopPropagation();
                            }}
                          />
                          <div draggable={false}>{entry.node}</div>
                        </div>
                      ))
                    : null;
                })()}
              </div>,
              document.body,
            )
          : null}
      </div>
    </div>,
  );
};

ActionItemContainer.displayName = 'ActionItemContainer';
