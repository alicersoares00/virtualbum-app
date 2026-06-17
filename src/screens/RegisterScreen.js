import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import LoadingState from "../components/LoadingState";
import ScrapbookBackground from "../components/ScrapbookBackground";
import { useAuth } from "../hooks/useAuth";
import colors from "../theme/colors";
import typography from "../theme/typography";

export default function RegisterScreen({ navigation }) {
  const { authLoading, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Preencha nome, email e senha.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("A confirmação de senha não confere.");
      return;
    }

    setError("");

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
    } catch {
      setError("Não foi possível criar sua conta agora.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrapbookBackground />
      <View style={styles.card}>
        <Text style={styles.badge}>novo capítulo</Text>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>
          Monte seu perfil, sincronize seus favoritos no Firebase e continue o álbum
          em qualquer nova sessão.
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nome"
          placeholderTextColor={colors.muted}
          style={styles.input}
          editable={!authLoading}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={colors.muted}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          editable={!authLoading}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          placeholderTextColor={colors.muted}
          secureTextEntry
          style={styles.input}
          editable={!authLoading}
        />
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirmar senha"
          placeholderTextColor={colors.muted}
          secureTextEntry
          style={styles.input}
          editable={!authLoading}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.primaryButton, authLoading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={authLoading}
        >
          <Text style={styles.primaryButtonText}>Cadastrar</Text>
        </TouchableOpacity>

        {authLoading ? <LoadingState message="Criando conta..." /> : null}

        <TouchableOpacity onPress={() => navigation.goBack()} disabled={authLoading}>
          <Text style={styles.link}>Voltar para login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: colors.overlay,
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: colors.surface,
    color: colors.primaryStrong,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: typography.body,
    marginBottom: 12,
  },
  title: {
    fontSize: 38,
    color: colors.text,
    fontFamily: typography.display,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: colors.textSoft,
    lineHeight: 22,
    fontSize: 15,
    fontFamily: typography.body,
  },
  input: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    color: colors.text,
    fontFamily: typography.body,
  },
  error: {
    color: colors.accentStrong,
    marginBottom: 12,
    fontFamily: typography.body,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: typography.body,
  },
  link: {
    textAlign: "center",
    marginTop: 18,
    color: colors.primaryStrong,
    fontFamily: typography.body,
  },
});
