import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";

export default function CallScreen() {
  const params = useLocalSearchParams();
  const webViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true); // Renamed to isLoading
  const [error, setError] = useState<string | null>(null);

  // Safely extract parameters with defaults
  const roomId = params.roomId?.toString() || "";
  const userName = params.userName?.toString() || "User";

  // Properly encoded Jitsi URL
  const jitsiURL = `https://meet.jit.si/${encodeURIComponent(
    roomId
  )}?config.startWithVideoMuted=true&userInfo.displayName=${encodeURIComponent(
    userName
  )}`;

  const handleEndCall = () => {
    router.back();
  };

  if (!roomId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Missing call parameters</Text>
        <TouchableOpacity style={styles.button} onPress={handleEndCall}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Connecting to call...</Text>
        </View>
      )}

      {/* WebView component */}
      <WebView
        ref={webViewRef}
        source={{ uri: jitsiURL }}
        style={styles.webview}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={(syntheticEvent) => {
          setIsLoading(false);
          setError(
            syntheticEvent.nativeEvent.description || "Failed to load call"
          );
        }}
        onHttpError={(syntheticEvent) => {
          setIsLoading(false);
          setError(`HTTP Error: ${syntheticEvent.nativeEvent.statusCode}`);
        }}
      />

      {/* Error overlay */}
      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>Call Failed</Text>
          <Text style={styles.errorDescription}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={handleEndCall}>
            <Text style={styles.buttonText}>End Call</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* End call button */}
      <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
        <Text style={styles.endCallText}>End Call</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    padding: 20,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
  },
  errorText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorDescription: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "red",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  endCallButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "red",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  endCallText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
