import { Canvas, useTouchHandler } from "@shopify/react-native-skia";
import { useContextBridge } from "its-fine";
import React, { useState } from "react";
import { LayoutChangeEvent, View, ViewStyle } from "react-native";
import { useFocusContext } from "../../focus/FocusContext";
import { useBoardAspectRatio, useBoardContext } from "../BoardContext";
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
      strokeWidth: 1,
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

  const { containerDimensions, setBoardDimensions } =
    useContainerDimensionContext();
  const boardAspectRatio = useBoardAspectRatio();

  const onLayout = (e: LayoutChangeEvent) => {
    const layoutAspectRatio =
      e.nativeEvent.layout.width / e.nativeEvent.layout.height;

    const shrinkVertically = boardAspectRatio > layoutAspectRatio;

    if (shrinkVertically) {
      const width = e.nativeEvent.layout.width;
      setBoardDimensions((old) => ({
        ...old,
        width: width,
        height: width / boardAspectRatio,
      }));
    } else {
      const height = e.nativeEvent.layout.height;
      setBoardDimensions((old) => ({
        ...old,
        width: height * boardAspectRatio,
        height: height,
      }));
    }
  };

  const canvasStyle: ViewStyle = {
    height: containerDimensions.height,
    width: containerDimensions.width,
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <View style={containerStyle} onLayout={onLayout}>
      <Canvas style={canvasStyle} onTouch={onTouch}>
        <ContextBridge>
          <BoardComponent />
        </ContextBridge>
      </Canvas>
    </View>
  );
};
