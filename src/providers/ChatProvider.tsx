import { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";

export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile) return;

    const client = StreamChat.getInstance(
      process.env.EXPO_PUBLIC_STREAM_API_KEY
    );

    const connect = async () => {
      await client.connectUser(
        {
          id: profile.id,
          name: profile.full_name || profile.email || "User",
          image: profile.avatar_url,
        },
        client.devToken(profile.id)
      );
      setIsReady(true);
    };

    connect();

    return () => {
      client.disconnectUser();
      setIsReady(false);
    };
  }, [profile?.id]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading chat...</Text>
      </View>
    );
  }

  return (
    <OverlayProvider>
      <Chat
        client={StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY)}
      >
        {children}
      </Chat>
    </OverlayProvider>
  );
}
