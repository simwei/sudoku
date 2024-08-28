import { Stack } from "expo-router/stack";
import React from "react";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />

      <Stack.Screen name="game/sudoku" options={{ title: "Sudoku" }} />
    </Stack>
  );
}
