import structuredClone from "@ungap/structured-clone";
import React from "react";
import { Alert, Pressable, Text, TextStyle, ViewStyle } from "react-native";
import { useBoardContext } from "../board/BoardContext";
import { colors } from "../colors";
import { useFocusContext } from "../focus/FocusContext";
import { Digit } from "../scheme/BoardData";
import { solveBruteForce } from "../solver/bruteForce";

const basicButtonStyle = (pressed?: boolean): ViewStyle => {
  return {
    borderRadius: 4,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: pressed ? colors.buttonPressed : colors.button,
  };
};

const basicTextStyle: TextStyle = { fontSize: 30, fontFamily: "Varela" };
const hintTextStyle: TextStyle = { fontSize: 10, fontFamily: "Varela" };

export const NumberButton = (props: { num: Digit }) => {
  const { cellDispatch } = useBoardContext();
  const { focus } = useFocusContext();

  return (
    <Pressable
      style={({ pressed }) => [basicButtonStyle(pressed), { aspectRatio: 1 }]}
      onPress={(_) => {
        cellDispatch({
          type: "toggleNumber",
          position: focus,
          value: props.num,
        });
      }}
      onLongPress={(_) => {
        cellDispatch({
          type: "toggleHint",
          position: focus,
          value: props.num,
        });
      }}
    >
      <Text style={basicTextStyle}>{props.num.toString()}</Text>
    </Pressable>
  );
};

export const HintButton = (props: { num: Digit }) => {
  const { cellDispatch } = useBoardContext();
  const { focus } = useFocusContext();

  return (
    <Pressable
      style={({ pressed }) => [basicButtonStyle(pressed), { aspectRatio: 1 }]}
      onPress={(_) => {
        cellDispatch({
          type: "toggleHint",
          position: focus,
          value: props.num,
        });
      }}
    >
      <Text style={hintTextStyle}>{props.num.toString()}</Text>
    </Pressable>
  );
};

export const ResetButton = () => {
  const { boardDispatch } = useBoardContext();

  return (
    <Pressable
      style={({ pressed }) => [basicButtonStyle(pressed), { flex: 1 }]}
      onPress={(_) => {
        boardDispatch({ type: "resetBoard" });
      }}
    >
      <Text style={basicTextStyle}>reset</Text>
    </Pressable>
  );
};

export const UndoButton = () => {
  const { historyDispatch } = useBoardContext();

  return (
    <Pressable
      style={({ pressed }) => [basicButtonStyle(pressed), { flex: 1 }]}
      onPress={(_) => {
        historyDispatch({ type: "undo" });
      }}
    >
      <Text style={basicTextStyle}>undo</Text>
    </Pressable>
  );
};

export const RedoButton = () => {
  const { historyDispatch } = useBoardContext();

  return (
    <Pressable
      style={({ pressed }) => [basicButtonStyle(pressed), { flex: 1 }]}
      onPress={(_) => {
        historyDispatch({ type: "redo" });
      }}
    >
      <Text style={basicTextStyle}>redo</Text>
    </Pressable>
  );
};

export const CheckButton = () => {
  const { checkDispatch } = useBoardContext();

  return (
    <Pressable
      style={({ pressed }) => [basicButtonStyle(pressed), { flex: 1 }]}
      onPress={(_) => {
        checkDispatch({ type: "check" });
      }}
    >
      <Text style={basicTextStyle}>check</Text>
    </Pressable>
  );
};

export const SolveButton = () => {
  const { cells, solverDispatch, isSolving, setIsSolving } = useBoardContext();

  return (
    <Pressable
      style={({ pressed }) => [basicButtonStyle(pressed), { flex: 1 }]}
      onPress={(_) => {
        setIsSolving(true);
        Alert.alert("Warning", "This operation might take a long time", [
          {
            text: "Continue",
            onPress: async () => {
              const inputCells = structuredClone(cells);
              const solved = await solveBruteForce(inputCells);
              if (solved !== false) {
                solverDispatch({ type: "solved-board", cells: solved });
              } else {
                Alert.alert(
                  "Houston, we have a problem",
                  "This board is not solvable"
                );
              }
              setIsSolving(false);
            },
          },
          { text: "Abort", onPress: () => setIsSolving(false) },
        ]);
      }}
    >
      <Text style={basicTextStyle}>{isSolving ? "..." : "solve"}</Text>
    </Pressable>
  );
};
