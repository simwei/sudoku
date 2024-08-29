import { Canvas, useTouchHandler } from "@shopify/react-native-skia";
import { useContextBridge } from "its-fine";
import React, { useState } from "react";
import { LayoutChangeEvent, ViewStyle } from "react-native";
import { useFocusContext } from "../../focus/FocusContext";
import { useBoardContext } from "../BoardContext";
import {
  ContainerDimensionContext,
  ContainerDimensions,
  useContainerDimensionContext,
} from "./ContainerDimensionContext";
import { BoardComponent } from "./skia-components/Board";
import {
  getCellPosition,
  useEffectiveBoardRect,
  useEffectiveCellDimensions,
} from "./skia-components/grid/math";

export const CanvasBoard = () => {
  const [containerDimensions, setBoardDimensions] =
    useState<ContainerDimensions>({
      width: 0,
      height: 0,
      strokeWidth: 0,
    });

  return (
    <ContainerDimensionContext.Provider
      value={{ containerDimensions, setBoardDimensions }}
    >
      <CanvasTouchManager />
    </ContainerDimensionContext.Provider>
  );
};

const CanvasTouchManager = () => {
  const ContextBridge = useContextBridge();

  const { setFocus } = useFocusContext();
  const { cells } = useBoardContext();
  const boardRect = useEffectiveBoardRect();
  const cellDimensions = useEffectiveCellDimensions();

  const onTouch = useTouchHandler(
    {
      onStart: (touchInfo) => {
        setFocus(
          getCellPosition(touchInfo, { cells, cellDimensions, boardRect })
        );
      },
    },
    [setFocus, cells, cellDimensions, boardRect] // CAUTION: deps not supported by eslint
  );

  const { setBoardDimensions } = useContainerDimensionContext();

  const onLayout = (e: LayoutChangeEvent) => {
    const minDimension = Math.min(
      e.nativeEvent.layout.height,
      e.nativeEvent.layout.width
    );
    setBoardDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
      strokeWidth: minDimension / 200,
    });
  };

  const canvasStyle: ViewStyle = {
    flex: 1,
  };

  return (
    <Canvas style={canvasStyle} onTouch={onTouch} onLayout={onLayout}>
      <ContextBridge>
        <BoardComponent />
      </ContextBridge>
    </Canvas>
  );
};
