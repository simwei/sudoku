import { SkPath, Skia } from "@shopify/react-native-skia";
import {
  cellHeight,
  cellWidth,
  globalXMargin,
  globalYMargin,
} from "../geometry/consts";
import { useMinMaxGridCoordinates } from "./useMinMaxGridCoordinates";

export const useGridPathDef = (
  xIndices: number[],
  yIndices: number[]
): SkPath => {
  const { minX, maxX, minY, maxY } = useMinMaxGridCoordinates();
  const path: SkPath = Skia.Path.Make();

  for (const xIndex of xIndices) {
    // draw vertical
    const x = xIndex * cellWidth + globalXMargin;
    path.moveTo(x, minY);
    path.lineTo(x, maxY);
  }

  for (const yIndex of yIndices) {
    // draw horizontal
    const y = yIndex * cellHeight + globalYMargin;
    path.moveTo(minX, y);
    path.lineTo(maxX, y);
  }

  return path;
};
