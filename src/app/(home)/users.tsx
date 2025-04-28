import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../providers/AuthProvider"; // Ensure this is the correct path to your AuthProvider
import { supabase } from "../../lib/supabase"; // Ensure this is the correct path to your Supabase client

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth(); // Get the current authenticated user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from("profiles") // Replace "profiles" with your actual table name
          .select("id, full_name, username") // Fetch relevant fields
          .neq("id", user.id); // Exclude the current user
        if (error) throw error;

        // Use `full_name` or `username` if available
        const updatedProfiles = profiles.map((profile) => ({
          ...profile,
          displayName: profile.full_name || profile.username || "Unnamed User",
        }));

        setUsers(updatedProfiles);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [user]);

  const handleCallPress = (userId, userName, isVideo = true) => {
    const roomId = `chat-call-${userId}`;
    router.push({
      pathname: "/(call)/CallScreen",
      params: {
        roomId,
        userName,
        isVideo: String(isVideo),
      },
    });
  };

  const renderUser = ({ item }) => (
    <View style={styles.userContainer}>
      {/* Display the user's full name or username */}
      <Text style={styles.userName}>{item.displayName}</Text>
      <View style={styles.buttonContainer}>
        {/* Video Call Button */}
        <TouchableOpacity
          onPress={() => handleCallPress(item.id, item.displayName, true)}
        >
          <Image
            source={require("../../../assets/video-recorder.png")} // Replace with your video call icon
            style={styles.icon}
          />
        </TouchableOpacity>
        {/* Voice Call Button */}
        <TouchableOpacity
          onPress={() => handleCallPress(item.id, item.displayName, false)}
        >
          <Image
            source={require("../../../assets/telecommunication.png")} // Replace with your voice call icon
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUser}
        contentContainerStyle={{ gap: 5 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
});
