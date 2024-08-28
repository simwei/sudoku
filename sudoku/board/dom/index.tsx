import React, { useContext } from "react";
import { Text, View, ViewStyle } from "react-native";
import { colors, useBackgroundColor } from "../../colors";
import { useFocusContext } from "../../focus/FocusContext";
import {
  CellData,
  CellPosition,
  RowData,
  RowPosition,
} from "../../scheme/BoardData";
import { CellsContext } from "../canvas/CellContext";
import { useTargetBoardWidth } from "../useTargetBoardWidth";

export const DOMBoard = () => {
  const { cells } = useContext(CellsContext);
  const targetBoardDimension = useTargetBoardWidth();

  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => ({
    cells: cells
      .filter((cell) => cell.position.rowId === index)
      .map((cell) => cell.cellData),
  }));

  return (
    <View style={{ width: targetBoardDimension, height: targetBoardDimension }}>
      {rows.map((row, rowId) => (
        <DOMRow
          position={{ rowId }}
          rowData={row}
          key={rowId}
          dimensions={{
            height: targetBoardDimension / rows.length,
          }}
        />
      ))}
    </View>
  );
};

const DOMRow = (props: {
  rowData: RowData;
  position: RowPosition;
  dimensions: { height: number };
}) => {
  const style: ViewStyle = { flexDirection: "row" };
  return (
    <View style={[style, props.dimensions]}>
      {props.rowData.cells.map((cell, columnId) => (
        <DOMCell
          position={{ ...props.position, columnId }}
          cellData={cell}
          key={columnId}
          dimensions={{
            height: props.dimensions.height,
            width: props.dimensions.height,
          }}
        />
      ))}
    </View>
  );
};

const DOMCell = (props: {
  cellData: CellData;
  position: CellPosition;
  dimensions: { height: number; width: number };
}) => {
  const { setFocus } = useFocusContext();
  const backgroundColor = useBackgroundColor(props.position);

  const { outerBorderStyle, innerBorderStyle } = borderStyle(
    props.position,
    props.dimensions.height * 0.02
  );

  const viewStyle: ViewStyle = {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const textStyle = {
    // TODO: text alignment is wonky between android and web
    fontSize: props.dimensions.height * 0.8,
    includeFontPadding: false,
  };

  return (
    <View
      style={[outerBorderStyle, props.dimensions, { backgroundColor }]}
      onTouchStart={() => setFocus(props.position)}
      onPointerDown={() => setFocus(props.position)}
    >
      <View style={[innerBorderStyle, viewStyle]}>
        <Text
          style={[
            props.cellData.type === "editable"
              ? { color: colors.editableText }
              : { color: colors.givenText },
            textStyle,
          ]}
        >
          {props.cellData.value}
        </Text>
      </View>
    </View>
  );
};

const borderStyle = (coordinates: CellPosition, baseBorderWidth: number) => {
  const borderWidth = baseBorderWidth;
  const borderColor = colors.innerBorderColor;

  const innerBorderStyle: ViewStyle = {
    borderLeftWidth: borderWidth,
    borderRightWidth: borderWidth,
    borderTopWidth: borderWidth,
    borderBottomWidth: borderWidth,
    borderLeftColor: borderColor,
    borderRightColor: borderColor,
    borderTopColor: borderColor,
    borderBottomColor: borderColor,
  };

  const separatorWidth = 2 * baseBorderWidth;
  const separatorColor = colors.blockBorderColor;

  const edgeBorderWidth = 2 * separatorWidth;
  const edgeBorderColor = colors.outerBorderColor;

  const outerBorderStyle: ViewStyle = {};

  if ([0].includes(coordinates.columnId)) {
    outerBorderStyle.borderLeftWidth = edgeBorderWidth;
    innerBorderStyle.borderLeftWidth = undefined;
    outerBorderStyle.borderLeftColor = edgeBorderColor;
    innerBorderStyle.borderLeftColor = undefined;
  }
  if ([3, 6].includes(coordinates.columnId)) {
    outerBorderStyle.borderLeftWidth = separatorWidth;
    innerBorderStyle.borderLeftWidth = undefined;
    outerBorderStyle.borderLeftColor = separatorColor;
    innerBorderStyle.borderLeftColor = undefined;
  }
  if ([2, 5].includes(coordinates.columnId)) {
    outerBorderStyle.borderRightWidth = separatorWidth;
    innerBorderStyle.borderRightWidth = undefined;
    outerBorderStyle.borderRightColor = separatorColor;
    innerBorderStyle.borderRightColor = undefined;
  }
  if ([8].includes(coordinates.columnId)) {
    outerBorderStyle.borderRightWidth = edgeBorderWidth;
    innerBorderStyle.borderRightWidth = undefined;
    outerBorderStyle.borderRightColor = edgeBorderColor;
    innerBorderStyle.borderRightColor = undefined;
  }

  if ([0].includes(coordinates.rowId)) {
    outerBorderStyle.borderTopWidth = edgeBorderWidth;
    innerBorderStyle.borderTopWidth = undefined;
    outerBorderStyle.borderTopColor = edgeBorderColor;
    innerBorderStyle.borderTopColor = undefined;
  }
  if ([3, 6].includes(coordinates.rowId)) {
    outerBorderStyle.borderTopWidth = separatorWidth;
    innerBorderStyle.borderTopWidth = undefined;
    outerBorderStyle.borderTopColor = separatorColor;
    innerBorderStyle.borderTopColor = undefined;
  }
  if ([2, 5].includes(coordinates.rowId)) {
    outerBorderStyle.borderBottomWidth = separatorWidth;
    innerBorderStyle.borderBottomWidth = undefined;
    outerBorderStyle.borderBottomColor = separatorColor;
    innerBorderStyle.borderBottomColor = undefined;
  }
  if ([8].includes(coordinates.rowId)) {
    outerBorderStyle.borderBottomWidth = edgeBorderWidth;
    innerBorderStyle.borderBottomWidth = undefined;
    outerBorderStyle.borderBottomColor = edgeBorderColor;
    innerBorderStyle.borderBottomColor = undefined;
  }

  return { outerBorderStyle, innerBorderStyle };
};
