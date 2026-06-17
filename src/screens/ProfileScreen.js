import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import AppHeader from "../components/AppHeader";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ScrapbookBackground from "../components/ScrapbookBackground";
import { useAuth } from "../hooks/useAuth";
import { getUserProfile, updateUserProfile } from "../services/firestoreService";
import colors from "../theme/colors";
import typography from "../theme/typography";

export default function ProfileScreen() {
  const isFocused = useIsFocused();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user?.uid || !isFocused) {
        return;
      }

      setLoading(true);
      setFeedback("");

      try {
        const currentProfile = await getUserProfile(user.uid);
        setProfile(currentProfile);
        setName(currentProfile?.name || user.displayName || "");
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [isFocused, user?.displayName, user?.uid]);

  async function handleSave() {
    if (!user?.uid || !name.trim()) {
      setFeedback("Informe um nome antes de salvar.");
      return;
    }

    setSaving(true);
    setFeedback("");

    try {
      await updateUserProfile(user.uid, {
        name: name.trim(),
      });

      const updatedProfile = await getUserProfile(user.uid);
      setProfile(updatedProfile);
      setFeedback("Perfil atualizado com sucesso.");
    } catch {
      setFeedback("Não foi possível atualizar o perfil.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState message="Carregando perfil..." fullScreen />;
  }

  if (!profile) {
    return (
      <View style={styles.emptyWrapper}>
        <ScrapbookBackground />
        <EmptyState
          title="Perfil indisponível"
          description="Não foi possível encontrar os dados do usuário no Firestore."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrapbookBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader
          title="Perfil"
          subtitle="Dados pessoais persistidos no Firestore, exibidos como ficha delicada dentro do álbum."
        />

        <View style={styles.card}>
          <Text style={styles.chip}>cartao do usuario</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />

          <Text style={styles.label}>Email</Text>
          <Text style={styles.staticValue}>{profile.email || user?.email}</Text>

          <Text style={styles.label}>Criado em</Text>
          <Text style={styles.staticValue}>
            {profile.createdAt ? new Date(profile.createdAt).toLocaleString("pt-BR") : "N/D"}
          </Text>

          <Text style={styles.label}>Favoritos salvos</Text>
          <Text style={styles.staticValue}>
            {Array.isArray(profile.favoriteItems) ? profile.favoriteItems.length : 0}
          </Text>

          <Text style={styles.label}>Ultimo acesso</Text>
          <Text style={styles.staticValue}>
            {profile.lastAccess ? new Date(profile.lastAccess).toLocaleString("pt-BR") : "N/D"}
          </Text>

          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

          <TouchableOpacity
            style={[styles.button, saving && styles.disabledButton]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.buttonText}>{saving ? "Salvando..." : "Salvar perfil"}</Text>
          </TouchableOpacity>
        </View>
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
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.overlay,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    color: colors.primaryStrong,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: typography.body,
  },
  label: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: typography.body,
  },
  input: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    color: colors.text,
    fontFamily: typography.body,
  },
  staticValue: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 22,
    fontFamily: typography.body,
  },
  feedback: {
    marginBottom: 12,
    color: colors.primaryStrong,
    fontFamily: typography.body,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: typography.body,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
