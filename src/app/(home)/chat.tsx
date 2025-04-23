// File: src/app/(home)/chat.tsx
import { useEffect } from "react";
import { View, Button, Alert } from "react-native";
import { router } from "expo-router";
import * as Permissions from "expo-permissions"; // For classic Expo SDK <48

export default function ChatScreen() {
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Permissions.askAsync(
        Permissions.CAMERA
      );
      const { status: micStatus } = await Permissions.askAsync(
        Permissions.AUDIO_RECORDING
      );

      if (cameraStatus !== "granted" || micStatus !== "granted") {
        Alert.alert(
          "Permissions required",
          "Camera and Microphone permissions are needed for calls."
        );
      }
    })();
  }, []);

  const handleCallPress = () => {
    const roomId = "room-123"; // Replace dynamically if needed
    const userName = "Ali"; // Replace with actual user name

    router.push({
      pathname: "/(call)/call",
      params: { roomId, userName },
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Start Call" onPress={handleCallPress} />
    </View>
  );
}
