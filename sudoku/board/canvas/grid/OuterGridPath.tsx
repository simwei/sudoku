import { Rect } from "@shopify/react-native-skia";
import {
  outerGridStrokeWidth,
  totalHeight,
  totalWidth,
} from "../geometry/consts";
import { useMinMaxGridCoordinates } from "./useMinMaxGridCoordinates";

export const OuterGridPath = () => {
  const { minX, minY } = useMinMaxGridCoordinates();

  return (
    <Rect
      x={minX}
      y={minY}
      width={totalWidth}
      height={totalHeight}
      style={"stroke"}
      strokeWidth={outerGridStrokeWidth}
    />
  );
};
