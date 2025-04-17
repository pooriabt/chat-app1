import { Slot, Stack } from "expo-router";
import { useEffect } from "react";

import ChatProvider from "../../providers/ChatProvider";

export default function HomeLayout() {
  return (
    <ChatProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ChatProvider>
  );
}
