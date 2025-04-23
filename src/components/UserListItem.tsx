import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { useChatContext } from "stream-chat-expo";
import { useAuth } from "../providers/AuthProvider";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Define the User type interface
interface User {
  id: string;
  full_name?: string; // Optional because it might not exist
  online?: boolean;
  // Add other user properties you might use
}

interface AuthUser {
  id: string;
  full_name?: string;
  // Add other auth user properties
}

interface UserListItemProps {
  user: User;
}

const UserListItem: React.FC<UserListItemProps> = ({ user }) => {
  const { client } = useChatContext();
  const { user: me } = useAuth() as { user: AuthUser };

  const startCall = async () => {
    // Check if recipient is online first
    if (!user.online) {
      Alert.alert(
        "User Offline",
        `${user.full_name || "The user"} is currently offline`,
        [{ text: "OK" }]
      );
      return;
    }

    // Proceed with call setup
    const roomId = `call-${me.id}-${user.id}-${Date.now()}`;
    router.push({
      pathname: "/(call)/CallScreen",
      params: {
        roomId,
        userName: me.full_name || "Me",
        recipientId: user.id,
      },
    });
  };

  const onChatPress = async () => {
    const channel = client.channel("messaging", { members: [me.id, user.id] });
    await channel.watch();
    router.replace(`/(home)/channel/${channel.cid}`);
  };

  const onCallPress = () => {
    const sortedIds = [me.id, user.id].sort();
    const roomId = `call-${sortedIds.join("-")}-${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    router.push({
      pathname: "/(call)/CallScreen",
      params: {
        roomId,
        userName: me.full_name || "Me",
        recipientName: user.full_name || "User",
        recipientId: user.id,
        isVideoEnabled: "true",
      },
    });
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onChatPress} style={styles.chatContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user.full_name?.charAt(0) || "U").toUpperCase()}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{user.full_name || "Unknown User"}</Text>
          <Text style={styles.status}>
            {user.online ? "Online" : "Offline"}
          </Text>
        </View>
      </Pressable>

      <TouchableOpacity onPress={onCallPress} style={styles.callButton}>
        <Ionicons name="call" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  chatContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 2,
  },
  status: {
    fontSize: 14,
    color: "#666",
  },
  callButton: {
    padding: 8,
    marginLeft: 10,
  },
});

export default UserListItem;
