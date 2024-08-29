import { CellPosition, CellRecord } from "../../../../scheme/BoardData";
import { BoardSize, useBoardSize } from "../../../BoardContext";
import {
  ContainerDimensions,
  useContainerDimensionContext,
} from "../../ContainerDimensionContext";

type RectSize = {
  height: number;
  width: number;
};

type Rect = {
  x: number;
  width: number;
  y: number;
  height: number;
};

export const useEffectiveBoardRect = (): Rect => {
  // adds margins and centering
  const { containerDimensions } = useContainerDimensionContext();
  const boardSize = useBoardSize();

  const aspectRatio = boardSize.rows / boardSize.columns;

  const baseDimensions = withGlobalMargin(containerDimensions);

  const shrinked = shrinkToAspectRatio(baseDimensions, aspectRatio);

  const centered = center(shrinked, baseDimensions);

  return centered;
};

export function center(innerRect: Rect, outerRect: Rect) {
  return {
    ...innerRect,
    y: outerRect.y + (outerRect.height - innerRect.height) / 2,
    x: outerRect.x + (outerRect.width - innerRect.width) / 2,
  };
}

function shrinkToAspectRatio(rect: Rect, targetAspectRatio: number) {
  const currentAspectRatio = rect.height / rect.width;

  const shouldShrinkVertically = currentAspectRatio > targetAspectRatio;

  if (shouldShrinkVertically) {
    return {
      ...rect,
      height: rect.width * targetAspectRatio,
    };
  }
  return {
    ...rect,
    width: rect.height / targetAspectRatio,
  };
}

export function withGlobalMargin(containerDimensions: ContainerDimensions) {
  const xMargin = containerDimensions.strokeWidth / 2;
  const yMargin = xMargin;

  const x = xMargin;
  const width = containerDimensions.width - 2 * xMargin;

  const y = yMargin;
  const height = containerDimensions.height - 2 * yMargin;
  return { x, width, y, height };
}

export function useEffectiveCellDimensions(): RectSize {
  const boardRect = useEffectiveBoardRect();
  const boardSize = useBoardSize();

  return getEffectiveCellDimensions(boardRect, boardSize);
}

function getEffectiveCellDimensions(
  boardRect: Rect,
  boardSize: BoardSize
): RectSize {
  return {
    height: boardRect.height / boardSize.rows,
    width: boardRect.width / boardSize.columns,
  };
}

export function useEffectiveCellRect(position: CellPosition) {
  const cellDimensions = useEffectiveCellDimensions();
  const boardRect = useEffectiveBoardRect();

  return getEffectiveCellRect(cellDimensions, position, boardRect);
}

function getEffectiveCellRect(
  cellDimensions: RectSize,
  position: CellPosition,
  boardRect: Rect
) {
  return {
    x: cellDimensions.width * position.columnId + boardRect.x,
    y: cellDimensions.height * position.rowId + boardRect.y,
    width: cellDimensions.width,
    height: cellDimensions.height,
  };
}

export const getCellPosition = (
  sourcePoint: {
    x: number;
    y: number;
  },
  context: {
    cells: CellRecord[];
    cellDimensions: RectSize;
    boardRect: Rect;
  }
): CellPosition | undefined => {
  const { cells, cellDimensions, boardRect } = context;
  const cell = cells
    .map(({ position }) => {
      const geometry = getEffectiveCellRect(
        cellDimensions,
        position,
        boardRect
      );
      return {
        position,
        match:
          geometry.x <= sourcePoint.x &&
          sourcePoint.x <= geometry.x + geometry.width &&
          geometry.y <= sourcePoint.y &&
          sourcePoint.y <= geometry.y + geometry.height,
      };
    })
    .find(({ match }) => match);

  return cell?.position;
};
