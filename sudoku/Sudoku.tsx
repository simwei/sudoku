import { FiberProvider } from "its-fine";
import { CanvasBoard } from "./board/canvas";
import { DOMBoard } from "./board/dom";
import { createSampleBoard } from "./dummy/createSampleBoard";
import { FocusProvider } from "./focus/FocusContext";
import { FontManagerProvider } from "./font/FontContext";

export const Sudoku = () => {
  const board = createSampleBoard();

  return (
    <FiberProvider>
      <FontManagerProvider>
        <FocusProvider>
          {/* <DOMBoard board={board} /> */}
          <CanvasBoard board={board} />
        </FocusProvider>
      </FontManagerProvider>
    </FiberProvider>
  );
};
