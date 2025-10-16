import { GripVertical, Menu } from '@sofa-design/icons';
import { ConfigProvider, Popover } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
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
  const [isIndicatorHover, setIsIndicatorHover] = useState(false);
  const [showOverflowPopup, setShowOverflowPopup] = useState(false);
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
        // width: 'calc(100% - 16px)',
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
        // if (e.cancelable) e.preventDefault();
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
        <div className={classNames(`${basePrefixCls}-overflow-container`, hashId)} data-no-pan>
          <div className={classNames(`${basePrefixCls}-overflow-container-indicator`, hashId)}>
            <div className={classNames(`${basePrefixCls}-overflow-container-placeholder`, hashId)}></div>
            <Popover
              open={showOverflowPopup}
              onOpenChange={(visible) => !props.menuDisabled && setShowOverflowPopup(visible)}
              trigger="click"
              placement="topRight"
              arrow={false}
              overlayInnerStyle={{ padding: 0 }}
              overlayClassName={classNames(`${basePrefixCls}-overflow-popover`, hashId)}
              content={
                <div
                  className={classNames(`${basePrefixCls}-overflow-container-popup`, hashId)}
                  onWheel={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {ordered.length > 0
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
                              isHandlePressRef.current = true;
                              setDraggingIndex(index);
                              evt.stopPropagation();
                            }}
                          />
                          <div draggable={false}>{entry.node}</div>
                        </div>
                      ))
                    : null}
                </div>
              }
            >
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
              >
                <Menu />
              </div>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

ActionItemContainer.displayName = 'ActionItemContainer';
