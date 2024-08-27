import { BoardData, CellData, isDigit, RowData } from "../scheme/BoardData";

export function createSampleBoard(): BoardData {
  const data: { [row in number]?: { [col in number]?: number } } = {
    1: { 1: 1, 2: 7, 6: 4 },
    2: { 1: 8, 6: 6, 8: 3 },
    3: { 6: 1, 9: 5 },
    4: { 5: 9, 7: 4 },
    5: { 1: 7, 2: 9, 8: 8 },
    6: { 2: 1, 3: 6 },
    7: { 6: 2, 7: 5 },
    8: { 3: 9, 5: 1, 7: 7 },
    9: { 5: 3, 7: 6, 9: 2 },
  };

  const rows = new Array<RowData>();
  for (let rowId of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    const cells = new Array<CellData>();

    for (let columnId of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      const value = data[rowId]?.[columnId];

      if (isDigit(value) || value === undefined) {
        const isInitial = isDigit(value);
        const cell: CellData = {
          value,
          type: isInitial ? "given" : "editable",
        };
        cells.push(cell);
        continue;
      }

      throw Error(
        `${value} on position (${rowId}, ${columnId}) is not a valid digit)`
      );
    }

    rows.push({ cells });
  }
  return { rows };
}
