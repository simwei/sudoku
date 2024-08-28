import { FiberProvider } from "its-fine";
import React from "react";
import { BoardProvider } from "./board/BoardContext";
import { CanvasBoard } from "./board/canvas";
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
          <BoardProvider boardData={board}>
            {useCanvas ? <CanvasBoard /> : <DOMBoard />}
            <InputRow />
          </BoardProvider>
        </FocusProvider>
      </FontManagerProvider>
    </FiberProvider>
  );
};
