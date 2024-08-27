import { FiberProvider } from "its-fine";
import { CanvasBoard } from "./board/canvas";
import { CellsProvider } from "./board/canvas/CellContext";
import { DOMBoard } from "./board/dom";
import { createSampleBoard } from "./dummy/createSampleBoard";
import { FocusProvider } from "./focus/FocusContext";
import { FontManagerProvider } from "./font/FontContext";
import { InputRow } from "./input";
import { NumberButton } from "./input/Button";

export const Sudoku = () => {
  const board = createSampleBoard();

  return (
    <FiberProvider>
      <FontManagerProvider>
        <FocusProvider>
          {/* <DOMBoard board={board} /> */}
          <CellsProvider board={board}>
            <CanvasBoard />
            <InputRow />
          </CellsProvider>
        </FocusProvider>
      </FontManagerProvider>
    </FiberProvider>
  );
};
