import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import AppHeader from "../components/AppHeader";
import CuratedMemorySection from "../components/CuratedMemorySection";
import EmptyState from "../components/EmptyState";
import ListItemCard from "../components/ListItemCard";
import LoadingState from "../components/LoadingState";
import ScrapbookBackground from "../components/ScrapbookBackground";
import WeatherForecastSection from "../components/WeatherForecastSection";
import curatedMemories from "../data/curatedMemories";
import { useAuth } from "../hooks/useAuth";
import usePhotoFeed from "../hooks/usePhotoFeed";
import { ROUTES } from "../navigation/routeNames";
import { getUserProfile, toggleFavoriteItem } from "../services/firestoreService";
import colors from "../theme/colors";
import typography from "../theme/typography";

export default function DashboardScreen({ navigation }) {
  const isFocused = useIsFocused();
  const { user } = useAuth();
  const { filteredPhotos, query, setQuery, loading, error, refetch } = usePhotoFeed();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [profile, setProfile] = useState(null);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState(null);
  const [selectedMemoryId, setSelectedMemoryId] = useState(curatedMemories[0].id);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.uid || !isFocused) {
        return;
      }

      try {
        const currentProfile = await getUserProfile(user.uid);
        setProfile(currentProfile);
        setFavoriteIds(
          Array.isArray(currentProfile?.favoriteItems)
            ? currentProfile.favoriteItems.map((item) => item.id)
            : []
        );
      } catch (loadError) {
        console.warn("Não foi possível carregar o perfil do dashboard.", loadError);
      }
    }

    loadProfile();
  }, [isFocused, user?.uid]);

  async function handleToggleFavorite(item) {
    if (!user?.uid) {
      return;
    }

    setFavoriteLoadingId(item.id);

    try {
      const nextFavorites = await toggleFavoriteItem(user.uid, item);
      setFavoriteIds(nextFavorites.map((favorite) => favorite.id));
      setProfile((currentProfile) => ({
        ...(currentProfile || {}),
        favoriteItems: nextFavorites,
      }));
    } catch (toggleError) {
      console.warn("Não foi possível atualizar os favoritos.", toggleError);
    } finally {
      setFavoriteLoadingId(null);
    }
  }

  return (
    <View style={styles.container}>
      <ScrapbookBackground />
      <FlatList
        data={filteredPhotos}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View>
            <AppHeader
              title="Meu Álbum"
              subtitle="Uma página viva com lembranças, recortes, clima da semana e a galeria complementar que você pode salvar como favorita."
            />

            <View style={styles.heroCard}>
              <View style={styles.heroTape} />
              <Text style={styles.heroEyebrow}>entrada do dia</Text>
              <Text style={styles.heroTitle}>
                Olá, {profile?.name || user?.displayName || "viajante"}
              </Text>
              <Text style={styles.heroText}>
                Seu caderno tem {favoriteIds.length} favorito{favoriteIds.length === 1 ? "" : "s"} guardado
                {profile?.lastAccess
                  ? ` e foi aberto pela ultima vez em ${new Date(profile.lastAccess).toLocaleString("pt-BR")}.`
                  : " e esta registrando a primeira sessao."}
              </Text>

              <View style={styles.statsRow}>
                <View style={styles.statChip}>
                  <Text style={styles.statLabel}>colecao</Text>
                  <Text style={styles.statValue}>{curatedMemories.length} memorias</Text>
                </View>
                <View style={styles.statChip}>
                  <Text style={styles.statLabel}>api</Text>
                  <Text style={styles.statValue}>{filteredPhotos.length} recortes</Text>
                </View>
              </View>
            </View>

            <CuratedMemorySection
              items={curatedMemories}
              activeId={selectedMemoryId}
              onSelect={setSelectedMemoryId}
            />

            <WeatherForecastSection />

            <View style={styles.apiSectionHeader}>
              <Text style={styles.apiSectionEyebrow}>recortes externos</Text>
              <Text style={styles.apiSectionTitle}>Galeria complementar da API</Text>
              <Text style={styles.apiSectionSubtitle}>
                O feed abaixo continua ligado a JSONPlaceholder, mas agora entra na
                linguagem visual do scrapbook com busca, detalhe e favoritos.
              </Text>
            </View>

            <View style={styles.searchCard}>
              <Text style={styles.searchLabel}>Filtrar lembrancas</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Procure pelo titulo de uma foto"
                placeholderTextColor={colors.muted}
                style={styles.searchInput}
              />
            </View>

            {loading ? <LoadingState message="Buscando itens da API..." /> : null}
            {!loading && error ? (
              <EmptyState title="Falha ao carregar a galeria" description={error} />
            ) : null}
            {!loading && !error && filteredPhotos.length === 0 ? (
              <EmptyState
                title="Nenhum item encontrado"
                description="Ajuste o filtro para procurar outro titulo."
              />
            ) : null}
          </View>
        }
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <ListItemCard
            item={item}
            isFavorite={favoriteIds.includes(item.id)}
            togglingFavorite={favoriteLoadingId === item.id}
            onPress={() =>
              navigation.navigate(ROUTES.DETAILS, {
                item,
              })
            }
            onToggleFavorite={() => handleToggleFavorite(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: colors.overlay,
    borderRadius: 30,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    position: "relative",
  },
  heroTape: {
    position: "absolute",
    top: -10,
    right: 28,
    width: 74,
    height: 22,
    borderRadius: 8,
    backgroundColor: "rgba(255, 246, 201, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(183, 167, 128, 0.4)",
    transform: [{ rotate: "7deg" }],
  },
  heroEyebrow: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    color: colors.primaryStrong,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: typography.body,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 36,
    color: colors.text,
    marginBottom: 8,
    fontFamily: typography.display,
  },
  heroText: {
    color: colors.textSoft,
    lineHeight: 22,
    fontSize: 14,
    fontFamily: typography.body,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  statChip: {
    backgroundColor: colors.paperAlt,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 120,
  },
  statLabel: {
    color: colors.primaryStrong,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
    fontFamily: typography.body,
  },
  statValue: {
    color: colors.text,
    fontSize: 14,
    fontFamily: typography.body,
  },
  searchCard: {
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 26,
    padding: 16,
    marginBottom: 16,
  },
  searchLabel: {
    fontSize: 13,
    color: colors.primaryStrong,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
    fontFamily: typography.body,
  },
  searchInput: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontFamily: typography.body,
  },
  apiSectionHeader: {
    marginBottom: 12,
  },
  apiSectionEyebrow: {
    fontSize: 12,
    color: colors.accentStrong,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontFamily: typography.body,
  },
  apiSectionTitle: {
    fontSize: 31,
    color: colors.text,
    marginBottom: 4,
    fontFamily: typography.display,
  },
  apiSectionSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSoft,
    fontFamily: typography.body,
  },
});
