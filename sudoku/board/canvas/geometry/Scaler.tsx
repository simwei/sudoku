import { FitBox } from "@shopify/react-native-skia";
import { PropsWithChildren } from "react";
import { useSourceViewport, useTargetViewport } from "./hooks";

export const Scaler = (props: PropsWithChildren) => {
  const [src, dst] = [useSourceViewport(), useTargetViewport()];

  return (
    <FitBox src={src} dst={dst}>
      {props.children}
    </FitBox>
  );
};
