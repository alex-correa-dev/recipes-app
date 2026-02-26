import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export const LoadingSpinner = () => (
  <View style={styles.container} testID="loading-container">
    <ActivityIndicator size="large" color="#ff4444" testID="loading-spinner" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
