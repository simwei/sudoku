import { Path } from "@shopify/react-native-skia";
import React from "react";
import { blockGridStrokeWidth } from "../geometry/consts";
import { getGridPathDef } from "./getGridPathDef";

export const BlockGridPath = () => {
  const pathDef = getGridPathDef([3, 6], [3, 6]);
  return (
    <Path path={pathDef} style={"stroke"} strokeWidth={blockGridStrokeWidth} />
  );
};
