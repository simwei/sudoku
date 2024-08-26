import {
  globalXMargin,
  globalYMargin,
  totalHeight,
  totalWidth,
} from "../geometry/consts";

export const useMinMaxGridCoordinates = () => {
  const minX = globalXMargin;
  const maxX = totalWidth - 1 + globalXMargin;

  const minY = globalYMargin;
  const maxY = totalHeight - 1 + globalYMargin;

  return { minX, maxX, minY, maxY };
};
