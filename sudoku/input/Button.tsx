import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { CellsContext } from "../board/canvas/CellContext";
import { colors } from "../colors";
import { useFocusContext } from "../focus/FocusContext";
import { Digit } from "../scheme/BoardData";

export const NumberButton = (props: { num: Digit }) => {
  const { updateCellData } = useContext(CellsContext);
  const { focus } = useFocusContext();
  console.log("render", props);
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? colors.buttonPressed : colors.button,
        },
        {
          borderRadius: 4,
          aspectRatio: 1,
          height: 60,
        },
        {
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
      onPress={(e) => {
        if (focus) updateCellData(focus, props.num);
      }}
    >
      <Text style={[{ fontSize: 30 }]}>{props.num.toString()}</Text>
    </Pressable>
  );
};
