import { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";

export default function ChatProvider({ children }: PropsWithChildren) {
  const { user, profile, chatClient, isInitialized } = useAuth();
  const [isChatReady, setIsChatReady] = useState(false);

  useEffect(() => {
    if (!isInitialized || !user || !profile || !chatClient) {
      // console.log({ isInitialized, user, profile });

      setIsChatReady(true);
      // console.log("here");

      return;
    }

    const connectUser = async () => {
      try {
        // Force disconnect first if needed
        if (chatClient.userID) {
          await chatClient.disconnectUser();
        }

        await chatClient.connectUser(
          {
            id: profile.id,
            name: profile.full_name || profile.email || "User",
            image: profile.avatar_url,
          },
          chatClient.devToken(profile.id)
        );
        setIsChatReady(true);
      } catch (error) {
        console.error("Chat connection error:", error);
        setIsChatReady(false);
        // Add retry logic if needed
      }
    };

    connectUser();

    return () => {
      if (isChatReady) {
        chatClient.disconnectUser();
      }
    };
  }, [isInitialized, user?.id, profile?.id]);

  if (!isInitialized || !isChatReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <OverlayProvider>
      <Chat client={chatClient}>{children}</Chat>
    </OverlayProvider>
  );
}
