import "react-native-gesture-handler";
import React from "react";
import { useFonts } from "expo-font";

import RootNavigator from "./src/navigation/RootNavigator";
import { AuthProvider } from "./src/hooks/useAuth";
import LoadingState from "./src/components/LoadingState";

export default function App() {
  const [fontsLoaded] = useFonts({
    PatrickHand: require("./src/assets/fonts/PatrickHand-Regular.ttf"),
    PlaypenSans: require("./src/assets/fonts/PlaypenSans-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) {
    return <LoadingState message="Abrindo seu caderno de memórias..." fullScreen />;
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
