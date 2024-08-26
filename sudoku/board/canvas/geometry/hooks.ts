import { rect, SkHostRect } from "@shopify/react-native-skia";
import { useTargetBoardWidth } from "../../useTargetBoardWidth";
import {
  cellHeight,
  cellWidth,
  columnNumber,
  globalXMargin,
  globalYMargin,
  rowNumber,
} from "./consts";

export const useSourceViewport = (): SkHostRect => {
  const width = cellWidth * columnNumber + globalXMargin * 2;
  const height = cellHeight * rowNumber + globalYMargin * 2;
  return rect(0, 0, width, height);
};

export const useTargetViewport = (): SkHostRect => {
  const targetBoardWidth = useTargetBoardWidth();
  return rect(0, 0, targetBoardWidth, targetBoardWidth);
};
