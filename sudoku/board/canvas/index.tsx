import {
  Canvas,
  Paragraph,
  Rect,
  Skia,
  TextAlign,
  useTouchHandler,
} from "@shopify/react-native-skia";
import { useContextBridge } from "its-fine";
import { useBackgroundColor } from "../../colors";
import { useFocusContext } from "../../focus/FocusContext";
import { useFontManager } from "../../font/FontContext";
import { BoardData, CellData, CellPosition } from "../../scheme/BoardData";
import { useTargetBoardWidth } from "../useTargetBoardWidth";
import {
  getCellGeometry,
  useGetPosition,
  useGetSourcePoint,
  withCellGeometryProvider,
} from "./geometry/CellGeometryContext";
import { canvasMainFontSize } from "./geometry/consts";
import { Scaler } from "./geometry/Scaler";
import { BlockGridPath } from "./grid/BlockGridPath";
import { InnerGridPath } from "./grid/InnerGridPath";
import { OuterGridPath } from "./grid/OuterGridPath";

const useOnTouch = () => {
  const getSourcePoint = useGetSourcePoint();
  const getCellPosition = useGetPosition();
  const { setFocus } = useFocusContext();

  const onTouch = useTouchHandler(
    {
      onStart: (e) => {
        const cellPosition = getCellPosition(getSourcePoint(e));
        setFocus(cellPosition);
      },
    },
    [getSourcePoint, getCellPosition, setFocus]
  );

  return onTouch;
};

export const CanvasBoard = withCellGeometryProvider(
  (props: { board: BoardData }) => {
    const ContextBridge = useContextBridge();

    const targetBoardDimension = useTargetBoardWidth();
    const onTouch = useOnTouch();

    return (
      <Canvas
        style={{
          width: targetBoardDimension,
          height: targetBoardDimension,
        }}
        onTouch={onTouch}
      >
        <ContextBridge>
          <Scaler>
            {props.board.rows.map((row, rowId) =>
              row.cells.map((cell, columnId) => (
                <CanvasCell
                  cell={cell}
                  position={{ rowId, columnId }}
                  key={`${rowId}-${columnId}`}
                />
              ))
            )}
            <InnerGridPath />
            <BlockGridPath />
            <OuterGridPath />
          </Scaler>
        </ContextBridge>
      </Canvas>
    );
  }
);

const CanvasCell = (props: { cell: CellData; position: CellPosition }) => {
  const customFontMgr = useFontManager();
  const backgroundColor = useBackgroundColor(props.position);

  const cellGeometry = getCellGeometry(props.position);
  const textStyle = {
    color: Skia.Color("black"),
    fontFamilies: ["Varela"],
    fontSize: canvasMainFontSize,
  };

  const paragraph = Skia.ParagraphBuilder.Make(
    { textAlign: TextAlign.Center },
    customFontMgr
  )
    .pushStyle(textStyle)
    .addText(props.cell.value?.toString() || "")
    .pop()
    .build();

  return (
    <>
      <Rect {...cellGeometry} color={backgroundColor}></Rect>
      <Paragraph {...cellGeometry} paragraph={paragraph} />
    </>
  );
};
