import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
import { useEffect } from "react";
import { ToastProvider } from "react-native-toast-notifications";
import { UserProvider } from "@/context/UserContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { TranscriptionProvider } from "@/context/TranscriptionContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    if (loaded || error) {
      SplashScreen.hideAsync().then();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <UserProvider>
      <LanguageProvider>
        <TranscriptionProvider>
          <ToastProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </ToastProvider>
        </TranscriptionProvider>
      </LanguageProvider>
    </UserProvider>
  );
}
