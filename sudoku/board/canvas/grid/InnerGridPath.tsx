import { Path } from "@shopify/react-native-skia";
import { innerGridStrokeWidth } from "../geometry/consts";
import { useGridPathDef } from "./useGridPathDef";

export const InnerGridPath = () => {
  const pathDef = useGridPathDef([1, 2, 4, 5, 7, 8], [1, 2, 4, 5, 7, 8]);

  return (
    <Path
      path={pathDef}
      style={"stroke"}
      color={"grey"}
      strokeWidth={innerGridStrokeWidth}
    />
  );
};
