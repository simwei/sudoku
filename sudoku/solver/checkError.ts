import {
  CellPosition,
  CellRecords,
  Digit,
  getBlockIdentifier,
} from "../scheme/BoardData";

export const checkError = (
  cells: CellRecords,
  cellData: { value?: Digit },
  position: CellPosition
) => {
  if (cellData.value === undefined) {
    return false;
  }

  return cells.some((other) => {
    const sameValue = other.cellData.value === cellData.value;

    const sameBlock =
      getBlockIdentifier(other.position) === getBlockIdentifier(position);
    const sameColumn = other.position.columnId === position.columnId;
    const sameRow = other.position.rowId === position.rowId;

    const notSamePosition = !(
      other.position.columnId === position.columnId &&
      other.position.rowId === position.rowId
    );

    const hasError =
      sameValue && (sameBlock || sameColumn || sameRow) && notSamePosition;

    return hasError;
  });
};

export const checkAnyError = (cells: CellRecords) => {
  return cells.some(({ cellData, position }) =>
    checkError(cells, cellData, position)
  );
};
