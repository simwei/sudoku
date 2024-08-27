import { Rect } from "@shopify/react-native-skia";
import React from "react";
import {
  outerGridStrokeWidth,
  totalHeight,
  totalWidth,
} from "../geometry/consts";
import { getMinMaxGridCoordinates } from "./getMinMaxGridCoordinates";

export const OuterGridPath = () => {
  const { minX, minY } = getMinMaxGridCoordinates();

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
