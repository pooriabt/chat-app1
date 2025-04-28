// File: src/app/(home)/chat.tsx
import React from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { router } from "expo-router";

const users = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

export default function ChatScreen() {
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
      <Text style={styles.userName}>{item.name}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Video Call"
          onPress={() => handleCallPress(item.id, item.name, true)}
        />
        <Button
          title="Voice Call"
          onPress={() => handleCallPress(item.id, item.name, false)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
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
});
