import { useBoardContext } from "../board/BoardContext";
import { useFocusContext } from "../focus/FocusContext";
import {
  CellData,
  CellPosition,
  getBlockIdentifier,
} from "../scheme/BoardData";
import { checkError } from "../solver/checkError";

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

export function useIsError(props: {
  cellData: CellData;
  position: CellPosition;
}) {
  const { position, cellData } = props;
  const { cells } = useBoardContext();

  const isError = checkError(cells, cellData, position);

  return { isError };
}
