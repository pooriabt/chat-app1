// File: src/app/(home)/chat.tsx
import { useEffect } from "react";
import { View, Button, Alert } from "react-native";
import { router } from "expo-router";
import * as Permissions from "expo-permissions";

export default function ChatScreen({ route }) {
  const { userId } = route.params || {};

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

  const handleCallPress = (isVideo = true) => {
    const roomId = `chat-call-${Math.random().toString(36).substring(7)}`;
    const userName = "User"; // Replace with actual user name from auth

    router.push({
      pathname: "/(call)/call",
      params: {
        roomId,
        userName,
        recipientId: userId,
        isVideo: String(isVideo),
      },
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ gap: 20 }}>
        <Button title="Video Call" onPress={() => handleCallPress(true)} />
        <Button title="Voice Call" onPress={() => handleCallPress(false)} />
      </View>
    </View>
  );
}
