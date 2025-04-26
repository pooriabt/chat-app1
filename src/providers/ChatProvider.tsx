import { PropsWithChildren, useEffect, useState, useCallback } from "react";
import { ActivityIndicator, View, Text, Button } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";

export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const { profile } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch Stream Token
  const fetchStreamToken = useCallback(
    async (signal?: AbortSignal) => {
      if (!profile?.id || signal?.aborted) return;

      try {
        const sessionResult = await supabase.auth.getSession();
        const session = sessionResult.data.session;

        if (!session) {
          setError("Authentication session expired. Please log in again.");
          return;
        }

        const response = await fetch(
          "https://btezxwxovdtmoidhvemy.supabase.co/functions/v1/stream-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ user_id: profile.id }),
            signal, // Connect to AbortController
          }
        );

        if (!response.ok) throw new Error("Failed to fetch token");
        const result = await response.json();

        if (result.token) {
          setToken(result.token);
          setError(null);
        } else {
          setError("Failed to get chat token. Please try again.");
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        setError("Failed to connect to chat. Check your internet connection.");
      }
    },
    [profile?.id]
  );

  // Connect to Stream Chat
  const connectToStream = useCallback(
    async (signal?: AbortSignal) => {
      if (!profile?.id || !token || signal?.aborted) return;

      const client = StreamChat.getInstance(
        process.env.EXPO_PUBLIC_STREAM_API_KEY!
      );

      try {
        await client.connectUser(
          {
            id: profile.id,
            name: profile.full_name || profile.email || "User",
            image: profile.avatar_url,
          },
          token
        );

        if (signal?.aborted) {
          client.disconnectUser(); // Cleanup if aborted
          return;
        }

        setIsReady(true);
        setError(null);
      } catch (error) {
        if (error.name === "AbortError") return;
        setError("Chat connection failed. Tap to retry.");
        setIsReady(false);
      }
    },
    [token, profile]
  );

  // Effect for token fetch
  useEffect(() => {
    const abortController = new AbortController();
    fetchStreamToken(abortController.signal);
    return () => abortController.abort();
  }, [fetchStreamToken]);

  // Effect for Stream connection
  useEffect(() => {
    const abortController = new AbortController();
    connectToStream(abortController.signal);
    return () => {
      abortController.abort();
      const client = StreamChat.getInstance(
        process.env.EXPO_PUBLIC_STREAM_API_KEY!
      );
      if (client.userID) client.disconnectUser(); // Only disconnect if connected
    };
  }, [connectToStream]);

  // Error UI
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        <Button title="Retry" onPress={() => fetchStreamToken()} />
      </View>
    );
  }

  // Loading UI
  if (!profile || !token || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading chat...</Text>
      </View>
    );
  }

  // Chat UI
  return (
    <OverlayProvider>
      <Chat
        client={StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY!)}
      >
        {children}
      </Chat>
    </OverlayProvider>
  );
}
