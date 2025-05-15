import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { UserResponse } from "stream-chat";
import { useChatContext } from "stream-chat-expo";

type UserListItemProps = {
  user: UserResponse<unknown>;
};

export default function UserListItem({ user }: UserListItemProps) {
  const router = useRouter();
  const { client } = useChatContext();

  const onPress = async () => {
    if (!user.id || !client.user) {
      console.warn("User or Client not defined");
      return;
    }

    const channel = client.channel("messaging", {
      members: [client.user.id, user.id],
    });

    await channel.watch();

    router.push(`/channel/${channel.cid}`);
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.name?.charAt(0) || "U"}</Text>
      </View>
      <Text style={styles.name}>{user.name || "Unknown User"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  avatar: {
    backgroundColor: "#ccc",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
  name: {
    fontSize: 16,
  },
});
