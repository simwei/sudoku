import { SkTypefaceFontProvider, useFonts } from "@shopify/react-native-skia";
import { PropsWithChildren, createContext, useContext } from "react";
import { ActivityIndicator } from "react-native";

const FontManagerContext = createContext<SkTypefaceFontProvider | null>(null);

export const useFontManager = () => {
  const fontManagerContext = useContext(FontManagerContext);
  if (fontManagerContext === null) {
    throw Error(`FontManagerContext is null`);
  }
  return fontManagerContext;
};

export const FontManagerProvider = (props: PropsWithChildren) => {
  const fontManager = useFonts({
    Varela: [require("./varela/Varela-Regular.ttf")],
  });

  if (!fontManager) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <FontManagerContext.Provider value={fontManager}>
      {props.children}
    </FontManagerContext.Provider>
  );
};
