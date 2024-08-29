import { useBoardContext } from "../board/BoardContext";
import { useFocusContext } from "../focus/FocusContext";
import {
  CellData,
  CellPosition,
  getBlockIdentifier,
} from "../scheme/BoardData";

export const colors = {
  noFocus: "#ffffff",
  focus: "#d0d0d0",
  secondaryFocus: "#e7e7e7",
  button: "#e7e7e7",
  buttonPressed: "#d0d0d0",
  editableText: "gray",
  givenText: "black",
  innerBorderColor: "gray",
  outerBorderColor: "black",
  blockBorderColor: "black",
  errorBackground: "pink",
};

export function useBackgroundColor(props: {
  cellData: CellData;
  position: CellPosition;
}) {
  const { isFocused, isSecondaryFocused } = useIsFocused(props);
  const { isError } = useIsError(props);

  if (isError) {
    return colors.errorBackground;
  }

  if (isFocused) {
    return colors.focus;
  }

  if (isSecondaryFocused) {
    return colors.secondaryFocus;
  }

  // else
  return colors.noFocus;
}

function useIsFocused(props: { position: CellPosition }) {
  const { position } = props;
  const { focus } = useFocusContext();

  const isFocused =
    focus !== undefined &&
    focus.columnId === position.columnId &&
    focus.rowId === position.rowId;

  const isSecondaryFocused =
    focus !== undefined &&
    (focus.columnId === position.columnId ||
      focus.rowId === position.rowId ||
      getBlockIdentifier(focus) === getBlockIdentifier(position));
  return { isFocused, isSecondaryFocused };
}

function useIsError(props: { cellData: CellData; position: CellPosition }) {
  const { position, cellData } = props;
  const { cells } = useBoardContext();

  if (cellData.value === undefined) {
    return { isError: false };
  }

  const isError = cells.some((other) => {
    const sameValue = other.cellData.value === cellData.value;

    const sameBlock =
      getBlockIdentifier(other.position) === getBlockIdentifier(position);
    const sameColumn = other.position.columnId === position.columnId;
    const sameRow = other.position.rowId === position.rowId;

    const notSamePosition = !(
      other.position.columnId === position.columnId &&
      other.position.rowId === position.rowId
    );

    const hasError =
      sameValue && (sameBlock || sameColumn || sameRow) && notSamePosition;

    return hasError;
  });

  return { isError };
}
