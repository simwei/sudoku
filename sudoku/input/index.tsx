import React from "react";
import { View, ViewStyle } from "react-native";
import { Digit } from "../scheme/BoardData";
import { NumberButton, RedoButton, ResetButton, UndoButton } from "./Button";

export const InputRow = () => {
  const rowStyle: ViewStyle = {
    flexDirection: "row",
    columnGap: 10,
  };

  const inputStyle: ViewStyle = {
    rowGap: 10,
  };

  return (
    <View style={inputStyle}>
      {(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ] as Digit[][]
      ).map((row) => (
        <View style={rowStyle} key={JSON.stringify(row)}>
          {row.map((num) => (
            <NumberButton num={num} key={num} />
          ))}
        </View>
      ))}

      {/* <ResetButton />

      <View style={rowStyle}>
        <UndoButton />
        <RedoButton />
      </View> */}
    </View>
  );
};
