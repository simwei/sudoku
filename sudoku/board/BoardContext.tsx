import { applyPatches, Patch, produce, produceWithPatches } from "immer";
import React, {
  createContext,
  PropsWithChildren,
  useRef,
  useState,
} from "react";
import { BoardData, CellData, CellPosition, Digit } from "../scheme/BoardData";
import {
  cellHeight,
  cellWidth,
  globalXMargin,
  globalYMargin,
} from "./canvas/geometry/consts";

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

type CellAction =
  | {
      type: "toggleNumber";
      position?: CellPosition;
      value: Digit;
    }
  | {
      type: "toggleHint";
      position?: CellPosition;
      value: Digit;
    };

type BoardAction = { type: "resetBoard" };

type HistoryAction = { type: "undo" } | { type: "redo" };

export const BoardContext = createContext<{
  cells: Cells;
  cellDispatch: (action: CellAction) => void;
  historyDispatch: (action: HistoryAction) => void;
  boardDispatch: (action: BoardAction) => void;
}>({
  cells: [],
  cellDispatch: () => {},
  historyDispatch: () => {},
  boardDispatch: () => {},
});

export const BoardProvider = (
  props: PropsWithChildren & { boardData: BoardData }
) => {
  const [cells, setState] = useState(buildCells(props.boardData));

  const undoStack = useRef<{ patches: Patch[]; inversePatches: Patch[] }[]>([]);
  const undoStackPointer = useRef(-1);

  const cellAction = produceWithPatches((draft: Cells, action: CellAction) => {
    switch (action.type) {
      case "toggleNumber": {
        if (!action.position) {
          return;
        }
        const cell = getCell(draft, action.position);

        if (cell.cellData.type === "editable") {
          ((cellData: CellData, newDigit: Digit) => {
            if (cellData.value === newDigit) {
              // remove value when the same is entered again
              cellData.value = undefined;
            } else {
              cellData.value = newDigit;
            }
          })(cell.cellData, action.value);
        }
        break;
      }

      case "toggleHint": {
        if (!action.position) {
          return;
        }
        const cell = getCell(draft, action.position);

        if (
          cell.cellData.type === "editable" &&
          cell.cellData.value === undefined
        ) {
          ((cellData: CellData, key: Digit) => {
            if (cellData.hints === undefined) {
              cellData.hints = new Map();
            }
            cellData.hints.set(key, !cellData.hints.get(key));
          })(cell.cellData, action.value);
        }
        break;
      }
    }
  });

  const cellDispatch = (action: CellAction) => {
    if (!action.position) {
      return;
    }

    setState((currentState) => {
      return recordHistory(cellAction, currentState, action);
    });
  };

  const historyAction = produce((draft: Cells, action: HistoryAction) => {
    switch (action.type) {
      case "undo": {
        if (undoStackPointer.current < 0) {
          return;
        }
        const { inversePatches } = undoStack.current[undoStackPointer.current];
        applyPatches(draft, inversePatches);
        undoStackPointer.current--;
        break;
      }

      case "redo": {
        if (undoStackPointer.current === undoStack.current.length - 1) {
          return;
        }

        undoStackPointer.current++;

        const { patches } = undoStack.current[undoStackPointer.current];
        applyPatches(draft, patches);
        break;
      }
    }
  });

  const historyDispatch = (action: HistoryAction) => {
    setState((currentState) => {
      // don´t record history here, because it is forcefully manipulated
      return historyAction(currentState, action);
    });
  };

  const boardAction = produceWithPatches(
    (draft: Cells, action: BoardAction) => {
      switch (action.type) {
        case "resetBoard": {
          draft.forEach((cell) => {
            if (cell.cellData.type === "editable") {
              cell.cellData.value = undefined;
              cell.cellData.hints = undefined;
            }
          });
          break;
        }
      }
    }
  );

  const boardDispatch = (action: BoardAction) => {
    setState((currentState) => {
      return recordHistory(boardAction, currentState, action);
    });
  };

  const recordHistory = <S extends Cells, A extends CellAction | BoardAction>(
    actionFn: { (base: S, action: A): readonly [S, Patch[], Patch[]] },
    currentState: S,
    action: A
  ) => {
    const [nextState, patches, inversePatches] = actionFn(currentState, action);

    const pointer = ++undoStackPointer.current;
    undoStack.current.length = pointer;
    undoStack.current[pointer] = { patches, inversePatches };
    return nextState;
  };

  return (
    <BoardContext.Provider
      value={{ cells, cellDispatch, historyDispatch, boardDispatch }}
    >
      {props.children}
    </BoardContext.Provider>
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

export function getCell(cells: Cells, position: CellPosition) {
  const targetCell = cells.find(
    (cell) =>
      cell.position.columnId === position.columnId &&
      cell.position.rowId === position.rowId
  );

  if (targetCell === undefined) {
    throw Error(
      `No Cell found for ${JSON.stringify(position)} in ${JSON.stringify(cells)}}`
    );
  }
  return targetCell;
}

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
