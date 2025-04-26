import { useAuth } from "../../providers/AuthProvider";
import { Redirect, Stack } from "expo-router";
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
      </Stack>
    </ChatProvider>
  );
}
