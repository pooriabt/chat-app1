import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";

export default function CallScreen() {
  const { roomId, userName, isVideo } = useLocalSearchParams();

  const jitsiUrl = `https://meet.jit.si/${roomId}#userInfo.displayName="${userName}"`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: jitsiUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
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
});
