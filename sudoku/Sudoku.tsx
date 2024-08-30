import { FiberProvider } from "its-fine";
import React from "react";
import { View, ViewStyle } from "react-native";
import { BoardProvider } from "./board/BoardContext";
import { CanvasBoard } from "./board/canvas/CanvasBoard";
import { DOMBoard } from "./board/dom/DOMBoard";
import { createSampleBoard } from "./dummy/createSampleBoard";
import { FocusProvider } from "./focus/FocusContext";
import { FontManagerProvider } from "./font/FontContext";
import { InputRow } from "./input";

const useCanvas = true;

export const Sudoku = () => {
  const board = createSampleBoard();

  const inputContainer: ViewStyle = {
    flexGrow: 0,
    alignItems: "center",
    padding: 20,
  };

  const boardContainer: ViewStyle = {
    flexGrow: 1,
    padding: 10,
  };

  return (
    <FiberProvider>
      <FontManagerProvider>
        <FocusProvider>
          <BoardProvider boardData={board}>
            <View style={boardContainer}>
              {useCanvas ? <CanvasBoard /> : <DOMBoard />}
            </View>
            <View style={inputContainer}>
              <InputRow />
            </View>
          </BoardProvider>
        </FocusProvider>
      </FontManagerProvider>
    </FiberProvider>
  );
};
