import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Channel, MessageList, MessageInput } from "stream-chat-expo";
import { useChatClient } from "../../../providers/ChatProvider";

export default function ChannelScreen() {
  console.log("🔍 channel/[cid].tsx mounted");

  const { cid } = useLocalSearchParams<{ cid: string }>();
  console.log("🆔 channel ID:", cid);

  const { client, isReady } = useChatClient();
  console.log("👤 client ready state:", isReady);

  const [channel, setChannel] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !cid) return;

    console.log("🔄 Querying channel with id:", cid);
    const fetchedChannel = client.channel("messaging", cid);

    fetchedChannel.watch()
      .then(() => {
        setChannel(fetchedChannel);
        console.log("✅ Channel loaded");
      })
      .catch((err) => {
        console.error("❌ Error querying channel:", err);
        setError("Failed to load the channel.");
      });
  }, [isReady, cid]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!channel) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading channel...</Text>
      </View>
    );
  }

  return (
    <Channel channel={channel}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
}
