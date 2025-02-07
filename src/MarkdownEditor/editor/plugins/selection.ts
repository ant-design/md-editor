import { Editor, NodeEntry, Path } from 'slate';
import { EditorStore } from '../store';

export function findPointLeftTop(entry: NodeEntry, editor: Editor) {
  const [cell, cellPath]: any = entry;
  if (!(typeof cell.colspan === 'number' && typeof cell.rowspan === 'number')) {
    return null;
  }
  let tmpNode: any = cell as Node;
  let tmpPath = cellPath;
  if (cell.colspan === 0 && cell.rowspan !== 0) {
    while (
      tmpNode &&
      typeof tmpNode.colspan === 'number' &&
      tmpNode.colspan === 0
    ) {
      [tmpNode, tmpPath] = Editor?.node(editor, [
        ...tmpPath.slice(0, -1),
        tmpPath[tmpPath.length - 1] - 1,
      ]);
    }
    return [tmpNode, tmpPath];
  }
  if (cell.rowspan === 0 && cell.colspan !== 0) {
    while (
      tmpNode &&
      typeof tmpNode.rowspan === 'number' &&
      tmpNode.rowspan === 0
    ) {
      [tmpNode, tmpPath] = Editor?.node(editor, [
        ...tmpPath.slice(0, -2),
        tmpPath[tmpPath.length - 2] - 1,
        tmpPath[tmpPath.length - 1],
      ]);
    }
    return [tmpNode, tmpPath];
  }
  if (cell.rowspan === 0 && cell.colspan === 0) {
    while (
      tmpNode &&
      typeof tmpNode.colspan === 'number' &&
      tmpNode.colspan === 0
    ) {
      [tmpNode, tmpPath] = Editor?.node(editor, [
        ...tmpPath.slice(0, -1),
        tmpPath[tmpPath.length - 1] - 1,
      ]);
    }
    while (
      tmpNode &&
      typeof tmpNode.rowspan === 'number' &&
      tmpNode.rowspan === 0
    ) {
      [tmpNode, tmpPath] = Editor?.node(editor, [
        ...tmpPath.slice(0, -2),
        tmpPath[tmpPath.length - 2] - 1,
        tmpPath[tmpPath.length - 1],
      ]);
    }
    return [tmpNode, tmpPath];
  }
}

