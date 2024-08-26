import { useState } from "react";
import { Text, View, ViewStyle } from "react-native";
import { useBackgroundColor } from "../../colors";
import { useFocusContext } from "../../focus/FocusContext";
import {
  BoardData,
  CellData,
  CellPosition,
  RowData,
  RowPosition,
} from "../../scheme/BoardData";
import { useTargetBoardWidth } from "../useTargetBoardWidth";

export const DOMBoard = (props: { board: BoardData }) => {
  const targetBoardDimension = useTargetBoardWidth();

  return (
    <View style={{ width: targetBoardDimension, height: targetBoardDimension }}>
      {props.board.rows.map((row, rowId) => (
        <DOMRow
          position={{ rowId }}
          row={row}
          key={rowId}
          dimensions={{
            height: targetBoardDimension / props.board.rows.length,
          }}
        />
      ))}
    </View>
  );
};

const DOMRow = (props: {
  row: RowData;
  position: RowPosition;
  dimensions: { height: number };
}) => {
  return (
    <View style={[{ flexDirection: "row" }, props.dimensions]}>
      {props.row.cells.map((cell, columnId) => (
        <DOMCell
          position={{ ...props.position, columnId }}
          cell={cell}
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
  cell: CellData;
  position: CellPosition;
  dimensions: { height: number; width: number };
}) => {
  const { setFocus } = useFocusContext();
  const backgroundColor = useBackgroundColor(props.position);

  const [editable] = useState(props.cell.isInitial === false);

  const { outerBorderStyle, innerBorderStyle } = borderStyle(
    props.position,
    props.dimensions.height * 0.02
  );

  return (
    <View
      style={[outerBorderStyle, props.dimensions, { backgroundColor }]}
      onTouchStart={() => setFocus(props.position)}
      onPointerDown={() => setFocus(props.position)}
    >
      <View
        style={[
          innerBorderStyle,
          {
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text
          style={[
            editable ? { color: "gray" } : { color: "black" },
            {
              // TODO: text alignment is wonky between android and web
              fontSize: props.dimensions.height * 0.8,
              includeFontPadding: false,
            },
          ]}
        >
          {props.cell.value}
        </Text>
      </View>
    </View>
  );
};

const borderStyle = (coordinates: CellPosition, baseBorderWidth: number) => {
  const borderWidth = baseBorderWidth;
  const borderColor = "grey";

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
  const separatorColor = "black";

  const edgeBorderWidth = 2 * separatorWidth;
  const edgeBorderColor = "black";

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
