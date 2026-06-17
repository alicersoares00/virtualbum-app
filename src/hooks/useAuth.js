import React, { createContext, useContext, useEffect, useState } from "react";

import {
  loginWithEmail,
  logoutUser,
  observeAuthState,
  registerWithEmail,
} from "../services/authService";
import { touchLastAccess } from "../services/firestoreService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = observeAuthState(async (nextUser) => {
      setUser(nextUser);

      if (nextUser?.uid) {
        try {
          await touchLastAccess(nextUser.uid);
        } catch (error) {
          console.warn("Não foi possível atualizar o último acesso.", error);
        }
      }

      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  async function login(email, password) {
    setAuthLoading(true);
    try {
      const credential = await loginWithEmail(email, password);
      return credential.user;
    } finally {
      setAuthLoading(false);
    }
  }

  async function register({ name, email, password }) {
    setAuthLoading(true);
    try {
      const credential = await registerWithEmail({ name, email, password });
      return credential.user;
    } finally {
      setAuthLoading(false);
    }
  }

  async function logout() {
    setAuthLoading(true);
    try {
      await logoutUser();
    } finally {
      setAuthLoading(false);
    }
  }

  const value = {
    user,
    initializing,
    authLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