const calcCoveredCells = (
  store: EditorStore,
  table: any[],
  startPath: any[],
  endPath: any[],
): any[] => {
  let cells: NodeEntry[] = [];
  const totalCellsGenerator: any = Editor.nodes(store.editor, {
    at: table[1],
    match: (n: any) => !!n && n.type === 'table-cell',
  });
  const totalCells = [];
  for (const [n, p] of totalCellsGenerator) {
    totalCells.push([n, p]);
  }

  const [startNode]: any = Editor?.node(store.editor, startPath);
  const [endNode]: any = Editor?.node(store.editor, endPath);
  let rowMin = Math.min(startPath[2], endPath[2]);
  let rowMax = Math.max(startPath[2], endPath[2]);
  let colMin = Math.min(startPath[3], endPath[3]);
  let colMax = Math.max(
    startPath[3],
    endPath[3],
    startPath[3] + (startNode.colspan || 1) - 1,
    endPath[3] + (endNode.colspan || 1) - 1,
  );

  if (startNode.rowspan * startNode.colspan > 0) {
    rowMax = Math.max(rowMax, startPath[2] + (startNode.rowspan || 1) - 1);
    colMax = Math.max(colMax, startPath[3] + (startNode.colspan || 1) - 1);
  }
  if (endNode.rowspan * endNode.colspan > 0) {
    rowMax = Math.max(rowMax, endPath[2] + (endNode.rowspan || 1) - 1);
    colMax = Math.max(colMax, endPath[3] + (endNode.colspan || 1) - 1);
  }

  let collaboratedCellsArr: Array<NodeEntry> = [];

  for (const [cellNode, cellPath] of totalCells) {
    if (
      rowMin <= cellPath[2] &&
      cellPath[2] <= rowMax &&
      colMin <= cellPath[3] &&
      cellPath[3] <= colMax
    ) {
      if (
        typeof cellNode.colspan === 'number' &&
        typeof cellNode.rowspan === 'number'
      ) {
        collaboratedCellsArr.push([cellNode, cellPath]);
      }
    }
  }

  collaboratedCellsArr.forEach((entry) => {
    const [cellNode, cellPath]: any = entry;
    if ((cellNode.colspan as number) * (cellNode.rowspan as number) > 0) {
      colMax = Math.max(colMax, cellPath[3] + (cellNode.colspan as number) - 1);
      rowMax = Math.max(rowMax, cellPath[2] + (cellNode.rowspan as number) - 1);
    } else {
      const [nodeTopLeft, pathTopLeft]: any = findPointLeftTop(
        [cellNode, cellPath],
        store.editor,
      );
      colMin = Math.min(colMin, pathTopLeft[3]);
      rowMin = Math.min(rowMin, pathTopLeft[2]);
      colMax = Math.max(
        colMax,
        pathTopLeft[3] + (nodeTopLeft.colspan as number) - 1,
      );
      rowMax = Math.max(
        rowMax,
        pathTopLeft[2] + (nodeTopLeft.rowspan as number) - 1,
      );
    }
  });
  for (const [cellNode, cellPath] of totalCells) {
    if (
      rowMin <= cellPath[2] &&
      cellPath[2] <= rowMax &&
      colMin <= cellPath[3] &&
      cellPath[3] <= colMax
    ) {
      if (
        typeof cellNode.colspan === 'number' &&
        typeof cellNode.rowspan === 'number' &&
        cellNode.colspan * cellNode.rowspan > 0
      ) {
        colMax = Math.max(colMax, cellPath[3] + cellNode.colspan - 1);
        rowMax = Math.max(rowMax, cellPath[2] + cellNode.rowspan - 1);
      } else if (
        typeof cellNode.colspan === 'number' &&
        typeof cellNode.rowspan === 'number' &&
        cellNode.colspan * cellNode.rowspan === 0 &&
        !cellNode.selectedCell
      ) {
        const pointLeftTop = findPointLeftTop(
          [cellNode, cellPath],
          store.editor,
        );
        if (pointLeftTop) {
          const [nodeTopLeft, pathTopLeft] = pointLeftTop;
          colMin = Math.min(colMin, pathTopLeft[3]);
          rowMin = Math.min(rowMin, pathTopLeft[2]);
          colMax = Math.max(
            colMax,
            pathTopLeft[3] + ((nodeTopLeft as any).colspan as number) - 1,
          );
          rowMax = Math.max(
            rowMax,
            pathTopLeft[2] + ((nodeTopLeft as any).rowspan as number) - 1,
          );
        }
      }
    }
  }

  for (const [cellNode, cellPath] of totalCells) {
    if (
      rowMin <= cellPath[2] &&
      cellPath[2] <= rowMax &&
      colMin <= cellPath[3] &&
      cellPath[3] <= colMax
    ) {
      cells.push([cellNode as Node, cellPath as Path]);
    }
  }

  return cells;
};
export function addSelection(
  store: EditorStore,
  table: NodeEntry | null,
  startPath: Path,
  endPath: Path,
  setSelCells: any,
): any[] {
  if (!table || !table[1]) {
    return [];
  }

  const coveredCells = calcCoveredCells(store, table, startPath, endPath);
  setSelCells(() => {
    store.SEL_CELLS.set(store.editor, coveredCells);
    return coveredCells;
  });

  return coveredCells;
}
export function removeSelection(
  store: EditorStore,
  setSelCells: (callback: () => any[]) => void,
) {
  setSelCells(() => {
    store.SEL_CELLS.set(store.editor, []);
    return [];
  });
}
