import React, { createContext, useContext, useState, useCallback, PropsWithChildren, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";

// Context to expose chat client
const ChatContext = createContext<{
  client: StreamChat;
  isReady: boolean;
} | null>(null);

// Hook to use the chat client in other components
export function useChatClient() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatClient must be used within a ChatProvider");
  }
  return context;
}

// Provider component
export default function ChatProvider({ children }: PropsWithChildren) {
  const { profile } = useAuth();
  const [client] = useState(StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY!));
  const [isReady, setIsReady] = useState(false);

  const connectUser = useCallback(async () => {
    if (!profile?.id) return;
    const sessionResult = await supabase.auth.getSession();
    const session = sessionResult.data.session;
    if (!session) return;

    try {
      const response = await fetch("https://btezxwxovdtmoidhvemy.supabase.co/functions/v1/stream-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ user_id: profile.id }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        console.error("Failed to get Stream token", data);
        return;
      }

      await client.connectUser(
        {
          id: profile.id,
          name: profile.full_name || profile.email || "User",
          image: profile.avatar_url,
        },
        data.token
      );

      console.log("✅ Connected to Stream Chat successfully");
      setIsReady(true);
    } catch (error) {
      console.error("❌ Failed to connect to Stream Chat", error);
    }
  }, [profile, client]);

  useEffect(() => {
    connectUser();
    return () => {
      if (client.userID) {
        client.disconnectUser();
      }
    };
  }, [connectUser]);

  return (
    <ChatContext.Provider value={{ client, isReady }}>
      <OverlayProvider>
        <Chat client={client}>{children}</Chat>
      </OverlayProvider>
    </ChatContext.Provider>
  );
}
