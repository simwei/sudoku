import { FitBox, rect, SkHostRect } from "@shopify/react-native-skia";
import { PropsWithChildren } from "react";
import { useTargetBoardWidth } from "../useTargetBoardWidth";
import {
  cellHeight,
  cellWidth,
  columnNumber,
  globalXMargin,
  globalYMargin,
  rowNumber,
} from "./geometry/consts";

export const getVirtualViewport = (): SkHostRect => {
  const width = cellWidth * columnNumber + globalXMargin * 2;
  const height = cellHeight * rowNumber + globalYMargin * 2;
  return rect(0, 0, width, height);
};

export const useRenderViewport = (): SkHostRect => {
  const targetBoardWidth = useTargetBoardWidth();
  return rect(0, 0, targetBoardWidth, targetBoardWidth);
};

export const translateViewport = (
  point: { x: number; y: number },
  from: SkHostRect,
  to: SkHostRect
): { x: number; y: number } => {
  return {
    x: (point.x / from.width) * to.width,
    y: (point.y / from.height) * to.height,
  };
};

export const ViewportScaler = (props: PropsWithChildren) => {
  const [src, dst] = [getVirtualViewport(), useRenderViewport()];

  return (
    <FitBox src={src} dst={dst}>
      {props.children}
    </FitBox>
  );
};
