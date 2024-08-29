import { createContext, useContext } from "react";

export type ContainerDimensions = {
  height: number;
  width: number;
  strokeWidth: number;
};

export const ContainerDimensionContext = createContext<{
  containerDimensions: ContainerDimensions;
  setBoardDimensions: (containerDimensions: ContainerDimensions) => void;
} | null>(null);

export const useContainerDimensionContext = () => {
  const containerDimensionContext = useContext(ContainerDimensionContext);
  if (containerDimensionContext === null) {
    throw Error(`ContainerDimensionContext is null`);
  }
  return containerDimensionContext;
};
