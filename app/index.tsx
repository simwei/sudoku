import { Link, SplashScreen } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import {
  GestureHandlerRootView,
  RectButton,
} from "react-native-gesture-handler";

export default function App() {
  SplashScreen.hideAsync();

  return (
    <GestureHandlerRootView>
      <FlatList
        data={[{ href: "./game/sudoku", text: "Play Sudoku" }]}
        renderItem={({ item }) => (
          <Link href={item.href} asChild style={[styles.button]}>
            <RectButton>
              <Text>{item.text}</Text>
            </RectButton>
          </Link>
        )}
        contentContainerStyle={styles.container}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
  },
  container: {
    rowGap: 10,
    margin: 10,
  },
});
