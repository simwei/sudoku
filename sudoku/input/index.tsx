import React, { Reducer, useReducer } from "react";
import { View, ViewStyle } from "react-native";
import { IconButton } from "react-native-paper";
import Animated from "react-native-reanimated";
import { Digit } from "../scheme/BoardData";
import {
  CheckButton,
  HintButton,
  NumberButton,
  RedoButton,
  ResetButton,
  SolveButton,
  UndoButton,
} from "./Button";

type InputType = "nine-digits" | "nine-hints" | "utilities";

const inputTypeReducer: Reducer<
  {
    showLeft: boolean;
    showRight: boolean;
    inputType: InputType;
  },
  { type: "left" | "right" }
> = (state, action) => {
  switch (state.inputType) {
    case "nine-digits": {
      switch (action.type) {
        case "left": {
          return {
            showLeft: false,
            showRight: true,
            inputType: "nine-hints",
          };
        }

        case "right": {
          return {
            showLeft: true,
            showRight: false,
            inputType: "utilities",
          };
        }
      }
      break;
    }
    case "nine-hints": {
      switch (action.type) {
        case "left": {
          return {
            ...state,
          };
        }

        case "right": {
          return { showLeft: true, showRight: true, inputType: "nine-digits" };
        }
      }
      break;
    }
    case "utilities": {
      switch (action.type) {
        case "left": {
          return {
            showLeft: true,
            showRight: true,
            inputType: "nine-digits",
          };
        }

        case "right": {
          return {
            ...state,
          };
        }
      }
      break;
    }
  }
};

export const Input = () => {
  const [inputState, dispatchState] = useReducer(inputTypeReducer, {
    inputType: "nine-digits",
    showLeft: true,
    showRight: true,
  });

  const inputStyle: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 200,
  };

  return (
    <View style={inputStyle}>
      <IconButton
        icon={"arrow-left"}
        disabled={!inputState.showLeft}
        onPress={() => dispatchState({ type: "left" })}
      />

      {inputState.inputType === "nine-digits" && <NineDigits />}
      {inputState.inputType === "nine-hints" && <NineHints />}
      {inputState.inputType === "utilities" && <Utilities />}

      <IconButton
        disabled={!inputState.showRight}
        icon={"arrow-right"}
        onPress={() => dispatchState({ type: "right" })}
      />
    </View>
  );
};

const NineDigits = () => {
  const rowStyle: ViewStyle = {
    flexDirection: "row",
    columnGap: 10,
  };

  const inputStyle: ViewStyle = {
    rowGap: 10,
  };

  return (
    <Animated.View style={inputStyle}>
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
    </Animated.View>
  );
};

const NineHints = () => {
  const rowStyle: ViewStyle = {
    flexDirection: "row",
    columnGap: 10,
  };

  const inputStyle: ViewStyle = {
    rowGap: 10,
  };

  return (
    <Animated.View style={inputStyle}>
      {(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ] as Digit[][]
      ).map((row) => (
        <View style={rowStyle} key={JSON.stringify(row)}>
          {row.map((num) => (
            <HintButton num={num} key={num} />
          ))}
        </View>
      ))}
    </Animated.View>
  );
};

const Utilities = () => {
  const rowStyle: ViewStyle = {
    flexDirection: "row",
    columnGap: 10,
    width: 200,
  };

  const inputStyle: ViewStyle = {
    rowGap: 10,
  };

  return (
    <Animated.View style={inputStyle}>
      <View style={rowStyle}>
        <UndoButton />
        <RedoButton />
      </View>
      <View style={rowStyle}>
        <ResetButton />
      </View>
      <View style={rowStyle}>
        <SolveButton />
        <CheckButton />
      </View>
    </Animated.View>
  );
};
