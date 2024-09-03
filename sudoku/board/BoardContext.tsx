import { applyPatches, Patch, produce, produceWithPatches } from "immer";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from "react";
import { Alert } from "react-native";
import {
  BoardData,
  CellData,
  CellPosition,
  CellRecords,
  Digit,
} from "../scheme/BoardData";
import { solveBruteForce } from "../solver/bruteForce";
import { checkAnyError } from "../solver/checkError";

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

type CheckAction = { type: "check" };

type HistoryAction = { type: "undo" } | { type: "redo" };

type SolverAction =
  | { type: "solve" }
  | { type: "solved-board"; cells: CellRecords };

const BoardContext = createContext<{
  cells: CellRecords;
  cellDispatch: (action: CellAction) => void;
  historyDispatch: (action: HistoryAction) => void;
  boardDispatch: (action: BoardAction) => void;
  checkDispatch: (action: CheckAction) => void;
  solverDispatch: (action: SolverAction) => void;
} | null>(null);

export const useBoardContext = () => {
  const boardContext = useContext(BoardContext);
  if (boardContext === null) {
    throw Error(`BoardContext is null`);
  }
  return boardContext;
};

export const BoardProvider = (
  props: PropsWithChildren & { boardData: BoardData }
) => {
  const [cells, setState] = useState(buildCells(props.boardData));

  const undoStack = useRef<{ patches: Patch[]; inversePatches: Patch[] }[]>([]);
  const undoStackPointer = useRef(-1);

  const cellAction = produceWithPatches(
    (draft: CellRecords, action: CellAction) => {
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
    }
  );

  const cellDispatch = (action: CellAction) => {
    if (!action.position) {
      return;
    }

    setState((currentState) => {
      return recordHistory(cellAction, currentState, action);
    });
  };

  const historyAction = produce((draft: CellRecords, action: HistoryAction) => {
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
    (draft: CellRecords, action: BoardAction) => {
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

  const checkAction = produce((draft: CellRecords, action: CheckAction) => {
    switch (action.type) {
      case "check": {
        if (checkAnyError(draft)) {
          Alert.alert("Oh no...", "You have made an error");
          break;
        }
        if (draft.some(({ cellData }) => cellData.value === undefined)) {
          Alert.alert(
            "You're doing good",
            "But you have not entered all numbers"
          );
          break;
        }

        Alert.alert("Congratulations", "You have solved the puzzle");
        break;
      }
    }
  });

  const checkDispatch = (action: CheckAction) => {
    setState((currentState) => {
      // don´t record history here, we do not change the board
      return checkAction(currentState, action);
    });
  };

  const solverAction = produceWithPatches(
    (draft: CellRecords, action: SolverAction) => {
      switch (action.type) {
        case "solve": {
          break;
        }
        case "solved-board": {
          draft.forEach((cell) => {
            cell.cellData = getCell(action.cells, cell.position).cellData;
          });
        }
      }
    }
  );

  const solverDispatch = (action: SolverAction) => {
    setState((currentState) => {
      return recordHistory(solverAction, currentState, action);
    });
  };

  const recordHistory = <
    S extends CellRecords,
    A extends CellAction | BoardAction | SolverAction,
  >(
    actionFn: { (base: S, action: A): readonly [S, Patch[], Patch[]] },
    currentState: S,
    action: A
  ) => {
    const [nextState, patches, inversePatches] = actionFn(currentState, action);

    if (patches.length === 0 && inversePatches.length === 0) {
      return nextState;
    }

    const pointer = ++undoStackPointer.current;
    undoStack.current.length = pointer;
    undoStack.current[pointer] = { patches, inversePatches };
    return nextState;
  };

  return (
    <BoardContext.Provider
      value={{
        cells,
        cellDispatch,
        historyDispatch,
        boardDispatch,
        checkDispatch,
        solverDispatch,
      }}
    >
      {props.children}
    </BoardContext.Provider>
  );
};

const buildCells = (board: BoardData) => {
  const cells: CellRecords = [];
  for (let [rowId, row] of board.rows.entries()) {
    for (let [columnId, cellData] of row.cells.entries()) {
      cells.push({
        cellData: { ...cellData },
        position: { rowId, columnId },
      });
    }
  }

  return cells;
};

function getCell(cells: CellRecords, position: CellPosition) {
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

export const useBoardSize = (): BoardSize => {
  const { cells } = useBoardContext();
  return {
    rows: getNumRows(cells),
    columns: getNumColumns(cells),
  };
};

export const useBoardAspectRatio = (): number => {
  // aspect ratio = width / height (as in CSS)
  const boardSize = useBoardSize();
  return boardSize.columns / boardSize.rows;
};

export type BoardSize = {
  rows: number;
  columns: number;
};

const getNumRows = (cells: CellRecords): number => {
  const sorted = [...cells].sort((a, b) => a.position.rowId - b.position.rowId);
  return (
    sorted[sorted.length - 1].position.rowId - sorted[0].position.rowId + 1
  );
};

const getNumColumns = (cells: CellRecords): number => {
  const sorted = [...cells].sort(
    (a, b) => a.position.columnId - b.position.columnId
  );
  return (
    sorted[sorted.length - 1].position.columnId -
    sorted[0].position.columnId +
    1
  );
};
