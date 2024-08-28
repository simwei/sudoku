import {
  Canvas,
  Paragraph,
  Rect,
  Skia,
  SkRect,
  SkTypefaceFontProvider,
  TextAlign,
  useTouchHandler,
} from "@shopify/react-native-skia";
import { useContextBridge } from "its-fine";
import React, { useContext } from "react";
import { colors, useBackgroundColor } from "../../colors";
import { useFocusContext } from "../../focus/FocusContext";
import { useFontManager } from "../../font/FontContext";
import { CellType, Digit } from "../../scheme/BoardData";
import { BoardContext, Cell, getCellPosition } from "../BoardContext";
import { useTargetBoardWidth } from "../useTargetBoardWidth";
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

  const { cells } = useContext(BoardContext);

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
  const { cells } = useContext(BoardContext);

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
  const backgroundColor = useBackgroundColor(props);

  return (
    <>
      <Rect {...props.geometry} color={backgroundColor} />
      {props.cellData.value ? (
        <CellMainNumber
          digit={props.cellData.value}
          geometry={props.geometry}
          type={props.cellData.type}
        />
      ) : (
        Array.from(props.cellData.hints || []).map((hint) => {
          const [key, value] = hint;

          if (value) {
            const { hintGeometry, hintFontSize } = getHintDimensions(
              props.geometry,
              key
            );
            return (
              <CellHintNumber
                digit={key}
                geometry={hintGeometry}
                fontSize={hintFontSize}
                key={key}
              />
            );
          }
        })
      )}
    </>
  );
};

const CellMainNumber = (props: {
  digit: Digit;
  type: CellType;
  geometry: SkRect;
}) => {
  const customFontMgr = useFontManager();

  const paragraph = getParagraph({
    fontSize: props.geometry.height * 0.75,
    customFontMgr,
    text: props.digit.toString(),
    type: props.type,
  });

  return <Paragraph {...props.geometry} paragraph={paragraph} />;
};

const CellHintNumber = (props: {
  digit: Digit;
  geometry: SkRect;
  fontSize: number;
}) => {
  const customFontMgr = useFontManager();
  const { digit } = props;

  const paragraph = getParagraph({
    type: "editable",
    text: digit.toString(),
    customFontMgr,
    fontSize: props.geometry.height * 0.75,
  });

  return (
    <>
      <Paragraph {...props.geometry} paragraph={paragraph} />
    </>
  );
};

function getHintDimensions(cellGeometry: SkRect, forDigit: Digit) {
  const hintGeometry = {
    x: cellGeometry.x + (cellGeometry.width / 3) * ((forDigit - 1) % 3),
    y:
      cellGeometry.y +
      (cellGeometry.height / 3) * Math.floor((forDigit - 1) / 3),
    width: cellGeometry.width / 3,
    height: cellGeometry.height / 3,
  };

  const hintFontSize = (cellGeometry.height * 0.75) / 3;

  return { hintGeometry, hintFontSize };
}

function getParagraph(props: {
  text: string;
  type: CellType;
  fontSize: number;
  customFontMgr: SkTypefaceFontProvider;
}) {
  const textStyle = {
    color:
      props.type === "editable"
        ? Skia.Color(colors.editableText)
        : Skia.Color(colors.givenText),
    fontFamilies: ["Varela"],
    fontSize: props.fontSize,
  };

  const paragraph = Skia.ParagraphBuilder.Make(
    { textAlign: TextAlign.Center },
    props.customFontMgr
  )
    .pushStyle(textStyle)
    .addText(props.text)
    .pop()
    .build();

  return paragraph;
}
