import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { CellPosition } from "../scheme/BoardData";

export type FocusPosition = CellPosition | undefined;

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

export const FocusProvider = (props: PropsWithChildren) => {
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
