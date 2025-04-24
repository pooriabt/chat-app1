import { Link, router, Stack } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { ChannelList } from "stream-chat-expo";
import { useAuth } from "../../../providers/AuthProvider";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

// Add proper type for AuthUser
interface AuthUser {
  id: string;
  full_name?: string;
  // Add other properties you need
}

export default function MainTabScreen() {
  const { user, isLoading } = useAuth();

  // Add auth check and loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href={"/(home)/users"} asChild>
              <Entypo
                name="users"
                size={22}
                color="gray"
                style={{ marginHorizontal: 15 }}
              />
            </Link>
          ),
        }}
      />
      <ChannelList
        filters={{ members: { $in: [user.id] } }}
        onSelect={(channel) =>
          // Update navigation path to match your structure
          router.push(`/(home)/channel/${channel.cid}`)
        }
      />
    </>
  );
}
