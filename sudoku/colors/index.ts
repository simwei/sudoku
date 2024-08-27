import { useFocusContext } from "../focus/FocusContext";
import { CellPosition, getBlockIdentifier } from "../scheme/BoardData";

export const colors = {
  focus: "#d0d0d0",
  secondaryFocus: "#e7e7e7",
  button: "#e7e7e7",
  buttonPressed: "#d0d0d0",
};

export function useBackgroundColor(position: CellPosition) {
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

  const backgroundColor = isFocused
    ? colors.focus
    : isSecondaryFocused
      ? colors.secondaryFocus
      : "#ffffff";

  return backgroundColor;
}
