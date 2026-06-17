import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";

import AppHeader from "../components/AppHeader";
import ScrapbookBackground from "../components/ScrapbookBackground";
import { useAuth } from "../hooks/useAuth";
import colors from "../theme/colors";
import typography from "../theme/typography";

export default function SettingsScreen() {
  const { authLoading, logout, user } = useAuth();
  const [albumTitle, setAlbumTitle] = useState("Memórias de Brasília");
  const [authorName, setAuthorName] = useState(user?.displayName || "");
  const [memoryPlace, setMemoryPlace] = useState("Asa Norte");
  const [specialCaption, setSpecialCaption] = useState("");
  const [freeNote, setFreeNote] = useState("");
  const [themeMode, setThemeMode] = useState("natureza");
  const [layoutMode, setLayoutMode] = useState("diario");
  const [stickerDensity, setStickerDensity] = useState(45);
  const [titleSize, setTitleSize] = useState(20);
  const [showForecast, setShowForecast] = useState(true);
  const [highlightFavorites, setHighlightFavorites] = useState(true);
  const [previewMessage, setPreviewMessage] = useState("");

  function handleApplyPanel() {
    setPreviewMessage(
      `Título "${albumTitle || "Sem título"}" preparado por ${authorName || "autor anônimo"} para o local ${memoryPlace || "não informado"}. Tema ${themeMode}, layout ${layoutMode}, densidade ${Math.round(stickerDensity)}%, título ${Math.round(titleSize)}px, clima ${showForecast ? "visível" : "oculto"} e favoritos ${highlightFavorites ? "destacados" : "neutros"}. ${specialCaption ? `Legenda: ${specialCaption}.` : ""} ${freeNote ? `Observação: ${freeNote}.` : "Sem observações extras."}`
    );
  }

  function handleResetPanel() {
    setAlbumTitle("");
    setAuthorName(user?.displayName || "");
    setMemoryPlace("");
    setSpecialCaption("");
    setFreeNote("");
    setThemeMode("natureza");
    setLayoutMode("diario");
    setStickerDensity(45);
    setTitleSize(20);
    setShowForecast(true);
    setHighlightFavorites(true);
    setPreviewMessage("");
  }

  return (
    <View style={styles.screen}>
      <ScrapbookBackground />
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader
          title="Configurações"
          subtitle="Um painel de montagem do álbum com controles, anotações e ajustes extras dentro da mesma estética artesanal."
        />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Conta e integrações</Text>
          <Text style={styles.itemTitle}>Conta autenticada</Text>
          <Text style={styles.itemText}>{user?.email || "Usuário sem email"}</Text>

          <Text style={styles.itemTitle}>Persistência remota</Text>
          <Text style={styles.itemText}>
            O perfil e os favoritos são armazenados no Firestore.
          </Text>

          <Text style={styles.itemTitle}>API publica integrada</Text>
          <Text style={styles.itemText}>
            A galeria principal usa JSONPlaceholder para listar fotos.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Painel de montagem</Text>
          <Text style={styles.panelSubtitle}>
            Experimente legendas, tema, layout e intensidade visual como se estivesse
            organizando uma nova página do scrapbook.
          </Text>

          <Text style={styles.label}>Título</Text>
          <TextInput
            value={albumTitle}
            onChangeText={setAlbumTitle}
            placeholder="Defina o título da coleção"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />

          <Text style={styles.label}>Autor</Text>
          <TextInput
            value={authorName}
            onChangeText={setAuthorName}
            placeholder="Nome do autor"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />

          <Text style={styles.label}>Local</Text>
          <TextInput
            value={memoryPlace}
            onChangeText={setMemoryPlace}
            placeholder="Onde a memória acontece"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />

          <Text style={styles.label}>Legenda especial</Text>
          <TextInput
            value={specialCaption}
            onChangeText={setSpecialCaption}
            placeholder="Escreva uma legenda curta"
            placeholderTextColor={colors.muted}
            style={[styles.input, styles.multilineInput]}
            multiline
          />

          <Text style={styles.label}>Observação rápida</Text>
          <TextInput
            value={freeNote}
            onChangeText={setFreeNote}
            placeholder="Anotação livre para o painel"
            placeholderTextColor={colors.muted}
            style={[styles.input, styles.multilineInput]}
            multiline
          />

          <Text style={styles.label}>Tema</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={themeMode} onValueChange={setThemeMode} style={styles.picker}>
              <Picker.Item label="Natureza" value="natureza" />
              <Picker.Item label="Objetos afetivos" value="objetos" />
              <Picker.Item label="Experimentos visuais" value="experimentos" />
            </Picker>
          </View>

          <Text style={styles.label}>Layout</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={layoutMode}
              onValueChange={setLayoutMode}
              style={styles.picker}
            >
              <Picker.Item label="Diário" value="diario" />
              <Picker.Item label="Grade" value="grade" />
              <Picker.Item label="Destaque central" value="destaque" />
            </Picker>
          </View>

          <Text style={styles.label}>
            Densidade de adesivos ({Math.round(stickerDensity)}%)
          </Text>
          <Slider
            minimumValue={0}
            maximumValue={100}
            value={stickerDensity}
            onValueChange={setStickerDensity}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.accent}
          />

          <Text style={styles.label}>
            Tamanho do título ({Math.round(titleSize)}px)
          </Text>
          <Slider
            minimumValue={14}
            maximumValue={32}
            value={titleSize}
            onValueChange={setTitleSize}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.accentStrong}
          />

          <View style={styles.switchRow}>
            <View style={styles.switchTextWrap}>
              <Text style={styles.label}>Mostrar clima semanal</Text>
              <Text style={styles.helperText}>
                Alterna o destaque visual do painel de previsão na simulação.
              </Text>
            </View>
            <Switch
              value={showForecast}
              onValueChange={setShowForecast}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextWrap}>
              <Text style={styles.label}>Destacar favoritos</Text>
              <Text style={styles.helperText}>
                Define se os itens marcados recebem evidencia no resumo final.
              </Text>
            </View>
            <Switch
              value={highlightFavorites}
              onValueChange={setHighlightFavorites}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleApplyPanel}>
              <Text style={styles.actionButtonText}>Aplicar painel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleResetPanel}>
              <Text style={styles.secondaryButtonText}>Limpar painel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Resumo interativo</Text>
            <Text style={styles.previewText}>
              {previewMessage ||
                "Use os controles acima e toque em um dos botoes para gerar ou limpar a simulacao."}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, authLoading && styles.disabledButton]}
          onPress={logout}
          disabled={authLoading}
        >
          <Text style={styles.logoutButtonText}>
            {authLoading ? "Saindo..." : "Sair da conta"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.overlay,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 32,
    color: colors.text,
    marginBottom: 10,
    fontFamily: typography.display,
  },
  itemTitle: {
    fontSize: 14,
    color: colors.primaryStrong,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: typography.body,
  },
  itemText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSoft,
    marginBottom: 16,
    fontFamily: typography.body,
  },
  panelSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSoft,
    marginBottom: 16,
    fontFamily: typography.body,
  },
  label: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 6,
    fontFamily: typography.body,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSoft,
    fontFamily: typography.body,
  },
  input: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    color: colors.text,
    fontFamily: typography.body,
  },
  multilineInput: {
    minHeight: 88,
    textAlignVertical: "top",
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.paper,
    marginBottom: 14,
    overflow: "hidden",
  },
  picker: {
    color: colors.text,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 8,
    marginBottom: 14,
  },
  switchTextWrap: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.paperAlt,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: typography.body,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontFamily: typography.body,
  },
  previewCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  previewTitle: {
    fontSize: 28,
    color: colors.text,
    marginBottom: 8,
    fontFamily: typography.display,
  },
  previewText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
    fontFamily: typography.body,
  },
  logoutButton: {
    backgroundColor: colors.accentStrong,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: typography.body,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
