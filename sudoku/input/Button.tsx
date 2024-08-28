import React, { useContext } from "react";
import { Pressable, Text, TextStyle, ViewStyle } from "react-native";
import { CellsContext } from "../board/canvas/CellContext";
import { colors } from "../colors";
import { useFocusContext } from "../focus/FocusContext";
import { Digit } from "../scheme/BoardData";

export const NumberButton = (props: { num: Digit }) => {
  const { dispatch } = useContext(CellsContext);
  const { focus } = useFocusContext();

  const textStyle: TextStyle = { fontSize: 30, fontFamily: "Varela" };

  const buttonStyle: ViewStyle = {
    borderRadius: 4,
    aspectRatio: 1,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyle,
        { backgroundColor: pressed ? colors.buttonPressed : colors.button },
      ]}
      onPress={(_) => {
        if (focus) {
          dispatch({ type: "toggleNumber", position: focus, value: props.num });
        }
      }}
      onLongPress={(_) => {
        if (focus) {
          dispatch({ type: "toggleHint", position: focus, value: props.num });
        }
      }}
    >
      <Text style={textStyle}>{props.num.toString()}</Text>
    </Pressable>
  );
};

export const ResetButton = () => {
  const { dispatch } = useContext(CellsContext);
  const { focus } = useFocusContext();

  const textStyle: TextStyle = { fontSize: 30, fontFamily: "Varela" };

  const buttonStyle: ViewStyle = {
    borderRadius: 4,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyle,
        { backgroundColor: pressed ? colors.buttonPressed : colors.button },
      ]}
      onPress={(_) => {
        if (focus) {
          dispatch({ type: "resetBoard" });
        }
      }}
    >
      <Text style={textStyle}>reset</Text>
    </Pressable>
  );
};
