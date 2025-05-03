import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";

export default function CallScreen() {
  const { roomId, userName, isVideo } = useLocalSearchParams();
  const [showFallback, setShowFallback] = useState(false);

  // Fallback for invalid userName
  const displayName = Array.isArray(userName)
    ? userName.join(", ")
    : userName || "Guest";

  const jitsiUrl = roomId
    ? `https://meet.jit.si/${roomId}?config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=${!isVideo}&interfaceConfig.DISABLE_JOIN_LEAVE_NOTIFICATIONS=true&userInfo.displayName=${encodeURIComponent(
        displayName
      )}`
    : null;

  console.log("Constructed Jitsi URL:", jitsiUrl);

  if (showFallback || !jitsiUrl) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>404 - Room Not Found</Text>
        <Text style={styles.fallbackText}>
          Click <Text style={styles.link}>here</Text> to navigate to Jitsi Meet.
        </Text>
        <Button
          title="Start Meeting"
          onPress={() => {
            setShowFallback(false);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: jitsiUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onError={() => setShowFallback(true)} // Show fallback on error
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  fallbackText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
