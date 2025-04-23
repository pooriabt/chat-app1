import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function CallScreen({ route }) {
  const { roomId, userName } = route.params;

  const jitsiURL = `https://meet.jit.si/${roomId}#userInfo.displayName="${userName}"`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: jitsiURL }}
        style={styles.webview}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
