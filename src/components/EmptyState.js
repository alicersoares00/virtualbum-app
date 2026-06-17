import React from "react";
import { StyleSheet, Text, View } from "react-native";

import colors from "../theme/colors";
import typography from "../theme/typography";

export default function EmptyState({ title, description }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✦</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.overlay,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    marginBottom: 6,
    color: colors.apricot,
  },
  title: {
    fontSize: 28,
    color: colors.text,
    marginBottom: 8,
    fontFamily: typography.display,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSoft,
    fontFamily: typography.body,
  },
});
