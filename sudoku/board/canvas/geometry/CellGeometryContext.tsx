import {
  JSX,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { CellPosition } from "../../../scheme/BoardData";
import {
  cellHeight,
  cellWidth,
  columnNumber,
  globalXMargin,
  globalYMargin,
  rowNumber,
} from "./consts";
import { useSourceViewport, useTargetViewport } from "./hooks";

export type CellGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CellGeometries = [CellPosition, CellGeometry][];

const CellGeometryContext = createContext<CellGeometries | null>(null);

const useCellGeometries = () => {
  const cellGeometryContext = useContext(CellGeometryContext);
  if (cellGeometryContext === null) {
    throw Error(`CellGeometryContext is null`);
  }
  return cellGeometryContext;
};

export const CellGeometryProvider = (props: PropsWithChildren) => {
  const [cellGeometries] = useState<CellGeometries>(buildCellGeometries);

  return (
    <CellGeometryContext.Provider value={cellGeometries}>
      {props.children}
    </CellGeometryContext.Provider>
  );
};

export function getCellGeometry(position: CellPosition): CellGeometry {
  return {
    x: cellWidth * position.columnId + globalXMargin,
    y: cellHeight * position.rowId + globalYMargin,
    width: cellWidth,
    height: cellHeight,
  };
}

const buildCellGeometries = () => {
  const cellGeometries: [CellPosition, CellGeometry][] = [];
  for (let rowId = 0; rowId < rowNumber; rowId++) {
    for (let columnId = 0; columnId < columnNumber; columnId++) {
      const position = { rowId, columnId };
      cellGeometries.push([position, getCellGeometry(position)]);
    }
  }

  return cellGeometries;
};

export const useGetSourcePoint = () => {
  const targetViewport = useTargetViewport();
  const sourceViewport = useSourceViewport();

  return (targetPoint: { x: number; y: number }) => {
    return {
      x: (targetPoint.x / targetViewport.width) * sourceViewport.width,
      y: (targetPoint.y / targetViewport.height) * sourceViewport.height,
    };
  };
};

export const useGetPosition = () => {
  const cellGeometries = useCellGeometries();

  return (sourcePoint: { x: number; y: number }): CellPosition | undefined => {
    const [position] = cellGeometries.find(([_, geometry]) => {
      return (
        geometry.x <= sourcePoint.x &&
        sourcePoint.x <= geometry.x + geometry.width &&
        geometry.y <= sourcePoint.y &&
        sourcePoint.y <= geometry.y + geometry.height
      );
    }) || [undefined];

    return position;
  };
};

export const withCellGeometryProvider = <T,>(
  Component: React.ComponentType<T>
) => {
  return (props: JSX.IntrinsicAttributes & T) => (
    <CellGeometryProvider>
      <Component {...props} />
    </CellGeometryProvider>
  );
};
