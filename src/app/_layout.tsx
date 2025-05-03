import { useEffect } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthProvider from "../providers/AuthProvider";
import * as Linking from "expo-linking";
import { router } from "expo-router";

export default function RootLayout() {
  // 🔁 Handle incoming deep links like chat-app://login
  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      const parsed = Linking.parse(url);
      if (parsed?.path === "login") {
        router.replace("/(auth)/login");
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false, // Hide headers globally
          }}
        >
          <Stack.Screen name="(home)/users" options={{ title: "Users" }} />
          <Stack.Screen name="(call)/CallScreen" options={{ title: "Call" }} />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
