import { GripVertical,Menu } from '@sofa-design/icons';
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
  showMenu?: boolean;
  menuDisabled?: boolean;
};

export const ActionItemContainer = (props: ActionItemContainerProps) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const basePrefixCls = getPrefixCls('agent-chat-action-item-box');
  const { wrapSSR, hashId } = useStyle(basePrefixCls);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
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
        'button, a, input, textarea, select, [role="button"], [contenteditable="true"], [data-no-pan]'
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

  const [ordered, setOrdered] = useState<ChildEntry[]>(() => toEntries(props.children));

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
    <div style={{ width: '100%' }}>
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 'calc(100% - 20px)',
          gap: 8,
          backgroundColor: 'transparent',
          overflow: 'visible',
          position: 'relative',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          ...props.style
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
          const el = scrollRef.current;
          if (!el) return;
          if (e.button !== 0) return;
          // ignore if clicking on the overflow indicator area
          if (indicatorRef.current && indicatorRef.current.contains(e.target as Node)) return;
          // if clicking on an interactive child, don't pan
          if (isInteractiveTarget(e.target)) return;
          panIntentRef.current = true;
          hasPanMovedRef.current = false;
          panStartXRef.current = e.clientX;
          panStartScrollLeftRef.current = el.scrollLeft;
        }}
        onPointerMove={(e) => {
          const el = scrollRef.current;
          if (!el) return;
          if (!isPanningRef.current && panIntentRef.current) {
            const dx = e.clientX - panStartXRef.current;
            if (Math.abs(dx) > 6) {
              isPanningRef.current = true;
              hasPanMovedRef.current = true;
              try { el.setPointerCapture(e.pointerId); } catch { }
            }
          }
          if (isPanningRef.current) {
            const dx = e.clientX - panStartXRef.current;
            el.scrollLeft = panStartScrollLeftRef.current - dx;
            if (e.cancelable) e.preventDefault();
            e.stopPropagation();
          }
        }}
        onPointerUp={(e) => {
          const el = scrollRef.current;
          if (!el) return;
          panIntentRef.current = false;
          if (isPanningRef.current) {
            isPanningRef.current = false;
            try { el.releasePointerCapture(e.pointerId); } catch { }
          }
        }}
        onPointerCancel={() => {
          isPanningRef.current = false;
          panIntentRef.current = false;
        }}
        onWheel={(e) => {
          const el = scrollRef.current;
          if (!el) return;
          // Map wheel to horizontal scrolling: use the dominant axis
          const horizontalDelta =
            Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
          if (horizontalDelta !== 0) {
            el.scrollLeft += horizontalDelta;
          }
          // Always stop propagation to avoid bubbling to parent scrollers
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
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
        <div
          ref={scrollRef}
          className={classNames(`${basePrefixCls}-scroll`, hashId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: 8,
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: 'pan-x',
          }}
        >{ordered.map((entry) => (
          <React.Fragment key={entry.key as any}>{entry.node}</React.Fragment>
        ))}</div>
        {props.showMenu !== false && (
          <div className={classNames(`${basePrefixCls}-overflow-container`, hashId)}>
          <div
            className={classNames(`${basePrefixCls}-overflow-container-indicator`, hashId)}
            ref={indicatorRef}
          >
            <div className={classNames(`${basePrefixCls}-overflow-container-placeholder`, hashId)}></div>
            <div
              className={classNames(
                `${basePrefixCls}-overflow-container-menu`,
                hashId,
                {
                  [`${basePrefixCls}-overflow-container-menu-disabled`]: props.menuDisabled,
                }
              )}
              onMouseEnter={() => !props.menuDisabled && setIsIndicatorHover(true)}
              onMouseLeave={() => !props.menuDisabled && setIsIndicatorHover(false)}
              onClick={() => !props.menuDisabled && setShowOverflowPopup((v) => !v)}
            >
              <Menu />
              <div>
              {props.menuDisabled}
              </div>
            </div>
          </div>
        {showOverflowPopup && popupPos && typeof document !== 'undefined'
          ? createPortal(
            <div
              className={classNames(
                `${basePrefixCls}-overflow-container-popup`,
                hashId,
              )}
              ref={popupRef}
              style={{ position: 'fixed', left: popupPos.left, top: popupPos.top, zIndex: 1000 }}
              onWheel={(e) => {
                if (e.cancelable) e.preventDefault();
                e.stopPropagation();
              }}
            >
              {(() => {
                return ordered.length > 0
                  ? ordered.map((entry, index) => (
                    <div
                      key={entry.key as any}
                      className={classNames(
                        `${basePrefixCls}-overflow-container-popup-item`,
                        hashId,
                        {
                          [`${basePrefixCls}-dragging`]: draggingIndex === index,
                          [`${basePrefixCls}-drag-over`]: overIndex === index,
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
                        className={classNames(`${basePrefixCls}-drag-handle`, hashId)}
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
        )}
      </div>
    </div>
  );
};

ActionItemContainer.displayName = 'ActionItemContainer';
