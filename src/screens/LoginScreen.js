import React, { useState } from "react";
import {
  Image,
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
import { ROUTES } from "../navigation/routeNames";
import colors from "../theme/colors";
import typography from "../theme/typography";

import logo from "../assets/logo.png";

export default function LoginScreen({ navigation }) {
  const { authLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Informe email e senha para continuar.");
      return;
    }

    setError("");

    try {
      await login(email.trim(), password);
    } catch {
      setError("Nao foi possivel entrar. Verifique suas credenciais.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrapbookBackground />
      <View style={styles.card}>
        <View style={styles.heroRow}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.heroTextWrap}>
            <Text style={styles.badge}>seu caderno digital</Text>
            <Text style={styles.title}>Virtualbum</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Entre para revisitar albuns, guardar recortes favoritos e continuar a sua
          colecao com clima de diario artesanal.
        </Text>

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

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.primaryButton, authLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={authLoading}
        >
          <Text style={styles.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        {authLoading ? <LoadingState message="Validando acesso..." /> : null}

        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.REGISTER)}
          disabled={authLoading}
        >
          <Text style={styles.link}>Primeira vez aqui? Criar conta</Text>
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
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  heroTextWrap: {
    flex: 1,
  },
  logo: {
    width: 88,
    height: 88,
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
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    color: colors.text,
    fontFamily: typography.display,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSoft,
    marginTop: 16,
    marginBottom: 24,
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
    fontSize: 14,
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
