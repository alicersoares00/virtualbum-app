import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import DrawerContent from "../components/DrawerContent";
import LoadingState from "../components/LoadingState";
import { useAuth } from "../hooks/useAuth";
import DashboardScreen from "../screens/DashboardScreen";
import DetailsScreen from "../screens/DetailsScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SettingsScreen from "../screens/SettingsScreen";
import colors from "../theme/colors";
import typography from "../theme/typography";
import { ROUTES } from "./routeNames";

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const DashboardStack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <AuthStack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function DashboardStackNavigator() {
  return (
    <DashboardStack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: colors.paper,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: typography.display,
          fontSize: 28,
          color: colors.text,
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerLeft: () => (
          <Ionicons
            name="menu"
            size={24}
            color={colors.text}
            style={{ marginLeft: 16 }}
            onPress={() => navigation.getParent()?.toggleDrawer()}
          />
        ),
      })}
    >
      <DashboardStack.Screen
        name={ROUTES.DASHBOARD}
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <DashboardStack.Screen
        name={ROUTES.DETAILS}
        component={DetailsScreen}
        options={{
          headerShown: false,
          headerLeft: undefined,
        }}
      />
    </DashboardStack.Navigator>
  );
}

function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: colors.paper,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: typography.display,
          fontSize: 28,
          color: colors.text,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSoft,
        drawerActiveBackgroundColor: colors.surfaceSoft,
        drawerLabelStyle: {
          marginLeft: -12,
          fontSize: 16,
          fontFamily: typography.body,
        },
        sceneStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerLeft: () => (
          <Ionicons
            name="menu"
            size={24}
            color={colors.text}
            style={{ marginLeft: 16 }}
            onPress={() => navigation.toggleDrawer()}
          />
        ),
      })}
    >
      <Drawer.Screen
        name={ROUTES.DASHBOARD_STACK}
        component={DashboardStackNavigator}
        options={{
          title: "Meu Album",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function RootNavigator() {
  const { initializing, user } = useAuth();

  if (initializing) {
    return <LoadingState message="Preparando sua sessao..." fullScreen />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name={ROUTES.APP_DRAWER} component={AppDrawerNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
