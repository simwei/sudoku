import {
  cellHeight,
  cellWidth,
  columnNumber,
  globalXMargin,
  globalYMargin,
} from "../geometry/consts";

export const getMinMaxGridCoordinates = () => {
  const minX = globalXMargin;
  const maxX = cellWidth * columnNumber - 1 + globalXMargin;

  const minY = globalYMargin;
  const maxY = cellHeight * columnNumber - 1 + globalYMargin;

  return { minX, maxX, minY, maxY };
};
