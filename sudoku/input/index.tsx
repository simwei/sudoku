import { useWindowDimensions, View } from "react-native";
import { Digit } from "../scheme/BoardData";
import { NumberButton } from "./Button";

export const InputRow = () => {
  const windowDimensions = useWindowDimensions();
  return (
    <View
      style={[
        {
          rowGap: 10,
        },
        { margin: 20 },
      ]}
    >
      {(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ] as Digit[][]
      ).map((row) => (
        <View
          style={[
            {
              flexDirection: "row",
              columnGap: 10,
            },
          ]}
          key={JSON.stringify(row)}
        >
          {row.map((num) => (
            <NumberButton num={num} key={num} />
          ))}
        </View>
      ))}
    </View>
  );
};
