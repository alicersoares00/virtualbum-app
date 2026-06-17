import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import colors from "../theme/colors";

export default function LoadingState({
  message = "Carregando...",
  fullScreen = false,
}) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    marginTop: 12,
    fontSize: 15,
    color: colors.textSoft,
  },
});
