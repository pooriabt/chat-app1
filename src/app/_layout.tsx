import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthProvider from "../providers/AuthProvider";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false, // Hide headers globally
          }}
        >
          {/* Ensure the (home) folder is included */}
          <Stack.Screen name="(home)/users" options={{ title: "Users" }} />
          <Stack.Screen name="(call)/CallScreen" options={{ title: "Call" }} />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
