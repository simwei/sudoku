import { createSampleBoard } from "../dummy/createSampleBoard";
import { Board } from "./Board";

export const Sudoku = () => {
  const board = createSampleBoard();

  return <Board board={board} />;
};
