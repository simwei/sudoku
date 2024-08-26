import { useWindowDimensions } from "react-native";

export const useTargetBoardWidth = () => {
  const dimensions = useWindowDimensions();
  const minWindowDimension = Math.min(dimensions.height, dimensions.width);
  return minWindowDimension * 0.9;
};
