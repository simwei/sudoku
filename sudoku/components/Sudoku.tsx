import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { createSampleBoard } from "../dummy/createSampleBoard";
import { Board } from "./Board";
import { CellPosition } from "../scheme/BoardData";

type FocusPosition = CellPosition | undefined;
type FocusContextType = {
  focus: FocusPosition;
  setFocus: Dispatch<SetStateAction<FocusPosition>>;
};

const FocusContext = createContext<FocusContextType | null>(null);

export const useFocusContext = () => {
  const focusContext = useContext(FocusContext);
  if (focusContext === null) {
    throw Error(`FocusContext is null`);
  }
  return focusContext;
};

const FocusProvider = (props: PropsWithChildren) => {
  const [focus, setFocus] = useState<FocusPosition>({
    columnId: 1,
    rowId: 2,
  });

  return (
    <FocusContext.Provider value={{ focus, setFocus }}>
      {props.children}
    </FocusContext.Provider>
  );
};

export const Sudoku = () => {
  const board = createSampleBoard();

  return (
    <FocusProvider>
      <Board board={board} />
    </FocusProvider>
  );
};
