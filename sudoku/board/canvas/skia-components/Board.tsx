import React from "react";
import { useBoardContext } from "../../BoardContext";
import { Cell } from "./Cell";
import { Grid } from "./grid/Grid";

export const BoardComponent = () => {
  const { cells } = useBoardContext();

  return (
    <>
      {cells.map((cell) => (
        <Cell
          {...cell}
          key={`${cell.position.rowId}-${cell.position.columnId}`}
        />
      ))}
      <Grid />
    </>
  );
};
