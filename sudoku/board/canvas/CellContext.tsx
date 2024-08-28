import React, { PropsWithChildren, createContext } from "react";
import { ImmerReducer, useImmerReducer } from "use-immer";
import {
  BoardData,
  CellData,
  CellPosition,
  Digit,
} from "../../scheme/BoardData";
import {
  cellHeight,
  cellWidth,
  globalXMargin,
  globalYMargin,
} from "./geometry/consts";

type CellGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Cell = {
  position: CellPosition;
  cellData: CellData;
  geometry: CellGeometry;
};

type Cells = Cell[];

type Action =
  | {
      type: "toggleNumber";
      position: CellPosition;
      value: Digit;
    }
  | {
      type: "toggleHint";
      position: CellPosition;
      value: Digit;
    }
  | { type: "resetBoard" };

export const CellsContext = createContext<{
  cells: Cells;
  dispatch: (action: Action) => void;
}>({ cells: [], dispatch: () => {} });

const reducer: ImmerReducer<Cells, Action> = (draft, action: Action) => {
  switch (action.type) {
    case "toggleNumber": {
      const cell = getCell(draft, action.position);

      if (cell.cellData.type === "editable") {
        toggleNumber(cell.cellData, action.value);
      }
      break;
    }

    case "toggleHint": {
      const cell = getCell(draft, action.position);
      if (
        cell.cellData.type === "editable" &&
        cell.cellData.value === undefined
      ) {
        toggleHint(cell.cellData, action.value);
      }
      break;
    }

    case "resetBoard": {
      resetBoard(draft);
      break;
    }

    default: {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const _: never = action;
    }
  }
};

function getCell(draft: Cells, position: CellPosition) {
  const targetCell = draft.find(
    (cell) =>
      cell.position.columnId === position.columnId &&
      cell.position.rowId === position.rowId
  );

  if (targetCell === undefined) {
    throw Error(
      `No Cell found for ${JSON.stringify(position)} in ${JSON.stringify(draft)}}`
    );
  }
  return targetCell;
}

const resetBoard = (draft: Cells) => {
  draft.forEach((cell) => {
    if (cell.cellData.type === "editable") {
      cell.cellData.value = undefined;
      cell.cellData.hints = undefined;
    }
  });
};

const toggleHint = (cellData: CellData, key: Digit) => {
  if (cellData.hints === undefined) {
    cellData.hints = new Map();
  }
  cellData.hints.set(key, !cellData.hints.get(key));
};

const toggleNumber = (cellData: CellData, newDigit: Digit) => {
  if (cellData.value === newDigit) {
    // remove value when the same is entered again
    cellData.value = undefined;
  } else {
    cellData.value = newDigit;
  }
};

export const CellsProvider = (
  props: PropsWithChildren & { board: BoardData }
) => {
  const [cells, dispatch] = useImmerReducer(reducer, buildCells(props.board));

  return (
    <CellsContext.Provider value={{ cells, dispatch }}>
      {props.children}
    </CellsContext.Provider>
  );
};

function calculateCellGeometry(position: CellPosition): CellGeometry {
  return {
    x: cellWidth * position.columnId + globalXMargin,
    y: cellHeight * position.rowId + globalYMargin,
    width: cellWidth,
    height: cellHeight,
  };
}

const buildCells = (board: BoardData) => {
  const cells: Cells = [];
  for (let [rowId, row] of board.rows.entries()) {
    for (let [columnId, cellData] of row.cells.entries()) {
      const position = { rowId, columnId };
      cells.push({
        cellData: { ...cellData },
        position: { rowId, columnId },
        geometry: calculateCellGeometry(position),
      });
    }
  }

  return cells;
};

export const getCellPosition = (
  cells: Cells,
  sourcePoint: {
    x: number;
    y: number;
  }
): CellPosition | undefined => {
  const cell = cells.find(({ geometry }) => {
    return (
      geometry.x <= sourcePoint.x &&
      sourcePoint.x <= geometry.x + geometry.width &&
      geometry.y <= sourcePoint.y &&
      sourcePoint.y <= geometry.y + geometry.height
    );
  });

  return cell?.position;
};
