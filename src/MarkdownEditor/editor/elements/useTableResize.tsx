import { useCallback, useEffect, useState } from 'react';
import { Editor, Node, NodeEntry, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { useEditorStore } from '../store';
const SEL_CELLS: WeakMap<Editor, NodeEntry[]> = new WeakMap();
const RESIZING_ROW: WeakMap<Editor, NodeEntry> = new WeakMap();
const RESIZING_ROW_ORIGIN_HEIGHT: WeakMap<Editor, number> = new WeakMap();
const RESIZING_ROW_MIN_HEIGHT: WeakMap<Editor, number> = new WeakMap();

const RESIZING_COL: WeakMap<Editor, NodeEntry> = new WeakMap();
const RESIZING_COL_ORIGIN_WIDTH: WeakMap<Editor, number> = new WeakMap();
const RESIZING_COL_MIN_WIDTH: WeakMap<Editor, number> = new WeakMap();

export const useTableResize = (
  tableRef: any,
  tableTargetRef: any,
  setColArr: any,
  element: any,
) => {
  const { store } = useEditorStore();

  const [isDragging, setIsDragging] = useState(false);
  const [startKey, setStartKey] = useState('');
  const [tableResizeMaskRect, setTableResizeMaskRect] = useState({
    height: 0,
    width: 0,
    top: 0,
    left: 0,
  });

  const [tableRect, setTableRect] = useState({
    height: 0,
    width: 0,
    top: 0,
    left: 0,
  });
  const [maskRectSide, setMaskRectSide] = useState<
    'top' | 'right' | 'bottom' | 'left' | null
  >(null);
  const [curCell, setCurCell] = useState(null);
  const [startPositionX, setStartPositionX] = useState<number | null>(null);
  const [startPositionY, setStartPositionY] = useState<number | null>(null);
  const [differenceX, setDifferenceX] = useState<number | null>(null);
  const [differenceY, setDifferenceY] = useState<number | null>(null);

  const [rowMovingLine, setRowMovingLine] = useState<{ top: number | null }>({
    top: 0,
  });

  const [colMovingLine, setColMovingLine] = useState({
    left: 0,
  });

  const handleTableCellsMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (store.readonly || !store.editor) return;

      const cell = (e.target as HTMLBaseElement).closest('td');

      if (cell) {
        try {
          if (!ReactEditor.hasDOMNode(store.editor, cell)) {
            console.warn(
              'Cell is not associated with the current Slate editor:',
              cell,
            );
            return;
          }

          const tdSlateNode = ReactEditor.toSlateNode(store.editor, cell);
          const tdClientBounding = cell.getBoundingClientRect();
          const tbodyDom = (e.target as HTMLBaseElement).closest('tbody');
          if (tbodyDom && tdSlateNode && tdClientBounding) {
            const tbodyClientBounding = tbodyDom.getBoundingClientRect();
            const maskLeft =
              (tdClientBounding.left || 0) - tbodyClientBounding.left;
            const maskTop =
              (tdClientBounding.top || 0) - tbodyClientBounding.top;
            setCurCell(tdSlateNode);
            if (
              tableResizeMaskRect.height !== tdClientBounding.height ||
              tableResizeMaskRect.width !== tdClientBounding.width ||
              tableResizeMaskRect.left !== maskLeft ||
              tableResizeMaskRect.top !== maskTop
            ) {
              setTableResizeMaskRect({
                height: tdClientBounding.height || 0,
                width: tdClientBounding.width || 0,
                left: maskLeft,
                top: maskTop,
              });
            }
            if (
              tableRect.height !== tbodyClientBounding.height ||
              tableRect.width !== tbodyClientBounding.width ||
              tableRect.left !== tbodyClientBounding.left ||
              tableRect.top !== tbodyClientBounding.top
            ) {
              setTableRect({
                height: tbodyClientBounding.height || 0,
                width: tbodyClientBounding.width || 0,
                left: tbodyClientBounding.left || 0,
                top: tbodyClientBounding.top || 0,
              });
            }
          }
        } catch (error) {
          console.error(
            'Error checking Slate configuration for cell:',
            error,
            cell,
          );
        }
      }
    },
    [startKey, store.editor?.selection, (tableRef as any).current],
  );
  function getParentPathByType(
    editor: Editor,
    path: Path,
    type: string,
  ): Path | null {
    if (!path) return null;
    const len = path.length;
    for (let i = len - 1; i >= 0; i--) {
      const node: any =
        Node.has(editor, path.slice(0, i)) &&
        Node.get(editor, path.slice(0, i));
      if (node && node.type === type) {
        return path.slice(0, i);
      }
    }
    return null;
  }

  const handleMovingLineMouseMove = useCallback(
    (e: PointerEvent) => {
      const editorDom = ReactEditor.toDOMNode(store.editor, store.editor);
      editorDom.setPointerCapture(e.pointerId);

      if (!curCell) return;

      if (startPositionY !== null && isDragging) {
        const resizingRowEntry: any = RESIZING_ROW.get(store.editor);
        const minHeight = RESIZING_ROW_MIN_HEIGHT.get(store.editor) ?? 0;
        const originHeight = RESIZING_ROW_ORIGIN_HEIGHT.get(store.editor) ?? 0;
        const diffY = e.pageY - startPositionY;
        const calculatedHeight = Math.floor(originHeight + diffY);
        let isMinValue = false;

        if (minHeight - originHeight >= diffY) {
          isMinValue = true;
        }

        if (isMinValue) {
          setDifferenceY(minHeight - originHeight);
        } else {
          setDifferenceY(diffY);
        }

        console.log(
          '[resizingRowEntry 1 ]',
          curCell,
          minHeight,
          resizingRowEntry,
        );

        document.body.style.cursor = 'row-resize';

        const trDOM = ReactEditor.toDOMNode(store.editor, resizingRowEntry[0]);
        let dataHeight = minHeight + 'px';

        switch (maskRectSide) {
          case 'top':
            if (minHeight && isMinValue) {
            } else {
              dataHeight = calculatedHeight + 'px';
            }
            trDOM.style.height = dataHeight;
            trDOM.setAttribute('data-height', dataHeight);

            break;
          case 'bottom':
            if (minHeight && isMinValue) {
            } else {
              dataHeight = calculatedHeight + 'px';
            }
            trDOM.style.height = dataHeight;
            trDOM.setAttribute('data-height', dataHeight);
            break;
          default:
            break;
        }
        console.log('differenceY]', startPositionY, differenceY);
        return;
      }

      if (startPositionX !== null && isDragging) {
        const minWidth = RESIZING_COL_MIN_WIDTH.get(store.editor) ?? 0;
        const tdEntry = RESIZING_COL.get(store.editor);
        console.log('[tdEntry]', tdEntry);
        const tablePath =
          tdEntry &&
          tdEntry[1] &&
          getParentPathByType(store.editor, tdEntry[1], 'table');
        if (!tablePath) return;
        const tableNode = Editor.node(store.editor, tablePath);
        const tableDOM = ReactEditor.toDOMNode(store.editor, tableNode[0]);
        console.log('[col 1 ]', tdEntry);

        const colNumber = tdEntry && tdEntry[1] && tdEntry[1][3];
        const originWidth = RESIZING_COL_ORIGIN_WIDTH.get(store.editor) ?? 0;
        const diffX = e.pageX - startPositionX;
        const calculatedWidth = Math.floor(originWidth + diffX);
        let isMinValue = false;

        if (minWidth - originWidth + 3 >= diffX) {
          isMinValue = true;
        }
        if (isMinValue) {
          setDifferenceX(minWidth - originWidth);
        } else {
          setDifferenceX(diffX);
        }

        document.body.style.cursor = 'col-resize';
        switch (maskRectSide) {
          case 'right':
            setColArr((prev: string[]) => {
              const res = [...prev];
              if (isMinValue) {
                res.splice(colNumber, 1, minWidth + 'px');
              } else {
                res.splice(colNumber, 1, calculatedWidth + 'px');
              }
              tableDOM?.setAttribute('data-col-arr', JSON.stringify(res));
              return res;
            });

            console.log(`RRRRRR right`, originWidth, calculatedWidth);

            break;
          case 'left':
            setColArr((prev: string[]) => {
              const res = [...prev];
              if (isMinValue) {
                res.splice(colNumber, 1, minWidth + 'px');
              } else {
                res.splice(colNumber, 1, calculatedWidth + 'px');
              }
              tableDOM?.setAttribute('data-col-arr', JSON.stringify(res));
              return res;
            });
            console.log(`LLLLLL left`, originWidth, calculatedWidth);
            break;
          default:
            break;
        }
        console.log('differenceX]', startPositionX, differenceX);
        return;
      }
    },
    [startPositionY, startPositionX, isDragging, curCell, maskRectSide],
  );

  const handleMovingLineMouseUp = useCallback(
    (e: PointerEvent) => {
      const editorDom = ReactEditor.toDOMNode(store.editor, store.editor);
      editorDom.releasePointerCapture(e.pointerId);
      if (startPositionY !== null && isDragging) {
        setStartPositionY(null);
        setDifferenceY(null);
        setRowMovingLine({ top: null });
        setIsDragging(false);
        document.body.style.cursor = 'default';

        const resizingRowEntry: any = RESIZING_ROW.get(store.editor);

        const trDOM =
          resizingRowEntry &&
          resizingRowEntry[0] &&
          ReactEditor.toDOMNode(store.editor, resizingRowEntry[0]);
        if (!trDOM) {
          return;
        }
        const dataHeight = trDOM.getAttribute('data-height');
        Transforms.setNodes(store.editor, { height: dataHeight } as any, {
          at: resizingRowEntry[1],
        });

        editorDom.removeEventListener('pointermove', handleMovingLineMouseMove);
        editorDom.removeEventListener('pointerup', handleMovingLineMouseUp);
        console.log('[handleMovingLineMouseUp]', editorDom);
      }

      if (startPositionX !== null && isDragging) {
        setStartPositionX(null);
        setDifferenceX(null);
        setColMovingLine({ left: -9999 });
        setIsDragging(false);
        document.body.style.cursor = 'default';

        const tdEntry = RESIZING_COL.get(store.editor);
        const tablePath =
          tdEntry &&
          tdEntry[1] &&
          getParentPathByType(store.editor, tdEntry[1], 'table');

        if (!tablePath) return;
        const tableNode = Editor.node(store.editor, tablePath);
        const tableDOM = ReactEditor.toDOMNode(store.editor, tableNode[0]);
        const dataColArr: string = tableDOM.getAttribute('data-col-arr') ?? '';

        if (dataColArr) {
          const howWideEach = new Array(element.hwEach?.length || 1).fill(
            JSON.parse(dataColArr),
          );
          Transforms.setNodes(
            store.editor,
            { hwEach: howWideEach } as Partial<Node>,
            { at: tablePath },
          );
        }

        editorDom.removeEventListener('pointermove', handleMovingLineMouseMove);
        editorDom.removeEventListener('pointerup', handleMovingLineMouseUp);
      }
    },
    [startPositionY, startPositionX, isDragging],
  );

  const handleResetStartKey = useCallback(() => {
    setStartKey('');
    setCurCell(null);
  }, []);

  useEffect(() => {
    const editorDom = ReactEditor.toDOMNode(store.editor, store.editor);
    if (isDragging) {
      editorDom.addEventListener('pointermove', handleMovingLineMouseMove);
      editorDom.addEventListener('pointerup', handleMovingLineMouseUp);
    }
    editorDom.addEventListener('pointerup', handleResetStartKey);

    return () => {
      editorDom.removeEventListener('pointermove', handleMovingLineMouseMove);
      editorDom.removeEventListener('pointerup', handleMovingLineMouseUp);
      editorDom.removeEventListener('pointerup', handleResetStartKey);
    };
  }, [isDragging]);

  useEffect(() => {
    const tbodyDom = (tableTargetRef as any).current?.childNodes?.[1];
    if (tbodyDom) {
      const tbodyClientBounding = tbodyDom.getBoundingClientRect();
      if (
        tableRect.height !== tbodyClientBounding.height ||
        tableRect.width !== tbodyClientBounding.width ||
        tableRect.left !== tbodyClientBounding.left ||
        tableRect.top !== tbodyClientBounding.top
      ) {
        setTableRect({
          height: tbodyClientBounding.height || 0,
          width: tbodyClientBounding.width || 0,
          left: tbodyClientBounding.left || 0,
          top: tbodyClientBounding.top || 0,
        });
      }
    }
  }, [differenceX, differenceY]);

  return {
    tableResizeMaskRect,
    tableRect,
    curCell,
    handleTableCellsMouseMove,
    setMaskRectSide,
    rowMovingLine,
    colMovingLine,
    SEL_CELLS,
    RESIZING_ROW,
    RESIZING_ROW_ORIGIN_HEIGHT,
    RESIZING_ROW_MIN_HEIGHT,
    RESIZING_COL,
    RESIZING_COL_ORIGIN_WIDTH,
    RESIZING_COL_MIN_WIDTH,
    setStartPositionX,
    setStartPositionY,
    differenceX,
    differenceY,
    isDragging,
    setIsDragging,
    setRowMovingLine,
    setColMovingLine,
    startKey,
  };
};
