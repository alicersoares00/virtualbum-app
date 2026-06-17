import React from "react";
import { StyleSheet, Text, View } from "react-native";

import colors from "../theme/colors";
import typography from "../theme/typography";

export default function AppHeader({ title, subtitle }) {
  return (
    <View style={styles.container}>
      <View style={styles.eyebrowRow}>
        <Text style={styles.eyebrow}>Diário Visual</Text>
        <Text style={styles.pin}>✿</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? (
        <View style={styles.note}>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  eyebrow: {
    alignSelf: "flex-start",
    backgroundColor: colors.paperAlt,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.primaryStrong,
    overflow: "hidden",
    fontFamily: typography.body,
  },
  pin: {
    fontSize: 16,
    color: colors.accent,
  },
  title: {
    fontSize: 38,
    color: colors.text,
    fontFamily: typography.display,
    lineHeight: 42,
  },
  note: {
    marginTop: 10,
    backgroundColor: colors.overlay,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSoft,
    fontFamily: typography.body,
  },
});
