import React, { PropsWithChildren, createContext } from "react";
import { useImmer } from "use-immer";
import {
  BoardData,
  CellData,
  CellPosition,
  Digit,
} from "../../scheme/BoardData";
import {
  cellHeight,
  cellWidth,
  globalXMargin,
  globalYMargin,
} from "./geometry/consts";

type CellGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Cell = {
  position: CellPosition;
  cellData: CellData;
  geometry: CellGeometry;
};

type Cells = Cell[];

type UpdateCellDataFn = (position: CellPosition, update: UpdateValue) => void;

type UpdateValue = Digit | undefined;

export const CellsContext = createContext<{
  cells: Cells;
  updateCellData: UpdateCellDataFn;
}>({ cells: [], updateCellData: () => {} });

export const CellsProvider = (
  props: PropsWithChildren & { board: BoardData }
) => {
  const [cells, setCells] = useImmer(buildCells(props.board));

  const updateCellData = (position: CellPosition, update: UpdateValue) => {
    const foundIndex = cells.findIndex(
      (cell) =>
        cell.position.columnId === position.columnId &&
        cell.position.rowId === position.rowId
    );

    if (foundIndex === -1) {
      throw Error(`Invalid Position ${position}`);
    }

    if (cells[foundIndex].cellData.value === update) {
      return;
    }

    if (cells[foundIndex].cellData.type !== "editable") {
      return;
    }

    setCells((oldCells) => {
      oldCells[foundIndex].cellData.value = update;
    });
  };

  return (
    <CellsContext.Provider value={{ cells, updateCellData }}>
      {props.children}
    </CellsContext.Provider>
  );
};

function calculateCellGeometry(position: CellPosition): CellGeometry {
  return {
    x: cellWidth * position.columnId + globalXMargin,
    y: cellHeight * position.rowId + globalYMargin,
    width: cellWidth,
    height: cellHeight,
  };
}

const buildCells = (board: BoardData) => {
  const cells: Cells = [];
  for (let [rowId, row] of board.rows.entries()) {
    for (let [columnId, cellData] of row.cells.entries()) {
      const position = { rowId, columnId };
      cells.push({
        cellData,
        position: { rowId, columnId },
        geometry: calculateCellGeometry(position),
      });
    }
  }

  return cells;
};

export const getCellPosition = (
  cells: Cells,
  sourcePoint: {
    x: number;
    y: number;
  }
): CellPosition | undefined => {
  const cell = cells.find(({ geometry }) => {
    return (
      geometry.x <= sourcePoint.x &&
      sourcePoint.x <= geometry.x + geometry.width &&
      geometry.y <= sourcePoint.y &&
      sourcePoint.y <= geometry.y + geometry.height
    );
  });

  return cell?.position;
};
