import { Editor, Location } from 'slate';
import { matrices } from './matrices';
import { NodeEntryWithContext } from './types';

export function filledMatrix(
  editor: Editor,
  options: { at?: Location } = {},
): NodeEntryWithContext[][] {
  const filled: NodeEntryWithContext[][] = [];

  // Expand each section separately to avoid sections collapsing into each other.
  for (const matrix of matrices(editor, { at: options.at })) {
    const filledSection: NodeEntryWithContext[][] = [];

    // First pass: calculate the maximum dimensions needed
    let maxRows = 0;
    let maxCols = 0;

    for (let x = 0; x < matrix.length; x++) {
      maxRows = Math.max(maxRows, x + 1);
      for (let y = 0; y < matrix[x].length; y++) {
        const [{ rowSpan = 1, colSpan = 1 }] = matrix[x][y];
        maxRows = Math.max(maxRows, x + rowSpan);
        maxCols = Math.max(maxCols, y + colSpan);
      }
    }

    // Initialize the filled matrix with proper dimensions
    for (let x = 0; x < maxRows; x++) {
      filledSection[x] = new Array(maxCols).fill(null);
    }

    // Second pass: fill the matrix
    for (let x = 0; x < matrix.length; x++) {
      for (let y = 0, offset = 0; y < matrix[x].length; y++) {
        const [{ rowSpan = 1, colSpan = 1 }] = matrix[x][y];

        // Find the next available position in this row
        let startCol = y + offset;
        while (startCol < maxCols && filledSection[x][startCol]) {
          startCol++;
        }

        // Fill the cells for this element
        for (let r = 0; r < rowSpan && x + r < maxRows; r++) {
          for (let c = 0; c < colSpan && startCol + c < maxCols; c++) {
            if (!filledSection[x + r]) {
              filledSection[x + r] = new Array(maxCols).fill(null);
            }

            filledSection[x + r][startCol + c] = [
              matrix[x][y], // entry
              {
                rtl: c + 1,
                ltr: colSpan - c,
                ttb: r + 1,
                btt: rowSpan - r,
              },
            ];
          }
        }

        // Update offset for next iteration
        offset = startCol + colSpan - y - 1;
      }
    }

    // Filter out null entries and ensure consistent structure
    const cleanedSection = filledSection
      .map((row) => row.filter((cell) => cell !== null))
      .filter((row) => row.length > 0);

    filled.push(...cleanedSection);
  }

  return filled;
}
