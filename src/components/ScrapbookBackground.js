import React from "react";
import { StyleSheet, Text, View } from "react-native";

import colors from "../theme/colors";
import typography from "../theme/typography";

export default function ScrapbookBackground() {
  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />
      <View style={styles.gridPatch} />
      <View style={[styles.tape, styles.tapeLeft]} />
      <View style={[styles.tape, styles.tapeRight]} />
      <Text style={[styles.sticker, styles.stickerFlower]}>✿</Text>
      <Text style={[styles.sticker, styles.stickerStar]}>★</Text>
      <Text style={[styles.sticker, styles.stickerClover]}>☘</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.9,
  },
  blobTop: {
    width: 280,
    height: 280,
    top: -96,
    right: -72,
    backgroundColor: "#E5F7C8",
  },
  blobBottom: {
    width: 240,
    height: 240,
    bottom: -92,
    left: -76,
    backgroundColor: "#FCE9C7",
  },
  gridPatch: {
    position: "absolute",
    top: 96,
    right: -24,
    width: 144,
    height: 144,
    borderRadius: 32,
    opacity: 0.28,
    backgroundColor: colors.paperAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tape: {
    position: "absolute",
    width: 84,
    height: 24,
    backgroundColor: "rgba(255, 248, 214, 0.78)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(183, 167, 128, 0.36)",
    transform: [{ rotate: "-8deg" }],
  },
  tapeLeft: {
    top: 68,
    left: 20,
  },
  tapeRight: {
    bottom: 132,
    right: 18,
    transform: [{ rotate: "9deg" }],
  },
  sticker: {
    position: "absolute",
    fontFamily: typography.display,
    color: colors.bark,
    opacity: 0.72,
  },
  stickerFlower: {
    fontSize: 30,
    top: 138,
    left: 28,
    color: colors.accent,
  },
  stickerStar: {
    fontSize: 28,
    right: 28,
    top: 284,
    color: colors.sunflower,
  },
  stickerClover: {
    fontSize: 27,
    left: 42,
    bottom: 120,
    color: colors.primary,
  },
});
