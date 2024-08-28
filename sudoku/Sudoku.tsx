import { FiberProvider } from "its-fine";
import React from "react";
import { CanvasBoard } from "./board/canvas";
import { CellsProvider } from "./board/canvas/CellContext";
import { DOMBoard } from "./board/dom";
import { createSampleBoard } from "./dummy/createSampleBoard";
import { FocusProvider } from "./focus/FocusContext";
import { FontManagerProvider } from "./font/FontContext";
import { InputRow } from "./input";

const useCanvas = true;

export const Sudoku = () => {
  const board = createSampleBoard();

  return (
    <FiberProvider>
      <FontManagerProvider>
        <FocusProvider>
          <CellsProvider board={board}>
            {useCanvas ? <CanvasBoard /> : <DOMBoard />}
            <InputRow />
          </CellsProvider>
        </FocusProvider>
      </FontManagerProvider>
    </FiberProvider>
  );
};
