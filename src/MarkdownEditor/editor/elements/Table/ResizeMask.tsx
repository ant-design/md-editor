import React, { useEffect } from 'react';
import { Editor, Node, Path } from 'slate';
import { ReactEditor } from 'slate-react';

function getParentPathByType(
  editor: Editor,
  path: Path,
  type: string,
): Path | null {
  if (!path) return null;
  const len = path.length;
  for (let i = len - 1; i >= 0; i--) {
    const node: any =
      Node.has(editor, path.slice(0, i)) && Node.get(editor, path.slice(0, i));
    if (node && node.type === type) {
      return path.slice(0, i);
    }
  }
  return null;
}

const tableMargin = { left: 26, top: 18 };

const tdPaddingAndBorder = 4 + 1;

function ResizeMask(props: {
  SEL_CELLS: any;
  RESIZING_ROW: any;
  RESIZING_ROW_ORIGIN_HEIGHT: any;
  RESIZING_ROW_MIN_HEIGHT: any;
  RESIZING_COL: any;
  RESIZING_COL_ORIGIN_WIDTH: any;
  RESIZING_COL_MIN_WIDTH: any;
  store: any;
  tableRect: any;
  setMaskRectSide: any;
  tableResizeMaskRect: any;
  curCell: any;
  setStartPositionX: any;
  setStartPositionY: any;
  differenceY: any;
  differenceX: any;
  isDragging: any;
  setIsDragging: any;
  setRowMovingLine: any;
  setColMovingLine: any;
  rowMovingLine: any;
  colMovingLine: any;
  startKey: any;
  colArr: any;
}) {
  const {
    SEL_CELLS,
    RESIZING_ROW,
    RESIZING_ROW_ORIGIN_HEIGHT,
    RESIZING_ROW_MIN_HEIGHT,
    RESIZING_COL,
    RESIZING_COL_ORIGIN_WIDTH,
    RESIZING_COL_MIN_WIDTH,
    store,
    tableRect,
    setMaskRectSide,
    tableResizeMaskRect,
    curCell,

    setStartPositionX,
    setStartPositionY,
    differenceY,
    differenceX,
    isDragging,
    setIsDragging,
    setRowMovingLine,
    setColMovingLine,
    rowMovingLine,
    colMovingLine,
    startKey,
    colArr,
  } = props;
  useEffect(() => {
    if (differenceY === null) {
      setRowMovingLine({
        top: null,
      });
    }

    if (differenceX === null) {
      setColMovingLine({
        left: -9999,
      });
    }
  }, [differenceY, differenceX]);

  function getNodeOfDomHeight(node: any) {
    if (!node) return 0;
    if (node.type === 'card') {
      if (node.children?.[1]) {
        const innerNode = node.children[1];
        let margins = 0;
        const dom = ReactEditor.toDOMNode(store.editor, innerNode);
        if (['image'].includes(innerNode.type)) {
          margins = 16 * 2;
        }
        return dom.clientHeight + margins;
      }
    } else {
      const dom = ReactEditor.toDOMNode(store.editor, node);
      return dom.clientHeight;
    }
    return 0;
  }

  return store.readonly ? null : (
    <>
      <div
        suppressContentEditableWarning
        className={'table-resize-mask'}
        contentEditable="false"
        style={{
          background: 'rgba(200,245,233,.5)',
          height: tableResizeMaskRect.height,
          width: tableResizeMaskRect.width,
          left: tableResizeMaskRect.left + tableMargin.left,
          top: tableResizeMaskRect.top + tableMargin.top,
          display:
            SEL_CELLS.get(store.editor) &&
            SEL_CELLS.get(store.editor)!.length > 0
              ? 'none'
              : undefined,
          position: 'absolute',
        }}
      >
        <div
          data-ignore-slate
          suppressContentEditableWarning
          contentEditable="false"
          className={'table-resize-top'}
          style={{
            width: '100%',
            height: '7px',
            left: 0,
            top: -3,
            cursor: rowMovingLine.display === 'none' ? 'default' : undefined,
            position: 'absolute',
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            if (isDragging || startKey) return;
            const thisDom: any = e.target;
            if (thisDom) {
              const thisDomRect = thisDom.getBoundingClientRect();
              const calcultedTop = thisDomRect.top + 3 - tableRect.top;

              if (calcultedTop < 1) {
                setRowMovingLine({ top: null });
                thisDom.style.cursor = 'default';
              } else {
                setRowMovingLine({
                  top: Math.round(calcultedTop),
                });
                thisDom.style.cursor = 'row-resize';
              }
            }
          }}
          onMouseLeave={(e: any) => {
            e.stopPropagation();
            if (!isDragging) {
              setRowMovingLine({ top: null });
            }
            e.target.style.cursor = 'default';
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            if (differenceY !== null) return;
            const thisDom: any = e.target;
            if (thisDom) {
              const thisDomRect = thisDom.getBoundingClientRect();
              if (thisDomRect) {
                const calcultedTop = thisDomRect.top + 3 - tableRect.top;
                if (calcultedTop < 1) {
                  e.preventDefault();
                  return;
                }
                setStartPositionY(thisDomRect.top + 3);
                setIsDragging(true);
                setMaskRectSide('top');

                if (curCell) {
                  const tdSlateNodePath = ReactEditor.findPath(
                    store.editor,
                    curCell,
                  );
                  const trSlateNodePath = Path.parent(tdSlateNodePath);

                  const prevTrSlateNodePath =
                    Path.hasPrevious(trSlateNodePath) &&
                    Path.previous(trSlateNodePath);

                  if (prevTrSlateNodePath) {
                    const trEntry: any = Editor.node(
                      store.editor,
                      prevTrSlateNodePath,
                    );
                    let minHeight = 33;
                    const tdNodes = trEntry[0]?.children;
                    tdNodes.forEach((tdNode: { children: any }) => {
                      const tdDOM = ReactEditor.toDOMNode(store.editor, tdNode);
                      if (!tdDOM) return;
                      let tdHeight = 0;
                      const contentNodes = tdNode.children;
                      if (!contentNodes) return;
                      contentNodes.forEach((node: any) => {
                        tdHeight += getNodeOfDomHeight(node);
                      });

                      if (tdHeight > minHeight) {
                        minHeight = tdHeight + tdPaddingAndBorder * 2;
                      }
                    });
                    RESIZING_ROW.set(store.editor, trEntry);
                    RESIZING_ROW_ORIGIN_HEIGHT.set(
                      store.editor,
                      ReactEditor.toDOMNode(store.editor, trEntry[0])
                        ?.clientHeight || minHeight,
                    );
                    RESIZING_ROW_MIN_HEIGHT.set(store.editor, minHeight);
                  }
                }
              }
            }
          }}
        ></div>
        <div
          data-ignore-slate
          suppressContentEditableWarning
          contentEditable="false"
          className={'table-resize-right'}
          style={{
            width: '7px',
            height: '100%',
            left: tableResizeMaskRect.width - 3,
            top: 0,
            position: 'absolute',
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            if (isDragging || startKey) return;
            const thisDom: any = e.target;
            if (thisDom) {
              const thisDomRect = thisDom.getBoundingClientRect();
              setColMovingLine({
                left: Math.round(thisDomRect.left + 3 - tableRect.left),
              });
              thisDom.style.cursor = 'col-resize';
            }
          }}
          onMouseLeave={(e: any) => {
            e.stopPropagation();
            if (!isDragging) {
              setColMovingLine({ left: -9999 });
            }
            e.target.style.cursor = 'default';
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            const thisDom: any = e.target;
            if (thisDom) {
              const thisDomRect = thisDom.getBoundingClientRect();
              if (thisDomRect) {
                setStartPositionX(thisDomRect.right);
                setIsDragging(true);
                setMaskRectSide('right');
                if (curCell) {
                  const tdSlateNodePath = ReactEditor.findPath(
                    store.editor,
                    curCell,
                  );

                  if (tdSlateNodePath) {
                    const tdEntry = Editor.node(store.editor, tdSlateNodePath);
                    let isColCell = false;
                    let col = 1;
                    let entry: any = tdEntry;
                    let path = entry[1];
                    const tablePath = getParentPathByType(
                      store.editor,
                      tdSlateNodePath,
                      'table',
                    );
                    if (!tablePath) return;
                    const tableNode: any =
                      Node.has(store.editor, tablePath) &&
                      Node.get(store.editor, tablePath);

                    const hwEach = colArr;

                    let originWidth = Number.parseInt(hwEach[path[3]]) || 40;
                    if (entry[0] && entry[0].colspan > 1) {
                      isColCell = true;
                      col = entry[0].colspan;
                    }
                    if (isColCell) {
                      for (let i = 1; i < col; i++) {
                        path = Path.next(path);
                        entry = Editor.node(store.editor, path);
                      }
                      originWidth = Number.parseInt(hwEach[path[3]]);
                    }
                    let minWidth = 40;
                    RESIZING_COL.set(store.editor, entry);
                    RESIZING_COL_ORIGIN_WIDTH.set(
                      store.editor,
                      originWidth >= minWidth ? originWidth : minWidth,
                    );
                    RESIZING_COL_MIN_WIDTH.set(store.editor, minWidth);
                    const tableDOM = ReactEditor.toDOMNode(
                      store.editor,
                      tableNode,
                    );
                    tableDOM?.setAttribute(
                      'data-col-arr',
                      JSON.stringify(hwEach),
                    );
                  }
                }
              }
            }
          }}
        ></div>
        <div
          data-ignore-slate
          suppressContentEditableWarning
          contentEditable="false"
          className={'table-resize-bottom'}
          style={{
            width: '100%',
            height: '7px',
            left: 0,
            top: tableResizeMaskRect.height - 3,
            position: 'absolute',
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            if (isDragging || startKey) return;
            const thisDom: any = e.target;
            if (thisDom) {
              const thisDomRect = thisDom.getBoundingClientRect();
              setRowMovingLine({
                top: Math.round(thisDomRect.top + 3 - tableRect.top),
              });
              thisDom.style.cursor = 'row-resize';
            }
          }}
          onMouseLeave={(e: any) => {
            e.stopPropagation();
            if (!isDragging) {
              setRowMovingLine({ top: null });
            }
            e.target.style.cursor = 'default';
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            if (differenceY !== null) return;
            const thisDom: any = e.target;
            if (thisDom) {
              const thisDomRect = thisDom.getBoundingClientRect();
              if (thisDomRect) {
                setStartPositionY(thisDomRect.top - 3);
                setIsDragging(true);
                setMaskRectSide('bottom');
                if (curCell) {
                  const tdSlateNodePath = ReactEditor.findPath(
                    store.editor,
                    curCell,
                  );
                  const trSlateNodePath = Path.parent(tdSlateNodePath);

                  if (trSlateNodePath) {
                    const trEntry: any = Editor.node(
                      store.editor,
                      trSlateNodePath,
                    );
                    let entry = trEntry;
                    let path = trSlateNodePath;
                    let isColCell = false;
                    let row = 1;
                    const tdEntry: any = Editor.node(
                      store.editor,
                      tdSlateNodePath,
                    );
                    if (tdEntry[0] && tdEntry[0].rowspan > 1) {
                      isColCell = true;
                      row = tdEntry[0].rowspan;
                    }
                    if (isColCell) {
                      for (let i = 1; i < row; i++) {
                        path = Path.next(path);
                        entry = Editor.node(store.editor, path);
                      }
                    }

                    let minHeight = 33;
                    const tdNodes = entry[0]?.children;
                    tdNodes.forEach((tdNode: { children: any }) => {
                      const tdDOM = ReactEditor.toDOMNode(store.editor, tdNode);
                      if (!tdDOM) return;
                      let tdHeight = 0;
                      const contentNodes = tdNode.children;
                      if (!contentNodes) return;
                      contentNodes.forEach((node: any) => {
                        tdHeight += getNodeOfDomHeight(node);
                      });

                      if (tdHeight > minHeight) {
                        minHeight = tdHeight + tdPaddingAndBorder * 2;
                      }
                    });

                    RESIZING_ROW.set(store.editor, entry);
                    RESIZING_ROW_ORIGIN_HEIGHT.set(
                      store.editor,
                      ReactEditor.toDOMNode(store.editor, entry[0])
                        ?.clientHeight || minHeight,
                    );
                    RESIZING_ROW_MIN_HEIGHT.set(store.editor, minHeight);
                  }
                }
              }
            }
          }}
        ></div>
        <div
          data-ignore-slate
          suppressContentEditableWarning
          contentEditable="false"
          className={'table-resize-left'}
          style={{
            width: '7px',
            height: '100%',
            left: -3,
            top: 0,
            cursor: colMovingLine.display === 'none' ? 'default' : undefined,
            position: 'absolute',
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            if (isDragging || startKey) return;
            const thisDom: any = e.target;
            if (thisDom) {
              const thisDomRect = thisDom.getBoundingClientRect();
              const calculatedLeft = thisDomRect.left + 3 - tableRect.left;
              if (calculatedLeft < 1) {
                setColMovingLine({ left: -9999 });
                thisDom.style.cursor = 'default';
              } else {
                setColMovingLine({
                  left: Math.round(calculatedLeft),
                });
                thisDom.style.cursor = 'col-resize';
              }
            }
          }}
          onMouseLeave={(e: any) => {
            e.stopPropagation();
            if (!isDragging) {
              setColMovingLine({ left: -9999 });
            }
            e.target.style.cursor = 'default';
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            const thisDom: any = e.target;
            if (thisDom) {
              const thisDomRect = thisDom.getBoundingClientRect();
              if (thisDomRect) {
                const calculatedLeft = thisDomRect.left + 3 - tableRect.left;
                if (calculatedLeft < 1) {
                  e.preventDefault();
                  return;
                }
                setStartPositionX(thisDomRect.right);
                setIsDragging(true);
                setMaskRectSide('left');
                if (curCell) {
                  const tdSlateNodePath = ReactEditor.findPath(
                    store.editor,
                    curCell,
                  );
                  const prevTdSlateNodePath =
                    Path.hasPrevious(tdSlateNodePath) &&
                    Path.previous(tdSlateNodePath);
                  if (prevTdSlateNodePath) {
                    const tdEntry = Editor.node(
                      store.editor,
                      prevTdSlateNodePath,
                    );
                    let entry: any = tdEntry;
                    let path = entry[1];
                    const tablePath = getParentPathByType(
                      store.editor,
                      prevTdSlateNodePath,
                      'table',
                    );
                    if (!tablePath) return;
                    const tableNode: any =
                      Node.has(store.editor, tablePath) &&
                      Node.get(store.editor, tablePath);

                    const hwEach = colArr;
                    let originWidth = Number.parseInt(hwEach[path[3]]) || 40;
                    let minWidth = 40;
                    RESIZING_COL.set(store.editor, tdEntry);
                    RESIZING_COL_ORIGIN_WIDTH.set(
                      store.editor,
                      originWidth >= minWidth ? originWidth : minWidth,
                    );
                    RESIZING_COL_MIN_WIDTH.set(store.editor, minWidth);

                    const tableDOM = ReactEditor.toDOMNode(
                      store.editor,
                      tableNode,
                    );
                    tableDOM?.setAttribute(
                      'data-col-arr',
                      JSON.stringify(hwEach),
                    );
                  }
                }
              }
            }
          }}
        ></div>
      </div>
    </>
  );
}

export default ResizeMask;
