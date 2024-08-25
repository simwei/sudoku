import { createContext } from "react";
import { createSampleBoard } from "../dummy/createSampleBoard";
import { Board } from "./Board";
import { CellPosition } from "../scheme/BoardData";

export const FocusContext = createContext<CellPosition | undefined>(undefined);

export const Sudoku = () => {
  const board = createSampleBoard();

  return (
    <FocusContext.Provider value={{columnId: 1, rowId: 2}}>
      <Board board={board} />
    </FocusContext.Provider>
  );
};
