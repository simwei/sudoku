import {
  Canvas,
  Paragraph,
  Rect,
  Skia,
  TextAlign,
  useTouchHandler,
} from "@shopify/react-native-skia";
import { useContextBridge } from "its-fine";
import { useContext } from "react";
import { useBackgroundColor } from "../../colors";
import { useFocusContext } from "../../focus/FocusContext";
import { useFontManager } from "../../font/FontContext";
import { BoardData } from "../../scheme/BoardData";
import { useTargetBoardWidth } from "../useTargetBoardWidth";
import {
  Cell,
  CellsContext,
  CellsProvider,
  getCellPosition,
} from "./CellContext";
import { canvasMainFontSize } from "./geometry/consts";
import { BlockGridPath } from "./grid/BlockGridPath";
import { InnerGridPath } from "./grid/InnerGridPath";
import { OuterGridPath } from "./grid/OuterGridPath";
import {
  getVirtualViewport,
  translateViewport,
  useRenderViewport,
  ViewportScaler,
} from "./ViewportScaler";

export const CanvasBoard = () => {
  return <CanvasManager />;
};

const CanvasManager = () => {
  const ContextBridge = useContextBridge();

  const targetBoardDimension = useTargetBoardWidth();
  const renderViewport = useRenderViewport();
  const virtualViewport = getVirtualViewport();

  const { cells } = useContext(CellsContext);

  const { setFocus } = useFocusContext();

  const onTouch = useTouchHandler(
    {
      onStart: (touchInfo) => {
        const cellPosition = getCellPosition(
          cells,
          translateViewport(touchInfo, renderViewport, virtualViewport)
        );
        setFocus(cellPosition);
      },
    },
    [setFocus, renderViewport, cells] // CAUTION: deps not supported by eslint
  );

  console.log("update Canvas");
  return (
    <Canvas
      style={{
        width: targetBoardDimension,
        height: targetBoardDimension,
      }}
      onTouch={onTouch}
    >
      <ViewportScaler>
        <ContextBridge>
          <BoardComponent />
        </ContextBridge>
      </ViewportScaler>
    </Canvas>
  );
};

const BoardComponent = () => {
  const { cells } = useContext(CellsContext);

  return (
    <>
      {cells.map((cell) => (
        <CellComponent
          {...cell}
          key={`${cell.position.rowId}-${cell.position.columnId}`}
        />
      ))}

      <InnerGridPath />
      <BlockGridPath />
      <OuterGridPath />
    </>
  );
};

const CellComponent = (props: Cell) => {
  const customFontMgr = useFontManager();
  const backgroundColor = useBackgroundColor(props.position);

  const textStyle = {
    color:
      props.cellData.type === "editable"
        ? Skia.Color("gray")
        : Skia.Color("black"),
    fontFamilies: ["Varela"],
    fontSize: canvasMainFontSize,
  };

  const paragraph = Skia.ParagraphBuilder.Make(
    { textAlign: TextAlign.Center },
    customFontMgr
  )
    .pushStyle(textStyle)
    .addText(props.cellData.value?.toString() || "")
    .pop()
    .build();

  return (
    <>
      <Rect {...props.geometry} color={backgroundColor} />
      <Paragraph {...props.geometry} paragraph={paragraph} />
    </>
  );
};
