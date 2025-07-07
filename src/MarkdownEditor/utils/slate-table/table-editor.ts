/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Editor, Location, Node, NodeEntry, Path, Transforms } from 'slate';
import { DEFAULT_INSERT_TABLE_OPTIONS, InsertTableOptions } from './options';
import { TableCursor } from './table-cursor';
import { filledMatrix, hasCommon, isElement, isOfType } from './utils';
import { CellElement } from './utils/types';
import { EDITOR_TO_SELECTION, EDITOR_TO_WITH_TABLE_OPTIONS } from './weak-maps';

export const TableEditor = {
  /**
   * Inserts a table at the specified location with the specified number of
   * rows and columns. If no location is specified it will be inserted at the current
   * selection.
   * @param options The `rows` and `cols` specify the number of rows and
   * columns in the table, if not provided, they default to 2. The `at`
   * property can be used to optionally specifiy the location at which
   * to insert the table.
   * @returns void
   */
  insertTable(editor: Editor, options: Partial<InsertTableOptions> = {}): void {
    const editorOptions = EDITOR_TO_WITH_TABLE_OPTIONS.get(editor);

    if (!editorOptions) {
      return;
    }

    const {
      blocks: { content, table, td, tr },
    } = editorOptions;

    const { rows, cols, at } = { ...DEFAULT_INSERT_TABLE_OPTIONS, ...options };

    if (TableCursor.isInTable(editor, { at })) {
      return;
    }

    // number of rows and cols can't be less than 1
    const clamp = (n: number) => (n < 1 ? 1 : n);

    Transforms.insertNodes(
      editor,
      {
        type: table,
        children: Array.from({ length: clamp(rows) }).map<Node>(() => ({
          type: tr,
          children: Array.from({ length: clamp(cols) }).map<Node>(() => ({
            type: td,
            children: [
              {
                type: content,
                children: [{ text: '' }],
              },
            ],
          })),
        })),
      } as Node,
      { at },
    );
  },
  /**
   * Removes a table at the specified location. If no location is specified
   * it will remove the table at the current selection.
   * @returns void
   */
  removeTable(editor: Editor, options: { at?: Location } = {}): void {
    const [table] = Editor.nodes(editor, {
      match: isOfType(editor, 'table'),
      at: options.at,
    });

    if (!table) {
      return;
    }

    const [, path] = table;

    Transforms.removeNodes(editor, { at: path });
  },
  /**
   * Inserts a new row at the specified location. If no location
   * is specified it will insert the row at the current selection.
   * @param options The `at` specifies the location of the base row
   * on which the new row will be inserted. Depending on the `before`
   * property the row will be inserted before or after the base row.
   * @returns void
   */
  insertRow(
    editor: Editor,
    options: { at?: Location; before?: boolean } = {},
  ): void {
    const editorOptions = EDITOR_TO_WITH_TABLE_OPTIONS.get(editor);

    if (!editorOptions) {
      return;
    }

    const [table, currentSection, currentTr, currentTd] = Editor.nodes(editor, {
      match: isOfType(
        editor,
        'table', // current table
        'thead', // current section

        'tfoot',
        'tr', // current row
        'td', // current cell
        'th',
      ),
      at: options.at,
    });

    if (!table || !currentSection || !currentTr || !currentTd) {
      return;
    }

    const matrix = filledMatrix(editor, { at: options.at });

    let trIndex = 0;
    outer: for (let x = 0; x < matrix.length; x++) {
      const [, currentTdPath] = currentTd;
      for (let y = 0; y < matrix[x].length; y++) {
        const [[, path], { btt }] = matrix[x][y];
        if (!Path.equals(currentTdPath, path)) {
          continue;
        }

        trIndex = x;

        // When determining the exit condition, we consider two scenarios:
        // 1. If a row will be added above the current selection, we seek the first match.
        // 2. Otherwise, if cells have a rowSpan, we aim to find the last match.
        if (options.before || btt < 2) {
          break outer;
        }
      }
    }

    const [...tableRows] = Editor.nodes(editor, {
      match: isOfType(editor, 'tr'),
      at: table[1],
    });

    Editor.withoutNormalizing(editor, () => {
      const destIndex = options.before ? trIndex - 1 : trIndex + 1;
      const isWithinBounds = destIndex >= 0 && destIndex < matrix.length;

      let increasedRowspan = 0;
      for (let y = 0; isWithinBounds && y < matrix[destIndex].length; y++) {
        const [[element, path], { ltr, ttb, btt }] = matrix[destIndex][y];
        const rowSpan = element.rowSpan || 1;

        if (options.before ? btt > 1 : ttb > 1) {
          increasedRowspan += ltr;

          Transforms.setNodes<CellElement>(
            editor,
            {
              rowSpan: rowSpan + 1,
            },
            { at: path },
          );
        }

        y += ltr - 1;
      }

      const { length: colLen } = isWithinBounds ? matrix[destIndex] : matrix[0];
      const { blocks } = editorOptions;

      const [, currentPath] = tableRows[trIndex];
      const [section] = currentSection;

      Transforms.insertNodes(
        editor,
        {
          type: blocks.tr,
          children: Array.from({ length: colLen - increasedRowspan }).map(
            () => ({
              type:
                (section as any).type === blocks.thead ? blocks.th : blocks.td,
              children: [
                {
                  type: blocks.content,
                  children: [{ text: '' }],
                },
              ],
            }),
          ),
        } as Node,
        {
          at: options.before ? currentPath : Path.next(currentPath),
        },
      );
    });
  },
  /**
   * Removes the row at the specified location. If no location is specified
   * it will remove the row at the current selection.
   * @returns void
   */
  removeRow(editor: Editor, options: { at?: Location } = {}) {
    const editorOptions = EDITOR_TO_WITH_TABLE_OPTIONS.get(editor);

    if (!editorOptions) {
      return;
    }

    const [table, section, tr, td] = Editor.nodes(editor, {
      match: isOfType(
        editor,
        'table', // table
        'thead', // section

        'tfoot',
        'tr', // row
        'td', // cell
        'th',
      ),
      at: options.at,
    });

    if (!table || !section || !tr || !td) {
      return;
    }

    const [, tablePath] = table;
    const [, sectionPath] = section;
    const [, trPath] = tr;
    const [, tdPath] = td;

    // check if there is a sibling in the table
    const [, globalSibling] = Editor.nodes(editor, {
      match: isOfType(editor, 'tr'),
      at: tablePath,
    });

    if (!globalSibling) {
      return Transforms.removeNodes(editor, {
        at: tablePath,
      });
    }

    const matrix = filledMatrix(editor, { at: options.at });

    let trIndex = 0;
    out: for (let x = 0; x < matrix.length; x++) {
      for (let y = 0; y < matrix[x].length; y++) {
        const [[, path], { ltr: colSpan }] = matrix[x][y];

        if (Path.equals(tdPath, path)) {
          trIndex = x;
          break out;
        }

        y += colSpan - 1;
      }
    }

    // Flags whether the tr has a cell with a rowSpan attribute (greater than 1).
    // If true, cells with a rowSpan will be moved to the next tr.
    let hasRowspan = false;

    // cells which span over multiple rows and have to be reduced
    // when deleting the current tr
    const toReduce: NodeEntry<CellElement>[] = [];

    for (let i = 0; i < matrix[trIndex].length; i++) {
      const [entry, { ltr: colSpan, ttb, btt }] = matrix[trIndex][i];

      // checks if the cell marks the beginning of a rowSpan.
      if (ttb === 1 && btt > 1) {
        hasRowspan = true;
      }

      // check if the cell has a rowSpan greater 1, indicating
      // it spans multiple rows.
      if (ttb > 1 || btt > 1) {
        toReduce.push(entry);
      }

      i += colSpan - 1;
    }

    const toAdd: NodeEntry<CellElement>[] = [];
    const next = matrix[trIndex + 1];
    for (let i = 0; hasRowspan && i < next?.length; i++) {
      const [entry, { ltr: colSpan, ttb }] = next[i];

      // - If 1, it indicates the start of either a rowSpan or a normal cell, and it can be carried over.
      // - If 2, it signifies the start of a rowSpan in the previous cell and should be carried over.
      // - If greater than 2, the rowSpan is above the current row and should not be carried over.
      if (ttb > 2) {
        continue;
      }

      toAdd.push(entry);

      i += colSpan - 1;
    }

    Editor.withoutNormalizing(editor, () => {
      for (const [{ rowSpan = 1 }, path] of toReduce) {
        Transforms.setNodes<CellElement>(
          editor,
          { rowSpan: rowSpan - 1 },
          { at: path },
        );
      }

      // If a cell of the tr contains the start of a rowSpan
      // the cells will be merged with the next row
      if (hasRowspan) {
        const { blocks } = editorOptions;

        Transforms.mergeNodes(editor, {
          match: isOfType(editor, 'tr'),
          at: Path.next(trPath),
        });

        Transforms.insertNodes(
          editor,
          {
            type: blocks.tr,
            children: toAdd.map((entry) => {
              const [element] = entry;

              if (toReduce.includes(entry)) {
                const { rowSpan = 1, ...rest } = element;

                return { ...rest, rowSpan: rowSpan === 1 ? 1 : rowSpan - 1 };
              }

              return element;
            }),
          } as Node,
          { at: Path.next(trPath) },
        );
      }

      // check if there is a sibling in the table section
      const [, sibling] = Editor.nodes(editor, {
        match: isOfType(editor, 'tr'),
        at: sectionPath,
      });

      return Transforms.removeNodes(editor, {
        // removes table section if there is no sibling in it
        at: sibling ? trPath : sectionPath,
      });
    });
  },
  /**
   * Inserts a new column at the specified location. If no location
   * is specified it will insert the column at the current selection.
   * @returns void
   */
  insertColumn(
    editor: Editor,
    options: { at?: Location; before?: boolean } = {},
  ): void {
    const editorOptions = EDITOR_TO_WITH_TABLE_OPTIONS.get(editor);

    if (!editorOptions) {
      return;
    }

    const [table, td] = Editor.nodes(editor, {
      match: isOfType(
        editor,
        'table', // table
        'td', // cell
        'th',
      ),
      at: options.at,
    });

    if (!table || !td) {
      return;
    }

    const [, tdPath] = td;

    const matrix = filledMatrix(editor, { at: options.at });

    let tdIndex = 0;
    out: for (let x = 0; x < matrix.length; x++) {
      for (let y = 0; y < matrix[x].length; y++) {
        const [[, path]] = matrix[x][y];

        if (Path.equals(tdPath, path)) {
          tdIndex = y;
          if (options.before) {
            break out;
          }
        }
      }
    }

    Editor.withoutNormalizing(editor, () => {
      const { blocks } = editorOptions;
      outer: for (let x = 0; x < matrix.length; x++) {
        const [[{ colSpan = 1 }, path], { ltr, rtl, ttb, btt }] =
          matrix[x][tdIndex];

        // when inserting left and the right-to-left is greater than 1, the colSpan is increased
        // when inserting right and the left-to-right is greater than 1, the colSpan is increased
        if (options.before ? rtl > 1 : ltr > 1) {
          Transforms.setNodes<CellElement>(
            editor,
            { colSpan: colSpan + 1 },
            { at: path },
          );

          // skip increasing the colSpan for the same cell if it has a rowSpan
          x += btt - 1;
          continue;
        }

        // section should always be present in the table
        const [[section]] = Editor.nodes(editor, {
          match: isOfType(editor, 'thead', 'tfoot'),
          at: path,
        });

        const insertTd = (path: Path): void =>
          Transforms.insertNodes(
            editor,
            {
              type:
                (section as any).type === blocks.thead ? blocks.th : blocks.td,
              children: [
                {
                  type: blocks.content,
                  children: [{ text: '' }],
                } as Node,
              ],
            } as Node,
            { at: path },
          );

        // if the cell has no rowSpan, just insert:
        if (ttb === 1) {
          insertTd(options.before ? path : Path.next(path));
          continue;
        }

        // iterate to the prev real cell
        for (let y = tdIndex; y >= 0; y--) {
          const [[, path], { ttb }] = matrix[x][y];

          // skip cells which span through the row because of their rowSpan attribute
          if (ttb !== 1) {
            continue;
          }

          // always the next path when adding from this loop
          insertTd(Path.next(path));
          continue outer;
        }

        let index = 0;
        for (const [, path] of Editor.nodes(editor, {
          match: isOfType(editor, 'tr'),
          at: table[1],
        })) {
          if (index !== x) {
            index++;
            continue;
          }

          insertTd(path.concat(0));
          continue outer;
        }
      }
    });
  },
  /**
   * Removes the column at the specified location. If no location is specified
   * it will remove the column at the current selection.
   * @returns void
   */
  removeColumn(editor: Editor, options: { at?: Location } = {}): void {
    const [table, td] = Editor.nodes(editor, {
      match: isOfType(
        editor,
        'table', // table
        'td', // cell
        'th',
      ),
      at: options.at,
    });

    if (!table || !td) {
      return;
    }

    const [, tablePath] = table;
    const [, tdPath] = td;

    const matrix = filledMatrix(editor, { at: options.at });

    const [, sibling] = matrix[0];
    if (!sibling) {
      return Transforms.removeNodes(editor, {
        at: tablePath,
      });
    }

    let tdIndex = 0;
    out: for (let x = 0; x < matrix.length; x++) {
      for (let y = 0; y < matrix[x].length; y++) {
        const [[, path], { ltr: colSpan }] = matrix[x][y];

        if (Path.equals(tdPath, path)) {
          tdIndex = y;
          break out;
        }

        y += colSpan - 1;
      }
    }

    Editor.withoutNormalizing(editor, () => {
      for (let x = matrix.length - 1; x >= 0; x--) {
        const [[{ colSpan = 1 }, path], { ltr, rtl, ttb }] = matrix[x][tdIndex];

        // skip "fake" cells which belong to a cell with a `rowSpan`
        if (ttb > 1) {
          continue;
        }

        let hasSibling = false;
        for (let y = 0; y < matrix[x].length; y++) {
          if (y === tdIndex) {
            continue;
          }

          const [[, siblingPath], { ltr: colSpan }] = matrix[x][y];
          if (Path.isSibling(path, siblingPath)) {
            hasSibling = true;
            break;
          }

          y += colSpan - 1;
        }

        if (!hasSibling) {
          TableEditor.removeRow(editor, { at: path });
          continue;
        }

        ltr === 1 && rtl === 1
          ? Transforms.removeNodes(editor, { at: path })
          : Transforms.setNodes<CellElement>(
              editor,
              { colSpan: colSpan - 1 },
              { at: path },
            );

        x -= ttb - 1;
      }
    });
  },
  /**
   * Checks if the current selection can be merged. Merging is not possible when any of the following conditions are met:
   * - The selection is empty.
   * - The selection is not within the same "thead" or "tfoot" section.
   * @returns {boolean} `true` if the selection can be merged, otherwise `false`.
   */
  canMerge(editor: Editor): boolean {
    const matrix = EDITOR_TO_SELECTION.get(editor);
    // cannot merge when selection is empty
    if (!matrix || !matrix.length) {
      return false;
    }

    // prettier-ignore
    const [[, lastPath]] = matrix[matrix.length - 1][matrix[matrix.length - 1].length - 1];
    const [[, firstPath]] = matrix[0][0];

    // cannot merge when selection is not in common section
    if (!hasCommon(editor, [firstPath, lastPath], 'thead', 'tfoot')) {
      return false;
    }

    return true;
  },
  /**
   * Merges the selected cells in the table.
   * @returns void
   */
  merge(editor: Editor): void {
    if (!TableEditor.canMerge(editor)) {
      return;
    }

    const selection = EDITOR_TO_SELECTION.get(editor);

    if (!selection || !selection.length) {
      return;
    }

    const [[, basePath]] = selection[0][0];
    const [[, lastPath]] = Node.children(editor, basePath, { reverse: true });

    const matrix = filledMatrix(editor, { at: basePath });

    Editor.withoutNormalizing(editor, () => {
      let rowSpan = 0;
      let colSpan = 0;
      for (let x = selection.length - 1; x >= 0; x--, rowSpan++) {
        colSpan = 0;
        for (let y = selection[x].length - 1; y >= 0; y--, colSpan++) {
          const [[, path], { rtl: colSpan, ttb }] = selection[x][y];

          y -= colSpan - 1;
          colSpan += colSpan - 1;

          // skip first cell and "fake" cells which belong to a cell with a `rowSpan`
          if (Path.equals(basePath, path) || ttb > 1) {
            continue;
          }

          // prettier-ignore
          for (const [, childPath] of Node.children(editor, path, { reverse: true })) {
            Transforms.moveNodes(editor, {
              to: Path.next(lastPath),
              at: childPath,
            });
          }

          const [[, trPath]] = Editor.nodes(editor, {
            match: isOfType(editor, 'tr'),
            at: path,
          });

          const [, sibling] = Node.children(editor, trPath);

          if (sibling) {
            Transforms.removeNodes(editor, { at: path });
            continue;
          }

          // there has to be a better way to do this
          let trIndex = 0;
          out: for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
              const [[, tdPath]] = matrix[i][j];
              if (Path.equals(tdPath, path)) {
                trIndex = i;
                break out;
              }
            }
          }

          for (let y = 0; y < matrix[trIndex].length; y++) {
            const [[, tdPath], { ttb, ltr }] = matrix[trIndex][y];
            y += ltr - 1;

            if (ttb === 1) {
              continue;
            }

            const [element] = Editor.node(editor, tdPath);
            if (isElement<CellElement>(element)) {
              const { rowSpan = 1 } = element;
              Transforms.setNodes<CellElement>(
                editor,
                { rowSpan: rowSpan - 1 },
                { at: tdPath },
              );
            }
          }

          rowSpan--;
          Transforms.removeNodes(editor, { at: trPath });
        }
      }

      // set the colSpan to 1 when merging columns that match the matrix size
      if (selection.length === matrix.length) {
        colSpan = 1;
      }

      Transforms.setNodes<CellElement>(
        editor,
        { rowSpan, colSpan },
        { at: basePath },
      );
    });
  },
  /**
   * Splits either the cell at the current selection or a specified location. If a range
   * selection is present, all cells within the range will be split.
   * @param {Location} [options.at] - Splits the cell at the specified location. If no
   * location is specified it will split the cell at the current selection
   * @param {boolean} [options.all] - If true, splits all cells in the table
   * @returns void
   */
  split(editor: Editor, options: { at?: Location; all?: boolean } = {}): void {
    const editorOptions = EDITOR_TO_WITH_TABLE_OPTIONS.get(editor);
    if (!editorOptions) {
      return;
    }

    const [table, td] = Editor.nodes(editor, {
      match: isOfType(editor, 'table', 'th', 'td'),
      at: options.at,
    });

    if (!table || !td) {
      return;
    }

    const selection = EDITOR_TO_SELECTION.get(editor) || [];
    const matrix = filledMatrix(editor, { at: options.at });

    const { blocks } = editorOptions;

    Editor.withoutNormalizing(editor, () => {
      for (let x = matrix.length - 1; x >= 0; x--) {
        for (let y = matrix[x].length - 1; y >= 0; y--) {
          const [[, path], context] = matrix[x][y];
          const { ltr: colSpan, rtl, btt: rowSpan, ttb } = context;

          if (rtl > 1) {
            // get to the start of the colSpan
            y -= rtl - 2;
            continue;
          }

          if (ttb > 1) {
            continue;
          }

          if (rowSpan === 1 && colSpan === 1) {
            continue;
          }

          let found = !!options.all;

          if (selection.length) {
            outer: for (let i = 0; !options.all && i < selection.length; i++) {
              for (let j = 0; j < selection[i].length; j++) {
                const [[, tdPath]] = selection[i][j];

                if (Path.equals(tdPath, path)) {
                  found = true;
                  break outer;
                }
              }
            }
          } else {
            const [, tdPath] = td;
            if (Path.equals(tdPath, path)) {
              found = true;
            }
          }

          if (!found) {
            continue;
          }

          const [[section]] = Editor.nodes(editor, {
            match: isOfType(editor, 'thead', 'tfoot'),
            at: path,
          });

          out: for (let r = 1; r < rowSpan; r++) {
            for (let i = y; i >= 0; i--) {
              const [[, path], { ttb }] = matrix[x + r][i];

              if (ttb !== 1) {
                continue;
              }

              for (let c = 0; c < colSpan; c++) {
                Transforms.insertNodes(
                  editor,
                  {
                    type:
                      (section as any).type === blocks.thead
                        ? blocks.th
                        : blocks.td,
                    children: [
                      {
                        type: blocks.content,
                        children: [{ text: '' }],
                      } as Node,
                    ],
                  } as Node,
                  { at: Path.next(path) },
                );
              }
              continue out;
            }

            for (let i = y; i < matrix[x].length; i++) {
              const [[, path], { ttb }] = matrix[x + r][i];

              if (ttb !== 1) {
                continue;
              }

              for (let c = 0; c < colSpan; c++) {
                Transforms.insertNodes(
                  editor,
                  {
                    type:
                      (section as any).type === blocks.thead
                        ? blocks.th
                        : blocks.td,
                    children: [
                      {
                        type: blocks.content,
                        children: [{ text: '' }],
                      } as Node,
                    ],
                  } as Node,
                  { at: [...Path.parent(path), 0] },
                );
              }
              continue out;
            }
          }

          for (let c = 1; c < colSpan; c++) {
            Transforms.insertNodes(
              editor,
              {
                type:
                  (section as any).type === blocks.thead
                    ? blocks.th
                    : blocks.td,
                children: [
                  {
                    type: blocks.content,
                    children: [{ text: '' }],
                  } as Node,
                ],
              } as Node,
              { at: Path.next(path) },
            );
          }

          Transforms.setNodes<CellElement>(
            editor,
            { rowSpan: 1, colSpan: 1 },
            { at: path },
          );
        }
      }
    });
  },
};
