import { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native"; // Added View import
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile) return;

    const connect = async () => {
      try {
        await client.connectUser(
          {
            id: profile.id,
            name: profile.full_name || "User",
            image: profile.avatar_url
              ? supabase.storage
                  .from("avatars")
                  .getPublicUrl(profile.avatar_url).data.publicUrl
              : undefined,
          },
          client.devToken(profile.id)
        );
        setIsReady(true);
      } catch (error) {
        console.error("Connection error:", error);
      }
    };

    connect();

    return () => {
      if (client.userID) {
        client.disconnectUser();
      }
      setIsReady(false);
    };
  }, [profile?.id]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <OverlayProvider>
      <Chat client={client}>{children}</Chat>
    </OverlayProvider>
  );
}
