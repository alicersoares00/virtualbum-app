import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { resolvePhotoSource } from "../assets/photoCatalog";
import AppHeader from "../components/AppHeader";
import LoadingState from "../components/LoadingState";
import ScrapbookBackground from "../components/ScrapbookBackground";
import { useAuth } from "../hooks/useAuth";
import { getUserProfile, toggleFavoriteItem } from "../services/firestoreService";
import colors from "../theme/colors";
import typography from "../theme/typography";

export default function DetailsScreen({ route }) {
  const { user } = useAuth();
  const { item } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    async function loadFavoriteStatus() {
      if (!user?.uid) {
        setLoadingFavorite(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);
        const favoriteIds = Array.isArray(profile?.favoriteItems)
          ? profile.favoriteItems.map((favorite) => favorite.id)
          : [];
        setIsFavorite(favoriteIds.includes(item.id));
      } catch (error) {
        console.warn("Não foi possível carregar o favorito do item.", error);
      } finally {
        setLoadingFavorite(false);
      }
    }

    loadFavoriteStatus();
  }, [item.id, user?.uid]);

  async function handleToggleFavorite() {
    if (!user?.uid) {
      return;
    }

    setToggling(true);

    try {
      const nextFavorites = await toggleFavoriteItem(user.uid, item);
      setIsFavorite(nextFavorites.some((favorite) => favorite.id === item.id));
    } catch (error) {
      console.warn("Não foi possível alternar o favorito.", error);
    } finally {
      setToggling(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrapbookBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader
          title="Detalhes"
          subtitle="Uma página de álbum para ver o recorte ampliado, os metadados e o status do favorito."
        />

        <View style={styles.photoFrame}>
          <View style={styles.photoTapeLeft} />
          <View style={styles.photoTapeRight} />
          <Image source={resolvePhotoSource(item)} style={styles.image} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>ficha da lembrança</Text>
          <Text style={styles.label}>Título</Text>
          <Text style={styles.value}>{item.title}</Text>

          <Text style={styles.label}>Identificadores</Text>
          <Text style={styles.value}>Album #{item.albumId}</Text>
          <Text style={styles.value}>Foto #{item.id}</Text>

          <Text style={styles.label}>Imagem local</Text>
          <Text style={styles.value}>{item.assetLabel || item.assetKey || "Asset vinculado"}</Text>
        </View>

        {loadingFavorite ? (
          <LoadingState message="Carregando status do favorito..." />
        ) : (
          <TouchableOpacity
            style={[styles.favoriteButton, toggling && styles.disabledButton]}
            onPress={handleToggleFavorite}
            disabled={toggling}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={colors.white}
            />
            <Text style={styles.favoriteButtonText}>
              {toggling
                ? "Atualizando..."
                : isFavorite
                  ? "Remover dos favoritos"
                  : "Salvar nos favoritos"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  photoFrame: {
    backgroundColor: colors.overlay,
    borderRadius: 30,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    position: "relative",
  },
  photoTapeLeft: {
    position: "absolute",
    top: -10,
    left: 28,
    width: 74,
    height: 22,
    borderRadius: 8,
    backgroundColor: "rgba(255, 246, 201, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(183, 167, 128, 0.4)",
    transform: [{ rotate: "-7deg" }],
  },
  photoTapeRight: {
    position: "absolute",
    top: -12,
    right: 30,
    width: 68,
    height: 22,
    borderRadius: 8,
    backgroundColor: "rgba(255, 246, 201, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(183, 167, 128, 0.4)",
    transform: [{ rotate: "8deg" }],
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
  card: {
    backgroundColor: colors.overlay,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    color: colors.primaryStrong,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: typography.body,
  },
  label: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 12,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: typography.body,
  },
  value: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    fontFamily: typography.body,
  },
  favoriteButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
  },
  favoriteButtonText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: typography.body,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
