import { CellPosition, CellRecords, Digit } from "../scheme/BoardData";
import { checkAnyError, checkError } from "./checkError";

const insertValue = (
  cells: CellRecords,
  value: Digit,
  targetPosition: CellPosition,
  emptyPositions: CellPosition[]
): CellRecords | false => {
  if (checkError(cells, { value }, targetPosition)) {
    return false;
  }

  cells.forEach((cell) => {
    if (
      cell.position.columnId === targetPosition.columnId &&
      cell.position.rowId === targetPosition.rowId
    ) {
      cell.cellData.value = value;
    }
  });

  const solved = solve(cells, emptyPositions);

  if (solved === false) {
    const targetCell = cells.find(
      (cell) =>
        cell.position.columnId === targetPosition.columnId &&
        cell.position.rowId === targetPosition.rowId
    );
    if (targetCell) {
      targetCell.cellData.value = undefined;
    }
    return false;
  }

  return solved;
};

export const solveBruteForce = async (cells: CellRecords) => {
  return new Promise<CellRecords | false>((resolve) => {
    if (checkAnyError(cells)) {
      resolve(false);
      return;
    } // sanity check

    const emptyPositions = cells
      .filter(({ cellData }) => cellData.value === undefined)
      .map(({ position }) => position)
      .toReversed();

    const solved = solve(cells, emptyPositions);

    resolve(solved);
  });
};

const solve = (cells: CellRecords, emptyPositions: CellPosition[]) => {
  const nextPosition = emptyPositions.pop();

  if (!nextPosition) {
    return cells;
  }

  for (let digit: Digit = 1; digit <= 9; digit++) {
    const cellsWithInserted = insertValue(
      cells,
      digit as Digit,
      nextPosition,
      emptyPositions
    );
    if (cellsWithInserted !== false) {
      return cellsWithInserted;
    }
  }

  emptyPositions.push(nextPosition);
  return false;
};
