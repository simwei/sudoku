import { Path } from "@shopify/react-native-skia";
import { blockGridStrokeWidth } from "../geometry/consts";
import { useGridPathDef } from "./useGridPathDef";

export const BlockGridPath = () => {
  const pathDef = useGridPathDef([3, 6], [3, 6]);
  return (
    <Path path={pathDef} style={"stroke"} strokeWidth={blockGridStrokeWidth} />
  );
};
