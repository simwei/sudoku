import { FiberProvider } from "its-fine";
import React from "react";
import { Text, View, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { BoardProvider, useBoardContext } from "./board/BoardContext";
import { CanvasBoard } from "./board/canvas/CanvasBoard";
import { DOMBoard } from "./board/dom/DOMBoard";
import { createSampleBoard } from "./dummy/createSampleBoard";
import { FocusProvider } from "./focus/FocusContext";
import { FontManagerProvider } from "./font/FontContext";
import { Input } from "./input";

const useCanvas = true;

export const Sudoku = () => {
  const board = createSampleBoard();

  return (
    <FiberProvider>
      <FontManagerProvider>
        <FocusProvider>
          <BoardProvider boardData={board}>
            <SudokuGame />
          </BoardProvider>
        </FocusProvider>
      </FontManagerProvider>
    </FiberProvider>
  );
};

const SudokuGame = () => {
  const { isSolving } = useBoardContext();

  if (isSolving) {
    const solvingScreenStyle: ViewStyle = {
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    };

    return (
      <View style={solvingScreenStyle}>
        <ActivityIndicator size={"large"} />
        <Text>Solving</Text>
      </View>
    );
  }

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
    <>
      <View style={boardContainer}>
        {useCanvas ? <CanvasBoard /> : <DOMBoard />}
      </View>
      <View style={inputContainer}>
        <Input />
      </View>
    </>
  );
};
