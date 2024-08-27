import { SkPath, Skia } from "@shopify/react-native-skia";
import {
  cellHeight,
  cellWidth,
  globalXMargin,
  globalYMargin,
} from "../geometry/consts";
import { getMinMaxGridCoordinates } from "./getMinMaxGridCoordinates";

export const getGridPathDef = (
  xIndices: number[],
  yIndices: number[]
): SkPath => {
  const { minX, maxX, minY, maxY } = getMinMaxGridCoordinates();
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
