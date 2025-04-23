import { Slot, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthProvider from "../providers/AuthProvider";
import ChatProvider from "../providers/ChatProvider";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ChatProvider>
          <Slot />
        </ChatProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
