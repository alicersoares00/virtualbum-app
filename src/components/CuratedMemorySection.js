import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { resolvePhotoSource } from "../assets/photoCatalog";
import colors from "../theme/colors";
import typography from "../theme/typography";

export default function CuratedMemorySection({ items, activeId, onSelect }) {
  const activeMemory = items.find((item) => item.id === activeId) || items[0];
  const orderedDetails = [
    activeMemory,
    ...items.filter((item) => item.id !== activeMemory.id),
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Coleção temática</Text>
      <Text style={styles.sectionSubtitle}>
        Uma seleção com clima de recorte manual, camadas afetivas e fotos que parecem
        guardadas entre páginas de um caderno antigo.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.summaryList}
      >
        {items.map((item) => {
          const isActive = item.id === activeMemory.id;

          return (
            <Pressable
              key={item.id}
              style={[styles.summaryCard, isActive && styles.summaryCardActive]}
              onPress={() => onSelect(item.id)}
            >
              <View style={styles.stickerTape} />
              <Image source={resolvePhotoSource(item)} style={styles.summaryImage} />
              <Text style={styles.summaryTitle}>{item.title}</Text>
              <Text style={styles.summaryDescription}>{item.shortDescription}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.featuredCard}>
        <Text style={styles.featuredEyebrow}>memória em destaque</Text>
        <Text style={styles.featuredTitle}>{activeMemory.title}</Text>
        <Text style={styles.featuredLabel}>{activeMemory.focusLabel}</Text>
        <Text style={styles.featuredText}>{activeMemory.shortDescription}</Text>
      </View>

      <Text style={styles.sectionTitle}>Narrativas detalhadas</Text>
      <Text style={styles.sectionSubtitle}>
        Cada bloco funciona como uma página comentada do álbum, com imagem, etiqueta
        e texto em tom de diário.
      </Text>

      {orderedDetails.map((item) => {
        const isActive = item.id === activeMemory.id;

        return (
          <View key={item.id} style={[styles.detailCard, isActive && styles.detailCardActive]}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailMarker}>✦</Text>
              <Text style={styles.detailHeaderText}>página comentada</Text>
            </View>
            <Image source={resolvePhotoSource(item)} style={styles.detailImage} />

            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>{item.title}</Text>
              <Text style={styles.detailLabel}>{item.focusLabel}</Text>
              <Text style={styles.detailDescription}>{item.longDescription}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 31,
    color: colors.text,
    marginBottom: 6,
    fontFamily: typography.display,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSoft,
    marginBottom: 14,
    fontFamily: typography.body,
  },
  summaryList: {
    paddingRight: 8,
    paddingTop: 10,
  },
  summaryCard: {
    width: 220,
    backgroundColor: colors.overlay,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginRight: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  summaryCardActive: {
    borderColor: colors.primary,
    backgroundColor: "#FBFFF5",
    transform: [{ rotate: "-1deg" }],
  },
  stickerTape: {
    position: "absolute",
    top: -8,
    right: 18,
    width: 56,
    height: 18,
    borderRadius: 8,
    backgroundColor: "rgba(255, 245, 190, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(183, 167, 128, 0.4)",
    transform: [{ rotate: "8deg" }],
  },
  summaryImage: {
    width: "100%",
    height: 132,
    borderRadius: 18,
    backgroundColor: colors.surface,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.paper,
  },
  summaryTitle: {
    fontSize: 24,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 25,
    fontFamily: typography.display,
  },
  summaryDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSoft,
    fontFamily: typography.body,
  },
  featuredCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 16,
    marginBottom: 18,
  },
  featuredEyebrow: {
    fontSize: 12,
    color: colors.primaryStrong,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
    fontFamily: typography.body,
  },
  featuredTitle: {
    fontSize: 29,
    color: colors.text,
    marginBottom: 4,
    fontFamily: typography.display,
  },
  featuredLabel: {
    fontSize: 13,
    color: colors.olive,
    marginBottom: 8,
    fontFamily: typography.body,
  },
  featuredText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
    fontFamily: typography.body,
  },
  detailCard: {
    backgroundColor: colors.overlay,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 14,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  detailCardActive: {
    borderColor: colors.primary,
    backgroundColor: "#FCFEF8",
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  detailMarker: {
    fontSize: 15,
    color: colors.apricot,
  },
  detailHeaderText: {
    fontSize: 12,
    color: colors.primaryStrong,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontFamily: typography.body,
  },
  detailImage: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.paper,
  },
  detailContent: {
    gap: 6,
  },
  detailTitle: {
    fontSize: 28,
    color: colors.text,
    fontFamily: typography.display,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.primaryStrong,
    fontFamily: typography.body,
  },
  detailDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
    fontFamily: typography.body,
  },
});
