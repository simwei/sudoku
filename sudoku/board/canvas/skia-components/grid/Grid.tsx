import { Path, Rect, Skia, SkPath } from "@shopify/react-native-skia";
import React from "react";
import { colors } from "../../../../colors";
import { useContainerDimensionContext } from "../../ContainerDimensionContext";
import { useEffectiveBoardRect, useEffectiveCellDimensions } from "./math";

const OuterGrid = () => {
  const { containerDimensions } = useContainerDimensionContext();
  const effectiveRect = useEffectiveBoardRect();

  return (
    <Rect
      {...effectiveRect}
      style={"stroke"}
      strokeWidth={containerDimensions.strokeWidth * 2}
    />
  );
};

const BlockGrid = () => {
  const { containerDimensions } = useContainerDimensionContext();
  const pathDef = useGridPathDef([3, 6], [3, 6]);

  return (
    <Path
      path={pathDef}
      style={"stroke"}
      strokeWidth={containerDimensions.strokeWidth * 2}
    />
  );
};

const InnerGrid = () => {
  const { containerDimensions } = useContainerDimensionContext();
  const pathDef = useGridPathDef([1, 2, 4, 5, 7, 8], [1, 2, 4, 5, 7, 8]);

  return (
    <Path
      path={pathDef}
      style={"stroke"}
      color={colors.innerBorderColor}
      strokeWidth={containerDimensions.strokeWidth}
    />
  );
};

export const Grid = () => {
  return (
    <>
      <InnerGrid />
      <BlockGrid />
      <OuterGrid />
    </>
  );
};

const useGridPathDef = (xIndices: number[], yIndices: number[]): SkPath => {
  const boardRect = useEffectiveBoardRect();
  const cellDimensions = useEffectiveCellDimensions();

  const path: SkPath = Skia.Path.Make();

  for (const xIndex of xIndices) {
    // draw vertical
    const x = xIndex * cellDimensions.width + boardRect.x;
    path.moveTo(x, boardRect.y);
    path.lineTo(x, boardRect.y + boardRect.height);
  }

  for (const yIndex of yIndices) {
    // draw horizontal
    const y = yIndex * cellDimensions.height + boardRect.y;
    path.moveTo(boardRect.x, y);
    path.lineTo(boardRect.x + boardRect.width, y);
  }

  return path;
};
