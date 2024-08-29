import {
  Paragraph,
  Rect,
  Skia,
  SkRect,
  SkTypefaceFontProvider,
  TextAlign,
} from "@shopify/react-native-skia";
import React from "react";
import { colors, useBackgroundColor } from "../../../colors";
import { useFontManager } from "../../../font/FontContext";
import { CellRecord, CellType, Digit } from "../../../scheme/BoardData";
import { useEffectiveCellRect } from "./grid/math";

export const Cell = (props: CellRecord) => {
  const backgroundColor = useBackgroundColor(props);

  const rect = useEffectiveCellRect(props.position);

  return (
    <>
      <Rect {...rect} color={backgroundColor} />
      {props.cellData.value ? (
        <CellMainNumber
          digit={props.cellData.value}
          geometry={rect}
          type={props.cellData.type}
        />
      ) : (
        Array.from(props.cellData.hints || []).map((hint) => {
          const [key, value] = hint;

          if (value) {
            const { hintGeometry, hintFontSize } = getHintDimensions(rect, key);
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
