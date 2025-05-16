import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

export default function UsersScreen() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const { profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .neq("id", profile?.id)
        .order("full_name", { ascending: true });

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }
    };

    fetchUsers();
  }, [profile?.id]);

  const handlePress = (userId: string) => {
    router.push(`/channel/${userId}`);
  };

  return (
    <View style={styles.container}>
      
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => handlePress(item.id)}>
            <Text style={styles.userName}>{item.full_name || item.email}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  item: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  userName: { fontSize: 18, color: "#444" },
  separator: { height: 10 },
});
