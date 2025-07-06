import { colors } from "@/constants/color";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface ListEmptyProps {
  loading: boolean;
  message?: string;
}

const ListEmptyComponent = ({
  loading,
  message = "No films found",
}: ListEmptyProps) => {
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.text} />
      ) : (
        <Text style={styles.empty}>{message}</Text>
      )}
    </View>
  );
};

export default ListEmptyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  empty: {
    fontSize: 20,
    color: colors.text,
    textAlign: "center",
    marginTop: 20,
  },
});
