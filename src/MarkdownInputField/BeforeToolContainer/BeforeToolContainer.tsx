import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStyle } from './actionItemBoxStyle';

export type ActionItemContainerProps = {
  children: React.ReactElement | React.ReactElement[];
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
  const [popupPos, setPopupPos] = useState<{ left: number; top: number } | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const isHandlePressRef = useRef(false);

  type ChildEntry = { key: React.Key | null; node: React.ReactNode };
  const toEntries = (nodes: React.ReactNode): ChildEntry[] => {
    const array = React.Children.toArray(nodes);
    return array.map((node) => ({ key: (node as any)?.key ?? null, node }));
  };

  const [ordered, setOrdered] = useState<ChildEntry[]>(() => toEntries(props.children));
  
  useEffect(() => {
    let hasMissingKey = false;
    React.Children.forEach(props.children as any, (child) => {
      if (!React.isValidElement(child)) return;
      if (child.key === null) {
        hasMissingKey = true;
      }
    });
    if (hasMissingKey) {
      throw new Error('ActionItemContainer: all children must include an explicit `key` prop.');
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
    if (left + popupWidth > window.innerWidth - 8) left = window.innerWidth - 8 - popupWidth;
    // If not enough space above, place below
    if (top < 8) top = Math.min(rect.bottom + gap, window.innerHeight - popupHeight - 8);
    setPopupPos({ left, top });
  };

  useEffect(() => {
    if (!showOverflowPopup) return;
    // position once now, then again after the popup renders to measure actual size
    computePopupPosition();
    requestAnimationFrame(() => computePopupPosition());
    // in case layout/ fonts settle next frame again
    requestAnimationFrame(() => requestAnimationFrame(() => computePopupPosition()));
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', String(index));
    } catch {}
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
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
        overflowX: 'hidden',
        overflowY: 'visible',
        position: 'relative',
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
    >
      {ordered.map((entry) => (
        <React.Fragment key={entry.key as any}>{entry.node}</React.Fragment>
      ))}
      <div className={classNames(`${basePrefixCls}-container-overflow-container`, hashId)}>
          <div
            className={classNames(`${basePrefixCls}-container-overflow-container-indicator`, hashId)}
            ref={indicatorRef}
            onMouseEnter={() => setIsIndicatorHover(true)}
            onMouseLeave={() => setIsIndicatorHover(false)}
            onClick={() => setShowOverflowPopup((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="none"
              version="1.1"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              className={classNames(
                `${basePrefixCls}-container-overflow-container-indicator-icon`,
                hashId,
              )}
            >
              <defs>
                <clipPath id="master_svg0_3837_038771/548_27703/548_27350/548_27124">
                  <rect x="0" y="0" width="16" height="16" rx="0" />
                </clipPath>
              </defs>
              <g clipPath="url(#master_svg0_3837_038771/548_27703/548_27350/548_27124)">
                <g>
                  <path
                    d="M2.666667,11.333333492279053L13.3333,11.333333492279053C13.7015,11.333333492279053,14,11.631813492279052,14,12.000003492279053C14,12.368193492279053,13.7015,12.666663492279053,13.3333,12.666663492279053L2.666667,12.666663492279053C2.298477,12.666663492279053,2,12.368193492279053,2,12.000003492279053C2,11.631813492279052,2.298477,11.333333492279053,2.666667,11.333333492279053ZM2.666667,3.3333334922790527L13.3333,3.3333334922790527C13.7015,3.3333334922790527,14,3.631810492279053,14,4.000000492279053C14,4.368193492279053,13.7015,4.666663492279053,13.3333,4.666663492279053L2.666667,4.666663492279053C2.298477,4.666663492279053,2,4.368193492279053,2,4.000000492279053C2,3.631810492279053,2.298477,3.3333334922790527,2.666667,3.3333334922790527ZM2.666667,7.333333492279053L13.3333,7.333333492279053C13.7015,7.333333492279053,14,7.631813492279052,14,8.000003492279053C14,8.368193492279053,13.7015,8.666663492279053,13.3333,8.666663492279053L2.666667,8.666663492279053C2.298477,8.666663492279053,2,8.368193492279053,2,8.000003492279053C2,7.631813492279052,2.298477,7.333333492279053,2.666667,7.333333492279053Z"
                    fillRule="evenodd"
                    fill="#767E8B"
                    fillOpacity="1"
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
                  style={{ position: 'fixed', left: popupPos.left, top: popupPos.top, zIndex: 1000 }}
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
                                [`${basePrefixCls}-dragging`]: draggingIndex === index,
                                [`${basePrefixCls}-drag-over`]: overIndex === index,
                              },
                            )}
                            draggable={isHandlePressRef.current && draggingIndex === index}
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
                              if (!isHandlePressRef.current && !isHandleTarget(evt.target)) {
                                evt.preventDefault();
                                return;
                              }
                              handleDragStart(evt, index);
                            }}
                            onDragOver={(evt) => handleDragOver(evt, index)}
                            onDrop={(evt) => handleDrop(evt, index)}
                            onDragEnd={handleDragEnd}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              fill="none"
                              version="1.1"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              className={classNames(`${basePrefixCls}-drag-handle`, hashId)}
                              onMouseDown={(evt) => {
                                // Explicitly flag handle press to allow parent dragstart
                                isHandlePressRef.current = true;
                                setDraggingIndex(index);
                                evt.stopPropagation();
                              }}
                            >
                              <defs>
                                <clipPath id="master_svg0_3987_076835/1_00870">
                                  <rect x="0" y="0" width="14" height="14" rx="0" />
                                </clipPath>
                              </defs>
                              <g clipPath="url(#master_svg0_3987_076835/1_00870)">
                                <g>
                                  <path
                                    d="M6.416663015441895,7C6.416663015441895,7.64433,5.8943330154418945,8.16667,5.250003015441894,8.16667C4.605667015441894,8.16667,4.0833330154418945,7.64433,4.0833330154418945,7C4.0833330154418945,6.35567,4.605667015441894,5.83333,5.250003015441894,5.83333C5.8943330154418945,5.83333,6.416663015441895,6.35567,6.416663015441895,7ZM6.416663015441895,2.91667C6.416663015441895,3.561,5.8943330154418945,4.08333,5.250003015441894,4.08333C4.605667015441894,4.08333,4.0833330154418945,3.561,4.0833330154418945,2.91667C4.0833330154418945,2.272335,4.605667015441894,1.75,5.250003015441894,1.75C5.8943330154418945,1.75,6.416663015441895,2.272335,6.416663015441895,2.91667ZM6.416663015441895,11.08333C6.416663015441895,11.72766,5.8943330154418945,12.25,5.250003015441894,12.25C4.605667015441894,12.25,4.0833330154418945,11.72766,4.0833330154418945,11.08333C4.0833330154418945,10.439,4.605667015441894,9.91667,5.250003015441894,9.91667C5.894333015441894,9.91667,6.416663015441895,10.439,6.416663015441895,11.08333ZM9.916663015441895,7C9.916663015441895,7.64433,9.394333015441894,8.16667,8.750003015441894,8.16667C8.105663015441895,8.16667,7.5833330154418945,7.64433,7.5833330154418945,7C7.5833330154418945,6.35567,8.105663015441895,5.83333,8.750003015441894,5.83333C9.394333015441894,5.83333,9.916663015441895,6.35567,9.916663015441895,7ZM9.916663015441895,2.91667C9.916663015441895,3.561,9.394333015441894,4.08333,8.750003015441894,4.08333C8.105663015441895,4.08333,7.5833330154418945,3.561,7.5833330154418945,2.91667C7.5833330154418945,2.272335,8.105663015441895,1.75,8.750003015441894,1.75C9.394333015441894,1.75,9.916663015441895,2.272335,9.916663015441895,2.91667ZM9.916663015441895,11.08333C9.916663015441895,11.72766,9.394333015441894,12.25,8.750003015441894,12.25C8.105663015441895,12.25,7.5833330154418945,11.72766,7.5833330154418945,11.08333C7.5833330154418945,10.439,8.105663015441895,9.91667,8.750003015441894,9.91667C9.394333015441894,9.91667,9.916663015441895,10.439,9.916663015441895,11.08333Z"
                                    fill="#505C71"
                                    fillOpacity="0.42"
                                    style={{ mixBlendMode: 'normal' }}
                                  />
                                </g>
                              </g>
                            </svg>
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


