// File: src/app/(home)/users.tsx
import { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";
import UserListItem from "../../components/UserListItem";

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      let { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id);
      if (profiles) {
        // Add online status (you might want to implement real presence detection)
        const usersWithStatus = profiles.map((profile) => ({
          ...profile,
          online: Math.random() > 0.3, // Temporary random status
        }));
        setUsers(usersWithStatus);
      }
    };
    fetchUsers();

    // Set up real-time presence updates (you'll need to implement this properly)
    const channel = supabase.channel("online-users", {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel.on("presence", { event: "sync" }, () => {
      console.log("Online users: ", channel.presenceState());
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ online_at: new Date().toISOString() });
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <FlatList
      data={users}
      contentContainerStyle={{ gap: 5 }}
      renderItem={({ item }) => <UserListItem user={item} />}
    />
  );
}
