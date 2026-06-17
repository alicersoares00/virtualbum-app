import React from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { resolveThumbnailSource } from "../assets/photoCatalog";
import colors from "../theme/colors";
import typography from "../theme/typography";

export default function ListItemCard({
  item,
  onPress,
  onToggleFavorite,
  isFavorite,
  togglingFavorite,
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.tape} />
      <Image source={resolveThumbnailSource(item)} style={styles.thumbnail} />

      <View style={styles.content}>
        <Text style={styles.eyebrow}>recorte {item.id}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.meta}>Álbum #{item.albumId} • item #{item.id}</Text>
      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={onToggleFavorite}
        disabled={togglingFavorite}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={22}
          color={isFavorite ? colors.accent : colors.muted}
        />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.overlay,
    padding: 16,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    gap: 14,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    position: "relative",
  },
  tape: {
    position: "absolute",
    top: -8,
    left: 22,
    width: 62,
    height: 20,
    borderRadius: 8,
    backgroundColor: "rgba(255, 246, 201, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(183, 167, 128, 0.4)",
    transform: [{ rotate: "-7deg" }],
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 2,
    borderColor: colors.paper,
  },
  content: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    color: colors.primaryStrong,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 6,
    fontFamily: typography.body,
  },
  title: {
    fontSize: 24,
    color: colors.text,
    marginBottom: 6,
    lineHeight: 26,
    fontFamily: typography.display,
  },
  meta: {
    fontSize: 13,
    color: colors.textSoft,
    fontFamily: typography.body,
  },
  favoriteButton: {
    padding: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
});
