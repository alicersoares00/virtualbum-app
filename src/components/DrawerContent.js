import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import ScrapbookBackground from "./ScrapbookBackground";
import { useAuth } from "../hooks/useAuth";
import colors from "../theme/colors";
import typography from "../theme/typography";

export default function DrawerContent(props) {
  const { user, logout, authLoading } = useAuth();

  return (
    <View style={styles.container}>
      <ScrapbookBackground />
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.badge}>Coleção Pessoal</Text>
          <Text style={styles.title}>Virtualbum</Text>
          <Text style={styles.subtitle}>{user?.email || "Sessão autenticada"}</Text>
        </View>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
        disabled={authLoading}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.accentStrong} />
        <Text style={styles.logoutText}>{authLoading ? "Saindo..." : "Sair"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 12,
  },
  header: {
    marginTop: 14,
    marginHorizontal: 8,
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 26,
    backgroundColor: colors.overlay,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
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
    fontSize: 34,
    color: colors.text,
    marginBottom: 4,
    fontFamily: typography.display,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSoft,
    fontFamily: typography.body,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 24,
    paddingVertical: 15,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accentSoft,
    backgroundColor: "#FFF3ED",
  },
  logoutText: {
    fontSize: 15,
    fontFamily: typography.body,
    color: colors.accentStrong,
  },
});
