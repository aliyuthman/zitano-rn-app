import { colors } from "@/constants/color";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const FilmsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: "Poppins-Bold",
          fontWeight: "bold",
        },
        headerShown: true,
      }}
    >
      <Stack.Screen name="index" options={{ title: "All Films" }} />
      <Stack.Screen name="[id]" options={{ title: "Film Details" }} />
    </Stack>
  );
};

export default FilmsLayout;

const styles = StyleSheet.create({});
