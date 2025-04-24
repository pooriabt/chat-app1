import { Slot, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthProvider from "../providers/AuthProvider";
import ChatProvider from "../providers/ChatProvider";
import { useAuth } from "../providers/AuthProvider";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ChatProvider>
          <AuthGatekeeper />
        </ChatProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function AuthGatekeeper() {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      {!user ? (
        // Show auth stack
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
        </Stack>
      ) : (
        // Show app stack
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(home)" />
          <Redirect href="/(home)/(tabs)" />
        </Stack>
      )}
    </>
  );
}
