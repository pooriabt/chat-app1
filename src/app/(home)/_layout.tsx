import { useAuth } from "../../providers/AuthProvider";
import { Redirect, Stack, Slot } from "expo-router";
import ChatProvider from "../../providers/ChatProvider";

export default function HomeLayout() {
  const { user, isEmailConfirmed } = useAuth();

  if (!user || !isEmailConfirmed) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ChatProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Fallback Slot to render nested screens if not defined in Stack */}
        <Slot />
      </Stack>
    </ChatProvider>
  );
}
