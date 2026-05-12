import { tokenCache } from "@/cache";
import "@/global.css";
import { ClerkLoaded, ClerkProvider } from "@clerk/expo";
import { Slot } from "expo-router";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { ThemeProvider, useTheme } from "../component/ThemeProvider";
import { StatusBar } from "expo-status-bar";

function AppContent() {
  const { theme, themeVars } = useTheme();

  return (
    <>
      <View style={[{ flex: 1 }, themeVars]}>
        <Slot />
      </View>
      <StatusBar
        translucent={false}
        style={theme === "dark" ? "light" : "dark"}
      />
    </>
  );
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Missing Publishable Clerk Key");
  }
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <ClerkLoaded>
            <ThemeProvider>
              <AppContent />
              <Toast position="top" />
            </ThemeProvider>
          </ClerkLoaded>
        </ClerkProvider>
      </GestureHandlerRootView>
    </>
  );
}
