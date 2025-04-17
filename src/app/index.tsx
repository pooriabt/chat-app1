import { Redirect } from "expo-router";

import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return <Redirect href={"/(auth)/login"} />;

  // return (
  //   <View style={styles.container}>
  //     <Text>Hell world</Text>
  //     <StatusBar style="auto" />
  //   </View>
  // );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
